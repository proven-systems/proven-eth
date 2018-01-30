// Part of the Proven suite of software
// Copyright © 2017 "The Partnership" (Ethereum 0x12B0621D90c69867957A836d677C64c46EC4291D)

pragma solidity ^0.4.19;

import "./Ownable.sol";


contract BondHolderRegistry is Ownable {

  address public bondHolder;
  address public db;

  function setBondHolder(address _bondHolder) public onlyOwner {
    bondHolder = _bondHolder;
  }

  function setDB(address _db) public onlyOwner {
    db = _db;
  }
}
