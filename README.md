# ineter.js

Web scraping INETER map of earthquakes

## Installation

    npm install ineter

## Example
    
    var Ineter = require('ineter');
    
    var ineter = new Ineter();
    
    ineter.earthquakes( function( response ){
        console.log( response );
    });