/**
 * Controller for categories
 *
 * @module _Ya
 * @submodule doctor
 * @author Claudio A. Marrero
 * @class _Ya.Category
 */
'use strict';
module.exports = function(params){

    if(!params.Ya){
        return;
    }

    var Category = (function(){

        /**
         * Initialization method for Admin
         *
         * @method init
         */
        function init(){
            params.Ya.app.get('/category',get);
            params.Ya.app.get('/category/:categoryId',getById);
            params.Ya.app.post('/category',add);
        }


        /**
         * Get all category from db
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

            var categoryCb = function(err,categoryDoc){
                if(err){
                    if(params.debug)console.log('Error mongodb Categorys', err);
                    response.code = 506;
                    res.json(response);
                    return;
                }
                response.code = 200;
                response.result = categoryDoc;
                res.json(response);
            };

            params.Ya.category_model.find(query).exec(categoryCb);
        }

        /**
         * Get one category from db by id
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

            var categoryId = req.params.categoryId;
            if(!categoryId){
                res.json(response);
                return;
            }

            var categoryCb = function(err,categoryDoc){
                if(err){
                    if(params.debug)console.log('Error mongodb geting categories', err);
                    response.code = 506;
                    res.json(response);
                    return;
                }
                response.code = 200;
                response.result = categoryDoc;
                res.json(response);
            };

            params.Ya.category_model.findById(categoryId).exec(categoryCb);
        }

        /**
         * Create new category
         * @method add
         * @param req
         * @param res
         */
        function add(req,res){

            var response = {
                code:500,
                result:{}
            };

            var category ={
                "name": req.body.name,
                "description": req.body.description
            };

            params.Ya.category_model.create(category,function(err,doc){
                if(err){
                    if(params.debug)console.log('Error mongodb adding category', err);
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

    Category.init();

    return Category;

};