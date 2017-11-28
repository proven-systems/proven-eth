'use strict';

var Proven = artifacts.require('../contracts/Proven.sol');
var ProvenDb = artifacts.require('../contracts/ProvenDb.sol');
var ProvenRegistry = artifacts.require('../contracts/ProvenRegistry.sol');

contract('ProvenRegistry', function(accounts) {
	let provenRegistry;
	let provenDb;
	let proven;

	beforeEach(async function(){
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

//	it('should set the proven and db', async function(){
//		assert.isTrue(provenRegistry.proven === proven.address);
//		assert.isTrue(provenRegistry.db === provenDb.address);
//	});

//	describe('construction', function(){
//	});
});

/*
$(function() {

    function loadEthereumAccounts(web3) {
        var $input = $('#accounts');
        var accounts = web3.eth.accounts;
        for (var i = 0; i < accounts.length; i++) {
            var $option = $('<option>');
            $option.val(accounts[i]);
            var balance = parseFloat(web3.fromWei(web3.eth.getBalance(accounts[i]), "ether"));
            $option.append(accounts[i] + " [" + balance + " ether]");
            $input.append($option);
        }
    }

    function updateProvenRegistryValues(provenRegistry) {
        $('#registry_address').text(provenRegistry.address);
        $('#registry_owner').text(provenRegistry.owner);
        $('#registry_proven').text(provenRegistry.proven);
        $('#registry_db').text(provenRegistry.db);
    }

    function updateProvenValues(proven) {
        $('#proven_address').text(proven.address);
        $('#proven_owner').text(proven.owner);
        $('#proven_registry_address').text(proven.registry);
    }

    function updateProvenDbValues(provenDb) {
        $('#proven_db_address').text(provenDb.address);
        $('#proven_db_owner').text(provenDb.owner);
        $('#proven_db_registry_address').text(provenDb.registry);
    }

    function updateVerifierRegistryValues(verifierRegistry) {
        $('#verifier_registry_address').text(verifierRegistry.address);
        $('#verifier_registry_owner').text(verifierRegistry.owner);
        $('#verifier_registry_proven').text(verifierRegistry.proven);
        $('#verifier_registry_verifier').text(verifierRegistry.verifier);
        $('#verifier_registry_db').text(verifierRegistry.db);
        $('#verifier_registry_bondholder').text(verifierRegistry.bondHolder);
        $('#verifier_registry_oracle').text(verifierRegistry.oracle);
    }

    function updateVerifierValues(verifier) {
        $('#verifier_address').text(verifier.address);
        $('#verifier_owner').text(verifier.owner);
        $('#verifier_registry').text(verifier.registry);
        $('#verifier_fee').text(verifier.fee);
        $('#verifier_timeout_block_count').text(verifier.timeoutBlockCount);
        $('#verifier_required_bond_amount').text(verifier.requiredBondAmount);
    }

    function updateVerifierDbValues(verifierDb) {
        $('#verifier_db_address').text(verifierDb.address);
        $('#verifier_db_owner').text(verifierDb.owner);
        $('#verifier_db_registry_address').text(verifierDb.registry);
    }

    function updateBondHolderRegistryValues(bondHolderRegistry) {
        $('#bondholder_registry_address').text(bondHolderRegistry.address);
        $('#bondholder_registry_owner').text(bondHolderRegistry.owner);
        $('#bondholder_registry_bondholder').text(bondHolderRegistry.bondHolder);
        $('#bondholder_registry_db').text(bondHolderRegistry.db);
    }

    function updateBondHolderValues(bondHolder) {
        $('#bondholder_address').text(bondHolder.address);
        $('#bondholder_owner').text(bondHolder.owner);
        $('#bondholder_registry').text(bondHolder.registry);
        $('#bondholder_beneficiary').text(bondHolder.beneficiary);
        $('#bondholder_bond_count').text(bondHolder.bondCount);
    }

    if(typeof web3 !== 'undefined' && typeof Web3 !== 'undefined') {
        // If there's a web3 library loaded, then make your own web3
        web3 = new Web3(web3.currentProvider);
    } else if (typeof Web3 !== 'undefined') {
        // If there isn't then set a provider
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    } else if(typeof web3 == 'undefined') {
        // Alert the user he is not in a web3 compatible browser
        alert('No web3');
        return;
    }

    var provenRegistry = new ProvenRegistry(provenRegistryAddress, provenRegistryAbi);
    var proven = new Proven(provenAddress, provenAbi);
    var provenDb = new ProvenDb(provenDbAddress, provenDbAbi);
    var verifierRegistry = new VerifierRegistry(verifierRegistryAddress, verifierRegistryAbi);
    var verifier = new Verifier(verifierAddress, verifierAbi);
    var verifierDb = new VerifierDb(verifierDbAddress, verifierDbAbi);
    var bondHolderRegistry = new BondHolderRegistry(bondHolderRegistryAddress, bondHolderRegistryAbi);
    var bondHolder = new BondHolder(bondHolderAddress, bondHolderAbi);

    loadEthereumAccounts(web3);
    updateProvenRegistryValues(provenRegistry);
    updateProvenValues(proven);
    updateProvenDbValues(provenDb);
    updateVerifierRegistryValues(verifierRegistry);
    updateVerifierValues(verifier);
    updateVerifierDbValues(verifierDb);
    updateBondHolderRegistryValues(bondHolderRegistry);
    updateBondHolderValues(bondHolder);

    function setValueFromField(source, callback) {
        return function() {
            var address = $(source).val();
            var fromAddress = $('#accounts').val();
            callback(address, {from: fromAddress});
            $(source).val('');
        }
    }

    function optionsFromAccounts() {
        return {from: $('#accounts').val()};
    }

    /// ProvenRegistry
    $('#registry_owner_button').click(function() {
        provenRegistry.transferOwnership($('#registry_owner_field').val(), optionsFromAccounts(), function() {
            updateProvenRegistryValues(provenRegistry);
        });
    });
    $('#registry_proven_button').click(function() {
        provenRegistry.setProven($('#registry_proven_field').val(), optionsFromAccounts(), function() {
            updateProvenRegistryValues(provenRegistry);
        });
    });
    $('#registry_db_button').click(function() {
        provenRegistry.setDb($('#registry_db_field').val(), optionsFromAccounts(), function() {
            updateProvenRegistryValues(provenRegistry);
        });
    });

    /// Proven
    $('#proven_owner_button').click(function() {
        proven.transferOwnership($('#proven_owner_field').val(), optionsFromAccounts(), function() {
            updateProvenValues(proven);
        });
    });
    $('#publish_deposition_button').click(function() {
        proven.publishDeposition($('#ipfs_hash').val(), optionsFromAccounts(), function() {});
    });
    proven.watchDepositionPublished(function(args) {
        logEvent('Deposition Published', function(div) {
            div.append($('<p>').text('Receipt: ' + args._deposition));
            div.append($('<p>').text('Deponent: ' + args._deponent));
            div.append($('<p>').text('IPFS Hash: ' + args._ipfs_hash));
        });
    });
    $('#lookup_deposition_button').click(function() {
        var deposition = provenDb.depositions($('#deposition_receipt').val());
        $('#lookup_ipfs_hash').text(deposition.ipfsHash);
        $('#lookup_deponent').text(deposition.deponent);
    });

    /// ProvenDb
    $('#proven_db_owner_button').click(function() {
        provenDb.transferOwnership($('#proven_db_owner_field').val(), optionsFromAccounts(), function() {
            updateProvenDbValues(provenDb);
        });
    });
    provenDb.watchDepositionStored(function(args) {
        logEvent('Desposition Stored', function(div) {
            div.append($('<p>').text('Receipt: ' + args._deposition));
            div.append($('<p>').text('Deponent: ' + args._deponent));
            div.append($('<p>').text('IPFS Hash: ' + args._ipfs_hash));
        });
    });

    /// VerifierRegistry
    $('#verifier_registry_owner_button').click(function() {
        verifierRegistry.transferOwnership($('#verifier_registry_owner_field').val(), optionsFromAccounts(), function() {
            updateVerifierRegistryValues(verifierRegistry);
        });
    });
    $('#verifier_registry_proven_button').click(function() {
        verifierRegistry.setProven($('#verifier_registry_proven_field').val(), optionsFromAccounts(), function() {
            updateVerifierRegistryValues(verifierRegistry);
        });
    });
    $('#verifier_registry_verifier_button').click(function() {
        verifierRegistry.setVerifier($('#verifier_registry_verifier_field').val(), optionsFromAccounts(), function() {
            updateVerifierRegistryValues(verifierRegistry);
        });
    });
    $('#verifier_registry_db_button').click(function() {
        verifierRegistry.setDb($('#verifier_registry_db_field').val(), optionsFromAccounts(), function() {
            updateVerifierRegistryValues(verifierRegistry);
        });
    });
    $('#verifier_registry_bondholder_button').click(function() {
        verifierRegistry.setBondHolder($('#verifier_registry_bondholder_field').val(), optionsFromAccounts(), function() {
            updateVerifierRegistryValues(verifierRegistry);
        });
    });
    $('#verifier_registry_oracle_button').click(function() {
        verifierRegistry.setOracle($('#verifier_registry_oracle_field').val(), optionsFromAccounts(), function() {
            updateVerifierRegistryValues(verifierRegistry);
        });
    });

    /// Verifier
    $('#verifier_owner_button').click(function() {
        verifier.transferOwnership($('#verifier_owner_field').val(), optionsFromAccounts(), function() {
            updateVerifierValues(verifier);
        });
    });
    $('#verifier_registry_button').click(function() {
        verifier.setRegistry($('#verifier_registry_field').val(), optionsFromAccounts(), function() {
            updateVerifierValues(verifier);
        });
    });
    $('#verifier_fee_button').click(function() {
        verifier.setFee($('#verifier_fee_field').val(), optionsFromAccounts(), function() {
            updateVerifierValues(verifier);
        });
    });
    $('#verifier_timeout_block_count_button').click(function() {
        verifier.setTimeoutBlockCount($('#verifier_timeout_block_count_field').val(), optionsFromAccounts(), function() {
            updateVerifierValues(verifier);
        });
    });
    $('#verifier_required_bond_amount_button').click(function() {
        verifier.setRequiredBondAmount($('#verifier_required_bond_amount_field').val(), optionsFromAccounts(), function() {
            updateVerifierValues(verifier);
        });
    });
    $('#verifier_publish_button').click(function() {
        var options = optionsFromAccounts();
        options.value = $('#verifier_fee_field').val();
        verifier.publishDeposition($('#verifier_ipfs_hash').val(), options, function() {
            updateVerifierValues(verifier);
        });
    });
    $('#verifier_verify_button').click(function() {
        verifier.verifyDeposition($('#verifier_verify_id').val(), optionsFromAccounts(), function() {
            updateVerifierValues(verifier);
        });
    });
    verifier.watchDepositionPublished(function(args) {
        logEvent('Verifier Deposition Published', function(div) {
            div.append($('<p>').text('Deposition: ' + args.deposition));
            div.append($('<p>').text('Deponent: ' + args.deponent));
            div.append($('<p>').text('IPFS Hash: ' + args.ipfs_hash));
            div.append($('<p>').text('Bounty: ' + args.bounty));
        });
    });
    verifier.watchDepositionVerified(function(args) {
        logEvent('Verifier Deposition Verified', function(div) {
            div.append($('<p>').text('Deposition: ' + args.deposition));
            div.append($('<p>').text('Verifier: ' + args.verifier));
        });
    });

    /// VerifierDb
    $('#verifier_lookup_deposition_button').click(function() {
        var deposition = verifierDb.verifications($('#verifier_deposition_receipt').val());
        $('#verifier_lookup_state').text(deposition.state);
        $('#verifier_lookup_bounty').text(deposition.bounty);
        $('#verifier_lookup_verifier').text(deposition.verifier);
        $('#verifier_lookup_verified_in_block').text(deposition.verifiedInBlock);
        $('#verifier_lookup_challenger').text(deposition.challenger);
        $('#verifier_lookup_challenged_in_block').text(deposition.challengedInBlock);
        $('#verifier_lookup_bond_amount').text(deposition.bondAmount);
        $('#verifier_lookup_contestor').text(deposition.contestor);
    });

    /// BondHolderRegistry
    $('#bondholder_registry_owner_button').click(function() {
        bondHolderRegistry.transferOwnership($('#bondholder_registry_owner_field').val(), optionsFromAccounts(), function() {
            updateBondHolderRegistryValues(bondHolderRegistry);
        });
    });
    $('#bondholder_registry_bondholder_button').click(function() {
        bondHolderRegistry.setBondHolder($('#bondholder_registry_bondholder_field').val(), optionsFromAccounts(), function() {
            updateBondHolderRegistryValues(bondHolderRegistry);
        });
    });
    $('#bondholder_registry_db_button').click(function() {
        bondHolderRegistry.setDb($('#bondholder_registry_db_field').val(), optionsFromAccounts(), function() {
            updateBondHolderRegistryValues(bondHolderRegistry);
        });
    });

    /// BondHolder
    $('#bondholder_deposit_button').click(function() {
        bondHolder.depositBond($('#bondholder_deposit_amount_field').val(), optionsFromAccounts(), function() {
            updateBondHolderValues(bondHolder);
        });
    });
    $('#bondholder_withdrawal_button').click(function() {
        var withdrawal = bondHolder.withdrawals($('#bondholder_withdrawal_field').val());
        $('#bondholder_withdrawal_available').text(withdrawal.balance);
    });
    $('#bondholder_release_button').click(function() {
        bondHolder.releaseBond($('#bondholder_release_amount_field').val(), optionsFromAccounts(), function() {
            updateBondHolderValues(bondHolder);
        });
    });
    $('#bondholder_withdraw_button').click(function() {
        bondHolder.withdraw($('#bondholder_withdraw_amount_field').val(), optionsFromAccounts(), function() {
            updateBondHolderValues(bondHolder);
        });
    });
    $('#bondholder_bonded_button').click(function() {
        var bonded = bondHolder.bonds($('#bondholder_bonded_field').val());
        $('#bondholder_bonded_balance').text(bonded.balance);
        $('#bondholder_bonded_lockedAmount').text(bonded.lockedAmount);
    });
    $('#bondholder_lock_button').click(function() {
        bondHolder.lockBond($('#bondholder_lock_bonded_field').val(), $('#bondholder_lock_amount_field').val(), optionsFromAccounts(), function() {
            updateBondHolderValues(bondHolder);
        });
    });
    $('#bondholder_unlock_button').click(function() {
        bondHolder.unlockBond($('#bondholder_lock_bonded_field').val(), $('#bondholder_lock_amount_field').val(), optionsFromAccounts(), function() {
            updateBondHolderValues(bondHolder);
        });
    });
    function logEvent(title, callback) {
        $div = $('<div>');
        $div.append($('<h3>').text(title));
        $div.append($('<p>').text(new Date().toString()));
        callback($div);
        $('#proven_log').prepend($div);
    }
    function buildBondEvent(div, args) {
        div.append($('<p>').text('Bonded: ' + args.bonded));
        div.append($('<p>').text('Amount: ' + args.amount));
    }
    function logBondEvent(title) {
        return function(args) {
            logEvent(title, function(div) {
                buildBondEvent(div, args);
            });
        }
    }

    function logBondDistributed() {
        return function(args) {
            logEvent('Bond Distributed', function(div) {
                buildBondEvent(div, args);
                div.append($('<p>').text('Recipient 1: ' + args.recipient1));
                div.append($('<p>').text('Recipient 2: ' + args.recipient2));
            });
        }
    }

    bondHolder.watchBondDeposited(logBondEvent('Bond Deposited'));
    bondHolder.watchBondReleased(logBondEvent('Bond Released'));
    bondHolder.watchBondWithdrawn(logBondEvent('Bond Withdrawn'));
    bondHolder.watchBondLocked(logBondEvent('Bond Locked'));
    bondHolder.watchBondUnlocked(logBondEvent('Bond Unlocked'));
    bondHolder.watchBondDistributed(logBondDistributed());
})
    */
