/* eslint-disable prettier/prettier */
import { ethers } from "hardhat"
import { BytesLike, Wallet } from "ethers"
import { AssetManager, AssetManager__factory } from "../typechain-types"

async function createAsset(assetId: string, data: BytesLike) {

    const PRIVATE_KEY = process.env.PRIVATEKEY;
    const rpcProvider = process.env.AVALANCHE_FUJI_RPC_URL

    const provider = new ethers.JsonRpcProvider(rpcProvider)
    const wallet = new Wallet(PRIVATE_KEY as string)
    const signer = wallet.connect(provider)
    const contractAddress = ""

    const registry: AssetManager = AssetManager__factory.connect(contractAddress, signer)
    const tx = await registry.createAsset(assetId, data);
    console.log(`Hash: ${tx.hash}`)
}
const assetId = ""
const data = ""
createAsset(assetId, data).catch((error)=> {
    console.error(error)
    process.exitCode = 1;
    
})