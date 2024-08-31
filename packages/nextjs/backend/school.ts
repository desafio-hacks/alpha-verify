/* eslint-disable prettier/prettier */
import externalContracts from '@/contracts/externalContracts';
import { ethers } from 'ethers';
import { create } from 'ipfs-http-client';
import { Web3} from "web3"

// Configuration
const CONFIG = {
    CONTRACT_ADDRESS: '0xCaeC3B55dF16ec145B9e262a3Bd2A225b081630F', // Your deployed contract address
    SCHOOL_BACKEND_URL: "https://alpha-verify-server.vercel.app", // Production
    // SCHOOL_BACKEND_URL: "http://localhost:3001", // Production
    IPFS_URL: 'https://aquamarine-famous-penguin-727.mypinata.cloud/ipfs/',  // Or your preferred IPFS gateway
    SAMPLE_IMAGE_CID: 'QmPG1wiULtXJNPypDhAdT9t67mrxRG4XieEx9U1mvxzbcP'
};

// const CONTRACT_ABI = externalContracts[11155420].AlphaVerify.abi;

// Configure IPFS client
const ipfs = create({ url: CONFIG.IPFS_URL });

async function uploadToIPFS(content: any) {
    const result = await ipfs.add(JSON.stringify(content));
    return `ipfs://${result.path}`;
}

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

async function getCertificateDetails(studentAddress: string) {
    try {
        const response = await fetch(`${CONFIG.SCHOOL_BACKEND_URL}/certificate?studentAddress=${studentAddress}`);
        const data = await response.json();
        if (data.success) {
            return data;
        } else {
            throw new Error(data.error);
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
            const tokenURI = await uploadToIPFS(metadata);
            console.log(tokenURI)
            
            // Approve the certification on the blockchain
            let tx = await contract.method.approveCertification(studentAddress, certDetails.certId).send({from: accounts[0]});
            
            // Finally, mint the certificate NFT
            tx = await contract.method.mintCertificate(certDetails.certId, tokenURI).send({from: accounts[0]});
            
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
                "Access-Control-Allow-Origin": "no-cors"
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
function handleMintClick(studentAddress: string) {
    mintCertificate(studentAddress);
}

export { handleMintClick, addStudent };