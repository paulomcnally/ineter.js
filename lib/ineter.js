var crypto = require('crypto');
var request = require('request');

var url = 'http://webserver2.ineter.gob.ni/geofisica/sis/events/nicaragua.local';

var Ineter = function(){}

Ineter.prototype.earthquakes = function( callback ){

    var items = [];
    request.get({ url:url, encoding:'binary' }, function (error, response, body) {

        if( error ){
            callback(items);
        }
        else{

            if( response.statusCode != 200 ){
                callback(items);
            }
            else{
                var lines = body.trim().split(/\r?\n/);

                lines.pop();

                var regEx = /(\d{2}\/\d{2}\/\d{2})\s{1,}(\d{2}:\d{2}:\d{2})\s{1,}(\d{1,}.\d{1,}[A-Z]{1})\s{1,}(\d{1,}.\d{1,}[A-Z]{1})\s{1,}(\d{1,}.\d{1,})\s{1,}(\d{1,}.\d{1,}[A-Z]{2})\s{1,}(.*)/g;

                lines.forEach( function( line ){

                    var parseLine = line.replace( regEx, "$1|$2|$3|$4|$5KM|$6|$7" );

                    var parts = parseLine.split( "|" );

                    var obj = {
                        "id": crypto.createHash( 'md5' ).update( line ).digest( 'hex'),
                        "date": parts[0].replace(/(\d{2})\/(\d{2})\/(\d{2})/, "$3/$2/$1"),
                        "time": parts[1],
                        "latitude": parts[2],
                        "longitude": parts[3],
                        "depth": parts[4],
                        "magnitude": parts[5],
                        "place": parts[6].trim()
                    }

                    items.push( obj );

                });

                callback( items );

            }

        }
    });

}

module.exports = Ineter;