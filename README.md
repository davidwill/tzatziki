#Tzatziki

A web app for executing cucumber tests

## Requirements

### Node

The application runs on a node server.

To run the server, you'll need to have node.js installed.

Go [here] (http://nodejs.org) and follow the install instructions.

Go [here] (http://nodejs.org/dist/v0.10.18/node-v0.10.18.pkg) for
the mac installer. And [here] (http://nodejs.org/dist/v0.10.18/node-v0.10.18-x86.msi) for the windows installer.

After installation, type ``` node --help ``` in a terminal to verify a successful installation.

You should see an output similar to this:

```bash
Usage: node [options] [ -e script | script.js ] [arguments]
       node debug script.js [arguments]

Options:
  -v, --version        print node's version
  -e, --eval script    evaluate script
  -p, --print          evaluate script and print result
  -i, --interactive    always enter the REPL even if stdin
                       does not appear to be a terminal
  --no-deprecation     silence deprecation warnings
  --trace-deprecation  show stack traces on deprecations
  --v8-options         print v8 command line options
  --max-stack-size=val set max v8 stack size (bytes)

Environment variables:
NODE_PATH              ':'-separated list of directories
                       prefixed to the module search path.
NODE_MODULE_CONTEXTS   Set to 1 to load modules in their own
                       global contexts.
NODE_DISABLE_COLORS    Set to 1 to disable colors in the REPL

Documentation can be found at http://nodejs.org/
```

### Node Package Manager

To install necessary node modules, you'll need to have ``` npm ```

To install npm in one command, do this
```bash
curl http://npmjs.org/install.sh | sh
```

### Node Modules

The server and application require a set of modules to be installed. Once you have ``` npm ``` installed, you can
install the modules using the ``` npm install {module name} ``` command

### Cucumber test directory

You'll need to clone ithaka's cucumber test repo into tzatziki/cucumber/
You can do so by running the following command in the app's root directory

```bash
git clone https://github.com/ithaka/cucumber.git
```

## Running the app

### Start the server

Navigate to tzatziki/app/ and run the following command

```bash
node ../node-server.js
```

You should see the following output:

```bash
Server running at http://127.0.0.1:8087
```

You can then go [here] (http://127.0.0.1:8087/index.html) to view the app.
