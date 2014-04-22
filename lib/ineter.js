var crypto = require('crypto');
var request = require('request');

var url = 'http://webserver2.ineter.gob.ni/geofisica/sis/events/nicaragua.local';

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
                var lines = body.split('\r\n');

                lines.pop();

                var regEx = /(\d{2}\/\d{2}\/\d{2})\s{1,}(\d{2}:\d{2}:\d{2})\s{1,}(\d{1,}.\d{1,}[A-Z]{1})\s{1,}(\d{1,}.\d{1,}[A-Z]{1})\s{1,}(\d{1,}.\d{1,})\s{1,}(\d{1,}.\d{1,}[A-Z]{2})\s{1,}(.*)/g;

                lines.forEach( function( line ){

                    var parseLine = line.replace( regEx, "$1|$2|$3|$4|$5|$6|$7" );

                    var parts = parseLine.split( "|" );

                    var obj = {};

                    obj.id = crypto.createHash( 'md5' ).update( line ).digest( 'hex' );
                    obj.date = parts[0];
                    obj.time = parts[1];
                    obj.latitude = parts[2];
                    obj.longitude = parts[3]
                    obj.magnitude = parts[4];
                    obj.depth = parts[5];
                    obj.place = parts[6].replace(/(^\s*|\s*$)/g, '');

                    items.push( obj );

                });

                callback( items );

            }

        }
    });

}

module.exports = Ineter;