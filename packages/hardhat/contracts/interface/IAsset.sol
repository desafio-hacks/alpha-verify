//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IAsset {
    function createAsset(address owner, bytes calldata data) external returns (uint256);
    function getAsset(address owner, bytes calldata data) external returns (string memory);
    function verifyAsset(uint256 assetId) external returns (bool);
    function updateAsset(uint256 assetId) external;
    function ownerOf(uint256 tokenId) external view returns (address);
    function burn(uint256 assetId) external view;
    // function transfer
}