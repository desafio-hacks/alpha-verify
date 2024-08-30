// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract AssetTypeRegistry is Ownable {

    mapping(uint256 => address) public assetTypeToContract;
    
    event AssetTypeRegistered(uint256 indexed assetType, address factory);
    event AssetTypeRemoved(uint256 indexed assetType);

    constructor() {
    }

    function registerAssetType(uint256 assetType, address factory) external  onlyOwner {
        require(assetTypeToContract[assetType] == address(0), "Asset type already registered");
        assetTypeToContract[assetType] = factory;
        emit AssetTypeRegistered(assetType, factory);
    }
    
    function removeAssetType(uint256 assetType) external onlyOwner {
        require(assetTypeToContract[assetType] == address(0), "Asset type not registered");
        delete assetTypeToContract[assetType];
        emit AssetTypeRemoved(assetType);
    }

    function isAssetTypeRegistered(uint256 assetType) external view returns(bool) {
        return assetTypeToContract[assetType] != address(0);
    }

    function getContract(uint256 assetType) external view returns (address) {
        return assetTypeToContract[assetType];
    }
}