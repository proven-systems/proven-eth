const Migrations = artifacts.require('./Migrations.sol');

module.exports = function (deployer) { // eslint-disable-line func-names
  deployer.deploy(Migrations);
};
