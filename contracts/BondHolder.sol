// Part of the Proven suite of software
// Copyright © 2017 "The Partnership" (Ethereum 0x12B0621D90c69867957A836d677C64c46EC4291D)

pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./BondHolderRegistry.sol";


contract BondHolder is Ownable {

  BondHolderRegistry public registry;

  /// The address for whom we are holding bonds
  address public beneficiary;

  mapping(address => Bond) public bonds;
  uint public bondCount;

  mapping(address => uint) public withdrawals;

  struct Bond {
    uint balance;
    uint lockedAmount;
  }

  event BondDeposited(address bonded, uint amount);
  event BondReleased(address bonded, uint amount);
  event BondWithdrawn(address bonded, uint amount);
  event BondLocked(address bonded, uint amount);
  event BondUnlocked(address bonded, uint amount);
  event BondDistributed(address bonded, uint amount, address recipient1, address recipient2);

  modifier onlyBeneficiary() {
    require(msg.sender == beneficiary);
    _;
  }

  modifier onlyBonded() {
    require(isBonded(msg.sender));
    _;
  }

  modifier onlyWithNoBonds() {
    require(bondCount == 0);
    _;
  }

  function BondHolder(address _registry, address _beneficiary) public {
    registry = BondHolderRegistry(_registry);
    beneficiary = _beneficiary;
  }

  function withdraw(uint _amount) public {

    require(withdrawals[msg.sender] >= _amount);

    withdrawals[msg.sender] -= _amount;

    assert(msg.sender.send(_amount));

    BondWithdrawn(msg.sender, _amount);

    if (withdrawals[msg.sender] == 0)
      delete withdrawals[msg.sender];
  }

  function depositBond() public payable {
    require(msg.value > 0);

    if (bonds[msg.sender].balance == 0)
      bondCount += 1;

    bonds[msg.sender].balance += msg.value;

    BondDeposited(msg.sender, msg.value);
  }

  function releaseBond(uint _amount) public onlyBonded {

    var lockedAmount = bonds[msg.sender].lockedAmount;
    var balance = bonds[msg.sender].balance;
    uint available = 0;
    if (lockedAmount < balance) {
      available = balance - lockedAmount;
    }

    require(_amount <= available);

    bonds[msg.sender].balance -= _amount;
    withdrawals[msg.sender] += _amount;

    BondReleased(msg.sender, _amount);

    if (bonds[msg.sender].balance == 0) {
      delete bonds[msg.sender];
      bondCount -= 1;
    }
  }

  function lockBond(address _bonded, uint _amount) public onlyBeneficiary {

    // cannot lock more than bonded has on deposit
    require((bonds[_bonded].lockedAmount + _amount) <= bonds[_bonded].balance);

    bonds[_bonded].lockedAmount += _amount;

    BondLocked(_bonded, _amount);
  }

  function unlockBond(address _bonded, uint _amount) public onlyBeneficiary {

    if (_amount > bonds[_bonded].lockedAmount) {
      bonds[_bonded].lockedAmount = 0;
    } else {
      bonds[_bonded].lockedAmount -= _amount;
    }

    BondUnlocked(_bonded, _amount);
  }

  /// Distributes an amount from a bondee account to 2 recipients, split evenly
  //
  // Only callable by the beneficiary.
  function distributeBond(address _from, uint _amount, address _recipient1, address _recipient2) public onlyBeneficiary {

    // cannot distribute funds that don't exist
    require(_amount <= bonds[_from].balance);

    // sanity check on locked amount
    require(_amount <= bonds[_from].lockedAmount);

    // remove bond from bondee
    bonds[_from].balance -= _amount;
    bonds[_from].lockedAmount -= _amount;

    // distribute bond
    uint amountToDistribute = _amount / 2;
    withdrawals[_recipient1] += amountToDistribute;
    withdrawals[_recipient2] += amountToDistribute;

    BondDistributed(_from, _amount, _recipient1, _recipient2);
  }

  function availableBond(address _bonded) public view returns (uint) {
    return bonds[_bonded].balance - bonds[_bonded].lockedAmount;
  }

  function isBonded(address _bonded) public view returns (bool) {
    return bonds[_bonded].balance != 0;
  }

  function dissolve() public onlyOwner onlyWithNoBonds {
    selfdestruct(owner);
  }
}
