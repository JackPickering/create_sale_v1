var PickToken = artifacts.require("PickToken");

module.exports = async function(deployer, network, accounts) {
  var name = TOKEN_NAME;
  var symbol = TOKEN_SYMBOL;
  var decimals = TOKEN_DECIMAL;	

  deployer.deploy(PickToken, name, symbol, decimals, {overwrite: false});
};