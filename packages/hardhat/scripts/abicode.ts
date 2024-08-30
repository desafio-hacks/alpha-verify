/* eslint-disable prettier/prettier */
import { ethers } from "hardhat";

async function main() {
    const encoder = ethers.AbiCoder.defaultAbiCoder();
    const data = encoder.encode(['string', 'string'], ["1", "bnn"]);
    console.log(data)

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})