
// Require and initialize dependencies.
var fs  = require("fs");
var readline = require('readline');

// Define function for do all the work.
function generateStats(filename, callback) {
	// Try to open file.
	fs.readFile(filename, function(err, f){
		// Verify if the file was open.
		if(err == null) {
			// Get the lines of the file.
			var array = f.toString().split('\n');
			console.log("The file contains: " + array.length + " words");
			
			// Count the length of all words.
			var res = {};
			for(var i=0; i<array.length; i++) {
				var len = array[i].length;
				if(res[len] == null) {
					res[len] = 1;
				} else {
					res[len]++;
				}
			}
			
			// Display results.
			for (var key in res) {
				if (res.hasOwnProperty(key)) {
					console.log("- Words with length " + key + ": " + res[key]);
				}
			}
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
	generateStats(process.argv[2]);
} else {
	// Ask for the name of the dictionary's file.
	var rl = readline.createInterface({ input: process.stdin, output: process.stdout });
	rl.question("Enter the name of the file to parse: ", function(input) {
		generateStats(input, function() {
			rl.close();
		});
	});	
}
