/* eslint-disable prettier/prettier */
import { network, ethers } from "hardhat"

async function main() {
    if (network.name != "avalancheFuji") {
        console.log("Must be on Lisk Sepolia")
        return 1
    }
    const registry = process.env.REGISTRY as string;
    const AssetManager = await ethers.getContractFactory("AssetManager")
    const assetManager = await AssetManager.deploy(registry)
    await assetManager.waitForDeployment()

    console.log(`AssetManager deployed on ${network.name} with address ${assetManager.target}`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1;
})