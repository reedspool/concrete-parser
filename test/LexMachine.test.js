// Preamble


// [[file:../literate/LexMachineTests.org::*Preamble][Preamble:1]]
import * as LexMachine from "../src/LexMachine.js";
import { Token } from "../src/LexicalToken";
import { interpret, Machine } from "xstate";
import { InvertedPromise as Promise } from "../src/InvertedPromise";
import { TestInterpreter, toMatchState } from "xstate-jest-tools";
import { streamFile } from "../src/CharacterStream";
expect.extend({ toMatchState });

const lexMachine =
    Machine(LexMachine.definition)
        .withConfig(LexMachine.config)
        // Supply empty context to avoid warning
        .withContext({});

let interpreter;

const streamFileCallback = (event) => {
    interpreter.send(event);
}

beforeEach(() => {
    interpreter = TestInterpreter(lexMachine);
})
// Preamble:1 ends here

// Basic
// Start with the simplest test:


// [[file:../literate/LexMachineTests.org::*Basic][Basic:1]]
it("Starts empty", () => {
    expect(interpreter.S).toMatchState("none");
})
// Basic:1 ends here

// Blank


// [[file:../literate/LexMachineTests.org::*Blank][Blank:1]]
it("Tokenizes just a blank", () => {
    streamFile("_", streamFileCallback);
    expect(interpreter.S).toMatchState("done");
    expect(interpreter.C.tokens).toEqual(
        [ Token.Blank.factory() ]);
})
// Blank:1 ends here

// Value Identifier

// Okay what about a complete identifier?


// [[file:../literate/LexMachineTests.org::*Value Identifier][Value Identifier:1]]
it("Lexes a simple alphabetic ValueIdentifier", () => {
    streamFile("abc", streamFileCallback);
    expect(interpreter.S).toMatchState("done");
    expect(interpreter.C.tokens).toEqual(
        [ Token.ValueIdentifier.factory("abc") ]);
})
// Value Identifier:1 ends here



// Okay what about more complex identifiers


// [[file:../literate/LexMachineTests.org::*Value Identifier][Value Identifier:2]]
it("Lexes a complex mixed ValueIdentifier", () => {
    streamFile("a0_z", streamFileCallback);
    expect(interpreter.S).toMatchState("done");
    expect(interpreter.C.tokens).toEqual(
        [ Token.ValueIdentifier.factory("a0_z") ]);
})
// Value Identifier:2 ends here

// Address Identifier

// Okay what about a complete identifier?


// [[file:../literate/LexMachineTests.org::*Address Identifier][Address Identifier:1]]
it("Lexes a simple alphabetic AddressIdentifier", () => {
    streamFile("@abc", streamFileCallback);
    expect(interpreter.S).toMatchState("done");
    expect(interpreter.C.tokens).toEqual(
        [ Token.AddressIdentifier.factory("@abc") ]);
})
// Address Identifier:1 ends here



// Okay what about more complex identifiers


// [[file:../literate/LexMachineTests.org::*Address Identifier][Address Identifier:2]]
it("Lexes a complex mixed AddressIdentifier", () => {
    streamFile("@a0_z", streamFileCallback);
    expect(interpreter.S).toMatchState("done");
    expect(interpreter.C.tokens).toEqual(
        [ Token.AddressIdentifier.factory("@a0_z") ]);
})
// Address Identifier:2 ends here

// Label Identifiers


// [[file:../literate/LexMachineTests.org::*Label Identifiers][Label Identifiers:1]]
it("Lexes a simple alphabetic LabelIdentifier", () => {
    streamFile("abc:", streamFileCallback);
    expect(interpreter.S).toMatchState("done");
    expect(interpreter.C.tokens).toEqual(
        [ Token.LabelIdentifier.factory("abc:") ]);
})
// Label Identifiers:1 ends here



// Okay what about more complex identifiers


// [[file:../literate/LexMachineTests.org::*Label Identifiers][Label Identifiers:2]]
it("Lexes a complex mixed LabelIdentifier", () => {
    streamFile("a0_z:", streamFileCallback);
    expect(interpreter.S).toMatchState("done");
    expect(interpreter.C.tokens).toEqual(
        [ Token.LabelIdentifier.factory("a0_z:") ]);
})
// Label Identifiers:2 ends here

// Call Identifiers


