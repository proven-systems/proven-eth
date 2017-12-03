var Proven = artifacts.require("Proven");
var ProvenDb = artifacts.require("ProvenDb");
var ProvenRegistry = artifacts.require("ProvenRegistry");

module.exports = function(deployer) {
  deployer.deploy(ProvenRegistry).then(function() {
    deployer.link(ProvenRegistry, Proven);
    return deployer.deploy(Proven, ProvenRegistry.address).then(function() {
      deployer.link(ProvenRegistry, ProvenDb);
      return deployer.deploy(ProvenDb, ProvenRegistry.address).then(function() {
        ProvenRegistry.at(ProvenRegistry.address).setProven(Proven.address);
        ProvenRegistry.at(ProvenRegistry.address).setDb(ProvenDb.address);
      });
    })
  })
};
