module.exports = {
    port: 18565,
    testrpcOptions: '-p 18566 -u 0x54fd80d6ae7584d8e9a19fe1df43f04e5282cc43',
    testCommand: 'truffle test',
    norpc: true,
    copyNodeModules: true,
    skipFiles: ['zeppelin-solidity/contracts/ownership/Ownable.sol']
};
