/**
 * Category Model Schema
 * @module _Ya
 * @submodule promotion_model
 * @author Claudio A. Marrero
 * @class _Ya.promotion_model
 */
'use strict';
module.exports = function(params){

    if(!params.Ya){
        return;
    }

    /**
     * A Schema for Promotion
     * @property promotionSchema
     * @type {params.mongoose.Schema}
     * @private
     */
    var promotionSchema = new params.mongoose.Schema({
        "code": {type: String},
        "name": {type: String},
        "bgimg":{type: String},
        "type":{type: String},
        "description": {type: String},
        "status": {type: String},
        "expire": { type: Date},
        "business":{ type: params.mongoose.Schema.Types.ObjectId, ref:'business'},
        "category":{ type: params.mongoose.Schema.Types.ObjectId, ref:'category'},
        "zone":{ type: params.mongoose.Schema.Types.ObjectId, ref:'zone'},
        "amount": { type: Number},
        "takenUsers": { type: Number}
    });

    promotionSchema.index({name: 1});

    return params.mongoose.model('promotion', promotionSchema, 'promotion');
};
