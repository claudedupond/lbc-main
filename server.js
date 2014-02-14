var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var lbcscraper = require('./lib/lbcscraper');
var lbc = require('./lib/lbc');
var app = express();


// all environments
app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 3000);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.cookieParser());
app.use(express.cookieSession({secret: "fucklbcserv",  cookie: {maxAge: new Date(Date.now() + 12*30*24*60*60*1000)}}));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}
function checkAuth(req, res, next) {
    console.log(req.session.user +" : "+ req.session.password);
    if (!req.session.user && !req.session.password) {
        res.redirect('/signin');
    } else {
        next();
    }
}

app.get('/', checkAuth, routes.index);
app.get('/signin', routes.signin);
app.post('/addServer', checkAuth, routes.addServer);
app.post('/updateserver', checkAuth, routes.updateServer);
app.get('/logout', checkAuth, routes.logOut);
app.post('/auth', routes.auth);
app.get('/start', checkAuth,routes.start);
app.get('/stop', checkAuth, routes.stop);
app.post('/save', routes.save);
app.get('/exportalljson',  routes.exportAllJson);
app.get('/exportlatestjson', routes.exportLatestJson);

http.createServer(app).listen(app.get('port'), app.get('ip'), function () {
    console.log('Express server listening on port ' + app.get('port'));
    global.servList = [
        {url: "http://serv1-lbcserv.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv2-lbcserv.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv3-lbcserv.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv1-lbcserv1.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv2-lbcserv1.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv3-lbcserv1.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv1-lbcserv2.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv2-lbcserv2.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv3-lbcserv2.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv1-lbcserv3.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv2-lbcserv3.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv3-lbcserv3.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv1-lbcserv4.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv2-lbcserv4.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv3-lbcserv4.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv1-lbcserv5.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv2-lbcserv5.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv3-lbcserv5.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv1-lbcserv6.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv2-lbcserv6.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv3-lbcserv6.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv1-lbcserv7.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv2-lbcserv7.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv3-lbcserv7.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv1-lbcserv8.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv2-lbcserv8.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv3-lbcserv8.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv1-lbcserv9.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv2-lbcserv9.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv3-lbcserv9.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv1-lbcserv10.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv2-lbcserv10.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv3-lbcserv10.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv1-lbcserv11.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv2-lbcserv11.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv3-lbcserv11.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv1-lbcserv12.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv2-lbcserv12.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv3-lbcserv12.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv1-lbcserv13.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv2-lbcserv13.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv3-lbcserv13.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv1-lbcserv14.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv2-lbcserv14.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv3-lbcserv14.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv1-lbcserv15.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv2-lbcserv15.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv3-lbcserv15.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv1-lbcserv16.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv2-lbcserv16.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv3-lbcserv16.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv1-lbcserv17.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv2-lbcserv17.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv3-lbcserv17.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv1-lbcserv18.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv2-lbcserv18.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv3-lbcserv18.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv1-lbcserv19.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv2-lbcserv19.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv3-lbcserv19.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv1-lbcserv20.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv2-lbcserv20.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv3-lbcserv20.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv1-lbcserv21.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv2-lbcserv21.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv3-lbcserv21.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv1-lbcserv22.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv2-lbcserv22.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv3-lbcserv22.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv1-lbcserv23.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv2-lbcserv23.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv3-lbcserv23.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv1-lbcserv24.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv2-lbcserv24.rhcloud.com/", stat: true, count: 0},
        {url: "http://serv3-lbcserv24.rhcloud.com/", stat: true, count: 0}
    ];
    global.running = true;
    global.runningList = [];
    global.waitingList = [];
    global.user = "zrelli";
    global.password = "zrellihcc";
    global.dirname = __dirname;
    global.lbc = new lbc();
    global.lbc.connect(function(error,conn){
        if(!error){
            global.conn = conn;
            global.advert = global.lbc.advert;
            global.lbcscraper = new lbcscraper(global.lbc);
            global.lbcscraper.run();
        }
        else{
            console.error(error);
        }
    });
});
