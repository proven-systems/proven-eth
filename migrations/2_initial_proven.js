var Proven = artifacts.require("Proven");
var ProvenDb = artifacts.require("ProvenDb");
var ProvenRegistry = artifacts.require("ProvenRegistry");

module.exports = function(deployer) {
  deployer.deploy(ProvenRegistry).then(function() {
    return deployer.deploy(Proven, ProvenRegistry.address).then(function() {
      return deployer.deploy(ProvenDb, ProvenRegistry.address);
    })
  })
};
