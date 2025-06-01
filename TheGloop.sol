
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TheGloop is ERC721Enumerable, Ownable {
    uint256 public constant MAX_SUPPLY = 777;
    uint256 public constant TREASURY_AMOUNT = 200;
    uint256 public constant MAX_PER_WALLET = 1;

    string public baseTokenURI;

    bool public whitelistMintActive = false;
    bool public publicMintActive = false;

    address public treasuryWallet;
    mapping(address => bool) public whitelist;
    mapping(address => uint256) public mintedPerWallet;

    constructor(string memory _baseTokenURI, address _treasuryWallet) ERC721("Gloop NFT", "GLOOP") {
        baseTokenURI = _baseTokenURI;
        treasuryWallet = _treasuryWallet;
    }

    function setBaseURI(string memory _baseTokenURI) external onlyOwner {
        baseTokenURI = _baseTokenURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    function setWhitelistMintActive(bool _active) external onlyOwner {
        whitelistMintActive = _active;
    }

    function setPublicMintActive(bool _active) external onlyOwner {
        publicMintActive = _active;
    }

    function addToWhitelist(address[] calldata users) external onlyOwner {
        for (uint256 i = 0; i < users.length; i++) {
            whitelist[users[i]] = true;
        }
    }

    function mint() external {
        require(totalSupply() < MAX_SUPPLY, "All NFTs minted");
        require(mintedPerWallet[msg.sender] < MAX_PER_WALLET, "Max per wallet");

        if (whitelistMintActive) {
            require(whitelist[msg.sender], "Not whitelisted");
        } else {
            require(publicMintActive, "Public mint not active");
        }

        mintedPerWallet[msg.sender]++;
        _safeMint(msg.sender, totalSupply() + 1);
    }

    function mintTreasury() external {
        require(msg.sender == treasuryWallet, "Only treasury");
        require(totalSupply() + TREASURY_AMOUNT <= MAX_SUPPLY, "Exceeds max supply");

        for (uint256 i = 0; i < TREASURY_AMOUNT; i++) {
            _safeMint(treasuryWallet, totalSupply() + 1);
        }
    }
}
