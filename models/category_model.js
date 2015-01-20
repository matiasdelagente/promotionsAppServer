/**
 * Category Model Schema
 * @module _Ya
 * @submodule category_model
 * @author Claudio A. Marrero
 * @class _Ya.category_model
 */
'use strict';
module.exports = function(params){

    if(!params.Ya){
        return;
    }

    /**
     * A Schema for Category
     * @property categorySchema
     * @type {params.mongoose.Schema}
     * @private
     */
    var categorySchema = new params.mongoose.Schema({
        "name": {type: String},
        "description": {type: String}
    });

    categorySchema.index({name: 1});

    return params.mongoose.model('category', categorySchema, 'category');
};