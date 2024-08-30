// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AlphaVerify is ERC721URIStorage, AccessControl {
    using Counters for Counters.Counter;

    bytes32 public constant SCHOOL_ROLE = keccak256("SCHOOL_ROLE");
    address public immutable AssetManager;
    Counters.Counter private _tokenIds;
    

    struct Certificate {
        string certId;
        bytes4 accessToken;
        uint256 expiryTime;
    }

    mapping(uint256 => Certificate) private _certificates; // tokenId -> Certificate
    mapping(address => uint256) private _userCertificate; // address -> tokenId
    mapping(address => mapping(string => bool)) private _approvedCertifications;

    event CertificateMinted(uint256 indexed tokenId, address indexed owner, string certId);
    event CertificationApproved(address indexed student, string certId);
    event AccessGranted(uint256 indexed tokenId, bytes32 accessToken, uint256 expirationTime);

    constructor(address _assetManger) ERC721("AlphaVerify", "ALPVY") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(SCHOOL_ROLE, msg.sender);
        AssetManager = _assetManger;
    }
    modifier OnlyOwner(uint256 tokenId) {
        require(ownerOf(tokenId) == msg.sender, "Not the token owner");
        _;
    }
    modifier onlyManager() {
        require(AssetManager == msg.sender, "Not the token owner");
        _;
    }

    function approveCertification(address student, string memory certId) external {
        require(!_approvedCertifications[student][certId], "Certification already approved");
        _approvedCertifications[student][certId] = true;
        emit CertificationApproved(student, certId);
    }



    function mintCertificate(string memory certId, string memory uri, address owner) private {
        require(_userCertificate[owner] == 0, "Graduate already has a certificate");
        require(_approvedCertifications[owner][certId], "Certification not approved by school");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(owner, newTokenId);
        _setTokenURI(newTokenId, uri);

        Certificate storage newCert = _certificates[newTokenId];
        newCert.certId = certId;

        _userCertificate[owner] = newTokenId;

        // Remove the approval after minting to prevent re-use
        _approvedCertifications[owner][certId] = false;

        emit CertificateMinted(newTokenId, owner, certId);
    }

    function createAsset(address owner, bytes calldata data) onlyManager external {
        (string memory certId,string memory uri) = abi.decode(data, (string, string));
        mintCertificate(certId, uri, owner);
    }

    function generateAccessToken(uint256 tokenId, uint256 duration) external OnlyOwner(tokenId) {
        if (block.timestamp <= _certificates[tokenId].expiryTime) {
            revokeAccessToken(tokenId);
        }

        bytes32 fullHash = keccak256(abi.encodePacked(block.timestamp, msg.sender, tokenId, duration));
        _certificates[tokenId].accessToken = bytes4(fullHash);
        _certificates[tokenId].expiryTime = block.timestamp + duration;

        emit AccessGranted(tokenId, _certificates[tokenId].accessToken, _certificates[tokenId].expiryTime);
    }

    function getAccessToken(uint256 tokenId) OnlyOwner(tokenId) external view returns (bytes4) {
        require(block.timestamp <= _certificates[tokenId].expiryTime, "Access token expired");
        return _certificates[tokenId].accessToken;
    }

    function revokeAccessToken(uint256 tokenId) OnlyOwner(tokenId) public {
        delete _certificates[tokenId].accessToken;
        delete _certificates[tokenId].expiryTime;
    }

    function getCertificateId(uint256 tokenId, bytes4 accessToken) private view returns (string memory) {
        require(_isApprovedOrOwner(_msgSender(), tokenId) || 
                (_certificates[tokenId].accessToken == accessToken && 
                 block.timestamp <= _certificates[tokenId].expiryTime), 
                "Not authorized or access expired");
        return _certificates[tokenId].certId;
    }

    function getAsset(address owner, bytes calldata data) external view onlyManager returns(string memory) {
        uint256 tokenId;
        bytes4 accessToken;
        (tokenId, accessToken) = abi.decode(data, (uint256, bytes4));
        require(ownerOf(tokenId) == owner, "Not the token owner");
        return getCertificateId(tokenId, accessToken);
    }

    function getTokenId(address user) external view returns (uint256) {
        return _userCertificate[user];
    }

    function checkAccessTokenValidity(uint256 tokenId, bytes4 accessToken) public view returns (bool isValid, uint256 expirationTime) {
        require(_certificates[tokenId].accessToken == accessToken, "Wrong access token");
        uint256 expiration = _certificates[tokenId].expiryTime;
        isValid = (expiration != 0 && block.timestamp <= expiration);
        expirationTime = expiration;
    }
    function verifyAsset(uint256 tokenId, bytes calldata data) external view returns (bool) {
    bytes4 accessToken;
    (accessToken) = abi.decode(data, (bytes4));
    (bool isValid,) = checkAccessTokenValidity(tokenId, accessToken);
    return isValid;
}

    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view override returns (bool) {
        address owner = ownerOf(tokenId);
        return (spender == owner || getApproved(tokenId) == spender || isApprovedForAll(owner, spender));
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}