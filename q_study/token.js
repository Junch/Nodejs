var Q = require('q');

// http://stackoverflow.com/questions/21999148/not-quite-understanding-the-q-promise-library
// http://stackoverflow.com/questions/22519784/how-do-i-convert-an-existing-callback-api-to-promises?rq=1

function token() {
  var deferred = Q.defer();
  require('crypto').randomBytes(34, function(ex, buf){
    // reject it if there was an exception!
    if (ex) {
      return deferred.reject(ex);
    }

    // resolve it with the correct string value
    var token = buf.toString('hex');
    deferred.resolve(token);
  });

  return deferred.promise;
}

Q.fcall(token).then(function(t) {
  console.log("here " + t);
});
