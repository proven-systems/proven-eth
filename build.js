const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

const targets = require('./targets.json');

const outputPath = 'output/';

function findImports(path) {
    console.log('  +Loading ' + path + '...');
    return { contents: fs.readFileSync(path, 'utf8') }
}

var allTargets = targets.map(function(e) {
    var element = {};
    element.name = e.name;
    element.input = {};
    element.input[e.source] = fs.readFileSync(e.source, 'utf8');
    return element;
});

for (var i = 0; i < allTargets.length; i++) {

    var contractName = allTargets[i].name;
    var buildInput = allTargets[i].input;

    console.log('Compiling ' + contractName + '...');
    var output = solc.compile({sources: buildInput}, 1, findImports);
    if (output.errors) {
        output.errors.forEach(function(e) {
            console.log(e);
        })
        console.log("Build failed.");
        process.exit(1);
    }

    //console.log(output);

    const mkdirp = require('mkdirp');
    mkdirp.sync(outputPath);

    console.log('  Writing bytecode...');
    fs.writeFileSync(outputPath + contractName + '.bin', '0x' + output.contracts[contractName].bytecode);

    console.log('  Writing ABI...');
    fs.writeFileSync(outputPath + contractName + '.abi', output.contracts[contractName].interface);

    console.log('  Writing assembly...');
    fs.writeFileSync(outputPath + contractName + '.S', output.contracts[contractName].opcodes);
}
console.log("Done");
