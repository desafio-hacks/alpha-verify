/* eslint-disable prettier/prettier */
import { ethers } from "hardhat"
import { Wallet } from "ethers"
import { AlphaVerify, AlphaVerify__factory} from "../typechain-types"

async function revokeAccess(assetId: number) {

    const PRIVATE_KEY = process.env.PRIVATEKEY;
    const rpcProvider = process.env.AVALANCHE_FUJI_RPC_URL

    const provider = new ethers.JsonRpcProvider(rpcProvider)
    const wallet = new Wallet(PRIVATE_KEY as string)
    const signer = wallet.connect(provider)
    const contractAddress = ""

    const alpha: AlphaVerify = AlphaVerify__factory.connect(contractAddress, signer)
    const tx = await alpha.revokeAccessToken(assetId);
    console.log(`Hash: ${tx.hash}`)
}
const assetId = 0;
revokeAccess(assetId).catch((error)=> {
    console.error(error)
    process.exitCode = 1;
    
})