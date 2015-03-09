'use strict';

module.exports = function(params){

    if(!params.Ya){
        return;
    }

    var User = (function(){

        function init(){
            params.app.get('/user', get);
            params.app.get('/user/:userId', getById);
            params.app.post('/user', add);
            params.app.put('/user/:userId', update);
        }

        function get(req, res){

            var response = {
                code: 500,
                result: {}
            };

            var query = {};

            var userCb = function(err, userDoc){
                if(err){
                    if(params.debug)console.log('Error mongodb Users',err);
                    response.code = 506;
                    res.json(response);
                    return;
                }
                response.code = 200;
                response.result = userDoc;
                res.json(response);
            };

                params.Ya.user_model.find(query).exec(userCb);

            }


        function getById(req, res){

            var response = {
                code: 500,
                result: {}
            };

            var userId = req.params.userId;
            if(!userId){
                res.json(response)
                return;
            }

            var userCb = function(err, userDoc){
                if(err){
                    if(params.debug)console.log('Error mongodb getting user',err)
                    response.code = 506;
                    res.json(response);
                    return;
                }
                response.code = 200
                response.result = userDoc;
                res.json(response);
            };

            params.Ya.user_model.findById(userId).exec(userCb);

        }

        function update(req,res){

            var response = {
                code:500,
                result:{}
            };

            var userId = req.params.userId;
            if(!userId){
                res.json(response);
                return;
            }

            var name = req.body.name;
            var password = req.body.password

            var updateUserCb = function(err,userDoc){
                if(err){
                    if(params.debug)console.log('Error mongodb update user', err);
                    response.code = 506;
                    res.json(response);
                    return;
                }
                if(name)userDoc.name = name;
                if(password)userDoc.password = password;

                userDoc.save(function (err, updatedUser) {
                    if(err){
                        if(params.debug)console.log('Error mongodb update user', err);
                        response.code = 506;
                        res.json(response);
                        return;
                    }
                    response.code = 200;
                    response.result = updatedUser;
                    res.json(response);
                });
            };

            params.Ya.user_model.findById(userId).exec(updateUserCb);
        }

        function add(req, res){

            var response = {
                code: 500,
                result: {}
            };

            var user = {
                "name": req.body.name,
                "password": req.body.password
            };

            params.Ya.user_model.create(user, function(err,doc){
                if(err){
                    if(params.debug) console.log('Error mongodb adding user',err);
                    response.code = 506;
                    res.json(response);
                    return;
                }
                response.code = 200;
                response.result = doc;
                res.json(response);
            });
        }

        return{
            init:init
        };

    })();

    User.init();

    return User;

};
