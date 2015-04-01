/**
 * Category Model Schema
 * @module _Ya
 * @submodule business_model
 * @author Claudio A. Marrero
 * @class _Ya.business_model
 */
'use strict';
module.exports = function(params){

    if(!params.Ya){
        return;
    }

    /**
     * A Schema for Business
     * @property businessSchema
     * @type {params.mongoose.Schema}
     * @private
     */
    var businessSchema = new params.mongoose.Schema({
        "name": {type: String},
        "address": {type: String},
        "dispo":{type: Number},
        "bgimg":{type: String},
        "contact":{
            "address":{type: String},
            "phone":{type: Number},
            "facebook":{type: String},
            "web":{type: String}
        },
        "zone":{ type: params.mongoose.Schema.Types.ObjectId, ref:'zone'},
        "category":{ type: params.mongoose.Schema.Types.ObjectId, ref:'category'},
        "reserveExpireTime": { type: Number, default: 2 }
    });

    businessSchema.index({name: 1});

    return params.mongoose.model('business', businessSchema, 'business');
};
