/* eslint-disable prettier/prettier */
import externalContracts from '@/contracts/externalContracts';
import { ethers } from 'ethers';
import { create } from 'ipfs-http-client';
import { Web3} from "web3"
import axios from 'axios';
import { PinataSDK } from "pinata";
import FormData from 'form-data';
import fs from 'fs';

const pinata = new PinataSDK({
    pinataJwt: "PINATA_JWT",
    pinataGateway: "example-gateway.mypinata.cloud",
});

const JWT = process.env.API_KEY;
const gateway = "https://coral-worrying-turtle-782.mypinata.cloud/"





const pinFileToIPFS = async (metadata: any) => {
    const formData = new FormData();
    const src = "path/to/file.png";

    // const file = fs.createReadStream(src)
    formData.append('file', metadata)

    const pinataMetadata = JSON.stringify({
      name: 'File name',
    });
    formData.append('pinataMetadata', pinataMetadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    })
    formData.append('pinataOptions', pinataOptions);

    try{
    //   const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      const res = await axios.post(gateway, formData, {
        maxBodyLength: "Infinity",
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          'Authorization': `Bearer ${JWT}`
        }
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
}









// Configuration
const CONFIG = {
    CONTRACT_ADDRESS: '0xCaeC3B55dF16ec145B9e262a3Bd2A225b081630F', // Your deployed contract address
    SCHOOL_BACKEND_URL: "https://alpha-verify-server.vercel.app", // Production
    // SCHOOL_BACKEND_URL: "http://localhost:3001", // Production
    IPFS_URL: 'https://aquamarine-famous-penguin-727.mypinata.cloud/ipfs/QmPG1wiULtXJNPypDhAdT9t67mrxRG4XieEx9U1mvxzbcP/',  // Or your preferred IPFS gateway
    SAMPLE_IMAGE_CID: 'QmPG1wiULtXJNPypDhAdT9t67mrxRG4XieEx9U1mvxzbcP'
};

// const CONTRACT_ABI = externalContracts[11155420].AlphaVerify.abi;

// Configure IPFS client
const ipfs = create({ url: CONFIG.IPFS_URL });

// async function uploadToIPFS(content: any) {
//     const result = await ipfs.add(JSON.stringify(content));
//     return `ipfs://${result.path}`;
// }


// async function uploadToIPFS(content: any) {
//     try {
//         const url = CONFIG.IPFS_URL;
//         const pinataApiKey = process.env.API_KEY;
//         const pinataSecretApiKey = process.env.SECRET_KEY;

//         const result = await axios.post(url, content, {
//             headers: {
//                 'pinata_api_key': pinataApiKey,
//                 'pinata_secret_api_key': pinataSecretApiKey,
//             }
//         });

//         return `ipfs://${result.data.IpfsHash}`;
//     } catch (error) {
//         console.error('Error uploading to IPFS:', error);
//         throw error;
//     }
// }

// // Example usage:
// const content = { data: "Example content" };
// uploadToIPFS(content)
//     .then(ipfsUrl => console.log('IPFS URL:', ipfsUrl))
//     .catch(error => console.error('Error:', error));


async function approveCertification(studentAddress: string) {
    try {
        const response = await fetch(`${CONFIG.SCHOOL_BACKEND_URL}/approve-certification`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentAddress })
        });
        console.log(JSON.stringify({ studentAddress }))
        const data = await response.json();
        console.log(data)
        if (data.success) {
            console.log('Certification approved by school');
            return data.certId;
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Error approving certification:', error);
        throw error;
    }
}

