pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./VerifierRegistry.sol";


contract VerifierDb is Ownable {

  VerifierRegistry public registry;

  mapping(bytes32 => Verification) public verifications;

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
//    uint deposedInBlock;
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

  function VerifierDb(address _registry) public {
    registry = VerifierRegistry(_registry);
  }

  function getDetails(bytes32 _deposition) public constant onlyVerifier returns(State state, uint bounty, address verifier, uint verifiedInBlock, address challenger, uint challengedInBlock, uint bondAmount, address contestor) {

    Verification memory v = verifications[_deposition];

    state = v.state;
    bounty = v.bounty;
    verifier = v.verifier;
    verifiedInBlock = v.verifiedInBlock;
    challenger = v.challenger;
    challengedInBlock = v.challengedInBlock;
    bondAmount = v.bondAmount;
    contestor = v.contestor;
  }

  function initialize(bytes32 _deposition, uint _bounty) public onlyVerifier {

    Verification memory v = verifications[_deposition];

    v.state = State.Initialized;
    v.bounty = _bounty;

    verifications[_deposition] = v;

    Stored(_deposition, _bounty);
  }

  function verify(bytes32 _deposition, address _verifier, uint _bondAmount) public onlyVerifier {

    Verification memory v = verifications[_deposition];

    v.state = State.Verified;
    v.verifier = _verifier;
    v.verifiedInBlock = block.number;
    v.bondAmount = _bondAmount;

    verifications[_deposition] = v;

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
