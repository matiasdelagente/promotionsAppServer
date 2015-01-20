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
        "name": {type: String},
        "description": {type: String},
        "promotion":{ type: params.mongoose.Schema.Types.ObjectId, ref:'promotion'},
        "dispo":{type: Number},
        "bgimg":{type: String},
        "zone":{ type: params.mongoose.Schema.Types.ObjectId, ref:'zone'}
    });

    promotionSchema.index({name: 1});

    return params.mongoose.model('promotion', promotionSchema, 'promotion');
};