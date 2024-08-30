/* eslint-disable prettier/prettier */
import { ethers } from "hardhat"
import { Wallet } from "ethers"
import { AssetManager, AssetManager__factory } from "../typechain-types"

async function verifyAsset(assetType: number, assetId: number) {

    const PRIVATE_KEY = process.env.PRIVATEKEY;
    const rpcProvider = process.env.AVALANCHE_FUJI_RPC_URL

    const provider = new ethers.JsonRpcProvider(rpcProvider)
    const wallet = new Wallet(PRIVATE_KEY as string)
    const signer = wallet.connect(provider)
    const contractAddress = ""

    const registry: AssetManager = AssetManager__factory.connect(contractAddress, signer)
    const tx = await registry.verifyAsset(assetType, assetId);
    console.log(`Hash: ${tx.hash}`)
}
const assetId = 0;
const assetType = 0;
verifyAsset(assetType, assetId).catch((error)=> {
    console.error(error)
    process.exitCode = 1;
    
})