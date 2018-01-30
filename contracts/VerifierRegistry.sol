// Part of the Proven suite of software
// Copyright © 2017 "The Partnership" (Ethereum 0x12B0621D90c69867957A836d677C64c46EC4291D)

pragma solidity ^0.4.18;

import "./Ownable.sol";


/// VerifierRegistry
/// Allows separation of the contract implementation from the interface so
/// things like mobile clients only need a single access point, and internal
/// contracts don't need to store dependents.
contract VerifierRegistry is Ownable {

  address public proven;
  address public verifier;
  address public db;
  address public bondHolder;
  address public oracle;

  function setProven(address _proven) public onlyOwner {
    proven = _proven;
  }

  function setVerifier(address _verifier) public onlyOwner {
    verifier = _verifier;
  }

  function setDB(address _db) public onlyOwner {
    db = _db;
  }

  function setBondHolder(address _bondHolder) public onlyOwner {
    bondHolder = _bondHolder;
  }

  function setOracle(address _oracle) public onlyOwner {
    oracle = _oracle;
  }
}
