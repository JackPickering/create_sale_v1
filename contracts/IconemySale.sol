pragma solidity 0.4.21;

/*
 * This token is part of Pickeringware ltds smart contracts
 * It is used to specify certain details about the token upon release
 */

import './CappedCrowdsale.sol';

contract IconemySale is CappedCrowdsale {
  string public name;
  bool public capped;
  bool public capInETH;
  uint256 public saleId;

  // Changed implentation to include soft/hard caps
  function IconemySale(string _name, bool _capped, bool _capInETH, uint256 _saleId, uint256 _startTime, uint256 _endTime, uint256 _rate, address _wallet, address _beneficiary, uint256 _softcap, uint256 _hardcap, PickToken _token) 
    CappedCrowdsale(_startTime, _endTime, _rate, _wallet, _beneficiary, _softcap, _hardcap, _token)
      public {

    name = _name;
    capped = _capped;
    capInETH = _capInETH;
    saleId = _saleId;
  }
}