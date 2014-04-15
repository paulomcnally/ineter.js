var crypto = require('crypto');
var request = require('request');
var php = require('phpjs');
var S = require('string');

var url = 'http://webserver2.ineter.gob.ni/geofisica/sis/events/sismos.php';

var Ineter = function(){}

Ineter.prototype.earthquakes = function( callback ){

    var items = [];

    request( url, function (error, response, body) {

        if( error ){
            callback(items);
        }
        else{

            if( response.statusCode != 200 ){
                callback(items);
            }
            else{
                var lines = body.match(/<PRE>(.*)<\/PRE>/g);

                lines.forEach( function( item ){

                    var obj = {};

                    obj.id = crypto.createHash('md5').update( item ).digest('hex');
                    obj.date = S( item.match(/(\d{2}\/\d{2}\/\d{2})/g)[0] ).trim().s;
                    obj.time = S( item.match(/(\d{2}:\d{2}:\d{2})/g)[0] ).trim().s;
                    obj.latitude = S( S( item.match(/(\d{2}.\d{2})N/g)[0] ).trim().s  ).replaceAll('N','').s;
                    obj.longitude = S( S( item.match(/(\d{2}.\d{2})W/g)[0] ).trim().s ).replaceAll('W','').s;
                    obj.magnitude = S( S( item.match(/(\d{1}.\d{1})[ML|MC]/g)[0] ).trim().s).replaceAll('M','').s;
                    obj.depth = S( item.match(/\s(\d{1,}.\d{1})\s/g)[0] ).trim().s;
                    obj.place = S( S( S( item.match(/[ML|MC]\s{1,}(.*)<\/PRE>/g) ).replaceAll('</PRE>', '').s ).replaceAll('C  ', '').s ).replaceAll('L  ', '').s;

                    items.push( obj );

                });

                callback( items );

            }

        }
    });

}

module.exports = Ineter;