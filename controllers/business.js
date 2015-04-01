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
            params.app.get('/businesses',get);
            params.app.get('/businesses/:zone',get);
            params.app.get('/businesses/:zone/:skip/:limit',get);
            params.app.get('/businesses/:zone/:skip/:limit/:category',get);
            params.app.get('/businesses/:zone/:skip/:limit/:category/:name',get);
            params.app.get('/business/:businessId',getById);
            params.app.post('/business',add);
            params.app.delete('/business/:businessId', deleteBusiness);
            params.app.put('/business/:businessId', update);
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
                    if(params.debug)console.log('Error mongodb get business', err);
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

        /**
         * Create new business
         * @method add
         * @param req
         * @param res
         */

         function update(req,res){

             var response = {
                 code:500,
                 result:{}
             };

             var businessId = req.params.businessId;
             if(!businessId){
                 res.json(response);
                 return;
             }

             var name = req.body.name
             var dispo = req.body.dispo
             var bgimg = req.body.bgimg
             var address = req.body.address
             var phone = req.body.phone
             var facebook = req.body.facebook
             var web = req.body.web
             var zone = req.body.zone
             var category = req.body.category

             var updateUserCb = function(err,businessDoc){
                 if(err){
                     if(params.debug)console.log('Error mongodb update business', err);
                     response.code = 506;
                     res.json(response);
                     return;
                 }

                 if(name)businessDoc.name = name;
                 if(dispo)businessDoc.dispo = dispo;
                 if(bgimg)businessDoc.bgimg = bgimg;
                 if(address)businessDoc.contact.address = address
                 if(phone)businessDoc.contact.phone = phone
                 if(facebook)businessDoc.contact.facebook = facebook
                 if(web)businessDoc.contact.web = web
                 if(zone)businessDoc.zone = zone
                 if(category)businessDoc.category = category

                 businessDoc.save(function (err, updatedUser) {
                     if(err){
                         if(params.debug)console.log('Error mongodb update business', err);
                         response.code = 506;
                         res.json(response);
                         return;
                     }
                     response.code = 200;
                     response.result = updatedUser;
                     console.log(response.result)
                     res.json(response);
                 });
             };

             params.Ya.business_model.findById(businessId).exec(updateUserCb);
         }


         function deleteBusiness(req,res){

             var response = {
                 code:500,
                 result:{}
             };

             var businessId = req.params.businessId;
             if(!businessId){
                 res.json(response);
                 return;
             }

             var deleteBusinessCb = function(err,businessDoc){
                 if(err){
                     if(params.debug)console.log('Error mongodb delete business', err);
                     response.code = 506;
                     res.json(response);
                     return;
                 }
                 response.code = 200;
                 response.result = businessDoc;
                 res.json(response);

             };

             params.Ya.business_model.findByIdAndRemove(businessId).exec(deleteBusinessCb);
         }

        function add(req,res){

            var response = {
                code:500,
                result:{}
            };

            //TODO: Upload image

            var business =
            {
                "name": req.body.name,
                "address": req.body.address,
                "dispo":req.body.dispo,
                "bgimg":req.body.bgimg,
                "contact":{
                    "address":req.body.contact.address,
                    "phone":req.body.contact.phone,
                    "facebook":req.body.contact.facebook,
                    "web":req.body.contact.web
                },
                "zone":req.body.zone,
                "category":req.body.category
            };
            console.log(business)
            params.Ya.business_model.create(business,function(err,doc){
                if(err){
                    if(params.debug)console.log('Error mongodb adding business', err);
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

    Business.init();

    return Business;

};
