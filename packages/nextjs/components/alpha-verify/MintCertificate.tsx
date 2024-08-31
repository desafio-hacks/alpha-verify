'use client';

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { useScaffoldReadContract, useScaffoldWriteContract } from "@/hooks/scaffold-eth";
import { useAccount, useReadContract } from "wagmi";
import { writeSync } from "fs";
import { alphaverify, web3 } from "@/backend/alphaverify";
import { addStudent, handleMintClick } from "@/backend/school";

// Simulated blockchain and database functions
const simulateMint = () => Math.floor(Math.random() * 1000000)
const simulateGenerateAccessToken = () => Math.random().toString(36).substring(2, 15)

export default function MintCertificate() {
  const [userRole, setUserRole] = useState('student');
  const [hasMinted, setHasMinted] = useState(false);
  const [tokenId, setTokenId] = useState<any>(null);
  const [accessToken, setAccessToken] = useState(null);
  const [verificationTokenId, setVerificationTokenId] = useState();
  const [verificationAccessToken, setVerificationAccessToken] = useState('');
  const [approvedAddress, setApprovedAddress] = useState('');
  const [certificateContent, setCertificateContent] = useState('');
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [graduationDate, setGraduationDate] = useState('');
  const [studentAddress, setStudentAddress] = useState('');
  // const [] = useAccount();
  // const {data: id} = useScaffoldWriteContract({
  //   contractName: "AlphaVerify",
  //   functionName: "getTokenId",
  //   args: ["0"],
  // })
  // const { writeAsync, isLoading, isMining } = useScaffoldReadContract({
  //   contractName: "AlphaVErify",
  //   functionName: "getTokenId",
  //   args: ["0"],
  //   blockConfirmation: 1,
  //   onBlockConfirmation: (txnReceipt) => {
  //   console.log("Transaction blockHash",  txnReceipt.blockHash);
  //   }
  //   });

  const getTokenId = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' })
    const data = await alphaverify.methods.getTokenId(accounts[0]).call()
    console.log(data)
    setTokenId(data)
  }

  useEffect(() => {
    getTokenId()
  }, [])
  
  const getAccessToken = async (tokenId: number) => {
    const data = await alphaverify.methods.getAccessToken(tokenId).call()
    return data
  }
  const generateAccessToken = async (tokenId: number) => {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' })
    const date = Date.now()
    await alphaverify.methods.generateAccessToken(tokenId, date).send({ from: accounts[0]})
    const data = await getAccessToken(tokenId)
    setAccessToken(data)
    console.log(data)
  }
  const revokeAccessToken = async (tokenId: number) => {
  const accounts = await window.ethereum.request({ method: 'eth_accounts' })
    const data = await alphaverify.methods.revokeAccessToken(tokenId).send({from: accounts[0]})
    console.log(data)
  }
  const checkAccessTokenValidity = async () => {
    const data = await alphaverify.methods.checkAccessTokenValidity().call()
    console.log(data)
  }
  const getCertificateId = async (id: number, access: string) => {
    const accessTokenBytes = "0x" + access
    const data = await alphaverify.methods.getCertificateId(id, accessTokenBytes).call()
    console.log(data)
    return data
  }

  // mintCertificate()


    


  // console.log(JSON.stringify(id));

  const handleMint = async () => {
    // const newTokenId = simulateMint();
    const accounts = await window.ethereum.request({ method: 'eth_accounts' })
    console.log(accounts[0])
    const newTokenId = await handleMintClick(accounts[0]).then(() => {
      // setCertificateContent(`Certificate for TokenID: ${tokenId}`);
      // setTokenId(tokenId);
      setHasMinted(true);
    });
    // console.log(newTokenId)
  };


  const handleGenerateAccessToken = async () => {
    // const newAccessToken = simulateGenerateAccessToken();
    await generateAccessToken(tokenId);
    // setAccessToken(newAccessToken);
  };
