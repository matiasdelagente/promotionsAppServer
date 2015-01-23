/**
 * Controller for categories
 *
 * @module _Ya
 * @submodule doctor
 * @author Claudio A. Marrero
 * @class _Ya.Device
 */
'use strict';
module.exports = function(params){

    if(!params.Ya){
        return;
    }

    var Device = (function(){

        /**
         * Initialization method for Admin
         *
         * @method init
         */
        function init(){
            params.app.get('/devices',get);
            params.app.get('/devices/:skip/:limit',get);
            params.app.get('/device/:deviceId',getById);
            params.app.post('/device',add);
        }

        /**
         * Get all device from db
         *
         * @method get
         * @param req {Object} request from client
         * @param res {Object} response closure
         */
        function get(req,res){

            var response = {
                code:500,
                result:{}
            };

            var skip = (req.params.skip)?req.params.skip:0;
            var limit = (req.params.limit)?req.params.limit:20;

            var deviceCb = function(err,deviceDoc){
                if(err){
                    if(params.debug)console.log('Error mongodb get device', err);
                    response.code = 506;
                    res.json(response);
                    return;
                }
                response.code = 200;
                response.result = deviceDoc;
                res.json(response);
            };

            params.Ya.device_model.find({}).skip(skip).limit(limit).exec(deviceCb);
        }

        /**
         * Get one device from db by id
         *
         * @method getById
         * @param req {Object} request from client
         * @param res {Object} response closure
         */
        function getById(req,res){

            var response = {
                code:500,
                result:{}
            };

            var deviceId = req.params.deviceId;
            if(!deviceId){
                res.json(response);
                return;
            }

            var deviceCb = function(err,deviceDoc){
                if(err){
                    if(params.debug)console.log('Error mongodb get devices', err);
                    response.code = 506;
                    res.json(response);
                    return;
                }
                response.code = 200;
                response.result = deviceDoc;
                res.json(response);
            };

            params.Ya.device_model.findById(deviceId).exec(deviceCb);
        }

        /**
         * Create new device
         * @method add
         * @param req
         * @param res
         */
        function add(req,res){

            var response = {
                code:500,
                result:{}
            };

            var deviceObj =
            {
                "fingerprint": req.body.fingerprint,
                "device": req.body.device,
                "email": req.body.email
            };

            params.Ya.device_model.create(deviceObj,function(err,doc){
                if(err){
                    if(params.debug)console.log('Error mongodb adding device', err);
                    response.code = 506;
                    res.json(response);
                    return;
                }
                response.code = 200;
                response.result = doc;
                res.json(response);
            });
        }

        return {
            init:init
        };
    })();

    Device.init();

    return Device;

};