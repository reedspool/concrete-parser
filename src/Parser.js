// Preamble


// [[file:../literate/Parser.org::*Preamble][Preamble:1]]
import { interpret } from "xstate";
import { stream, streamFile } from "./CharacterStream";
import * as LexMachine from "./LexMachine.js";
import * as ParseMachine from "./ParseMachine.js";
import { InvertedPromise as Promise } from "inverted-promise";
// Preamble:1 ends here

// Parse File

// To parse a file, the procedure is as follows:


// [[file:../literate/Parser.org::*Parse File][Parse File:1]]
export const parseFile = async (source) => {
// Parse File:1 ends here



// The result will be a promise, which resolves later:


// [[file:../literate/Parser.org::*Parse File][Parse File:2]]
    const resultPromise = Promise();
// Parse File:2 ends here



// Instantiate the lexing and parsing machine interpreters which will form a pipeline.


// [[file:../literate/Parser.org::*Parse File][Parse File:3]]
    const lexInterpreter = interpret(LexMachine.init());
    const parseInterpreter = interpret(ParseMachine.init());
// Parse File:3 ends here



// Immediately start both interpreters.


// [[file:../literate/Parser.org::*Parse File][Parse File:4]]
    lexInterpreter.start();
    parseInterpreter.start();
// Parse File:4 ends here



// Now before sending anything, chain them together. First, when lexing finishes, send each token to the parser, in order. The tokens already have the shape of an XState event.

// After we send the last token, send a "DONE" event to signal completion. There is no way to know from the tokens themselves that it's got all of them.


// [[file:../literate/Parser.org::*Parse File][Parse File:5]]
    lexInterpreter.onDone(({ data }) => {
        data.forEach(token =>
            parseInterpreter.send(token));
        parseInterpreter.send("DONE");
    });
// Parse File:5 ends here



// When the parser is complete, we're all done. Stop both interpreters and fulfill the result promise.


// [[file:../literate/Parser.org::*Parse File][Parse File:6]]
    parseInterpreter.onDone(({ data }) => {
        lexInterpreter.stop();
        parseInterpreter.stop();
        resultPromise.resolve(data);
    });
// Parse File:6 ends here



// Now we're ready to start the pipeline. It begins with a stream of character events sent to the lexer.


// [[file:../literate/Parser.org::*Parse File][Parse File:7]]
    streamFile(source, (event) => lexInterpreter.send(event));
// Parse File:7 ends here



// Return the produced tree, and that's it!


// [[file:../literate/Parser.org::*Parse File][Parse File:8]]
    return resultPromise;
}
// Parse File:8 ends here
