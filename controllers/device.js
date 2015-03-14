/**
 * Controller for categories
 *
 * @module _Ya
 * @submodule doctor
 * @author Claudio A. Marrero
 * @class _Ya.Device
 */
'use strict';
module.exports = function(params){

    if(!params.Ya){
        return;
    }

    var gcm = require('node-gcm');
    var Device = (function(){

        /**
         * Initialization method for Admin
         *
         * @method init
         */
        function init(){
            params.app.get('/devices',get);
            params.app.get('/devices/:skip/:limit',get);
            params.app.get('/device/:deviceId',getById);
            params.app.post('/device',add);
            params.app.post('/device/:deviceId/notifications/id', updateNotificationsId);
            params.app.post('/device/:deviceId/notifications/enabled', enableDisableNotifications);
            params.app.post('/device/notifications', sendNotification);
            params.app.put('/device/:deviceId/email', updateEmail);
        }

        /**
         * Get all device from db
         *
         * @method get
         * @param req {Object} request from client
         * @param res {Object} response closure
         */
        function get(req,res){

            var response = {
                code:500,
                result:{}
            };

            var skip = (req.params.skip)?req.params.skip:0;
            var limit = (req.params.limit)?req.params.limit:20;

            var deviceCb = function(err,deviceDoc){
                if(err){
                    if(params.debug)console.log('Error mongodb get device', err);
                    response.code = 506;
                    res.json(response);
                    return;
                }
                response.code = 200;
                response.result = deviceDoc;
                res.json(response);
            };

            params.Ya.device_model.find({}).skip(skip).limit(limit).exec(deviceCb);
        }

        /**
         * Get one device from db by id
         *
         * @method getById
         * @param req {Object} request from client
         * @param res {Object} response closure
         */
        function getById(req,res){

            var response = {
                code:500,
                result:{}
            };

            var deviceId = req.params.deviceId;
            if(!deviceId){
                res.json(response);
                return;
            }

            var deviceCb = function(err,deviceDoc){
                if(err){
                    if(params.debug)console.log('Error mongodb get devices', err);
                    response.code = 506;
                    res.json(response);
                    return;
                }
                response.code = 200;
                response.result = deviceDoc;
                res.json(response);
            };

            params.Ya.device_model.findById(deviceId).exec(deviceCb);
        }

        /**
         * Create new device
         * @method add
         * @param req
         * @param res
         */
        function add(req,res){

            var response = {
                code:500,
                result:{}
            };

            var deviceObj =
            {
                "device": req.body.device,
                "email": req.body.email
            };

            params.Ya.device_model.create(deviceObj,function(err,doc){
                if(err){
                    if(params.debug)console.log('Error mongodb adding device', err);
                    response.code = 506;
                    res.json(response);
                    return;
                }
                response.code = 200;
                response.result = doc;
                res.json(response);
            });
        }

        /**
         * Update notification id for a device
         * @method updateNotificationsId
         * @param req
         * @param res
         */
        function updateNotificationsId(req,res){

            var response = {
                code:500,
                result:{}
            };

            var deviceId = req.params.deviceId;
            console.log(deviceId);
            if(!deviceId){
                res.json(response);
                return;
            }

            var notificationId = req.body.id;
            var updateNotificationsIdCb = function(err,deviceDoc){
                if(err){
                    if(params.debug)console.log('Error mongodb update notifications id', err);
                    response.code = 506;
                    res.json(response);
                    return;
                }
                response.code = 200;
                response.result = deviceDoc;
                res.json(response);
            };

            params.Ya.device_model.findByIdAndUpdate(deviceId, {
                $set: {
                    'notifications.id': notificationId
                }
            }).exec(updateNotificationsIdCb);
        }

        /**
         * Enable/disable notifications for a device
         * @method updateNotificationsConfig
         * @param req
         * @param res
         */
        function enableDisableNotifications(req,res){

            var response = {
                code:500,
                result:{}
            };

            var deviceId = req.params.deviceId;
            if(!deviceId){
                res.json(response);
                return;
            }

            var enabled = req.body.enabled;

            var updateConfigCb = function(err,deviceDoc){
                if(err){
                    if(params.debug)console.log('Error mongodb enable/disable notifications', err);
                    response.code = 506;
                    res.json(response);
                    return;
                }
                response.code = 200;
                response.result = deviceDoc;
                res.json(response);
            };

            params.Ya.device_model.findByIdAndUpdate(deviceId, {
                $set: {
                    'notifications.enabled': enabled
                }
            }).exec(updateConfigCb);
        }

        /**
         * Send a notification to a device
         *
         * @method sendNotification
         * @param req {Object} request from client
         * @param res {Object} response closure
         */
        function sendNotification(req,res){

            var response = {
                code:500,
                result:{}
            };

            var notData = {
                title: req.body.title,
                message: req.body.message
            };

            var message = new gcm.Message({
                collapseKey: 'demo',
                delayWhileIdle: true,
                timeToLive: 3000,
                data: notData
            });

            var sender = new gcm.Sender(params.Ya.gcm.APIKey);

            var deviceCb = function(err,deviceDoc){
                if(err || !deviceDoc){
                    if(params.debug)console.log('Error mongodb send notification', err);
                    response.code = 506;
                    res.json(response);
                    return;
                }
                var notifications = [];
                deviceDoc.forEach(function(item){
                    if(!item.notifications.id){
                        return;
                    }
                    notifications.push(item.notifications.id)
                });
                sender.sendNoRetry(message, notifications, function (err, result) {
                    if (err) {
                        if(params.debug)console.log('Error gmc send notification', err);
                        response.code = 500;
                        res.json(response);
                        return;
                    }
                    response.code = 200;
                    response.result = {};
                    res.json(response);
                });
            };

            params.Ya.device_model.find({'notifications.enabled':true}).exec(deviceCb);
        }



        /**
         * Update device's email
         * @method updateEmail
         * @param req
         * @param res
         */
        function updateEmail(req,res){

            var response = {
                code:500,
                result:{}
            };

            var deviceId = req.params.deviceId;
            if(!deviceId){
                res.json(response);
                return;
            }

            var email = req.body.email;

            var updateEmailCb = function(err,deviceDoc){
                if(err){
                    if(params.debug)console.log('Error mongodb update email', err);
                    response.code = 506;
                    res.json(response);
                    return;
                }
                deviceDoc.email = email;
                deviceDoc.save(function (err, updatedDevice) {
                    if(err){
                        if(params.debug)console.log('Error mongodb update email', err);
                        response.code = 506;
                        res.json(response);
                        return;
                    }
                    response.code = 200;
                    response.result = updatedDevice;
                    res.json(response);
                });
            };

            params.Ya.device_model.findById(deviceId).exec(updateEmailCb);
        }

        return {
            init:init
        };
    })();

    Device.init();

    return Device;

};