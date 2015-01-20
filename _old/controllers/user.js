/**
 * Created by Administrador on 29/12/2014.
 */
'use strict';

var userModel = require('../models/user.js');

function userCtrl(app){

    var that = this;

    app.get('/user/:userId',getUser);
    app.post('/login',login);
    app.post('/register',register);

    this.users = [];

    this.on = function(socket){
        socket.on('user:login',function(data,fn){

        });
    };

    function login(req,res){

        var response = {
            code:400,
            user:{}
        };

        var fingerprint = req.body.fingerprint;
        var user = that.users[fingerprint];

        if(user){
            user = setExpire(user);
            res.json(response);
            return;
        }

        user = that.users[fingerprint] = {};
        user = setExpire(user);
        res.json(response);
    }

    function register(req,res){

        var response = {
            code:400,
            user:{}
        };

        var fingerprint = req.body.fingerprint;
        var user = that.users[fingerprint] = {};
        setExpire(user);
        res.json(response);
    }

    function getUser(req,res){
        var response = {
            code:400,
            user:{}
        };
        res.json(response);
    }

    function setExpire(user){
        var today = new Date();
        user.expire = new Date(today.getTime() + 604800000);
        return user;
    }

    function isExpire(user){
        var expire = false;

        if(!user.expire){
            return expire;
        }

        var today = new Date();
        if(today.getTime() >= user.expire.getTime()){
            expire = true;
        }

        return expire;
    }

    this.deleteExpiredUsers = function(){
        for(var user in that.users){
            if(isExpire(that.users[user])){
                that.users.splice(user, 1);
            }
        }
    }
}

module.exports = userCtrl;