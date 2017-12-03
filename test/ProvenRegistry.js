'use strict';

var Proven = artifacts.require('../contracts/Proven.sol');
var ProvenDb = artifacts.require('../contracts/ProvenDb.sol');
var ProvenRegistry = artifacts.require('../contracts/ProvenRegistry.sol');

contract('ProvenRegistry', function(accounts) {
	let provenRegistry;
	let provenDb;
	let proven;
	let depositor = accounts[1];

	before(async function(){
		provenRegistry = await ProvenRegistry.new();
		proven = await Proven.new( provenRegistry.address );
		await provenRegistry.setProven( proven.address );
		provenDb = await ProvenDb.new( provenRegistry.address );
		await provenRegistry.setDb( provenDb.address );
	});

	it('should have addresses', async function(){
		assert.isFalse(provenRegistry.address === proven.address);
		assert.isFalse(provenDb.address === proven.address);
	});

	it('should publish an anonymous deposition', async function(){
		var result = await proven.publishDeposition("Qmb7Uwc39Q7YpPsfkWj54S2rMgdV6D845Sgr75GyxZfV4V");
		assert('DepositionPublished' === result.logs[0].event);
	});

	it('should publish a deposition from an account', async function(){
		var result = await proven.publishDeposition(depositor.address, "Qmb7Uwc39Q7YpPsfkWj54S2rMgdV6D845Sgr75GyxZfV4V");
		assert('DepositionPublished' === result.logs[0].event);
	});
});