// [[file:../literate/LexMachineTests.org::*Call Identifiers][Call Identifiers:1]]
it("Lexes a simple alphabetic CallIdentifier", () => {
    streamFile("abc!", streamFileCallback);
    expect(interpreter.S).toMatchState("done");
    expect(interpreter.C.tokens).toEqual(
        [ Token.CallIdentifier.factory("abc!") ]);
})
// Call Identifiers:1 ends here



// Okay what about more complex identifiers


// [[file:../literate/LexMachineTests.org::*Call Identifiers][Call Identifiers:2]]
it("Lexes a complex mixed CallIdentifier", () => {
    streamFile("a0_z!", streamFileCallback);
    expect(interpreter.S).toMatchState("done");
    expect(interpreter.C.tokens).toEqual(
        [ Token.CallIdentifier.factory("a0_z!") ]);
})
// Call Identifiers:2 ends here

// Numbers
// What about integers?


// [[file:../literate/LexMachineTests.org::*Numbers][Numbers:1]]
it("Lexes an integer", () => {
    streamFile("33554432", streamFileCallback);
    expect(interpreter.S).toMatchState("done");
    expect(interpreter.C.tokens).toEqual(
        [ Token.Number.factory("33554432") ]);
})
// Numbers:1 ends here



// Decimals?


// [[file:../literate/LexMachineTests.org::*Numbers][Numbers:2]]
it("Lexes a decimal", () => {
    streamFile("3355.4432", streamFileCallback);
    expect(interpreter.S).toMatchState("done");
    expect(interpreter.C.tokens).toEqual(
        [ Token.Number.factory("3355.4432") ]);
})
// Numbers:2 ends here



// Numbers that end with a period are not allowed.


// [[file:../literate/LexMachineTests.org::*Numbers][Numbers:3]]
it("Lexing a decimal that ends with a period throws an error", () => {
    interpreter.send({ type: "NUMERIC", char: "1" });
    interpreter.send({ type: "PERIOD", char: "." });
    const fn = () => interpreter.send({ type: "EOF", char: undefined });
    expect(fn).toThrowError();
})
// Numbers:3 ends here

// All together

// Can't be both an AddressIdentifier and a CallIdentifier


// [[file:../literate/LexMachineTests.org::*All together][All together:1]]
it("Cannot be both AddressIdentifier and CallIdentifier", () => {
    interpreter.send({ type: "AT_SIGN", char: "@" });
    interpreter.send({ type: "ALPHABETIC", char: "a" });
    const fn = () => interpreter.send({ type: "EXCLAMATION", char: "!" });
    expect(fn).toThrowError();
})
// All together:1 ends here



// What about everything we've done so far separated by whitespace?


// [[file:../literate/LexMachineTests.org::*All together][All together:2]]
it("Lexes whitespace separated tokens", () => {
    streamFile("ab _ z 3 33.44", streamFileCallback);
    expect(interpreter.S).toMatchState("done");
    expect(interpreter.C.tokens).toEqual(
        [
            Token.ValueIdentifier.factory("ab"),
            Token.Blank.factory(),
            Token.ValueIdentifier.factory("z"),
            Token.Number.factory("3"),
            Token.Number.factory("33.44")
        ]);
})
// All together:2 ends here

// XState Interpreter =onDone()=

// The machine should reach a final state if the input comes from =streamFile=.


// [[file:../literate/LexMachineTests.org::*XState Interpreter =onDone()=][XState Interpreter =onDone()=:1]]
it("XState interpreter onDone called successfully on empty file", async () => {
    const interpreter = interpret(lexMachine);
    const promise = Promise();
    
    interpreter.onDone(({ data }) => promise.resolve(data));
    interpreter.start();

    streamFile("", (event) => interpreter.send(event));
    expect(await promise).toEqual([]);
    interpreter.stop();
})
// XState Interpreter =onDone()=:1 ends here

// [[file:../literate/LexMachineTests.org::*XState Interpreter =onDone()=][XState Interpreter =onDone()=:2]]
it("XState interpreter onDone called successfully on non-empty file", async () => {
    const interpreter = interpret(lexMachine);
    const promise = Promise();
    
    interpreter.onDone(({ data }) => promise.resolve(data));
    interpreter.start();

    streamFile("3", (event) => interpreter.send(event));
    expect(await promise).toEqual([Token.Number.factory("3")]);
    interpreter.stop();
})
// XState Interpreter =onDone()=:2 ends here
