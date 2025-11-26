# GARCH Model API - C++ Qt UI

A sleek, modern desktop application built with Qt6 for interacting with the GARCH Model API.

## Features ✨

- **Modern UI Design**: Clean, professional interface with intuitive controls
- **Model Training**: Train GARCH models with customizable parameters
- **Volatility Forecasting**: Get day-by-day volatility predictions
- **Real-time Status**: Live status updates and error handling
- **Health Monitoring**: Check API connectivity status

## Prerequisites 📋

### Windows
1. **Qt6** (6.0 or higher)
   - Download from [Qt Official Website](https://www.qt.io/download)
   - Or install via vcpkg: `vcpkg install qt6-base qt6-widgets qt6-network`

2. **CMake** (3.16 or higher)
   - Download from [CMake Website](https://cmake.org/download/)
   - Or install via: `choco install cmake` (if using Chocolatey)

3. **C++ Compiler**
   - Visual Studio 2019 or later (with C++ desktop development workload)
   - Or MinGW-w64

### Linux
```bash
# Ubuntu/Debian
sudo apt-get install qt6-base-dev qt6-tools-dev cmake build-essential

# Fedora
sudo dnf install qt6-qtbase-devel qt6-qttools-devel cmake gcc-c++
```

### macOS
```bash
brew install qt@6 cmake
```

## Building 🏗️

### Windows (Visual Studio)

1. **Open Developer Command Prompt** or PowerShell

2. **Create build directory**:
```powershell
mkdir build
cd build
```

3. **Configure with CMake**:
```powershell
cmake .. -DCMAKE_PREFIX_PATH="C:/Qt/6.x.x/msvc2019_64" -G "Visual Studio 17 2022" -A x64
```
   *(Adjust Qt path and generator version as needed)*

4. **Build**:
```powershell
cmake --build . --config Release
```

5. **Run**:
```powershell
.\Release\GarchModelUI.exe
```

### Windows (MinGW)

```powershell
mkdir build
cd build
cmake .. -DCMAKE_PREFIX_PATH="C:/Qt/6.x.x/mingw_64" -G "MinGW Makefiles"
cmake --build .
.\GarchModelUI.exe
```

### Linux

```bash
mkdir build
cd build
cmake ..
make
./GarchModelUI
```

### macOS

```bash
mkdir build
cd build
cmake .. -DCMAKE_PREFIX_PATH="$(brew --prefix qt@6)"
make
./GarchModelUI
```

## Usage 🚀

1. **Start the Python API Server**:
   ```bash
   cd ..  # Go back to project root
   uvicorn main:app --reload --host localhost --port 8008
   ```

2. **Launch the C++ UI**:
   - Run the executable from the build directory
   - Or double-click `GarchModelUI.exe` (Windows)

3. **Using the Application**:
   - **Check API Health**: Click "Check API Health" to verify connection
   - **Train Model**: 
     - Enter ticker symbol (e.g., "SHOPERSTOP.BSE")
     - Set observations, p, and q parameters
     - Click "Train Model"
   - **Get Forecast**:
     - Enter ticker symbol
     - Set number of days to forecast
     - Click "Get Forecast"
   - **View Results**: Results appear in the Results panel

## Configuration ⚙️

The API base URL is hardcoded to `http://localhost:8008`. To change it:

1. Edit `ApiClient.cpp`
2. Modify the `m_baseUrl` initialization in the constructor
3. Rebuild the application

## Project Structure 📁

```
garch-model-api/
├── CMakeLists.txt      # Build configuration
├── main.cpp            # Application entry point
├── MainWindow.h        # Main window header
├── MainWindow.cpp      # Main window implementation
├── ApiClient.h         # API client header
├── ApiClient.cpp       # API client implementation
└── UI_README.md        # This file
```

## Troubleshooting 🔧

### "Cannot find Qt6"
- Ensure Qt6 is installed and `CMAKE_PREFIX_PATH` points to the correct Qt installation
- On Windows, the path should be like: `C:/Qt/6.x.x/msvc2019_64`
- On Linux/macOS, ensure Qt6 development packages are installed

### "API connection failed"
- Verify the Python API server is running on `localhost:8008`
- Check firewall settings
- Ensure the API server is accessible

### Build errors
- Make sure you have C++17 compatible compiler
- Verify all Qt6 components (Core, Widgets, Network) are installed
- Check CMake version (3.16+ required)

## Dependencies 📦

- **Qt6 Core**: Core functionality
- **Qt6 Widgets**: GUI components
- **Qt6 Network**: HTTP networking

## License 📄

Same license as the main GARCH Model API project.

---

**Built with Qt6 and C++17** 🚀

