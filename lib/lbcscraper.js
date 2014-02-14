/**
 * Created by Belkhiria on 1/26/14.
 */

var request = require('request'),
    cheerio = require('cheerio'),
    requestJSON = require('request-json'),
    lbc = null,
    options = {
        url: 'http://www.leboncoin.fr/voitures/?ps=12&f=p',
        port: 80,
        method: 'GET'
    },
    linksTimeOut = 60,
    _this = null,
    servIndex = -1;


var lbcscraper = function(_lbc){
    lbc = _lbc;
    _this = this;
};

lbcscraper.prototype.run = function(){
    var interval = setInterval(function(){
        _this.scrapLinks( function(error, links){
            if(global.running && !error){
                var list = [];
                for(var i=0;i<links.length;i++){
                    var found = false;
                    for(var j=0;j<global.runningList.length;j++){
                        if(links[i].options.url === global.runningList[j].options.url){
                            found = true;
                        }
                    }
                    if(!found){
                        list.push(links[i]);
                    }
                }
                global.runningList = global.runningList.concat(list);
                if(global.runningList > 40)
                    global.runningList = global.runningList.slice(global.runningList.length-40, global.runningList.length);

                _this.sendToServer(list);
            }
            else if(error)
                console.error(error);
        });
        if(!global.running)
            clearInterval(interval);
    }, linksTimeOut*1000);
};

lbcscraper.prototype.sendToServer = function(list){
    if(list.length){
        if(++servIndex === global.servList.length){
            servIndex = 0;
        }
        var serv = global.servList[servIndex];
        var ad = list[0];
        var client = requestJSON.newClient(serv.url);
        client.post('start', {}, function (err, res, body) {
            if (!err && body) {
                client.post('add', ad, function (err, res, body) {
                    if (!err && body) {
                        console.log('sent to : '+ serv.url);
                        var elem = list.shift();
                        elem.server = serv.url;
                        global.waitingList.push(elem);
                    }
                    else{
                        console.log('error sent to : '+ serv.url);
                    }
                    _this.sendToServer(list);
                });
            }
            else{
                global.servList[servIndex].stat = false;
                console.log('error sent to : '+ serv.url);
                _this.sendToServer(list);
            }
        });
    }
};

lbcscraper.prototype.scrapLinks = function(callback){
    request(options, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);
            var links = $('div.list-lbc').children('a');
            var list = [];
            for(var i = 0; i < links.length; i++){
                var a = links.eq(i);
                var urgent = false;
                if(a.children('div.urgent').text())
                    urgent = true;
                list.push({options:{
                    url: a.attr('href'),
                    port: 80,
                    method: 'GET'
                }, title: $('div.title').text().trim(), particulier: true, urgent: urgent});
            }
            callback(false, list);
        }
        else{
            console.error(error);
            callback(error, null);
        }
    });
};

module.exports = lbcscraper;
