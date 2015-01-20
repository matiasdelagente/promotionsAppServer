/**
 * Zone Model Schema
 * @module _Ya
 * @submodule zone_model
 * @author Claudio A. Marrero
 * @class _Ya.zone_model
 */
'use strict';
module.exports = function(params){

    if(!params.Ya){
        return;
    }

    /**
     * A Schema for Zone
     * @property zoneSchema
     * @type {params.mongoose.Schema}
     * @private
     */
    var zoneSchema = new params.mongoose.Schema({
        "name": {type: String},
        "description": {type: String}
    });

    zoneSchema.index({name: 1});

    return params.mongoose.model('zone', zoneSchema, 'zone');
};