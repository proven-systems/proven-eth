// Part of the Proven suite of software
// Copyright © 2017 "The Partnership" (Ethereum 0x12B0621D90c69867957A836d677C64c46EC4291D)

pragma solidity ^0.4.19;

import "./Ownable.sol";
import "./VerifierRegistry.sol";


contract VerifierDB is Ownable {

  VerifierRegistry public registry;

  mapping(bytes32 => Verification) public verifications;
  // This cannot be public because it produces "Internal compiler error:
  // Accessors for mapping with dynamically-sized keys not yet implemented."
  mapping(bytes => bytes32) internal depositionsFromIPFSHash;

  enum State {
    Unset,
    Initialized,
    Verified,
    Challenged,
    Contested,
    Proven,
    Disproven
  }

  struct Verification {
    State state;
    uint bounty;
    uint deposedInBlock;
    address verifier;
    uint verifiedInBlock;
    address challenger;
    uint challengedInBlock;
    uint bondAmount;
    address contestor;
  }

  event Stored(bytes32 deposition, uint bounty);
  event Verified(bytes32 deposition, address verifier);
  event Proven(bytes32 deposition);
  event Challenged(bytes32 deposition, address challenger);
  event Disproven(bytes32 deposition);
  event Contested(bytes32 deposition, address contestor);

  modifier onlyVerifier() {
    require (msg.sender == registry.verifier());
    _;
  }

  // Constructor
  function VerifierDB(address _registry) public {
    registry = VerifierRegistry(_registry);
  }

  // Using the IPFS hash, find out the deposition ID. This is important for a
  // contract or end user who wants to find out if an IPFS image is verified. 
  function getDepositionFromIPFSHash(bytes _ipfsHash) public view returns(bytes32) {
    return(depositionsFromIPFSHash[_ipfsHash]);
  }

  function getDetails(bytes32 _deposition) public view returns(State state, uint bounty, uint deposedInBlock, address verifier, uint verifiedInBlock, address challenger, uint challengedInBlock, uint bondAmount, address contestor) {

    Verification memory v = verifications[_deposition];

    state = v.state;
    bounty = v.bounty;
    deposedInBlock = v.deposedInBlock;
    verifier = v.verifier;
    verifiedInBlock = v.verifiedInBlock;
    challenger = v.challenger;
    challengedInBlock = v.challengedInBlock;
    bondAmount = v.bondAmount;
    contestor = v.contestor;
  }

  // Called by the verifier when it is directly creating a new deposition,
  // instead of mining one that's already in the chain's logs
  // (like those created from Proven.publishDeposition).
  // Thus, the IPFS hash must be known at this point.
  function initialize(bytes32 _deposition, bytes _ipfsHash, uint _bounty, uint _deposedInBlock) public onlyVerifier {

    require(_ipfsHash.length != 0);
    Verification memory v = verifications[_deposition];

    v.state = State.Initialized;
    v.bounty = _bounty;
    v.deposedInBlock = _deposedInBlock;

    verifications[_deposition] = v;
    depositionsFromIPFSHash[_ipfsHash] = _deposition;

    Stored(_deposition, _bounty);
  }

  // This is called to verify a published deposition that already exists either
  // from Verifier.publishDeposition or from Proven.publishDeposition.
  // If the IPFS hash is not provided the verification won't be retrievable
  // by a smart contract or by a user who wants to check its verification without
  // downloading the full blockchain and scanning the logs, etc.
  function verify(bytes32 _deposition, bytes _ipfsHash, address _verifier, uint _bondAmount) public onlyVerifier {

    Verification memory v = verifications[_deposition];

    v.state = State.Verified;
    v.verifier = _verifier;
    v.verifiedInBlock = block.number;
    v.bondAmount = _bondAmount;

    verifications[_deposition] = v;

    if (_ipfsHash.length != 0) {
      depositionsFromIPFSHash[_ipfsHash] = _deposition;
    }

    Verified(_deposition, _verifier);
  }

  function prove(bytes32 _deposition) public onlyVerifier {

    Verification memory v = verifications[_deposition];

    v.state = State.Proven;

    verifications[_deposition] = v;

    Proven(_deposition);
  }

  function challenge(bytes32 _deposition, address _challenger, uint _bondAmount) public onlyVerifier {

    Verification memory v = verifications[_deposition];

    v.state = State.Challenged;
    v.challenger = _challenger;
    v.challengedInBlock = block.number;
    v.bondAmount = _bondAmount;

    verifications[_deposition] = v;

    Challenged(_deposition, _challenger);
  }

  function disprove(bytes32 _deposition) public onlyVerifier {

    Verification memory v = verifications[_deposition];

    v.state = State.Disproven;

    verifications[_deposition] = v;

    Disproven(_deposition);
  }

  function contest(bytes32 _deposition, address _contestor) public onlyVerifier {

    Verification memory v = verifications[_deposition];

    v.state = State.Contested;
    v.contestor = _contestor;

    verifications[_deposition] = v;

    Contested(_deposition, _contestor);
  }
}
