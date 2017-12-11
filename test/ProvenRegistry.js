'use strict';

var Proven = artifacts.require('../contracts/Proven.sol');
var ProvenDb = artifacts.require('../contracts/ProvenDb.sol');
var ProvenRegistry = artifacts.require('../contracts/ProvenRegistry.sol');
var Verifier = artifacts.require('../contracts/Verifier.sol');
var VerifierDb = artifacts.require('../contracts/VerifierDb.sol');
var VerifierRegistry = artifacts.require('../contracts/VerifierRegistry.sol');
var BondHolder = artifacts.require('../contracts/BondHolder.sol');
var BondHolderRegistry = artifacts.require('../contracts/BondHolderRegistry.sol');


contract('Proven', function(accounts) {
  let provenRegistry;
  let provenDb;
  let proven;
  let verifierRegistry;
  let verifierDb;
  let verifier;
  let bondHolder;
  let bondHolderRegistry;
  let deposition1;
  let deposition2;
  let deposition3;
  let deposition4;
  let deposition5;
  let verification1, verification2, verification3;
  let depositor1 = accounts[1];
  let depositor2 = accounts[2];
  let depositor3 = accounts[3];
  let verifier1 = accounts[4];
  let verifier2 = accounts[5];
  let oracle = accounts[6];
  let beneficiary = accounts[7];
  let challenger1 = accounts[8];
  let challenger2 = accounts[9];
  let ipfsPic1 = "Qmb7Uwc39Q7YpPsfkWj54S2rMgdV6D845Sgr75GyxZfV4V";
  let ipfsPic2 = "Qmb7Uwc39Q7YpPsfkWj54S2rMgdV6D845Sgr75GyxZfV4V";
  let ipfsPic3 = "Qmb7Uwc39Q7YpPsfkWj54S2rMgdV6D845Sgr75GyxZfV4V";
  let ipfsPic4 = "QmVpYa8krJAdwDEcHcWVwyg2vznS3MoAXycaLHmqPWkn8j";
  let ipfsPic5 = "QmTbhNNgnSzDnQj8mLELcxqZKwUwbzpnHj2iMeqscjpDEF";

  before(async function(){
    provenRegistry = await ProvenRegistry.new();
    proven = await Proven.new( provenRegistry.address );
    await provenRegistry.setProven( proven.address );
    provenDb = await ProvenDb.new( provenRegistry.address );
    await provenRegistry.setDb( provenDb.address );
    verifierRegistry = await VerifierRegistry.new();
    verifierDb = await VerifierDb.new( verifierRegistry.address );
    await verifierRegistry.setDb( verifierDb.address );
    var fee = new web3.BigNumber(web3.toWei(.01, 'ether'));
    verifier = await Verifier.new( verifierRegistry.address, fee, 10, 10 );
    await verifierRegistry.setVerifier( verifier.address );
    await verifierRegistry.setOracle( oracle );
    await verifierRegistry.setProven( proven.address );
    bondHolderRegistry = await BondHolderRegistry.new();
    bondHolder = await BondHolder.new( bondHolderRegistry.address, verifier.address );
    await bondHolderRegistry.setBondHolder( bondHolder.address );
    await verifierRegistry.setBondHolder( bondHolder.address );
	});

  it('should have addresses', async function(){
    assert.isFalse(provenRegistry.address === proven.address);
    assert.isFalse(provenDb.address === proven.address);
    assert.isFalse(verifierRegistry.address === verifier.address);
    assert.isFalse(verifier.Db === verifier.address);
    assert.isFalse(bondHolderRegistry.address === bondHolder.address);
  });

  // Publish a deposition without specifying the depositor
  it('should publish an anonymous deposition', async function(){
    var result = await proven.publishDeposition(ipfsPic1);
    deposition1 = result;
    assert(depositor1 != result.logs[0].args['_deponent']);
    assert('DepositionPublished' === result.logs[0].event);
  });

  // Publish a deposition specifying the depositor
  it('should publish a deposition from an account', async function(){
    var result = await proven.publishDeposition(depositor2.address, ipfsPic2);
    deposition2 = result;
    assert(depositor2 != result.logs[0].args['_deponent']);
    assert('DepositionPublished' === result.logs[0].event);
  });

  // Publish a deposition directly from the depositor
  it('should publish a deposition made directly by a specific depositor', async function(){
    var result = await proven.publishDeposition(depositor3.address, ipfsPic3, {from: depositor3});
    deposition3 = result;
    assert(depositor3 === result.logs[0].args['_deponent']);
    assert('DepositionPublished' === result.logs[0].event);
  });

  // the verifier should be able to set a bond
  it('should let a verifier set up a bond', async function(){
    // there should be no bond to start
    assert( ! (await bondHolder.isBonded( verifier1 )));
    var amount = new web3.BigNumber(web3.toWei(5, 'ether'));
    var result = await bondHolder.depositBond({ from: verifier1, to: bondHolder.address, value: amount });
    assert(verifier1.address === result.logs[0].args['address']);
    assert('BondDeposited' === result.logs[0].event);
    // there should now be a bond
    assert( await bondHolder.isBonded( verifier1 ));
    // The bond should be what we set it to
    //    { [String: '11000000000000000000'] s: 1, e: 19, c: [ 110000 ] }
    result = await bondHolder.availableBond( verifier1 );
    assert( amount[0] === result[0] );
    assert( amount.s === result.s );
    assert( amount.e === result.e );
    assert( amount.c[0] === result.c[0] );
  });

  // a verifier should be able to publish a deposition through the verifier
  it('should let a verifier publish a deposition through the verifier', async function(){

    var amount = new web3.BigNumber(web3.toWei(.01, 'ether'));
    deposition4 = await verifier.publishDeposition(ipfsPic4, {from: verifier1, value: amount});
    assert(deposition4.logs[0].event === 'DepositionPublished');
  });

  // the verifier should be able to verify the deposition
  it('should verify an existing deposition', async function(){
    assert( await bondHolder.isBonded( verifier1 ));
    var depoId = deposition4.logs[0].args.deposition;
    verification1 = await verifier.verifyDeposition( depoId, {from: verifier1});
    assert(verification1.logs[0].event === 'DepositionVerified');
    assert(verification1.logs[0].args.deposition === depoId);
  });

  // an unbonded verifier should be able to publish a deposition
  it('should let an unbonded verifier publish a verification', async function(){
    assert( !(await bondHolder.isBonded( verifier2 )));
    var amount = new web3.BigNumber(web3.toWei(.01, 'ether'));
    deposition5 = await verifier.publishDeposition(ipfsPic5, {from: verifier2, value: amount});
    assert(deposition5.logs[0].event === 'DepositionPublished');
  });

  // but the unbonded verifier should not be able to verify it
  it('should not let the unbonded verifier verify the deposition', async function(){
    assert( !(await bondHolder.isBonded( verifier2 )));
    var failure = false;
    var depoId = deposition5.logs[0].args.deposition;
    // would be better to use OpenZeppelin's expectThrow but I can't figure out how
    // https://github.com/OpenZeppelin/zeppelin-solidity/blob/master/test/helpers/expectThrow.js
    try {
      await verifier.verifyDeposition( depoId, {from: verifier2});
    } catch (error) {
      failure = true;
    }
    assert(failure);
  });

  // a bonded verifier should be able to verify the deposition
  // made by an unbonded verifier
  it('should allow verification by a different verifier', async function(){
    assert( await bondHolder.isBonded( verifier1 ));
    var depoId = deposition5.logs[0].args.deposition;
    verification3 = await verifier.verifyDeposition( depoId, {from: verifier1});
    assert(verification3.logs[0].event === 'DepositionVerified');
    assert(verification3.logs[0].args.deposition === depoId);
  });

  // the depositor should be able to look up the verification:
  // based on the IPFS hash
  it('should retrieve the deposition ID from the IPFS hash', async function(){
    var depoId = await verifier.getDepositionFromIPFSHash(ipfsPic5);
    assert( deposition5.logs[0].args.deposition === depoId );
  });

  // Should be able to get the IFPS hash from the deposition ID
  it("should return the IPFS hash from the deposition ID", async function(){
    var ipfsHash = await provenDb.getIPFSHash(deposition5.logs[0].args.deposition);
    assert( web3.toAscii(ipfsHash) === ipfsPic5 );
  });

  // Should be able to get the deponent from the deposition ID
  // This is important because it is exercising a lot of integrations.
  it("should return the deponent from the deposition ID", async function(){
    var deponent = await provenDb.getDeponent(deposition5.logs[0].args.deposition);
    assert( deponent === verifier2 );
  });

  // Should be able to see when the IPFS asset was first deposed ("proven")

  // Scenario: anonymous deposition, unchallenged verification, proven

  // Scenario: anon depo, verified by Alice, challenged by Bob, Alice wins, takes bond.

  // Scenario: anon depo, verified by Alice, challenged by Bob, Alice responds, Bob wins

  // Scenario: Alice verifies a new depo, Bob challenges, Alice responds, Bob wins

  // Scenario: Alice verifies a new depo, Bob challenges, Alice does not respond, Bob wins

});
/*
    var watcher = bondHolder.Debug();
    watcher.watch((err, e) => {
      console.log('******* debug *******');
      console.log(err);
      console.log(e);
    });
*/
