const fs = require('fs');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

const inputPath = 'output/';

function namethize(name) {
    return name.substr(0, 1).toLowerCase() + name.substr(1);
}

function contractAbiDefinition(contractName, abi) {
    return "var " + namethize(contractName) + "Abi = " + abi.trim() + ";";
}

function contractAddressDefinition(contractName, address) {
    return "var " + namethize(contractName) + "Address = \"" + address + "\";";
}

function readAbi(contractName) {
    return fs.readFileSync(inputPath + contractName + ".abi", "utf8");
}

function buildDefinitionFileContent(contractName, address) {
    return contractAbiDefinition(contractName, readAbi(contractName)) + "\n" + contractAddressDefinition(contractName, address);
}

function writeDefinitionFile(contractName, address) {
    fs.writeFileSync(inputPath + contractName + ".js", buildDefinitionFileContent(contractName, address));
}

function createContract(options, abi, bytecode, ...parameters) {
    return new Promise(function(resolve, reject) {
        var TheContract = web3.eth.contract(abi);
        var theContract = TheContract.new(...parameters, {from: options.from, data: bytecode, gas: options.gas}, function(err, contract) {
            if (err) {
                reject(err);
            } else {
                if (!contract.address) {
                    console.log("  Waiting to be mined...");
                } else {
                    resolve(contract);
                }
            }
        });
    });
}

function deploy(contractName, options, ...parameters) {

    console.log("Deploying " + contractName + "...");

    var abi = JSON.parse(fs.readFileSync(inputPath + contractName + '.abi', 'utf8'));
    var bytecode = fs.readFileSync(inputPath + contractName + '.bin', 'utf8');

    return new Promise(function(resolve, reject) {
        createContract(options, abi, bytecode, ...parameters).then(function(contract) {
            console.log("  " + contractName + " deployed to " + contract.address);
            fs.appendFileSync(inputPath + contractName + ".addresses", contract.address + "\n");
            writeDefinitionFile(contractName, contract.address);
            resolve(contract);
        }, function(err) {
            reject(err);
        });
    });
}

const deployingAccount = "0x0061b257BC2985c93868416f6543f76359AC1072";
const oracleAccount = "0x20b9cCb06cf1178f354F706e69AD1Fc86C1E94b3";

var contracts = {}
deploy("Server", {from: deployingAccount, gas: 3000000}).then(function(contract) {
    return deploy("Client", {from: deployingAccount, gas: 3000000}, contract.address);
}).then(function(contract) {
    return deploy("ProvenRegistry", {from: deployingAccount, gas: 400000});
}).then(function(contract) {
    contracts["ProvenRegistry"] = contract;
    return deploy("ProvenDb", {from: deployingAccount, gas: 500000}, contracts["ProvenRegistry"].address);
}).then(function(contract) {
    contracts["ProvenDb"] = contract;
    return deploy("Proven", {from: deployingAccount, gas: 400000}, contracts["ProvenRegistry"].address);
}).then(function(contract) {
    contracts["Proven"] = contract;
    return deploy("VerifierRegistry", {from: deployingAccount, gas: 400000});
}).then(function(contract) {
    contracts["VerifierRegistry"] = contract;
    return deploy("VerifierDb", {from: deployingAccount, gas: 800000}, contracts["VerifierRegistry"].address);
}).then(function(contract) {
    contracts["VerifierDb"] = contract;
    return deploy("Verifier", {from: deployingAccount, gas: 2000000}, contracts["VerifierRegistry"].address, 10, 2, 100);
}).then(function(contract) {
    contracts["Verifier"] = contract;
    return deploy("BondHolderRegistry", {from: deployingAccount, gas: 400000});
}).then(function(contract) {
    contracts["BondHolderRegistry"] = contract;
    return deploy("BondHolder", {from: deployingAccount, gas: 800000}, contracts["BondHolderRegistry"].address, contracts["Verifier"].address);
}).catch(function(err) {
    console.log('Error deploying: ' + err);
});

