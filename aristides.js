/**
 * Created by Claudio Marrero
 */

function Aristides(){

    /**
     * Aristides scope
     * @type {Aristides}
     */
    var that = this;

    /**
     * Package
     * @type {exports}
     */
    this.config = new (require('./config/config.js'))();

    /**
     * Package express
     */
    var express = require('express');

    /**
     * Package body parser for express
     * @type {exports}
     */
    var bodyParser = require('body-parser');

    /**
     * Package for mongoose
     * @type {exports}
     */
    var mongoose = require('mongoose');

    /**
     * Connect to database
     * @method connectDatabase
     * @param cb
     */
    function connectDatabase(cb){
        mongoose.connect(that.config.servers.connectString,that.config.db,function(err) {
            if(err) throw err;
            cb();
        });
    }

    /**
     * Initialization of Express
     * @method initExpress
     */
    function initExpress(){
        var app = express();
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
        app.listen(that.config.expressPort);
        expressListeners(app);
    }

    /**
     * Initialization of Socket
     * @method initSocket
     */
    function initSocket(){
        var io = require('socket.io')();
        io.use(function(socket, next) {
            next();
        });
        io.listen(that.config.socketPort);

        io.on('connection',function(socket){
            socketListeners(io,socket);
        });
    }

    /**
     * Express listener default
     * @param express
     * @param app
     */
    function expressListeners(app){
        //Add here all default listener for socket
    }

    /**
     * Socket listener default
     * @param io
     * @param socket
     */
    function socketListeners(io,socket){
       //Add here all default listener for socket
    }

    /**
     * Initialize server for Aristides
     * @method initialize
     */
    this.initialize = function(){
        var connectCallback = function(){
            initExpress();
            initSocket();
        };
        connectDatabase(connectCallback);
    }
}

var aristides = new Aristides();
aristides.initialize();

module.exports = Aristides;
