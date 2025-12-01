// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title VolatilityOracle
 * @dev On-chain oracle for GARCH volatility forecasts on Mantle Network
 * @notice Part of Mantle Global Hackathon 2025 - RWA/RealFi Track
 */
contract VolatilityOracle {
    struct Forecast {
        string ticker;
        uint256 timestamp;
        uint256 nDays;
        mapping(uint256 => uint256) dailyVolatility; // day index => volatility value (scaled by 1e6)
        bool exists;
    }

    // Mapping: ticker => forecastId => Forecast
    mapping(string => mapping(uint256 => Forecast)) public forecasts;
    
    // Mapping: ticker => latest forecast ID
    mapping(string => uint256) public latestForecastId;
    
    // Authorized updaters (AI/ML backend addresses)
    mapping(address => bool) public authorizedUpdaters;
    
    address public owner;
    uint256 public constant SCALE = 1e6; // For fixed-point arithmetic
    
    event ForecastUpdated(
        string indexed ticker,
        uint256 indexed forecastId,
        uint256 timestamp,
        uint256 nDays
    );
    
    event UpdaterAuthorized(address indexed updater);
    event UpdaterRevoked(address indexed updater);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    modifier onlyAuthorized() {
        require(authorizedUpdaters[msg.sender] || msg.sender == owner, "Not authorized");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        authorizedUpdaters[msg.sender] = true;
    }
    
    /**
     * @dev Submit volatility forecast to the oracle
     * @param ticker Stock ticker symbol
     * @param volatilities Array of volatility values (scaled by 1e6)
     * @param nDays Number of forecast days
     */
    function submitForecast(
        string memory ticker,
        uint256[] memory volatilities,
        uint256 nDays
    ) external onlyAuthorized {
        require(volatilities.length == nDays, "Invalid forecast length");
        require(nDays > 0 && nDays <= 365, "Invalid forecast horizon");
        
        uint256 forecastId = latestForecastId[ticker] + 1;
        latestForecastId[ticker] = forecastId;
        
        Forecast storage forecast = forecasts[ticker][forecastId];
        forecast.ticker = ticker;
        forecast.timestamp = block.timestamp;
        forecast.nDays = nDays;
        forecast.exists = true;
        
        for (uint256 i = 0; i < volatilities.length; i++) {
            forecast.dailyVolatility[i] = volatilities[i];
        }
        
        emit ForecastUpdated(ticker, forecastId, block.timestamp, nDays);
    }
    
    /**
     * @dev Get volatility forecast for a specific day
     * @param ticker Stock ticker symbol
     * @param forecastId Forecast ID
     * @param dayIndex Day index (0-based)
     * @return volatility Volatility value (scaled by 1e6)
     */
    function getVolatility(
        string memory ticker,
        uint256 forecastId,
        uint256 dayIndex
    ) external view returns (uint256) {
        require(forecasts[ticker][forecastId].exists, "Forecast not found");
        require(dayIndex < forecasts[ticker][forecastId].nDays, "Invalid day index");
        return forecasts[ticker][forecastId].dailyVolatility[dayIndex];
    }
    
    /**
     * @dev Get latest forecast ID for a ticker
     * @param ticker Stock ticker symbol
     * @return forecastId Latest forecast ID
     */
    function getLatestForecastId(string memory ticker) external view returns (uint256) {
        return latestForecastId[ticker];
    }
    
    /**
     * @dev Get forecast metadata
     * @param ticker Stock ticker symbol
     * @param forecastId Forecast ID
     * @return timestamp Forecast timestamp
     * @return nDays Number of forecast days
     * @return exists Whether forecast exists
     */
    function getForecastMetadata(
        string memory ticker,
        uint256 forecastId
    ) external view returns (uint256 timestamp, uint256 nDays, bool exists) {
        Forecast storage forecast = forecasts[ticker][forecastId];
        return (forecast.timestamp, forecast.nDays, forecast.exists);
    }
    
    /**
     * @dev Authorize an address to submit forecasts
     * @param updater Address to authorize
     */
    function authorizeUpdater(address updater) external onlyOwner {
        authorizedUpdaters[updater] = true;
        emit UpdaterAuthorized(updater);
    }
    
    /**
     * @dev Revoke authorization from an address
     * @param updater Address to revoke
     */
    function revokeUpdater(address updater) external onlyOwner {
        authorizedUpdaters[updater] = false;
        emit UpdaterRevoked(updater);
    }
    
    /**
     * @dev Transfer ownership
     * @param newOwner New owner address
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }
}

