var IconemySale = artifacts.require("IconemySale");
var PickToken = artifacts.require("PickToken");

const moment = require('moment');

module.exports = async function(deployer, network, accounts) {

  const startTime = START_TIME;
  const endTime = END_TIME; // + 1 week
  const rate = TOKEN_PRICE; //Price: 0.001 ETH
  const wallet = OWNER_ADDRESS;
  const beneficiary = BENEFICIARY_ADDRESS;

  const softCap = 100000;
  const hardCap = 1000000;

  const saleName = 'Jack Pickerings Crowdsale';
  const capped = false;
  const capInETH = false;
  const saleID = 123;
  var sale;

  deployer.deploy(PickToken, {overwrite: false}).then(function() {
    return deployer.deploy(IconemySale, saleName, capped, capInETH, saleID, startTime, endTime, rate, wallet, beneficiary, softCap, hardCap, PickToken.address);
  });
};