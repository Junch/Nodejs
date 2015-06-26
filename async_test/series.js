
var async = require("async");

// Run the functions in the tasks array in series, each one running once the previous function has completed. If any
// functions in the series pass an error to its callback, no more functions are run, and callback is immediately called
// with the value of the error. Otherwise, callback receives an array of results when tasks have completed.
async.series({

    numbers: function (callback) {
        setTimeout(function () {
            callback(null, [ 1, 2, 3 ]);
        }, 1500);
    },
    strings: function (callback) {
        setTimeout(function () {
            callback(null, [ "a", "b", "c" ]);
        }, 2000);
    }
},
function (err, results) {
    console.log(results);
});
