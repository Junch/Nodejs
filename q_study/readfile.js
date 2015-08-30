// http://www.chenqing.org/2014/05/use-q-js-to-promise-in-node.html
// 【nodejs】利用q.js实现node 常用api的promise化

var FS = require('fs'),
    Q  = require('q'),
    colors = require('colors'),
    file = 'example.txt';

var encoding = 'utf8';

// Use Q.nfcall
var fsReadFile = Q.nfcall(FS.readFile, file, encoding);
fsReadFile.then (function (result){
    console.log(("invoke in nfcall" + file).red);
    console.log(result.green);
}, function(error){
    console.log("invoke in nfcall".red);
    console.log(error.toString().red);
});

// Use Q.denodeify
var fsReadFile_denodeify = Q.denodeify(FS.readFile);
fsReadFile_denodeify(file,encoding).then(function(result){
    console.log("invoke in denodeify".red);
    console.log(result.green)
}, function(error){
    console.log("invoke in denodeify".red);
    console.log(error.toString().red);
});

// use Q.defer
var fsReadFile_deferd = function(file,encoding){
    var deferred = Q.defer();
    FS.readFile(file,encoding,function(error,result){
        if(error){
            deferred.reject(error.toString().red);
        }
        deferred.resolve(result);
    });
 
    return deferred.promise;
};
 
fsReadFile_deferd(file).then(function(result){
    console.log("invoke in deferd".red);
    console.log(result.toString().green);
},function(error){
    console.log("invoke in deferd".red);
    console.log(error.toString().red);
});

// makeNodeResolver()
var fsReadFile_makeNodeResolver = function(file,encoding){
    var deferred = Q.defer();
    FS.readFile(file, encoding, deferred.makeNodeResolver());
    return deferred.promise;
};
 
fsReadFile_makeNodeResolver(file, encoding).then(function(result){
    console.log("invoke in makeNodeResolver".red);
    console.log(result.green);
},function(error){
    console.log("invoke in makeNodeResolver".red);
    console.log(error.toString().red);
});
