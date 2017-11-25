pragma solidity ^0.4.18;

contract Server{ 
    bool public alive = true;
    function homicide(){
        alive = false;
        suicide(msg.sender);
    }
}

