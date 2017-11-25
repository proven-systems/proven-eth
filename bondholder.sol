pragma solidity ^0.4.18;

import "./owned.sol";
import "./bondholder_registry.sol";

contract BondHolder is Owned {

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
        if (msg.sender != beneficiary)
            throw;
        _;
    }

    modifier onlyBonded() {
        if (!isBonded(msg.sender))
            throw;
        _;
    }

    modifier onlyWithNoBonds() {
        if (bondCount != 0)
            throw;
        _;
    }

    function BondHolder(address _registry, address _beneficiary) {
        registry = BondHolderRegistry(_registry);
        beneficiary = _beneficiary;
    }

    function withdraw(uint _amount) public {

        if (withdrawals[msg.sender] < _amount)
            throw;

        withdrawals[msg.sender] -= _amount;

        if (!msg.sender.send(_amount))
            throw;

        BondWithdrawn(msg.sender, _amount);

        if (withdrawals[msg.sender] == 0)
            delete withdrawals[msg.sender];
    }

    function depositBond() public payable {
        if (msg.value == 0)
            throw;

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
        if (_amount > available)
            throw;

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
        if (bonds[msg.sender].lockedAmount + _amount > bonds[msg.sender].balance)
            throw;

        bonds[msg.sender].lockedAmount += _amount;

        BondLocked(_bonded, _amount);
    }

    function unlockBond(address _bonded, uint _amount) public onlyBeneficiary {

        if (_amount > bonds[msg.sender].lockedAmount) {
            bonds[msg.sender].lockedAmount = 0;
        } else {
            bonds[msg.sender].lockedAmount -= _amount;
        }

        BondUnlocked(_bonded, _amount);
    }

    /// Distributes an amount from a bondee account to 2 recipients, split evenly
    //
    // Only callable by the beneficiary.
    function distributeBond(address _from, uint _amount, address _recipient1, address _recipient2) public onlyBeneficiary {

        // cannot distribute funds that don't exist
        if (_amount > bonds[_from].balance)
            throw;

        // sanity check on locked amount
        if (_amount > bonds[_from].lockedAmount)
            throw;

        // remove bond from bondee
        bonds[_from].balance -= _amount;
        bonds[_from].lockedAmount -= _amount;

        // distribute bond
        uint amountToDistribute = _amount / 2;
        withdrawals[_recipient1] += amountToDistribute;
        withdrawals[_recipient2] += amountToDistribute;

        BondDistributed(_from, _amount, _recipient1, _recipient2);
    }

    function availableBond(address _bonded) public constant returns (uint) {
        return bonds[_bonded].balance - bonds[_bonded].lockedAmount;
    }

    function isBonded(address _bonded) public constant returns (bool) {
        return bonds[_bonded].balance != 0;
    }

    function dissolve() public onlyOwner onlyWithNoBonds {
        selfdestruct(owner);
    }
}
