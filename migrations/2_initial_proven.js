var Ownable = artifacts.require("ownership/Ownable.sol");
var Proven = artifacts.require("Proven");
var ProvenDB = artifacts.require("ProvenDB");
var ProvenRegistry = artifacts.require("ProvenRegistry");
var Verifier = artifacts.require("Verifier");
var VerifierDB = artifacts.require("VerifierDB");
var VerifierRegistry = artifacts.require("VerifierRegistry");
var BondHolder = artifacts.require("BondHolder");
var BondHolderRegistry = artifacts.require("BondHolderRegistry");

module.exports = function(deployer) {
  deployer.deploy(Ownable).then(function() {
    deployer.deploy(ProvenRegistry).then(function() {
      deployer.link(Ownable, ProvenRegistry);
      deployer.link(ProvenRegistry, Proven);
      return deployer.deploy(Proven, ProvenRegistry.address).then(function() {
        deployer.link(Ownable, Proven);
        deployer.link(ProvenRegistry, ProvenDB);
        return deployer.deploy(ProvenDB, ProvenRegistry.address).then(function() {
          deployer.link(Ownable, ProvenDB);
          deployer.link(ProvenRegistry, ProvenDB);
          ProvenRegistry.at(ProvenRegistry.address).setProven(Proven.address);
          ProvenRegistry.at(ProvenRegistry.address).setDB(ProvenDB.address);
          return deployer.deploy(VerifierRegistry).then(function() {
            deployer.link(Ownable, VerifierRegistry);
            VerifierRegistry.at(VerifierRegistry.address).setProven(Proven.address);
//            VerifierRegistry.at(VerifierRegistry.address).setOracle(Proven.address); // still not sure what the Oracle is supposed to do.
            return deployer.deploy(VerifierDB, VerifierRegistry.address).then(function() {
              deployer.link(Ownable, VerifierDB);
              deployer.link(VerifierRegistry, VerifierDB);
              deployer.link(VerifierRegistry, Proven);
              VerifierRegistry.at(VerifierRegistry.address).setDB(VerifierDB.address);
              return deployer.deploy(Verifier, VerifierRegistry.address, 0.1, 100, 1).then(function() {
                deployer.link(Ownable, Verifier);
                deployer.link(VerifierRegistry, Verifier);
                VerifierRegistry.at(VerifierRegistry.address).setVerifier(Verifier.address);
                return deployer.deploy(BondHolderRegistry).then(function() {
                  deployer.link(Ownable, BondHolderRegistry);
                  return deployer.deploy(BondHolder, BondHolderRegistry.address, Verifier.address).then(function() {
                    deployer.link(Ownable, BondHolder);
                    deployer.link(BondHolderRegistry, BondHolder);
                    BondHolderRegistry.at(BondHolderRegistry.address).setBondHolder(BondHolder.address);
                    VerifierRegistry.at(VerifierRegistry.address).setBondHolder(BondHolder.address);
                  })
                })
              })
            })
          })
        })
      })
    })
  })
};
