
'use strict';

module.exports = function(params){

    if(!params.Ya){
        return
    }

    var schema = params.mongoose.Schema ({
        "name": {type: String},
        "email": {type: String, unique: true, required: true, validate: [params.validate.email, 'invalid email address']},
        "password": {type: String},
        "role":{ type: String, enum: ['admin','business']},
        "isAdmin":{ type: Boolean, default: false},
        "business": {type: params.mongoose.Schema.Types.ObjectId, ref: 'business'}
    });

    schema.index({name: 1});

    return params.mongoose.model('user', schema,'user');
};
