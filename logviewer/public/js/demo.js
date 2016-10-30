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
		},

		getEntryData: function(entry) {
			return new Promise((resolve, reject) => {
				entry.getData(new zip.TextWriter(), data => {
					resolve(data);
				});
			});
		},

		unzipLogs: function(blob, callback) {
			return new Promise((resolve, reject) => { 
				zip.createReader(new zip.BlobReader(blob), zipReader=> {
					zipReader.getEntries(entries => {
						let arr = entries.filter(entry => {
							return /jabber\.log/.exec(entry.filename) != null;
						});
						arr.sort((a,b) => {
							if (a.filename < b.filename)
								return 1;
							if (a.filename > b.filename)
								return -1;
							return 0;
						});

						let pArr = [];
						arr.forEach(entry => {
							pArr.push(this.getEntryData(entry));
						});

						let t0 = performance.now();
						console.log('start unzip');
						Promise.all(pArr).then(textArr => {
							let t1 = performance.now();
							console.log(`end unzip. It took ${t1-t0} milliseconds.`);
							
							zipReader.close();
							let data = textArr.join('');
							textArr = null;
							resolve(data);
						});
					});
				}, err => reject(err));
			});
		},

		unzipDeviceInfo: function(blob, callback) {
			return new Promise((resolve, reject) => {
				zip.createReader(new zip.BlobReader(blob), zipReader=> {
					zipReader.getEntries(entries => {
						let re = /deviceinfo.txt|UserPRData.plist|metadata.txt/;
						let arr = entries.filter(entry => {
							return re.exec(entry.filename) != null;
						});

						if (arr.length == 0) {
							resolve("Failed to get the deviceinfo.");
						} else {
							this.getEntryData(arr[0]).then(info => {
								zipReader.close();
								resolve(info);
							});
						}
					});
				}, err => reject(err));
			});
		}
	};
})();

module.exports = model;
