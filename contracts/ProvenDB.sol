// Part of the Proven suite of software
// Copyright © 2017 "The Partnership" (Ethereum 0x12B0621D90c69867957A836d677C64c46EC4291D)

pragma solidity ^0.4.21;

import "./Ownable.sol";
import "./ProvenRegistry.sol";


/// ProvenDB
/// Back-end storage contract for the Proven app.

contract ProvenDB is Ownable {

  event DepositionStored(bytes32 indexed _deposition, address indexed _deponent, bytes _ipfsHash);

  ProvenRegistry public registry;

  /// Collection of all depositions
  mapping(bytes32 => Deposition) public depositions;

  struct Deposition {
    address deponent;
    bytes ipfsHash;
  }

  modifier onlyProven() {
    require(msg.sender == registry.proven());
    _;
  }

  modifier onlyNewReceipt(bytes32 _id) {
    require(depositions[_id].deponent == 0);
    _;
  }

  /// Constructor
  constructor(address _registry) public {
    registry = ProvenRegistry(_registry);
  }

  function getDeponent(bytes32 _id) public view returns (address) {
    return depositions[_id].deponent;
  }

  function getIPFSHash(bytes32 _id) public view returns (bytes) {
    return depositions[_id].ipfsHash;
  }

  function storeDeposition(address _deponent, bytes _ipfsHash) public onlyProven returns (bytes32) {

    // generate hash to send back to caller
    bytes32 id = keccak256(abi.encodePacked(msg.data, block.number));

    store(id, _deponent, _ipfsHash);

    return id;
  }

  function store(bytes32 _id, address _deponent, bytes _ipfsHash) internal onlyNewReceipt(_id) {

    depositions[_id].deponent = _deponent;
    depositions[_id].ipfsHash = _ipfsHash;

    emit DepositionStored(_id, _deponent, _ipfsHash);
  }
}
