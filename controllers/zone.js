/**
 * Controller for categories
 *
 * @module _Ya
 * @submodule doctor
 * @author Claudio A. Marrero
 * @class _Ya.Zone
 */
'use strict';
module.exports = function(params){

    if(!params.Ya){
        return;
    }

    var Zone = (function(){

        /**
         * Initialization method for Admin
         *
         * @method init
         */
        function init(){
            params.app.get('/zone',get);
            params.app.get('/zone/:zoneId',getById);
            params.app.post('/zone',add);
        }


        /**
         * Get all zone from db
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

            var query = {};

            var zoneCb = function(err,zoneDoc){
                if(err){
                    if(params.debug)console.log('Error mongodb Zones', err);
                    response.code = 506;
                    res.json(response);
                    return;
                }
                response.code = 200;
                response.result = zoneDoc;
                res.json(response);
            };

            params.Ya.zone_model.find(query).exec(zoneCb);
        }

        /**
         * Get one zone from db by id
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
            console.log(req.params)
            var zoneId = req.params.zoneId;
            if(!zoneId){
                res.json(response);
                return;
            }

            var zoneCb = function(err,zoneDoc){
                if(err){
                    if(params.debug)console.log('Error mongodb geting categories', err);
                    response.code = 506;
                    res.json(response);
                    return;
                }
                response.code = 200;
                response.result = zoneDoc;
                res.json(response);
            };

            params.Ya.zone_model.findById(zoneId).exec(zoneCb);
        }

        /**
         * Create new zone
         * @method add
         * @param req
         * @param res
         */
        function add(req,res){

            var response = {
                code:500,
                result:{}
            };

            var zone ={
                "name": req.body.name,
                "description": req.body.description
            };

            params.Ya.zone_model.create(zone,function(err,doc){
                if(err){
                    if(params.debug)console.log('Error mongodb adding zone', err);
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

    Zone.init();

    return Zone;

};
