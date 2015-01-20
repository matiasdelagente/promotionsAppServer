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
            params.app('/business/:zone/:skip/:limit',get);
            params.app('/business/:zone/:skip/:limit/:category',get);
            params.app('/business/:zone/:skip/:limit/:category/:name',get);
            params.app('/business/:businessId',getById);
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

            if(req.params.zone){
                query.zone = req.params.zone;
            }

            if(req.params.category){
                query.category = req.params.category;
            }

            if(req.params.name){
                query.name = {'$regex': req.params.name};
            }

            var skip = (req.params.skip)?req.params.skip:0;
            var limit = (req.params.limit)?req.params.limit:20;

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

            params.Ya.business_model.find(query).populate('category zone').skip(skip).limit(limit).exec(businessCb);
        }

        /**
         * Get one business from db by id
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

            var businessId = req.params.businessId;
            if(!businessId){
                res.json(response);
                return;
            }

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

            params.Ya.business_model.findById(businessId).populate('category zone').exec(businessCb);
        }

        return {
            init:init
        };
    })();

    Business.init();

    return Business;

};