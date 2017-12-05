'use strict';

var Proven = artifacts.require('../contracts/Proven.sol');
var ProvenDb = artifacts.require('../contracts/ProvenDb.sol');
var ProvenRegistry = artifacts.require('../contracts/ProvenRegistry.sol');
var Verifier = artifacts.require('../contracts/Verifier.sol');
var VerifierDb = artifacts.require('../contracts/VerifierDb.sol');
var VerifierRegistry = artifacts.require('../contracts/VerifierRegistry.sol');
var BondHolder = artifacts.require('../contracts/BondHolder.sol');
var BondHolderRegistry = artifacts.require('../contracts/BondHolderRegistry.sol');

contract('ProvenRegistry', function(accounts) {
	let provenRegistry;
	let provenDb;
	let proven;
	let verifierRegistry;
	let verifierDb;
	let verifier;
  let bondHolder;
  let bondHolderRegistry;
	let depositor1 = accounts[1];
	let depositor2 = accounts[2];
	let verifier1 = accounts[3];
	let verifier2 = accounts[4];
  let oracle = accounts[5];
  let beneficiary = accounts[6];

	before(async function(){
    provenRegistry = await ProvenRegistry.new();
    proven = await Proven.new( provenRegistry.address );
    await provenRegistry.setProven( proven.address );
    provenDb = await ProvenDb.new( provenRegistry.address );
    await provenRegistry.setDb( provenDb.address );
    verifierRegistry = await VerifierRegistry.new();
    verifierDb = await VerifierDb.new( verifierRegistry.address );
    await verifierRegistry.setDb( verifierDb.address );
    verifier = await Verifier.new( verifierRegistry.address, 10, 10, 10 );
    await verifierRegistry.setVerifier( verifier1 );
    await verifierRegistry.setOracle( oracle );
    bondHolderRegistry = await BondHolderRegistry.new();
    bondHolder = await BondHolder.new( bondHolderRegistry.address, beneficiary );
    await bondHolderRegistry.setBondHolder( bondHolder.address );
	});

	it('should have addresses', async function(){
    assert.isFalse(provenRegistry.address === proven.address);
    assert.isFalse(provenDb.address === proven.address);
    assert.isFalse(verifierRegistry.address === verifier.address);
    assert.isFalse(verifier.Db === verifier.address);
    assert.isFalse(bondHolderRegistry.address === bondHolder.address);
	});

	it('should publish an anonymous deposition', async function(){
    var result = await proven.publishDeposition("Qmb7Uwc39Q7YpPsfkWj54S2rMgdV6D845Sgr75GyxZfV4V");
    assert('DepositionPublished' === result.logs[0].event);
	});

	it('should publish a deposition from an account', async function(){
    var result = await proven.publishDeposition(depositor1.address, "Qmb7Uwc39Q7YpPsfkWj54S2rMgdV6D845Sgr75GyxZfV4V");
    assert('DepositionPublished' === result.logs[0].event);
	});

  // // there should be more than one depositor
  // the depositor and the verifier should be different entities
  // // there should be more than one verifier
  // the verifier should be able to set a bond
  // the verifier should pick up the deposition and verify it
  // the verification should appear on the blockchain
  // the depositor should be able to look up the verification:
  // based on the IPFS hash
  // based on the SHA1 hash
  // based on the SHA256 hash
  // someone should be able to challenge the verification falsely and lose her money
  // the challenger should be able to challenge the verification truthfully and win her money
  // the verifier should be able to answer the the verification challenge and keep her money
  // the challenger should get the money when the verifier does not answer the challenge
});
