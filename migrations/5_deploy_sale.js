var Crowdsale = artifacts.require("Crowdsale");
var PickToken = artifacts.require("PickToken");

const moment = require('moment');

module.exports = async function(deployer, network, accounts) {

  const startTime = START_TIME;
  const endTime = END_TIME; // + 1 week
  const rate = TOKEN_PRICE; //Price: 0.001 ETH
  const wallet = OWNER_ADDRESS;
  const beneficiary = BENEFICIARY_ADDRESS;
  var sale;

  deployer.deploy(PickToken, {overwrite: false}).then(function() {
    return deployer.deploy(Crowdsale, startTime, endTime, rate, wallet, beneficiary, PickToken.address);
  });
};