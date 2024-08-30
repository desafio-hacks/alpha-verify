/* eslint-disable prettier/prettier */
import { ethers } from "hardhat"
import { Wallet } from "ethers"
import { AlphaVerify, AlphaVerify__factory } from "../typechain-types"

async function approveCertification(student: string, certId: string) {
    const PRIVATE_KEY = process.env.PRIVATEKEY;
    const rpcProvider = process.env.AVALANCHE_FUJI_RPC_URL

    const provider = new ethers.JsonRpcProvider(rpcProvider)
    const wallet = new Wallet(PRIVATE_KEY as string)
    const signer = wallet.connect(provider)
    const contractAddress = ""

    const registry: AlphaVerify = AlphaVerify__factory.connect(contractAddress, signer)
    const tx = await registry.approveCertification(student, certId);
    console.log(`Hash: ${tx.hash}`)
}
const student = ""
const certId = ""
approveCertification(student, certId).catch((error)=> {
    console.error(error)
    process.exitCode = 1;
    
})