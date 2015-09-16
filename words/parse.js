
// Configuration.
var MAX = 20000;
var MODES = [
	{ name: 'easy', min: 4, max: 6},
	{ name: 'normal', min: 7, max: 9},
	{ name: 'hard', min: 10, max: 12}
];

// Require and initialize dependencies.
var fs  = require("fs");
var readline = require('readline');

// Define function for do all the work.
function readAndParseDictionaty(filename, callback) {
	// Try to open the file.
	fs.readFile(filename, 'utf8', function(err, f){
		// Verify if the file was open.
		if(err == null) {
			// Get the lines of the file.
			var array = f.toString().replace(/\r/g, '').split('\n');
			console.log("The file contains: " + array.length + " words");
			
			// Generate files for each difficulty.
			MODES.forEach(function(mode) {
				// Count the number of words in the mode.
				var count = 0;
				array.forEach(function(entry) {
					if(entry.length >= mode.min && entry.length <= mode.max) { 
						count++; 
					}
				});
				
				// Get words.
				var res = [];
				array.forEach(function(entry) {
					if(entry.length >= mode.min && entry.length <= mode.max && (count < MAX || Math.random() < MAX/count)) { 
						res.push(entry);
					}
				});
				
				// Create JSON file.
				var jsonName = filename.replace(".dic", "") + "_" + mode.name
				fs.writeFile(jsonName + ".js", "var " + jsonName + " = " + JSON.stringify(res) + ";", 'utf8');
				console.log("The file '" + jsonName + ".json' was created with " + res.length + " words inside");
			});
		} else {
			// Show error message.
			console.log("The file could not be opened");
			console.log(err);
		}
		
		// Invoke return callback.
		if(callback != null) {
			callback();
		}
	});	
};

// Verify if the user entered the file name.
if(process.argv.length > 2) {
	readAndParseDictionaty(process.argv[2]);
} else {
	// Ask for the name of the dictionary's file.
	var rl = readline.createInterface({ input: process.stdin, output: process.stdout });
	rl.question("Enter the name of the file to parse: ", function(input) {
		readAndParseDictionaty(input, function() {
			rl.close();
		});
	});	
}
