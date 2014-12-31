/**
 * Created by Administrador on 29/12/2014.
 */
'use strict';

var userModel = require('../models/user.js');

function userCtrl(app){

    app.get('/user/:userId',getUser);

    function getUser(req,res){
        var response = {
            code:400,
            user:{}
        };
        res.json(response);
    }
}

module.exports = userCtrl;