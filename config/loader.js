/**
* A list of modules that you want to load, the order is very important, the controllers always in the end of array
*
* @module _Ya
* @submodule loader
* @author Claudio A. Marrero
* @class _Ya.loader
*/
'use strict';
module.exports = function(params){
	
	return [
		'./config/',
		'./models/',
		'./controllers/'
	];

};