import {ethers} from "hardhat";


async function main() {
  if (!process.env.ORACLE_ADDRESS) {
    throw new Error("ORACLE_ADDRESS env variable is not set.");
  }
  const oracleAddress: string = process.env.ORACLE_ADDRESS;
  await deployFactory(oracleAddress);
}


async function deployFactory(oracleAddress: string) {
  const agentFactory = await ethers.deployContract("AgentFactory", [], {});

  await agentFactory.waitForDeployment();

  console.log(`Agent factory contract deployed to ${agentFactory.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
