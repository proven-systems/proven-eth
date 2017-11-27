pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract BondHolderRegistry is Ownable {

    address public bondHolder;
    address public db;

    function setBondHolder(address _bondHolder) public onlyOwner {
        bondHolder = _bondHolder;
    }

    function setDb(address _db) public onlyOwner {
        db = _db;
    }
}
