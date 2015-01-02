/**
 * User Model Schema
 * @module aristides
 * @submodule user_model
 * @author Claudio A. Marrero
 * @class aristides.user_model
 */
'use strict';

var mongoose = require('mongoose');
var validate = require('mongoose-validate');

function userModel(){

    var schema = new mongoose.Schema({
        email:{ type: String, required: true, unique:true, validate: [validate.email, 'invalid email address'] },
        fingerprint:{type: String, required: true, unique: true}
    });
    schema.index({email: 1, fingerprint: 1});

    return mongoose.model('user', schema, 'user');
}

module.exports = userModel;