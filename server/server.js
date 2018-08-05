/**
 * Leaderboards server
 * @author Jani Nykänen
 */

// Import libraries
var http = require("http");
var url = require("url");
var fs = require("fs");

// Constants
const SCORE_PATH = "scores";
const SCORE_MAX = 15;
const PORT = process.env.PORT ||  80;


// Score entry type
var Entry = function(name, score)  {

    this.score = score;
    this.name = name;
}

// Get entry as a string
Entry.prototype.get_string = function() {

    return this.name + "|" + String(this.score);
}


// Clone
Entry.prototype.clone = function() {

    return new Entry(this.name, this.score);
}


// Entries
var entries = [];
for(var i = 0; i < SCORE_MAX; ++ i) {

    entries[i] = new Entry("Default", 0);
}


// Print entries
function print_entries() {

    let out = "";

    // Print entries
    for(var i = 0; i < SCORE_MAX; ++ i) {

        out += entries[i].get_string();
        if(i < SCORE_MAX-1)
            out += "|";
    }

    return out;
}


// Add a new entry
function add_entry(name, score) {

    let s = parseInt(score);

    // If too low a score, do not even bother
    if(s < entries[SCORE_MAX -1].score) return;

    // Add to a buffer
    let buffer = [];
    for(var i = 0; i < SCORE_MAX; ++ i) {

        buffer[i] = entries[i].clone();
    }
    buffer[SCORE_MAX] = new Entry(name, s);

    // Sort buffer
    let newBuffer = [];
    let indexTaken = [];
    for(var i = 0; i < SCORE_MAX +1; ++ i)
        indexTaken[i] = false;

    let max = buffer[0].score;
    let maxIndex = 0;

    for(var count = 0; count < SCORE_MAX; ++ count) {

        max = -1;
        maxIndex = -1;

        for(var i = 0; i < buffer.length; ++ i) {

            if(!indexTaken[i] && buffer[i].score > max) {

                maxIndex = i;
                max = buffer[i].score;
            }
        }
        newBuffer[count] = buffer[maxIndex].clone();
        indexTaken[maxIndex] = true;
    }

    // Copy back to original entry array
    for(var i = 0; i < SCORE_MAX; ++ i) {

        entries[i] = newBuffer[i].clone();
    }
}


// Parse params
function parse_params(q) {

    // Get scores
    if(q.get && q.get == "true") {

        // Read scores
        read_scores(SCORE_PATH);

        // Print entries
        return print_entries();

    } 
    // Add score
    else if(q.add && q.add == "true" 
        && q.name && q.score) {

        // Read scores
        read_scores(SCORE_PATH);

        // Add score
        add_entry(q.name, q.score);

        // Write new score to the file
        write_scores(SCORE_PATH);

        // Print entries
        return print_entries();
    }
}


// Read scores
function read_scores(path) {

    // Read file & get content
    try {
        var data = fs.readFileSync(path);
        var content = String(data).split('\n');
    }
    catch(e) {

        console.log("Error reading a file: " + e.message);
        console.log("Using defaults...");
        return;
    }
    
    // Add entries
    for(var i = 0; i < content.length; i += 2) {

        entries[i / 2] = new Entry(content[i], parseInt(content[i+1]));
    }

}


// Write scores
function write_scores(path) {

    let out = "";
    for(var i = 0; i < SCORE_MAX; ++ i) {

        out += entries[i].name;
        out += "\n";
        out += String(entries[i].score);
        
        if(i < SCORE_MAX-1)
            out += "\n";
    }

    fs.writeFileSync(path, out);
}


// Request handler
var req_handler = function(req, res) {

    // Parse params
    var q = url.parse(req.url, true).query;

    // Read scores
    read_scores(SCORE_PATH);

    // Parse params
    let content = parse_params(q);

    // Put data to the html document
    res.writeHead(200, {
        'Content-Type': 'text/plain',
    });

    // Pass content
    res.end(content);

};


// Create a server
const server = http.createServer(req_handler);

// Listen
server.listen(PORT, (err) => {
    
    if(err) {

        return console.log("A fatal error occurred: ", err);
    }
    console.log("Server is listening on port " + String(PORT) +  "...");
})
