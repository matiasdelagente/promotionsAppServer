/**
 * Controller for categories
 *
 * @module _Ya
 * @submodule doctor
 * @author Claudio A. Marrero
 * @class _Ya.Business
 */
'use strict';
module.exports = function(params){

    if(!params.Ya){
        return;
    }

    var Business = (function(){

        /**
         * Initialization method for Admin
         *
         * @method init
         */
        function init(){
            //TODO: Add endpoints of express
        }


        /**
         * Get all business from db
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

            var businessCb = function(err,businessDoc){
                if(err){
                    if(params.debug)console.log('Error mongodb geting categories', err);
                    response.code = 506;
                    res.json(response);
                    return;
                }

                response.code = 200;
                response.result = businessDoc;
                res.json(response);
            };

            params.Ya.business_model.find(query).skip(0).limit(20).exec(businessCb);
        }

        /**
         * Get one single doctor
         *
         * @method doctor
         * @param req {Object} request from client
         * @param res {Object} response closure
         */
        function business(req,res){

            var response = {
                code:500,
                result:{
                    err:"You miss some data"
                }
            };

            //TODO: Validate request
            var businessId = req.params.id;

            if(!businessId){
                res.json(response);
                return;
            }

            var businessCb = function(err,businessDoc){
                if(err){
                    if(params.debug)console.log('Error mongodb geting categories', err);
                    response.code = 506;
                    response.result.err = err;
                    res.json(response);
                    return;
                }

                if(!businessDoc){
                    if(params.debug)console.log('Dont fine any categories with this ID:', businessDoc);
                    response.code = 200;
                    response.result = businessDoc;
                    res.json(response);
                    return;
                }

                response.code = 200;
                response.result = businessDoc;
                res.json(response);
            };

            params.Ya.business_model.findById(businessId).exec(businessCb);
        }

        return {
            init:init
        };
    })();

    Business.init();

    return Business;

};