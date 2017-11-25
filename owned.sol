/*
Owned contract
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

pragma solidity ^0.4.9;

/// Owned
/// A standard contract structure for ownable things.
contract Owned
{
    /// The owner
    address public owner;

    /// Constructor: initializes owner
    function Owned() {
        owner = msg.sender;
    }

    /// Ensure that only the owner can call a function
    modifier onlyOwner {
        if (msg.sender != owner)
            throw;
        _;
    }

    /// Ensure address is set to something relatively sane
    modifier onlyValidRecipient(address _recipient) {
        if (_recipient == address(0))
            throw;
        _;
    }

    /// Transfer ownership to a new owner
    /// Callable only by the current owner.
    function transferOwnership(address _newOwner) public onlyOwner onlyValidRecipient(_newOwner) {
        owner = _newOwner;
    }

    /// Dissolve contract and send the remaining ETH to a beneficiary
    function dissolve(address _beneficiary) public onlyOwner onlyValidRecipient(_beneficiary) {
        selfdestruct(_beneficiary);
    }
}
