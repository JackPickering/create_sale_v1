pragma solidity 0.4.21;

import './Ownable.sol';

contract Stoppable is Ownable {
  bool public halted;

  event SaleStopped(address owner, uint256 datetime);

  modifier stopInEmergency {
    require(!halted);
    _;
  }

  function hasHalted() internal view returns (bool isHalted) {
  	return halted;
  }

   // called by the owner on emergency, triggers stopped state
  function stopICO() external onlyOwner {
    halted = true;
    SaleStopped(msg.sender, now);
  }
}