import { ethers } from "hardhat";

async function main() {
  const alphaVerify = await ethers.deployContract("AlphaVerify");

  await alphaVerify.waitForDeployment();

  console.log("AlphaVerify Contract Deployed at " + alphaVerify.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
