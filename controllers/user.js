'use strict';

module.exports = function(params){

    if(!params.Ya){
        return;
    }

    var User = (function(){

        /**
         * Initialization enddpints
         */
        function init(){
            params.app.post('/login',login);
            params.app.post('/register',register);
            params.app.post('/logout',logout);
            params.app.post('/autologin',autoLogin);
            params.app.get('/user', get);
            params.app.get('/user/:userId', getById);
            params.app.post('/user', add);
            params.app.put('/user/:userId', update);
            params.app.delete('/user/:userId', deleteUser);
        }

        /**
         * Register users
         * @method login
         * @param req
         * @param res
         */
        function register(req,res){
            var response = {
                code: 400,
                result: {}
            };
            //TODO: Decrypt password
            if(!req.body.email){res.json(response); return;}
            if(!req.body.password){res.json(response); return;}
            var userCb = function(err,userDoc){
                if(err || userDoc){res.json(response); return;}
                var regCb = function(e,d){
                    if(err || !d){res.json(response);return;}
                    params.Ya.auth.setToken(d._id,req.body.email,req.body.password);
                    response.code = 200;
                    response.result.user = d;
                    response.result.token = params.Ya.auth.getToken(req.body.email,req.body.password);
                    res.json(response);
                };
                var newUser = {email:req.body.email,password:req.body.password,role:'business',isAdmin:false};
                params.Ya.user_model.create(newUser,regCb);
            };
            params.Ya.user_model.findOne({email:req.body.email},userCb);
        }

        /**
         * Login users
         * @method login
         * @param req
         * @param res
         */
        function login(req,res){
            var response = {
                code: 400,
                result: {}
            };
            //TODO: Decrypt password
            if(!req.body.email){res.json(response); return;}
            if(!req.body.password){res.json(response); return;}
            var userCb = function(err,userDoc){
                if(err || !userDoc){res.json(response); return;}
                params.Ya.auth.setToken(userDoc._id,req.body.email,req.body.password);
                response.code = 200;
                response.result.user = userDoc;
                response.result.token = params.Ya.auth.getToken(req.body.email,req.body.password);
                res.json(response);
            };
            params.Ya.user_model.findOne({email:req.body.email,password:req.body.password},userCb);
        }

        /**
         * Make login with token
         * @method autoLogin
         * @param req
         * @param res
         */
        function autoLogin(req,res){
            var response = {
                code: 400,
                result: {}
            };
            if(!req.body.token || !params.Ya.auth.validateSession(req.body.token)){res.json(response); return;}
            var userId = params.Ya.auth.getUserByToken(req.body.token);
            var userCb = function(err,userDoc){
                if(err || !userDoc){res.json(response); return;}
                params.Ya.auth.setToken(userDoc._id,req.body.email,req.body.password);
                response.code = 200;
                response.result.user = userDoc;
                response.result.token = params.Ya.auth.getToken(req.body.email,req.body.password);
                res.json(response);
            };
            params.Ya.user_model.findById(userId,userCb);
        }

        /**
         * Clear token and logout user
         * @method logout
         * @param req
         * @param res
         */
        function logout(req,res){
            var response = {
                code: 400,
                result: {}
            };
            if(!req.body.token || !params.Ya.auth.validateSession(req.body.token)){res.json(response);return;}
            params.Ya.auth.deleteToken(req.body.token);
            response.code = 200;
            res.json(response);
        }

        /**
         * Get all users
         * @method get
         * @param req
         * @param res
         */
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

                params.Ya.user_model.find(query).populate('business').exec(userCb);

        }

        /**
         * Get users by ID
         * @method getById
         * @param req
         * @param res
         */
        function getById(req, res){

            var response = {
                code: 500,
                result: {}
            };

            var userId = req.params.userId;
            if(!userId){
                res.json(response);
                return;
            }

            var userCb = function(err, userDoc){
                if(err){
                    if(params.debug)console.log('Error mongodb getting user',err)
                    response.code = 506;
                    res.json(response);
                    return;
                }
                response.code = 200;
                response.result = userDoc;
                res.json(response);
            };

            params.Ya.user_model.findById(userId).exec(userCb);

        }

        /**
         * Update user
         * @method update
         * @param req
         * @param res
         */
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
            var password = req.body.password;
            var business = req.body.business;
            var email = req.body.email;

            var updateUserCb = function(err,userDoc){
                if(err){
                    if(params.debug)console.log('Error mongodb update user', err);
                    response.code = 506;
                    res.json(response);
                    return;
                }
                response.code = 200;
                response.result = userDoc;
                res.json(response);
            };

            params.Ya.user_model.findByIdAndUpdate(userId,{$set:req.body}).exec(updateUserCb);
        }

        /**
         * Delete user from db
         * @method deleteUser
         * @param req
         * @param res
         */
        function deleteUser(req,res){

            var response = {
                code:500,
                result:{}
            };

            var userId = req.params.userId;
            if(!userId){
                res.json(response);
                return;
            }

            var deleteUserCb = function(err,userDoc){
                if(err){
                    if(params.debug)console.log('Error mongodb delete user', err);
                    response.code = 506;
                    res.json(response);
                    return;
                }
                response.code = 200;
                response.result = userDoc;
                res.json(response);

            };
            //TODO: Revisar que pasa con las relaciones si se elimina el usuario
            params.Ya.user_model.findByIdAndRemove(userId).exec(deleteUserCb);
        }

        /**
         * Add new users
         * @method add
         * @param req
         * @param res
         */
        function add(req, res){

            var response = {
                code: 500,
                result: {}
            };

            //TODO: Encrypt the password
            var user = {
                "name": req.body.name,
                "password": req.body.password,
                "business": req.body.business,
                "email" : req.body.email
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
