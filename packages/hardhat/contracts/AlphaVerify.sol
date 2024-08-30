// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AlphaVerify is ERC721, ERC721URIStorage, AccessControl {
    using Counters for Counters.Counter;

    bytes32 public constant SCHOOL_ROLE = keccak256("SCHOOL_ROLE");
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

    constructor() ERC721("AlphaVerify", "ALPVY") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(SCHOOL_ROLE, msg.sender);
    }

    function approveCertification(address student, string memory certId) external {
        require(!_approvedCertifications[student][certId], "Certification already approved");
        _approvedCertifications[student][certId] = true;
        emit CertificationApproved(student, certId);
    }

    function mintCertificate(string memory certId, string memory uri) external {
        require(_userCertificate[msg.sender] == 0, "Graduate already has a certificate");
        require(_approvedCertifications[msg.sender][certId], "Certification not approved by school");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, uri);

        Certificate storage newCert = _certificates[newTokenId];
        newCert.certId = certId;

        _userCertificate[msg.sender] = newTokenId;

        // Remove the approval after minting to prevent re-use
        _approvedCertifications[msg.sender][certId] = false;

        emit CertificateMinted(newTokenId, msg.sender, certId);
    }

    function generateAccessToken(uint256 tokenId, uint256 duration) external {
        require(ownerOf(tokenId) == msg.sender, "Not the token owner");

        if (block.timestamp <= _certificates[tokenId].expiryTime) {
            revokeAccessToken(tokenId);
        }

        bytes32 fullHash = keccak256(abi.encodePacked(block.timestamp, msg.sender, tokenId, duration));
        _certificates[tokenId].accessToken = bytes4(fullHash);
        _certificates[tokenId].expiryTime = block.timestamp + duration;

        emit AccessGranted(tokenId, _certificates[tokenId].accessToken, _certificates[tokenId].expiryTime);
    }

    function getAccessToken(uint256 tokenId) external view returns (bytes4) {
        require(ownerOf(tokenId) == msg.sender, "Not the token owner");
        require(block.timestamp <= _certificates[tokenId].expiryTime, "Access token expired");

        return _certificates[tokenId].accessToken;
    }

    function revokeAccessToken(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Not the token owner");
        delete _certificates[tokenId].accessToken;
        delete _certificates[tokenId].expiryTime;
    }

    function getCertificateId(uint256 tokenId, bytes4 accessToken) external view returns (string memory) {
        require(_isApprovedOrOwner(_msgSender(), tokenId) || 
                (_certificates[tokenId].accessToken == accessToken && 
                 block.timestamp <= _certificates[tokenId].expiryTime), 
                "Not authorized or access expired");
        return _certificates[tokenId].certId;
    }

    function getTokenId(address user) external view returns (uint256) {
        return _userCertificate[user];
    }

    function checkAccessTokenValidity(uint256 tokenId) external view returns (bool isValid, uint256 expirationTime) {
        uint256 expiration = _certificates[tokenId].expiryTime;
        isValid = (expiration != 0 && block.timestamp <= expiration);
        expirationTime = expiration;
    }

    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view returns (bool) {
        address owner = ownerOf(tokenId);
        return (spender == owner || getApproved(tokenId) == spender || isApprovedForAll(owner, spender));
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}