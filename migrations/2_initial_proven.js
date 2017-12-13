var Proven = artifacts.require("Proven");
var ProvenDB = artifacts.require("ProvenDB");
var ProvenRegistry = artifacts.require("ProvenRegistry");

module.exports = function(deployer) {
  deployer.deploy(ProvenRegistry).then(function() {
    deployer.link(ProvenRegistry, Proven);
    return deployer.deploy(Proven, ProvenRegistry.address).then(function() {
      deployer.link(ProvenRegistry, ProvenDB);
      return deployer.deploy(ProvenDB, ProvenRegistry.address).then(function() {
        ProvenRegistry.at(ProvenRegistry.address).setProven(Proven.address);
        ProvenRegistry.at(ProvenRegistry.address).setDB(ProvenDB.address);
      });
    })
  })
};
