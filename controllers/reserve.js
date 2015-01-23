/**
 * Controller for categories
 *
 * @module _Ya
 * @submodule doctor
 * @author Claudio A. Marrero
 * @class _Ya.Reserve
 */
'use strict';
module.exports = function(params){

    if(!params.Ya){
        return;
    }

    var Reserve = (function(){

        /**
         * Initialization method for Admin
         *
         * @method init
         */
        function init(){
            params.app.get('/reserves/:device',get);
            params.app.get('/reserves/:device/:skip/:limit',get);
            params.app.get('/reserve/:reserveId',getById);
            params.app.post('/reserve',add);
            params.app.post('/reserve/cancel',cancel);
        }

        /**
         * Get all reserve from db
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

            if(req.params.device){
                query.device = req.params.device;
            }

            var skip = (req.params.skip)?req.params.skip:0;
            var limit = (req.params.limit)?req.params.limit:20;

            var reserveCb = function(err,reserveDoc){
                if(err){
                    if(params.debug)console.log('Error mongodb get reserve', err);
                    response.code = 506;
                    res.json(response);
                    return;
                }
                response.code = 200;
                response.result = reserveDoc;
                res.json(response);
            };

            params.Ya.reserve_model.find(query).populate('device promotion').skip(skip).limit(limit).exec(reserveCb);
        }

        /**
         * Get one reserve from db by id
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

            var reserveId = req.params.reserveId;
            if(!reserveId){
                res.json(response);
                return;
            }

            var reserveCb = function(err,reserveDoc){
                if(err){
                    if(params.debug)console.log('Error mongodb get reserves', err);
                    response.code = 506;
                    res.json(response);
                    return;
                }
                response.code = 200;
                response.result = reserveDoc;
                res.json(response);
            };

            params.Ya.reserve_model.findById(reserveId).populate('device promotion').exec(reserveCb);
        }

        /**
         * Create new reserve
         * @method add
         * @param req
         * @param res
         */
        function add(req,res){

            var response = {
                code:500,
                result:{}
            };

            var reserveObj =
            {
                "device": req.body.device,
                "promotion": req.body.promotion,
                "amount": req.body.amount
            };

            var promotion = function(){
                params.Ya.promotion_model.findById(req.body.promotion).exec(function(err,promotionDoc){
                    response.result.promotion = promotionDoc;
                    res.json(response);
                });
            };

            params.Ya.reserve_model.create(reserveObj,function(err,doc){
                if(err){
                    if(params.debug)console.log('Error mongodb adding reserve', err);
                    response.code = 506;
                    res.json(response);
                    return;
                }
                response.code = 200;
                response.result = doc;
                promotion();
            });
        }

        /**
         * Cancel reserve
         * @method cancel
         * @param req
         * @param res
         */
        function cancel(req,res){

            var response = {
                code:500,
                result:{}
            };

            var reserveId = req.params.reserveId;
            var deviceId = req.params.deviceId;

            if(!reserveId || !deviceId){
                res.json(response);
                return;
            }

            var query = {
                _id:reserveId,
                device:deviceId
            };

            params.Ya.reserve_model.remove(query).exec(function(err,reserveDoc){
                if(err){
                    if(params.debug)console.log('Error mongodb removing reserve', err);
                    response.code = 506;
                    res.json(response);
                    return;
                }
                response.code = 200;
                response.result = reserveDoc;
                res.json(response);
            });
        }

        return {
            init:init
        };
    })();

    Reserve.init();

    return Reserve;

};