// async function getCertificateDetails(studentAddress: string) {
//     try {
//         // console.log(studentAddress)
//         // const newres = await fetch(`${CONFIG.SCHOOL_BACKEND_URL}/certificate?studentAddress=0xf0830060f836b8d54bf02049e5905f619487989e`, {
//         //     method: 'GET',
//         // });
//         // console.log(newres)
//         const response = await fetch(`${CONFIG.SCHOOL_BACKEND_URL}/certificate?studentAddress=${studentAddress}`);
//         console.log(response)
//         const data = await response.json();
//         const ndata = JSON.stringify(data.body)
//         console.log((ndata))
//         console.log(data)
//         if (data.success) {
//             return data;
//         } else {
//             throw new Error(data.error);
//         }
//     } catch (error) {
//         console.error('Error fetching certificate details:', error);
//         throw error;
//     }
// }

async function getCertificateDetails(studentAddress: string) {
    const url = `https://alpha-verify-server.vercel.app/certificate?studentAddress=0xf0830060f836B8d54bF02049E5905F619487989e`;
    
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Certificate details:', data);

        if (data.success) {
            return data;
        } else {
            throw new Error(data.error || 'Failed to fetch certificate details');
        }
    } catch (error) {
        console.error('Error fetching certificate details:', error);
        throw error;
    }
}



async function mintCertificate(studentAddress: string) {
    if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        // const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        const web3 = new Web3(window.ethereum);
        const address = externalContracts[11155420].AlphaVerify.address;
        const abi = externalContracts[11155420].AlphaVerify.abi;
        const contract = new web3.eth.Contract(abi, address);
        // const signer = provider.getSigner();
        // const contract = new ethers.Contract(CONFIG.CONTRACT_ADDRESS, CONTRACT_ABI, signer);

        try {
            // // First, approve the certification on the school's backend
            // await approveCertification(studentAddress);
            
            // Then, get the certificate details
            console.log(studentAddress)
            const certDetails = await getCertificateDetails(studentAddress);
            console.log(certDetails)
            
            // Prepare metadata for IPFS
            const metadata = {
                name: `${certDetails.studentName}'s ${certDetails.course} Certificate`,
                description: `Certification of completion for ${certDetails.course} from ${certDetails.schoolName}`,
                // image: `https://ipfs.io/ipfs/${CONFIG.SAMPLE_IMAGE_CID}`,
                image: `${CONFIG.IPFS_URL}/${CONFIG.SAMPLE_IMAGE_CID}`,
                attributes: [
                    { trait_type: "Student Name", value: certDetails.studentName },
                    { trait_type: "Course", value: certDetails.course },
                    { trait_type: "Graduation Date", value: certDetails.graduationDate },
                    { trait_type: "Cert ID", value: certDetails.certId },
                    { trait_type: "School", value: certDetails.schoolName }
                ]
            };
            
            // Upload metadata to IPFS
            // const tokenURI = await pinFileToIPFS(metadata);
            const tokenURI = CONFIG.IPFS_URL;
            console.log(tokenURI)
            
            // Approve the certification on the blockchain
            let tx = await contract.methods.approveCertification(studentAddress, certDetails.certId).send({from: accounts[0]});
            
            // Finally, mint the certificate NFT
            tx = await contract.methods.mintCertificate(certDetails.certId, tokenURI).send({from: accounts[0]});
            
            console.log('Certificate minted successfully!');
            // Here you could update the UI to show the minting was successful
        } catch (error) {
            console.error('Error in certificate minting process:', error);
            // Here you could update the UI to show the error
        }
    } else {
        console.log('Please install MetaMask!');
        // Here you could update the UI to prompt the user to install MetaMask
    }
}

// Function to add a student to the database
async function addStudent(studentAddress: string, name: string, course: string, graduationDate: string |number) {
    try {
        const response = await fetch(`${CONFIG.SCHOOL_BACKEND_URL}/add-student`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
             },
            body: JSON.stringify({ studentAddress, name, course, graduationDate })
        });
        const data = await response.json();
        if (data.success) {
            console.log('Student added successfully');
            await approveCertification(studentAddress);
            console.log('Approved')
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Error adding student:', error);
        throw error;
    }
}

// This function would be called when the user clicks a "Mint Certificate" button
async function handleMintClick(studentAddress: string) {
    await mintCertificate(studentAddress);
}

export { handleMintClick, addStudent };