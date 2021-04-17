// Preamble


// [[file:../literate/ParseMachineTests.org::*Preamble][Preamble:1]]
import * as ParseMachine from "../src/ParseMachine.js";
import { Machine, interpret } from "xstate";
import { Token } from "../src/LexicalToken";
import { InvertedPromise as Promise } from "../src/InvertedPromise";
import { AbstractSyntaxTree } from "../src/AbstractSyntaxTree"
import { TestInterpreter, toMatchState } from "xstate-jest-tools";
expect.extend({ toMatchState });

const parseMachine =
    Machine(ParseMachine.definition)
        .withConfig(ParseMachine.config)
        // Supply empty context to avoid warning
        .withContext({});

let interpreter;
let tree;

beforeEach(() => {
    tree = AbstractSyntaxTree();
    interpreter = TestInterpreter(parseMachine);
})
// Preamble:1 ends here

// Simple
// Start with the simplest test:


// [[file:../literate/ParseMachineTests.org::*Simple][Simple:1]]
it("Starts empty", () => {
    expect(interpreter.S).toMatchState("ready");
    expect(interpreter.C.tree).toEqual(AbstractSyntaxTree());
})
// Simple:1 ends here



// Now let's send  the simplest case, the blank block, =_=.


// [[file:../literate/ParseMachineTests.org::*Simple][Simple:2]]
it("Parses just a blank", () => {
    tree.addToCurrentTape(Token.Blank.factory());
    
    interpreter.send(Token.Blank.factory());
    interpreter.send("DONE");

    expect(interpreter.S).toMatchState("done");
    expect(interpreter.C.tree).toEqual(
        tree)
})
// Simple:2 ends here

// XState Interpreter =onDone()=

// The machine should reach a final state if the input comes from =streamFile=.


// [[file:../literate/ParseMachineTests.org::*XState Interpreter =onDone()=][XState Interpreter =onDone()=:1]]
it("XState interpreter onDone called successfully on empty file", async () => {
    const interpreter = interpret(parseMachine);
    const promise = Promise();

    interpreter.onDone(({ data }) => promise.resolve(data));
    interpreter.start();

    interpreter.send("DONE");
    expect(await promise).toEqual(tree);
    interpreter.stop();
})
// XState Interpreter =onDone()=:1 ends here

// [[file:../literate/ParseMachineTests.org::*XState Interpreter =onDone()=][XState Interpreter =onDone()=:2]]
it("XState interpreter onDone called successfully on non-empty file", async () => {
    const interpreter = interpret(parseMachine);
    const promise = Promise();
    
    tree.addToCurrentTape(Token.Number.factory("3"));

    interpreter.onDone(({ data }) => promise.resolve(data));
    interpreter.start();

    interpreter.send(Token.Number.factory("3"));
    interpreter.send("DONE");
    expect(await promise).toEqual(tree);
    interpreter.stop();
})
// XState Interpreter =onDone()=:2 ends here
