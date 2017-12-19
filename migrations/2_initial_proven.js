var Ownable = artifacts.require("ownership/Ownable.sol");
var Proven = artifacts.require("Proven");
var ProvenDB = artifacts.require("ProvenDB");
var ProvenRegistry = artifacts.require("ProvenRegistry");
var Verifier = artifacts.require("Verifier");
var VerifierDB = artifacts.require("VerifierDB");
var VerifierRegistry = artifacts.require("VerifierRegistry");
var BondHolder = artifacts.require("BondHolder");
var BondHolderRegistry = artifacts.require("BondHolderRegistry");

module.exports = function (deployer) {
  deployer.deploy([
    Ownable,
    ProvenRegistry,
    VerifierRegistry,
    BondHolderRegistry
  ]).then(() => {
    return deployer.deploy([
      [Proven, ProvenRegistry.address],
      [ProvenDB, ProvenRegistry.address],
      [VerifierDB, VerifierRegistry.address],
      [Verifier, VerifierRegistry.address, 0.1, 100, 1]
    ]);
  }).then(() => {
    return deployer.deploy(BondHolder, BondHolderRegistry.address, Verifier.address);
  }).then(() => {
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
}