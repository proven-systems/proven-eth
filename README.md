Proven Contracts

This project uses the [Truffle](http://truffleframework.com/) framework and [openzeppelin](https://openzeppelin.org/) smart contracts.

# Setup

* Prerequisites: Node.js
* `npm install`

# Testing

* `truffle test`

# Deployment

* Run your local Ethereum client synced to the appropriate network (ropsten shown below), with RPC enabled, and run it with the deployment account unlocked.
* `truffle migrate --network ropsten`
* Make sure to save the output of this script to `build/ropsten/migration_log.txt` for reference, as it records the addresses at which each contract is deployed.
* Verify the contract code on Etherscan ([work is underway to automate this!](https://github.com/trufflesuite/truffle/issues/564))
  * Build a single-file copy for each of the deployed contracts with: `npm run-script build-contracts` 
  * for each of these files produced in `./build/merged/*.sol`, look up the contract address deployed in `build/ropsten/migration_log.txt`.
    * Navigate in the browser: https://ropsten.etherscan.io/verifyContract2?a=0x0contractadress
    * Enter the **ContractName**
    * Select the compiler (currently **v0.4.18+commit.9cf6e910**)
    * Paste the contents of the merged contract into the big text box `cat ./builds/merged/ContractName.sol | xclip -selection c`
    * If this constructor has an argument you'll have to figure it out by comparing `./build/contracts/ContractName.json` —> `"deployedBytecode"` with the input data of the contract hash for the transaction.  Go to https://ropsten.etherscan.io and search for the address deployed, then clck on the TxHash for the *Contract Creation* (earliest) event. Look at where the `deployedBytecode` ends, and whatever is in Etherscan's Tx `Input Data` after that is the constructor. Paste that into the "Constructor Arguments ABI-encoded on the Etherscan Verify Contract form.
    * Satisfy the reCAPTCHA and click **Verify and Publish**, cross your fingers

* Check in the changes to the `./build` directory. I think this is the right thing to do.
* Test and use.


# License

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but without any warranty; without even the implied warranty of merchantability or fitness for a particular purpose.  See the [GNU Affero General Public License](http://www.gnu.org/licenses/agpl.html) for more details.
