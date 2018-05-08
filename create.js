const cmd=require('node-cmd');
const replace = require('replace-in-file');

var options = {};

// Get token data
var token_name = process.argv[2];
var token_symbol = process.argv[3];
var token_decimal = process.argv[4];

// Get basic sale data
var start_time = process.argv[5];
var end_time = process.argv[6];
var token_price = process.argv[7];
var owner = process.argv[8];
var beneficiary = process.argv[9];

// Specify a build name for saving/getting files
var build_name = process.argv[10];

createNewSale();

function createNewSale(){
	try {
	 
	  var fileChanged = setTokenFile(token_name, token_symbol, token_decimal);
	  console.log('Modified files:', fileChanged.join(', '));
	  fileChanged = setSaleFile(start_time, end_time, token_price, owner, beneficiary);
	  console.log('Modified files:', fileChanged.join(', '));

		cmd.get(
			`
	            darq-truffle migrate --network rinkeby --reset
	            mv build ` + build_name + `
	            mv ` + build_name + ` ../build_folders
	        `,
		    function(err, data, stderr){
		        if (!err) {
		        	if(data.includes("Network up to date.")){
		        		console.log('The contracts have already been released onto the network!')
		        	} else {
		                console.log(data)
		        	}
		        } else {
		            console.log('error', err)
		        }
		        
	  			var fileChanged = resetTokenFile(token_name, token_symbol, token_decimal);
	  		    console.log('Restored files:', fileChanged.join(', '));
	  		    fileChanged = resetSaleFile(start_time, end_time, token_price, owner, beneficiary);
	  			console.log('Restored files:', fileChanged.join(', '));
		    }
		);
	}
	catch (error) {
	  console.error('Error occurred:', error);
	}
}

/*
 * Set the token file with the appropriate variables in order to run the migration file
*/
function setSaleFile(_startTime, _endTime, _price, _owner, _beneficiary){

	var migration = changeFile('migrations/5_deploy_sale.js', /START_TIME/g, _startTime);
	var migration = changeFile('migrations/5_deploy_sale.js', /END_TIME/g, _endTime);
	var migration = changeFile('migrations/5_deploy_sale.js', /TOKEN_PRICE/g, _price);
	var migration = changeFile('migrations/5_deploy_sale.js', /OWNER_ADDRESS/g, '"' + _owner + '"');
	var migration = changeFile('migrations/5_deploy_sale.js', /BENEFICIARY_ADDRESS/g, '"' + _beneficiary + '"');

	return migration;
}

/*
 * Reset the token file with the appropriate names in order to change them back again for a new sale
*/
function resetSaleFile(_startTime, _endTime, _price, _owner, _beneficiary){ 

	var migration = changeFile('migrations/5_deploy_sale.js', new RegExp(_startTime), 'START_TIME');
	migration = changeFile('migrations/5_deploy_sale.js', new RegExp(_endTime), 'END_TIME' );
	migration = changeFile('migrations/5_deploy_sale.js', new RegExp(_price), 'TOKEN_PRICE');
	migration = changeFile('migrations/5_deploy_sale.js', new RegExp('"' + _owner + '"'), 'OWNER_ADDRESS');
	migration = changeFile('migrations/5_deploy_sale.js', new RegExp('"' + _beneficiary + '"'), 'BENEFICIARY_ADDRESS');

	return migration;
}

/*
 * Set the token file with the appropriate variables in order to run the migration file
*/
function setTokenFile(_name, _symbol, _decimal){

	var migration = changeFile('migrations/4_deploy_token.js', /TOKEN_NAME/g, '"' + _name + '"');
	migration = changeFile('migrations/4_deploy_token.js', /TOKEN_SYMBOL/g, '"' + _symbol + '"');
	migration = changeFile('migrations/4_deploy_token.js', /TOKEN_DECIMAL/g, _decimal);

	return migration;
}

/*
 * Reset the token file with the appropriate names in order to change them back again for a new sale
*/
function resetTokenFile(_name, _symbol, _decimal){ 

	var migration = changeFile('migrations/4_deploy_token.js', new RegExp('"' + _name  + '"'), 'TOKEN_NAME');
	migration = changeFile('migrations/4_deploy_token.js', new RegExp('"' + _symbol + '"'), 'TOKEN_SYMBOL' );
	migration = changeFile('migrations/4_deploy_token.js', new RegExp(_decimal), 'TOKEN_DECIMAL');

	return migration;
}

function changeFile(_file, _change, _replacement){
	var replacement = createOptions(_file, _change , _replacement );
	var migration = replace.sync(replacement);

	return migration;
}

function createOptions(_file, _from, _to){
	options = {
		//Single file
		files: _file,

		//Replacement to make (string or regex) 
		from: _from,
		to: _to,
	};

	return options;
}