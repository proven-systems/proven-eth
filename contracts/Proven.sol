/*
Proven contract
Part of the Proven suite of software
Copyright (C) 2016 "The Partnership"
(Ethereum 0x12B0621D90c69867957A836d677C64c46EC4291D)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./ProvenRegistry.sol";
import "./ProvenDb.sol";


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

    ProvenDb db = ProvenDb(registry.db());
    bytes32 id = db.storeDeposition(_owner, _ipfsHash);

    DepositionPublished(id, _owner, _ipfsHash);

    return id;
  }

  /// Retrieve the status of a deposition
//  function isDepositionVerified(bytes _ipfsHash) public view returns (bool) {
  // TODO
//  }

}
