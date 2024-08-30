//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AssetTypeRegistry.sol";
import "./interface/IAsset.sol";

// Asset Manager Contract
contract AssetManager {
    AssetTypeRegistry public immutable registry;

    event AssetCreated(uint256 assetType, uint256 tokenId, address owner);
    event AssetBurned(uint256 assetType, uint256 assetId, address owner);
    event AssetUpdated(uint256 assetType, uint256 assetId);

    constructor(address _registry) {
        registry = AssetTypeRegistry(_registry);
    }
    modifier onlyRegisteredAsset(uint256
     assetType) {
        address assetContract = registry.getContract(assetType);
        require(assetContract != address(0), "Asset type not registered");
        _;
    }
    modifier onlyOwner(uint256 assetType, uint256 assetId) {
        address assetContract = registry.getContract(assetType);
        address owner = IAsset(assetContract).ownerOf(assetId);
        require(owner == msg.sender, "Caller must be owner");
        _;
    }

    function createAsset(uint256 assetType, bytes calldata data) onlyRegisteredAsset(assetType) external returns (uint256) {
        address assetContract = registry.getContract(assetType);
        uint256 tokenId = IAsset(assetContract).createAsset(msg.sender, data);
        emit AssetCreated(assetType, tokenId, msg.sender);
        return tokenId;
    }

    function getAsset(uint256 assetType, bytes calldata data) onlyRegisteredAsset(assetType) external returns (string memory) {
        address assetContract = registry.getContract(assetType);
        string memory tokenUri = IAsset(assetContract).getAsset(msg.sender, data);
        return tokenUri;   
    }

    function updateAsset(uint256 assetType, uint256 assetId) onlyRegisteredAsset(assetType) onlyOwner(assetType, assetId) external {
        address assetContract = registry.getContract(assetType);
        IAsset(assetContract).updateAsset(assetId);
        emit AssetUpdated(assetType, assetId);
    }

    function verifyAsset(uint256 assetType, uint256 assetId) external returns (bool) {
        address assetContract = registry.getContract(assetType);
        bool verified = IAsset(assetContract).verifyAsset(assetId);
        return verified;
    }

    // function transferAsset(uint256 assetType, uint256 assetId) external {}

    function burnAsset(uint256 assetType, uint256 assetId) onlyRegisteredAsset(assetType) onlyOwner(assetType, assetId) external {
        address assetContract = registry.getContract(assetType);
        IAsset(assetContract).burn(assetId);
        address owner = IAsset(assetContract).ownerOf(assetId);
        emit AssetBurned(assetType, assetId, owner);
    }
}