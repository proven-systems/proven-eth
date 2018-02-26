const Ownable = artifacts.require('ownership/Ownable.sol');
const Proven = artifacts.require('Proven');
const ProvenDB = artifacts.require('ProvenDB');
const ProvenRegistry = artifacts.require('ProvenRegistry');
const Verifier = artifacts.require('Verifier');
const VerifierDB = artifacts.require('VerifierDB');
const VerifierRegistry = artifacts.require('VerifierRegistry');
const BondHolder = artifacts.require('BondHolder');
const BondHolderRegistry = artifacts.require('BondHolderRegistry');

module.exports = function (deployer) { // eslint-disable-line func-names
  deployer.deploy([
    Ownable,
    ProvenRegistry,
    VerifierRegistry,
    BondHolderRegistry,
  ]).then(() => deployer.deploy([
    [Proven, ProvenRegistry.address],
    [ProvenDB, ProvenRegistry.address],
    [VerifierDB, VerifierRegistry.address],
    [Verifier, VerifierRegistry.address, 0.1, 100, 1],
  ])).then(() => deployer.deploy(BondHolder, BondHolderRegistry.address, Verifier.address)).then(() => {
    deployer.then(() => {
      ProvenRegistry.at(ProvenRegistry.address).setProven(Proven.address);
      ProvenRegistry.at(ProvenRegistry.address).setDB(ProvenDB.address);
      VerifierRegistry.at(VerifierRegistry.address).setProven(Proven.address);
      VerifierRegistry.at(VerifierRegistry.address).setDB(VerifierDB.address);
      VerifierRegistry.at(VerifierRegistry.address).setVerifier(Verifier.address);
      VerifierRegistry.at(VerifierRegistry.address).setBondHolder(BondHolder.address);
      // VerifierRegistry.at(VerifierRegistry.address).setOracle(Proven.address); // still not sure what the Oracle is supposed to do.
      BondHolderRegistry.at(BondHolderRegistry.address).setBondHolder(BondHolder.address);
    });
  });
};
