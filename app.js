const instagrab = require('./modules/getAllPhoto.js');
const fb = require('./modules/getAllFb.js');
var readline = require('readline-sync');

var readline = require('readline-sync');

    console.log("=== Tool get all image === ")
    console.log("1. Get all image of instagram ")
    console.log("2. Get all image of facebook")
    
    var key = readline.question("Enter your choice : ");
        switch (key) {
            case '1':
                var username = readline.question("Username : ");
                instagrab.getAllPhoto(username);          
                break;
            case '2':
                var username = readline.question("IDFb : ");
                fb.getAllPhoto(username);
                break;    
            default:
                process.exit()
                break;
        }   