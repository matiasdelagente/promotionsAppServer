/**
* Main Class Ya
* @module _Ya
* @author Claudio A. Marrero
* @class _Ya
* @main Ya
*/

var Debug = require('./config/debug.js')(null);

'use strict';
var Ya = (function(){

  	/**
	* Driver for mongodb
	* @property _mongoose
	* @type {Object}
	* @private
	*/
	var _mongoose = require('mongoose');

	/**
	* Validate module for schems of mongoose
	* @property _validate
	* @type {Object}
	* @private
	*/
	var _validate = require('mongoose-validate');

	/**
	* File Helper module
	* @property _fs
	* @type {Object}
	* @private
	*/
	var _fs = require('fs');

	/**
	* Mailer module, usefull for send emails only
	* @property _eMails
	* @type {Object}
	* @private
	*/
	var _eMails = require('mailer');

	/**
	* A list of modules that need to load before everything
	* @property _InitLoad
	* @type {Object}
	* @private
	*/
	var _InitLoad = ['./config/'];

	/**
	* A main object that have all modules, controlers, models, etc.
	* @property _Ya
	* @type {Object}
	* @private
	*/
	var _Ya = null;

	/**
	* Module to mix templagte engine with express
	*
	* @property _cons
	* @type {Object}
	* @private
	*/
	var _cons = require('consolidate');

	/**
	* Express module to public some endpoints from http
	*
	* @property _express
	* @type {Object}
	* @private
	*/
	var _express = require('express');

	/**
	* Express module to public some endpoints from http
	*
	* @property _bodyParser
	* @type {Object}
	* @private
	*/
	var _bodyParser = require('body-parser');

	/**
	* Instance of express
	*
	* @property _app
	* @type {Object}
	* @private
	*/
	var _app = _express();

	_app.engine('html', _cons.hogan);
	_app.set('view engine', 'html');
	_app.set('views', __dirname + '/tpl');
	_app.use(_bodyParser.urlencoded({ extended: false }));
	_app.use(_bodyParser.json());
    _app.use(function(req, res, next) {
        var oneof = false;
        if(req.headers.origin) {
            res.header('Access-Control-Allow-Origin', req.headers.origin);
            oneof = true;
        }
        if(req.headers['access-control-request-method']) {
            res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
            oneof = true;
        }
        if(req.headers['access-control-request-headers']) {
            res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
            oneof = true;
        }
        if(oneof) {
            res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
        }
        res.header('Access-Control-Allow-Credentials', true);
        // intercept OPTIONS method
        if (oneof && req.method == 'OPTIONS') {
            res.send(200);
        }
        else {
            next();
        }
    });
	_app.listen(80);

	/**
	* This method make the initialization of all coinding server, 
	* Makes a load of all modules and shot the connection to mongodb
	*
	* @method init
	* @example Ya.init();
	*/
	function init(){

		var _params = {
			mongoose:_mongoose,
			validate:_validate,
			fs:_fs,
			emails:_eMails,
			load:_InitLoad,
			app:_app,
			express:_express,
			debug:Debug.debug
		};

		var _loader = require('./load.js')(_params);
		_Ya = _loader.init();
		_Ya.deph = _params;

		connect();
	}

	/**
	* Make a conexion to the database, 
	*
	* @method connect
	* @example connect();
	*/
	function connect(){
		if(!_Ya){
			console.log('_Ya is null');
			return;
		}
		_mongoose.connect(_Ya.database.servers.connectString,_Ya.database.db,function(err) {
			if(err) throw err;
		});
	}

	return {
		init:init
	};
	
})();

Ya.init();