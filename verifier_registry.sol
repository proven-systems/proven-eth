/*
Registry contract
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

pragma solidity ^0.4.4;

import "./owned.sol";

/// VerifierRegistry
/// Allows separation of the contract implementation from the interface so
/// things like mobile clients only need a single access point, and internal
/// contracts don't need to store dependents.
contract VerifierRegistry is Owned {

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

    function setDb(address _db) public onlyOwner {
        db = _db;
    }

    function setBondHolder(address _bondHolder) public onlyOwner {
        bondHolder = _bondHolder;
    }

    function setOracle(address _oracle) public onlyOwner {
        oracle = _oracle;
    }
}
