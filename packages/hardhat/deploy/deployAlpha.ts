/* eslint-disable prettier/prettier */
import { network, ethers } from "hardhat"

async function main() {
    if (network.name != "avalancheFuji") {
        console.log("Must be on Lisk Sepolia")
        return 1
    }
    const ASSETMANAGER = process.env.ASSETMANAGER as string
    const AlphaVerify = await ethers.getContractFactory("AlphaVerify")
    const alphaVerify = await AlphaVerify.deploy(ASSETMANAGER)
    await alphaVerify.waitForDeployment()

    console.log(`AlphaVerifyRegistry deployed on ${network.name} with address ${alphaVerify.target}`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1;
})