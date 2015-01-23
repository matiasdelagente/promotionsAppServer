/**
 * Category Model Schema
 * @module _Ya
 * @submodule reserve_model
 * @author Claudio A. Marrero
 * @class _Ya.reserve_model
 */
'use strict';
module.exports = function(params){

    if(!params.Ya){
        return;
    }

    /**
     * A Schema for Reserve
     * @property reserveSchema
     * @type {params.mongoose.Schema}
     * @private
     */
    var reserveSchema = new params.mongoose.Schema({
        "device": { type: params.mongoose.Schema.Types.ObjectId, ref:'device'},
        "promotion": { type: params.mongoose.Schema.Types.ObjectId, ref:'promotion'},
        "amount":{type: Number},
        "date":{type: Date, default: new Date()}
    });

    reserveSchema.index({name: 1});

    return params.mongoose.model('reserve', reserveSchema, 'reserve');
};