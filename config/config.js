/**
 * Created by Administrador on 24/12/2014.
 */

function Config(){

    this.db = "aristides";
    this.dbUser = "ari";
    this.dbPass = "ari2014$";

    this.expressPort = 9000;
    this.socketPort = 9080;

    /**
     * Options to connect to mongodb
     * @property options
     * @type {Object}
     */
    this.options = {
        db: {  safe: true, strict: false, native_parser:true },
        server: { poolSize: 3 },
        replset: { rs_name: this.db, strategy: 'ping'},
        user: this.dbUser,
        pass: this.dbPass
    };

    this.options.server.socketOptions = this.options.replset.socketOptions = { keepAlive: 1 };

    /**
     * List of servers of replicaset
     * @property servers
     * @type {Object}
     */
    this.servers = {
        a:{
            host:'localhost',
            user: this.dbUser,
            pass: this.dbPass,
            db:this.db,
            port:27017
        },
        b:{
            host:'localhost',
            user: this.dbUser,
            pass: this.dbPass,
            db:this.db,
            port:27017
        },
        c:{
            host:'localhost',
            user: this.dbUser,
            pass: this.dbPass,
            db:this.db,
            port:27017
        }
    };

    this.servers.a.connect = 'mongodb://'+this.servers.a.user+':'+this.servers.a.pass+'@'+this.servers.a.host+':'+this.servers.a.port+'/'+this.servers.a.db;
    this.servers.b.connect = 'mongodb://'+this.servers.b.user+':'+this.servers.b.pass+'@'+this.servers.b.host+':'+this.servers.b.port;
    this.servers.c.connect = 'mongodb://'+this.servers.c.user+':'+this.servers.c.pass+'@'+this.servers.c.host+':'+this.servers.c.port;

    this.servers.connectString = this.servers.a.connect+','+this.servers.b.connect+','+this.servers.c.connect;
}

module.exports = Config;