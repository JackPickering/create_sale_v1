pragma solidity 0.4.21;

import './SafeMath.sol';
import './Crowdsale.sol';

/**
 * @title CappedCrowdsale
 * @dev Extension of Crowdsale with a max amount of funds raised
 */
contract CappedCrowdsale is Crowdsale {
  using SafeMath for uint256;

  uint256 public softCap;
  uint256 public hardCap;
  uint256 public withdrawn;
  bool public canWithdraw;

  // Changed implentation to include soft/hard caps
  function CappedCrowdsale(uint256 _startTime, uint256 _endTime, uint256 _rate, address _wallet, address _beneficiary, uint256 _softCap, uint256 _hardCap, PickToken _token) 
    Crowdsale(_startTime, _endTime, _rate, _wallet, _beneficiary, _token)
      public {

    require(_hardCap > 0 && _softCap > 0 && _softCap < _hardCap);

    softCap = _softCap;
    hardCap = _hardCap;
    withdrawn = 0;
    canWithdraw = false;
  }

  // overriding Crowdsale#validPurchase to add extra cap logic
  // @return true if investors can buy at the moment
  function validPurchase(uint256 _tokens) internal view returns (bool) {
    bool withinCap = tokensSent.add(_tokens) <= hardCap;
    return super.validPurchase(_tokens) && withinCap;
  }
  
  // overriding Crowdsale#hasEnded to add cap logic
  // @return true if crowdsale event has ended
  function hasEnded() public view returns (bool) {
    bool capReached = tokensSent >= hardCap;
    return super.hasEnded() || capReached;
  }
  
  // overriding Crowdsale#successfulWithdraw to add cap logic
  // only allow beneficiary to withdraw if softcap has been reached
  // Uses withdrawn incase a parent contract requires withdrawing softcap early
  function successfulWithdraw() external onlyOwner stopInEmergency {
    require(hasEnded());
    require(tokensSent > softCap);

    beneficiary.transfer(weiRaised);
    BeneficiaryWithdrawal(msg.sender, weiRaised, now);
  }
}