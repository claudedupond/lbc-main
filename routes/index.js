var http = require('http-get'),
    requestJSON = require('request-json');


exports.index = function(req, res){
    var online = 0;
    for(var i=0; i<global.servList; i++){
        if(global.servList[i].stat)
            online++;
    }
    res.render('index', {online: online, servList : global.servList, runningList : global.runningList, waitingList : global.waitingList, running: global.running});
};

exports.signin = function(req, res){
    res.render('signin');
};

exports.addServer = function(req, res){
    if(req.body.url)
        global.servList.push({url: req.body.url, stat: false});
    res.redirect('home');
};

exports.auth = function(req, res){
    var post = req.body;
    if (post.user == global.user && post.password == global.password) {
        req.session.user = post.user;
        req.session.password = post.password;
        res.redirect('home');
    } else {
        res.render('signin');
    }
};

exports.logOut = function(req, res){
    req.session = null;
    res.redirect('home');
};

exports.start = function(req, res){
    global.servList.forEach(function(serv){
        var client = requestJSON.newClient(serv.url);
        client.post('start', {}, function (err, res, body) {
            if (err)
                console.log(serv.url + ": offline");
            else{
                console.log(body);
                console.log(serv.url + ": online");
            }
        });
    });
    global.running = false;
    global.waitingList = [];
    global.runningList = [];
    global.running = true;
    res.redirect('home');
};

exports.stop = function(req, res){
    global.servList.forEach(function(serv){
        var client = requestJSON.newClient(serv.url);
        client.post('stop', {}, function (err, res, body) {
            if (err)
                console.log(serv.url + ": offline");
            else{
                console.log(body);
                console.log(serv.url + ": online");
            }
        });
    });
    global.waitingList = [];
    global.runningList = [];
    global.running = false;
    res.redirect('home');
};

exports.save = function(req, res){
    var advert = new global.lbc.advert();
    var _advert = req.body;
    if(_advert.numero){
        console.log('receive from : '+ req.url);
        global.waitingList.forEach(function(ad){
            if(ad.url === req.url){
                global.servList.forEach(function(serv){
                    var fullURL = req.protocol + "://" + req.get('host');
                    if(serv.url === fullURL)
                        serv.count++;
                });
                global.waitingList.splice(global.waitingList.indexOf(ad), 1);
            }
        });
        advert.nom = _advert.nom;
        advert.prix = _advert.prix;
        advert.ville = _advert.ville;
        advert.codepostal = _advert.codepostal;
        advert.marque = _advert.marque;
        advert.modele = _advert.modele;
        advert.anneemodele = _advert.anneemodele;
        advert.kilometrage = _advert.kilometrage;
        advert.carburant = _advert.carburant;
        advert.boitevitesse = _advert.boitevitesse;
        advert.date = _advert.date;
        advert.title = _advert.title;
        advert.description = _advert.description;
        advert.lien = _advert.lien;
        advert.urgent = _advert.urgent;
        advert.particulier = _advert.particulier;
        advert.numero = _advert.numero;

        advert.save(advert, function(error, advert){
            if(!error){
                console.log(JSON.stringify(advert));
                res.send(true);
            }
            else{
                console.error('save mongo');
                console.error(error);
                res.send(true);
            }
        });
    }
};

exports.updateServer = function(req, res){
    var server = req.body.server;
    if(server){
        global.servList.forEach(function(serv){
            var client = requestJSON.newClient(serv.url);
            client.post('updateserver', {server: server}, function (err, res, body) {
                if (err)
                    console.log(serv.url + body);
                else{
                    console.log(serv.url + body);
                }
            });
        });
    }
    res.redirect('home');
};

exports.exportAllJson = function(req, res){
    global.advert.find({}, function (error, result) {
        if(!error){
            var str = JSON.stringify(result);
            res.header('Content-type', 'text/json');
            res.send(str);
        }
        else
            res.send("erreur system");
    });
};

exports.exportLatestJson = function(req, res){
    global.advert.find({saved: false}, function (error, result) {
        if(!error){
            var str = JSON.stringify(result);
            global.advert.update({saved: false}, {saved: true}, { multi : true }, fn);
            res.header('Content-type', 'text/json');
            res.send(str);
        }
        else
            res.send("erreur system");
    });
};