/* eslint-disable prettier/prettier */
import { ethers } from "hardhat"
import { Wallet } from "ethers"
import { AlphaVerify, AlphaVerify__factory} from "../typechain-types"

async function getAccessToken(assetId: number) {
    const PRIVATE_KEY = process.env.PRIVATEKEY;
    const rpcProvider = process.env.AVALANCHE_FUJI_RPC_URL

    const provider = new ethers.JsonRpcProvider(rpcProvider)
    const wallet = new Wallet(PRIVATE_KEY as string)
    const signer = wallet.connect(provider)
    const contractAddress = ""

    const alpha: AlphaVerify = AlphaVerify__factory.connect(contractAddress, signer)
    const accessToken = await alpha.getAccessToken(assetId);
    return accessToken
}
const assetId = 0;
getAccessToken(assetId).catch((error)=> {
    console.error(error)
    process.exitCode = 1;
    
})