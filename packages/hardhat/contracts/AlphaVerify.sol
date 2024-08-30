// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AlphaVerify {

    constructor() {}

    function approveCertification(address student, string memory certId) external {}

    function mintCertificate(string memory certId, string memory uri) external {}

    function generateAccessToken(uint256 tokenId, uint256 duration) external {}

    function getAccessToken(uint256 tokenId) external view returns (bytes4) {}

    function revokeAccessToken(uint256 tokenId) public {}

    function getCertificateId(uint256 tokenId, bytes4 accessToken) external view returns (string memory) {}

    function getTokenId(address user) external view returns (uint256) {}

    function checkAccessTokenValidity(uint256 tokenId) external view returns (bool isValid, uint256 expirationTime) {}
}