;
  const handleRevokeAccessToken = async () => {
    await revokeAccessToken(tokenId)
    setAccessToken(null);
  };

  const handleVerifyCertificate = async () => {
    const certId = await getCertificateId(verificationTokenId, verificationAccessToken)
    // if (verificationTokenId === tokenId.toString() && verificationAccessToken === accessToken) {
    if (certId) {
      alert('Certificate verified successfully!');
    } else {
      alert('Invalid TokenID or AccessToken');
    }
  };

  const handleAddStudent = async () => {
    await addStudent(studentAddress, name, course, graduationDate);
  }
  const handleApproveAddress = () => {
    alert(`Address ${approvedAddress} approved for minting`);
  };

  return (
    <Card className="w-full max-w-4xl bg-gradient-to-r from-white to-gray-100 text-black mx-auto shadow-lg rounded-lg">
      <CardHeader className="bg-gradient-to-r from-gray-800 to-black text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold">Certificate Management System</CardTitle>
        <CardDescription className="text-sm text-gray-300">Manage and verify student certificates</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue={userRole} onValueChange={setUserRole}>
          <TabsList className="flex w-full justify-around mb-6">
            <TabsTrigger 
              value="student" 
              className={`px-4 py-2 rounded-full font-semibold transition-colors ${userRole === 'student' ? 'bg-black text-white' : 'bg-transparent text-black border border-black'}`}
            >
              Student
            </TabsTrigger>
            <TabsTrigger
            value="employer"
              className={`px-4 py-2 rounded-full font-semibold transition-colors ${userRole === 'employer' ? 'bg-black text-white' : 'bg-transparent text-black border border-black'}`}
            >
              Employer
            </TabsTrigger>
            <TabsTrigger 
              value="school" 
              className={`px-4 py-2 rounded-full font-semibold transition-colors ${userRole === 'school' ? 'bg-black text-white' : 'bg-transparent text-black border border-black'}`}
            >
              School
            </TabsTrigger>
          </TabsList>
          <TabsContent value="student">
            {hasMinted ? (
              <Button onClick={handleMint} className="mt-4 w-full text-lg font-semibold bg-black text-white hover:bg-black hover:text-white">Mint Certificate</Button>
            ) : (
              <div className="space-y-4 mt-4">
                <Button onClick={() => alert(certificateContent)} className="w-full text-lg font-semibold bg-black text-white hover:bg-black hover:text-white">View Certificate</Button>
                <div>
                  <Label htmlFor="tokenId" className="text-sm font-semibold">Your TokenID:</Label>
                  <Input id="tokenId" value={Number(tokenId)} onChange={(e) => setTokenId(e.target.value)} className="mt-1 bg-gray-100" />
                </div>
                {accessToken ? (
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="accessToken" className="text-sm font-semibold">Your AccessToken:</Label>
                      <Input id="accessToken" value={accessToken} readOnly className="mt-1 bg-gray-100" />
                    </div>
                    <Button onClick={handleRevokeAccessToken} className="w-full text-lg font-semibold bg-black text-white hover:bg-black hover:text-white">Revoke AccessToken</Button>
                  </div>
                ) : (
                  <Button onClick={handleGenerateAccessToken} className="w-full text-lg font-semibold bg-black text-white hover:bg-black hover:text-white">Generate AccessToken</Button>
                )}
              </div>
            )}
          </TabsContent>
          <TabsContent value="employer">
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="verificationTokenId" className="text-sm font-semibold">TokenID:</Label>
                <Input
                  id="verificationTokenId"
                  value={verificationTokenId}
                  onChange={(e) => setVerificationTokenId(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="verificationAccessToken" className="text-sm font-semibold">AccessToken:</Label>
                <Input
                  id="verificationAccessToken"
                  value={verificationAccessToken}
                  onChange={(e) => setVerificationAccessToken(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button onClick={handleVerifyCertificate} className="w-full text-lg font-semibold bg-black text-white hover:bg-black hover:text-white">Verify Certificate</Button>
            </div>
          </TabsContent>
          <TabsContent value="school">
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="studentAddress" className="text-sm font-semibold">Student Address</Label>
                <Input
                  id="studentAddress"
                  value={studentAddress}
                  onChange={(e) => setStudentAddress(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="name" className="text-sm font-semibold">Student Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="course" className="text-sm font-semibold">Course:</Label>
                <Input
                  id="course"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="graduationDate" className="text-sm font-semibold">Graduation Date</Label>
                <Input
                  id="graduationDate"
                  value={graduationDate}
                  onChange={(e) => setGraduationDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button onClick={handleAddStudent} className="w-full text-lg font-semibold bg-black text-white hover:bg-black hover:text-white">Add Student</Button>
              {/* <div>
                <Label htmlFor="approvedAddress" className="text-sm font-semibold">Address to Approve:</Label>
                <Input
                  id="approvedAddress"
                  value={approvedAddress}
                  onChange={(e) => setApprovedAddress(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button onClick={handleMint} className="w-full text-lg font-semibold bg-black text-white hover:bg-black hover:text-white">Approve Address for Minting</Button> */}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="bg-gradient-to-r from-gray-800 to-black text-white rounded-b-lg flex justify-between p-4">
        <CardDescription className="text-sm">Current role: {userRole}</CardDescription>
      </CardFooter>
    </Card>
  );
}
