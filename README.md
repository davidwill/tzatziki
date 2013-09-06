#Tzatziki

## Requirements

To run the server you'll need to have node installed. Go [here] (http://nodejs.org/dist/v0.10.18/node-v0.10.18.pkg) for
the mac installer. And [here] (http://nodejs.org/dist/v0.10.18/node-v0.10.18-x86.msi) for the windows installer.

After installation, type ```bash node --help ``` in a terminal to verify that the installation was successful.

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

## Running the app

### Start the server

Navigate to Tzatziki/app/ and run the following command

```bash

node ../node-server.js

```

You should see the following output:

```bash

Server running at http://127.0.0.1:8087

```

## Trevor's Mom

Is a ho