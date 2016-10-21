var zip = require('./zip.js').zip;
if (zip === undefined) {
	zip = window.zip;
}
zip.workerScriptsPath = "/js/";

var requestFileSystem = window.webkitRequestFileSystem || window.mozRequestFileSystem || window.requestFileSystem;

function onerror(message) {
	alert(message);
}

function createTempFile(callback) {
	var tmpFilename = "tmp.dat";
	requestFileSystem(TEMPORARY, 4 * 1024 * 1024 * 1024, function(filesystem) {
		function create() {
			filesystem.root.getFile(tmpFilename, {
				create : true
			}, function(zipFile) {
				callback(zipFile);
			});
		}

		filesystem.root.getFile(tmpFilename, null, function(entry) {
			entry.remove(create, create);
		}, create);
	});
}

var model = (function() {
	var URL = window.webkitURL || window.mozURL || window.URL;

	return {
		getEntries : function(file, onend) {
			zip.createReader(new zip.BlobReader(file), function(zipReader) {
				zipReader.getEntries(onend);
			}, onerror);
		},
		
		getEntryFile : function(entry, creationMethod, onend, onprogress) {
			var writer, zipFileEntry;

			function getData() {
				entry.getData(writer, function(blob) {
					var blobURL = creationMethod == "Blob" ? URL.createObjectURL(blob) : zipFileEntry.toURL();
					onend(blobURL);
				}, onprogress);
			}

			if (creationMethod == "Blob") {
				writer = new zip.BlobWriter();
				getData();
			} else {
				createTempFile(function(fileEntry) {
					zipFileEntry = fileEntry;
					writer = new zip.FileWriter(zipFileEntry);
					getData();
				});
			}
		}
	};
})();

module.exports = model;
