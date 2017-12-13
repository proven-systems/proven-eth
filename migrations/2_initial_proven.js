var Proven = artifacts.require("Proven");
var ProvenDB = artifacts.require("ProvenDB");
var ProvenRegistry = artifacts.require("ProvenRegistry");
var Verifier = artifacts.require("Verifier");
var VerifierDB = artifacts.require("VerifierDB");
var VerifierRegistry = artifacts.require("VerifierRegistry");
var BondHolder = artifacts.require("BondHolder");
var BondHolderRegistry = artifacts.require("BondHolderRegistry");

module.exports = function(deployer) {
  deployer.deploy(ProvenRegistry).then(function() {
    deployer.link(ProvenRegistry, Proven);
    return deployer.deploy(Proven, ProvenRegistry.address).then(function() {
      deployer.link(ProvenRegistry, ProvenDB);
      return deployer.deploy(ProvenDB, ProvenRegistry.address).then(function() {
        ProvenRegistry.at(ProvenRegistry.address).setProven(Proven.address);
        ProvenRegistry.at(ProvenRegistry.address).setDB(ProvenDB.address);
        return deployer.deploy(VerifierRegistry).then(function() {
          return deployer.deploy(VerifierDB, VerifierRegistry.address).then(function() {
            return deployer.deploy(Verifier, VerifierRegistry.address, 0.1, 100, 1).then(function() {
              return deployer.deploy(BondHolderRegistry).then(function() {
                return deployer.deploy(BondHolder).then(function() {
                  BondHolderRegistry.at(BondHolderRegistry.address).setBondHolder(BondHolder.address);
                  VerifierRegistry.at(VerifierRegistry.address).setDB(VerifierDB.address);
                  VerifierRegistry.at(VerifierRegistry.address).setBondHolder(BondHolder.address);
                  VerifierRegistry.at(VerifierRegistry.address).setProven(Proven.address);
                  VerifierRegistry.at(VerifierRegistry.address).setVerifier(Verifier.address);
//                  VerifierRegistry.at(VerifierRegistry.address).setOracle(Proven.address); // wut
                })
              })
            })
          })
        })
      })
    })
  })
};
