
'use strict';

module.exports = function(params){

    if(!params.Ya){
        return
    };

    var userSchema = params.mongoose.Schema ({
        "name": {type: String},
        "password": {type: String},
        "business": {type: params.mongoose.Schema.Types.ObjectId, ref: 'business'}
    });

    userSchema.index({name: 1});

    return params.mongoose.model('user', userSchema,'user');
}
