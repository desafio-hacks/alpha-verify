import Web3 from 'web3';
import externalContracts from '@/contracts/externalContracts';

let web3: any = null;
let alphaverify: any = null;
// let walletContract: any = null;
// let daoContract: any = null;
// let daoWalletContract: any = null;

web3 = new Web3(window.ethereum);
const address = externalContracts[11155420].AlphaVerify.address;
const abi = externalContracts[11155420].AlphaVerify.abi;
alphaverify = new web3.eth.Contract(abi, address);

// // const daoAddress = "0x5896A931de976815774230fd6B0eCc547f7Cd794"
// const daoAddress = "0x68BA7B1a908eDf9A317283CBe25F570A403696C0";
// daoContract = new web3.eth.Contract(dao.abi, daoAddress);
export {web3, alphaverify}