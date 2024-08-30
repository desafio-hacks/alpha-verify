'use client';

import { useState } from "react";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/@/components/ui/tabs"
import { Label } from "@/components/ui/label"

// Simulated blockchain and database functions
const simulateMint = () => Math.floor(Math.random() * 1000000)
const simulateGenerateAccessToken = () => Math.random().toString(36).substring(2, 15)

export default function MintCertificate() {
  const [userRole, setUserRole] = useState('student');
  const [hasMinted, setHasMinted] = useState(false);
  const [tokenId, setTokenId] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [verificationTokenId, setVerificationTokenId] = useState('');
  const [verificationAccessToken, setVerificationAccessToken] = useState('');
  const [approvedAddress, setApprovedAddress] = useState('');
  const [certificateContent, setCertificateContent] = useState('');

  const handleMint = () => {
    const newTokenId = simulateMint();
    setTokenId(newTokenId);
    setHasMinted(true);
    setCertificateContent(`Certificate for TokenID: ${newTokenId}`);
  };

  const handleGenerateAccessToken = () => {
    const newAccessToken = simulateGenerateAccessToken();
    setAccessToken(newAccessToken);
  };

  const handleRevokeAccessToken = () => {
    setAccessToken(null);
  };

  const handleVerifyCertificate = () => {
    if (verificationTokenId === tokenId.toString() && verificationAccessToken === accessToken) {
      alert('Certificate verified successfully!');
    } else {
      alert('Invalid TokenID or AccessToken');
    }
  };

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
            {!hasMinted ? (
              <Button onClick={handleMint} className="mt-4 w-full text-lg font-semibold bg-black text-white hover:bg-black hover:text-white">Mint Certificate</Button>
            ) : (
              <div className="space-y-4 mt-4">
                <Button onClick={() => alert(certificateContent)} className="w-full text-lg font-semibold bg-black text-white hover:bg-black hover:text-white">View Certificate</Button>
                <div>
                  <Label htmlFor="tokenId" className="text-sm font-semibold">Your TokenID:</Label>
                  <Input id="tokenId" value={tokenId} readOnly className="mt-1 bg-gray-100" />
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
                <Label htmlFor="approvedAddress" className="text-sm font-semibold">Address to Approve:</Label>
                <Input
                  id="approvedAddress"
                  value={approvedAddress}
                  onChange={(e) => setApprovedAddress(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button onClick={handleApproveAddress} className="w-full text-lg font-semibold bg-black text-white hover:bg-black hover:text-white">Approve Address for Minting</Button>
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
