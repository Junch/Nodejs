
var async = require("async");

// Run the tasks array of functions in parallel, without waiting until the previous function has completed. If any of the
// functions pass an error to its callback, the main callback is immediately called with the value of the error. Once the
// tasks have completed, the results are passed to the final callback as an array.
async.parallel({

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
