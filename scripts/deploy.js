const hre = require("hardhat");

async function main() {
  console.log("Deploying VolatilityOracle to Mantle Network...");

  const VolatilityOracle = await hre.ethers.getContractFactory("VolatilityOracle");
  const oracle = await VolatilityOracle.deploy();

  await oracle.waitForDeployment();

  const address = await oracle.getAddress();
  console.log("VolatilityOracle deployed to:", address);
  console.log("Network:", hre.network.name);
  console.log("\nNext steps:");
  console.log("1. Update frontend/.env.local with contract address:", address);
  console.log("2. Authorize your backend address to submit forecasts");
  console.log("3. Verify contract on Mantle explorer");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

