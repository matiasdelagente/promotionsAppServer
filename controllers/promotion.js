'use strict';
module.exports = function(params){

    if(!params.Ya){
        return;
    }

    var Promotion = (function(){

        /**
         * Initialization method for Admin
         *
         * @method init
         */
        function init(){
            params.app.get('/promotions',get);
            params.app.get('/promotions/:zone',get);
            params.app.get('/promotions/:zone/:skip/:limit/:businessId',get);
            params.app.get('/promotion/:promotionId',getById);
            params.app.post('/promotion',add);
            params.app.put('/promotion/:promotionId', deletePromotion);
            params.app.delete('/promotion/:promotionId', deletePromotion);
        }

        /**
         * Get all promotion from db
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

            if(req.params.businessId){
                query.business = req.params.businessId;
            }

            var skip = (req.params.skip)?req.params.skip:0;
            var limit = (req.params.limit)?req.params.limit:20;

            var promotionCb = function(err,promotionDoc){
                if(err){
                    if(params.debug)console.log('Error mongodb get promotion', err);
                    response.code = 506;
                    res.json(response);
                    return;
                }
                response.code = 200;
                response.result = promotionDoc;
                res.json(response);
            };

            params.Ya.promotion_model.find(query).populate('business category zone').skip(skip).limit(limit).exec(promotionCb);
        }

        /**
         * Get one promotion from db by id
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

            var promotionId = req.params.promotionId;
            if(!promotionId){
                res.json(response);
                return;
            }

            var promotionCb = function(err,promotionDoc){
                if(err){
                    if(params.debug)console.log('Error mongodb get promotions', err);
                    response.code = 506;
                    res.json(response);
                    return;
                }
                response.code = 200;
                response.result = promotionDoc;
                res.json(response);
            };

            params.Ya.promotion_model.findById(promotionId).populate('business category zone').exec(promotionCb);
        }

        function deletePromotion(req,res){

            var response = {
                code:500,
                result:{}
            };

            var promotionId = req.params.promotionId;
            if(!promotionId){
                res.json(response);
                return;
            }

            var deletePromotionCb = function(err,promotionDoc){
                if(err){
                    if(params.debug)console.log('Error mongodb delete promotion', err);
                    response.code = 506;
                    res.json(response);
                    return;
                }
                response.code = 200;
                response.result = promotionDoc;
                res.json(response);

            };

            params.Ya.promotion_model.findByIdAndRemove(promotionId).exec(deletePromotionCb);
        }

        /**
         * Create new promotion
         * @method add
         * @param req
         * @param res
         */
        function add(req,res){

            var response = {
                code:500,
                result:{}
            };

            //TODO: Upload image
            var promotionObj =
            {
                "name": req.body.name,
                "description": req.body.description,
                "bgimg": req.body.bgimg,
                "business": req.body.business,
                "category": req.body.category,
                "zone": req.body.zone
            };

            params.Ya.promotion_model.create(promotionObj,function(err,doc){
                if(err){
                    if(params.debug)console.log('Error mongodb adding promotion', err);
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

    Promotion.init();

    return Promotion;

};
