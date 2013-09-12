/*
 * Dependencies
 */
var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    url = require('url'),
    path = require('path'),
    fs = require('fs'),
    util = require('util'),
    exec = require('child_process').exec;

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
                            if(data.indexOf("Using local AWS") > -1){
                                exec('../scripts/oneMoreLine.sh '+arg, function(err,stdout){
                                    if(err)console.log("ERR: "+err);
                                    else{
                                        fileStream = fs.createReadStream(filename);
                                        console.log("Edited file again! "+arg+" "+stdout);
                                        fileStream.pipe(res);
                                    }
                                });
                            }else{
                                fileStream = fs.createReadStream(filename);
                                console.log("Edited file! "+arg+" "+stdout);
                                fileStream.pipe(res);
                            }
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
    socket.on('fetchCompleted', function(){
        fs.readdir(__dirname + '/app/results', function(err, list){
            if(err) return console.log(err);
            socket.emit('returnTests', list);
        });
    });
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
    socket.on('runTest', function(cmd){
        console.log("command recieved: "+cmd);
        exec('../scripts/runTest.sh '+cmd,function(err,stdout){
            if(err) return console.log(err);
            console.log("Test finished for "+cmd+": "+stdout);
            socket.emit('finishedTest', {test: cmd});
        });
    });
});

/*
 * Start Server
 */
app.listen(port, host);
console.log('Server running at '+thisServerUrl);