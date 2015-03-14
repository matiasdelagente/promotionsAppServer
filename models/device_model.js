/**
 * Category Model Schema
 * @module _Ya
 * @submodule device_model
 * @author Claudio A. Marrero
 * @class _Ya.device_model
 */
'use strict';
module.exports = function (params) {

    if (!params.Ya) {
        return;
    }

    /**
     * A Schema for Device
     * @property deviceSchema
     * @type {params.mongoose.Schema}
     * @private
     */
    var deviceSchema = new params.mongoose.Schema({
        "device": {},
        "notifications": {
            id: { type: String},
            enabled: {type: Boolean,default: true}
        },
        "email": {
            type: String,
            required: true,
            validate: [params.validate.email, 'invalid email address']
        },
        "registerDate": {type: Date, default: new Date()},
        "lastAccess": {type: Date, default: new Date()}
    });

    deviceSchema.index({email: 1});

    return params.mongoose.model('device', deviceSchema, 'device');
};
