var Ineter = require('../lib/ineter');
var ineter = new Ineter();

ineter.earthquakes(function(response) {
  console.log(JSON.stringify(response, null, 2));
});
