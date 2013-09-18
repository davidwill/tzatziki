/*
 * Dependencies
 */
var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    url = require('url'),
    path = require('path'),
    fs = require('fs'),
    util = require('util'),
    exec = require('child_process').exec,
    spawn = require('child_process').spawn;

/*
 * Server Config
 */
var host = "127.0.0.1",
    port = "8087",
    thisServerUrl = "http://" + host + ":" + port,
    mimeTypes = {
        "html": "text/html",
        "jpeg": "image/jpeg",
        "jpg": "image/jpeg",
        "png": "image/png",
        "js": "text/javascript",
        "Script": "text/javascript",
        "css": "text/css"};

/*
 * Tests
 */
var file_content = fs.readFileSync(__dirname + "/data/tests.json"),
    tests = JSON.parse(file_content);

/*
 * Handle File Requests
 */
function handler(req,res) {
    req.addListener('end', function(){});
    var uri = url.parse(req.url).pathname;
    var filename = path.join(process.cwd(), uri);
    if(filename.indexOf('/results/') > -1){
        var result = true;
    }
    res.writeHead(200, {'Content-Type': 'text/plain'});
    fs.exists(filename, function(exists) {
        if(!exists) {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write('404 Not Found\n');
            res.end();
            return;
        }
        var mimeType = mimeTypes[path.extname(filename).split(".")[1]];
        res.writeHead(200, mimeType);
        var fileStream = fs.createReadStream(filename);
        if(result){
            fs.readFile(filename, 'utf-8', function(err, data){
                if(err) fileStream.pipe(res);
                var arg = filename.replace(__dirname+'/app/results/', '');
                arg = arg.replace('.html','');
                if(data.indexOf("Testing App:") > -1){
                    exec('../scripts/editResult.sh '+arg, function(err,stdout){
                        if(err)console.log("ERR: "+err);
                        else{
                            fileStream = fs.createReadStream(filename);
                            console.log("Edited file! "+arg+" "+stdout);
                            fileStream.pipe(res);
                        }
                    });
                }else{
                    fileStream.pipe(res);
                }
            });
        }else{
            fileStream.pipe(res);
        }
    });
}

/*
 * Handle Web Socket Requests
 */
io.sockets.on('connection', function (socket) {

    /*
     * Handles the client's request for available tests
     */
    socket.on('fetchTests', function(){
        // Finds out which tests have results available
        fs.readdir(__dirname + '/app/results', function(err, list){
            if(err) return console.log(err);
            for(test in list){
                var pieces = list[test].split('.');
                if(tests.tests[pieces[0]]){
                    tests.tests[pieces[0]].results = true;
                }
            }
            fs.writeFile(__dirname + "/data/tests.json", JSON.stringify(tests));
            io.sockets.emit('returnTests', tests.tests);
        });
    });

    /*
     * Tells the client which environment is currently configured to be tested
     */
    socket.on('fetchEnv', function(envs){
        fs.readFile(__dirname+'/cucumber/features/support/env.rb', 'utf-8', function(err, data){
            if(err) return console.log(err);
            var newEnvs = [];
            for(env in envs){
                if(data.indexOf("jenkins."+envs[env].env) > -1){
                    envs[env].active = "active";
                }
                newEnvs.push(envs[env]);
            }
            socket.emit('returnEnv', newEnvs);
        });
    });

    /*
     * Handles the client's request to change which environment is being tested
     */
    socket.on('switchEnv', function(obj){
        var newEnv = obj.new, envs = obj.envs;
        var oldEnv = "", newEnvs = [];
        for(env in envs){
            if(envs[env].active == "active"){
                if(envs[env].env == newEnv) return;
                envs[env].active = "";
                oldEnv = envs[env].env;
            }else if(envs[env].env == newEnv){
                envs[env].active = "active";
            }
            newEnvs.push(envs[env]);
        }
        var codeToExecute = '../scripts/editEnv.sh '+oldEnv+" "+newEnv;
        exec(codeToExecute, function(err){
            if(err) return console.log(err);
            socket.emit('returnEnv', newEnvs);
        });
    });

    /*
     * Handles the client's request to run a test
     */
    socket.on('runTest', function(test){
        tests.tests[test].running = true;
        fs.writeFile(__dirname + "/data/tests.json", JSON.stringify(tests));
        // Spawn a child process to track progress of test
        var pwd = spawn('../scripts/runProgressTest.sh', [test]);
        pwd.stdout.on('data', function(data){
            if(tests.tests[test].running == true){
                // These regular expressions pull out the percentage of completion,
                var regex1 = new RegExp('=+\\s(\\d+)\\s=+');
                // the number of tests ran out of total test count,
                var regex2 = new RegExp('(\\d+\\/\\d+)');
                // and the time remaining
                var regex3 = new RegExp('(ETA:\\s\\d\\d:\\d\\d:\\d\\d)');
                var m1 = data.toString('ascii').match(regex1);
                var m2 = data.toString('ascii').match(regex2);
                var m3 = data.toString('ascii').match(regex3);
                // only update tests if the output contains what we're looking for
                if(m1 && m2 && m3){
                    tests.tests[test].progress = m1[1];
                    tests.tests[test].total = m2[1];
                    tests.tests[test].eta = m3[1];
                    fs.writeFile(__dirname + "/data/tests.json", JSON.stringify(tests));
                    io.sockets.emit('returnTests', tests.tests);
                }
            }
        });
        pwd.stderr.on('data', function(data){
            io.sockets.emit('output', {test: test, error: data.toString('ascii')});
        });
        // Execute a child process to generate html formatted results
        exec('../scripts/runTest.sh '+test,function(err,stdout){
            if(err) return console.log("ERR: "+err+"\nOUT: "+stdout);
            tests.tests[test].progress = null;
            tests.tests[test].total = null;
            tests.tests[test].eta = null;
            tests.tests[test].running = false;
            tests.tests[test].results = true;
            fs.writeFile(__dirname + "/data/tests.json", JSON.stringify(tests));
            io.sockets.emit('returnTests', tests.tests);
        });
    });
});

/*
 * Start Server
 */
app.listen(port, host);
console.log('Server running at '+thisServerUrl);
