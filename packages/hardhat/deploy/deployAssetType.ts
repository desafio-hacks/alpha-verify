/* eslint-disable prettier/prettier */
import { network, ethers } from "hardhat"

async function main() {
    if (network.name != "avalancheFuji") {
        console.log("Must be on Sepolia")
        return 1
    }
    const AssetType = await ethers.getContractFactory("AssetTypeRegistry")
    const assetType = await AssetType.deploy()
    await assetType.waitForDeployment()

    console.log(`AssetTypeRegistry deployed on ${network.name} with address ${assetType.target}`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1;
})