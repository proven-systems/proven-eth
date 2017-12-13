// Part of the Proven suite of software
// Copyright © 2017 "The Partnership" (Ethereum 0x12B0621D90c69867957A836d677C64c46EC4291D)

pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./ProvenRegistry.sol";
import "./ProvenDB.sol";


/// Proven
/// Allows callers to prove the provenance of a chain of hashed files stored in IPFS.
contract Proven is Ownable {

  ProvenRegistry public registry;

  /// Logged when this occurs
  event DepositionPublished(bytes32 _deposition, address _deponent, bytes _ipfsHash);

  /// Constructor must be passed a backend
  function Proven(address _registry) public {
    registry = ProvenRegistry(_registry);
  }

  /// Publish a deposition
  function publishDeposition(bytes _ipfsHash) public returns (bytes32) {
    return publishDeposition(msg.sender, _ipfsHash);
  }

  function publishDeposition(address _owner, bytes _ipfsHash) public returns (bytes32) {

    ProvenDB db = ProvenDB(registry.db());
    bytes32 id = db.storeDeposition(_owner, _ipfsHash);

    DepositionPublished(id, _owner, _ipfsHash);

    return id;
  }
}
