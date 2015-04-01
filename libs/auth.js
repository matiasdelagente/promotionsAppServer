'use strict';

module.exports = function(params){

    return (function(){

        var auth = {};
        var tokens = [];

        /**
         * Validate session
         * @method validateSession
         * @param token
         * @returns {*|boolean}
         */
        auth.validateSession = function(token){
            //TODO: Control that the token its ok
            return auth.getUserByToken(token) || false;
        };

        /**
         * Get user ID
         * @param token
         * @returns {*}
         */
        auth.getUserByToken = function(token){
            return tokens[token];
        };

        /**
         * Get token by email and password
         * @method getToken
         * @param email
         * @param password
         * @returns {*}
         */
        auth.getToken = function(email,password){
            var searchToken = new Buffer(email+password).toString('base64');
            if(!tokens[searchToken])return false;
            return searchToken;
        };

        /**
         * Set token by user, email and password
         * @method setToken
         * @param userId
         * @param email
         * @param password
         * @returns {*}
         */
        auth.setToken = function(userId,email,password){
            return tokens[new Buffer(email+password).toString('base64')] = userId;
        };

        /**
         * Delete an exist token
         * @method deleteToken
         * @param token
         */
        auth.deleteToken = function(token){
            //TODO: Call this with expire timeout
            delete tokens.slice(token,1);
        };

        return auth;
    })();
};