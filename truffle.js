module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  networks: {
// for ganache-gui
//    development: {
//      host: "localhost",
//      port: 7545,
//      network_id: "5777" // match any network
//    },
    localhost: {
      host: "localhost",
      port: 8546,
      network_id: "*"
    },
    ropsten: {
      host: "localhost",
      port: 8545,
      gas: 4612388,
      network_id: "3"
    }
  }
};
