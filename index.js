var spsave = require('spsave'),
	gutil = require('gulp-util'),
	PluginError = gutil.PluginError,
	path = require("path"),
	through = require("through2"),
	extend = require('util')._extend;

var PLUGIN_NAME = 'gulp-spsave';
var indexer = 0;

function gulpspsave(options) {
	if (!options) {
		throw new PluginError(PLUGIN_NAME, 'Missing options');
	}

	return through.obj(function (file, enc, cb) {
		var self = this;

		if (file.isNull()) {
			cb();
			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
			return;
		}

		if (file.isBuffer()) {
			if(typeof options.flatten !== "boolean"){
				options.flatten = true;
			}
			var newOptions = extend({}, options);
			newOptions.fileName = path.basename(file.path);
			if (!options.flatten){
				var relative = path.relative(file.base, file.path);
				var addFolder = relative.replace(newOptions.fileName, "");
				var destFolder = path.join(options.folder, addFolder).replace(/\\/g, '/');
				newOptions.folder = destFolder;
			}
			newOptions.fileContent = file.contents;
			// var self = this;
			// console.log(indexer++ + ' ' + file.path);
			spsave(newOptions, function (err, data) {
				if (err) {
					console.log(err);
					cb(new gutil.PluginError(PLUGIN_NAME, err.message));
					return;
				}
				self.push(file);
				cb();
			});
		}
	},
	function(cb) {
		cb();
	});
}

module.exports = gulpspsave;
