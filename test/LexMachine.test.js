// Preamble


// [[file:../literate/LexMachineTests.org::*Preamble][Preamble:1]]
import * as LexMachine from "../src/LexMachine.js";
import { Token } from "../src/LexicalToken";
import { interpret, Machine } from "xstate";
import { InvertedPromise as Promise } from "inverted-promise";
import { TestInterpreter, toMatchState } from "xstate-jest-tools";
import { streamFile, stream } from "../src/CharacterStream";
expect.extend({ toMatchState });

const lexMachine =
    Machine(LexMachine.definition)
        .withConfig(LexMachine.config)
        // Supply empty context to avoid warning
        .withContext({});

let interpreter;

const streamCallback = (event) => {
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
    streamFile("_", streamCallback);
    expect(interpreter.S).toMatchState("done");
    expect(interpreter.C.tokens).toEqual(
        [ Token.Blank() ]);
})
// Blank:1 ends here

// Comma


// [[file:../literate/LexMachineTests.org::*Comma][Comma:1]]
it("Tokenizes just a comma", () => {
    streamFile(",", streamCallback);
    expect(interpreter.S).toMatchState("done");
    expect(interpreter.C.tokens).toEqual(
        [ Token.Comma() ]);
})
// Comma:1 ends here

// Value Identifier

// Okay what about a complete identifier?


// [[file:../literate/LexMachineTests.org::*Value Identifier][Value Identifier:1]]
it("Lexes a simple alphabetic ValueIdentifier", () => {
    streamFile("abc", streamCallback);
    expect(interpreter.S).toMatchState("done");
    expect(interpreter.C.tokens).toEqual(
        [ Token.ValueIdentifier("abc").finalize() ]);
})
// Value Identifier:1 ends here



// Okay what about more complex identifiers


// [[file:../literate/LexMachineTests.org::*Value Identifier][Value Identifier:2]]
it("Lexes a complex mixed ValueIdentifier", () => {
    streamFile("a0_z", streamCallback);
    expect(interpreter.S).toMatchState("done");
    expect(interpreter.C.tokens).toEqual(
        [ Token.ValueIdentifier("a0_z").finalize() ]);
})
// Value Identifier:2 ends here

// Address Identifier

// Okay what about a complete identifier?


// [[file:../literate/LexMachineTests.org::*Address Identifier][Address Identifier:1]]
it("Lexes a simple alphabetic AddressIdentifier", () => {
    streamFile("@abc", streamCallback);
    expect(interpreter.S).toMatchState("done");
    expect(interpreter.C.tokens).toEqual(
        [ Token.AddressIdentifier("@abc").finalize() ]);
})
// Address Identifier:1 ends here



// Okay what about more complex identifiers


// [[file:../literate/LexMachineTests.org::*Address Identifier][Address Identifier:2]]
it("Lexes a complex mixed AddressIdentifier", () => {
    streamFile("@a0_z", streamCallback);
    expect(interpreter.S).toMatchState("done");
    expect(interpreter.C.tokens).toEqual(
        [ Token.AddressIdentifier("@a0_z").finalize() ]);
})
// Address Identifier:2 ends here

// Label Identifiers


// [[file:../literate/LexMachineTests.org::*Label Identifiers][Label Identifiers:1]]
it("Lexes a simple alphabetic LabelIdentifier", () => {
    streamFile("abc:", streamCallback);
    expect(interpreter.S).toMatchState("done");
    expect(interpreter.C.tokens).toEqual(
        [ Token.LabelIdentifier("abc:").finalize() ]);
})
// Label Identifiers:1 ends here



// Okay what about more complex identifiers


// [[file:../literate/LexMachineTests.org::*Label Identifiers][Label Identifiers:2]]
it("Lexes a complex mixed LabelIdentifier", () => {
    streamFile("a0_z:", streamCallback);
    expect(interpreter.S).toMatchState("done");
    expect(interpreter.C.tokens).toEqual(
        [ Token.LabelIdentifier("a0_z:").finalize() ]);
})
// Label Identifiers:2 ends here

// Call Identifiers


// [[file:../literate/LexMachineTests.org::*Call Identifiers][Call Identifiers:1]]
it("Lexes a simple alphabetic CallIdentifier", () => {
    streamFile("abc!", streamCallback);
    expect(interpreter.S).toMatchState("done");
    expect(interpreter.C.tokens).toEqual(
        [ Token.CallIdentifier("abc!").finalize() ]);
})
// Call Identifiers:1 ends here



// Okay what about more complex identifiers


// [[file:../literate/LexMachineTests.org::*Call Identifiers][Call Identifiers:2]]
it("Lexes a complex mixed CallIdentifier", () => {
    streamFile("a0_z!", streamCallback);
    expect(interpreter.S).toMatchState("done");
    expect(interpreter.C.tokens).toEqual(
        [ Token.CallIdentifier("a0_z!").finalize() ]);
})
// Call Identifiers:2 ends here

// Numbers
// What about integers?


// [[file:../literate/LexMachineTests.org::*Numbers][Numbers:1]]
it("Lexes an integer", () => {
    streamFile("33554432", streamCallback);
    expect(interpreter.S).toMatchState("done");
    expect(interpreter.C.tokens).toEqual(
        [ Token.Number("33554432") ]);
})
// Numbers:1 ends here



// Decimals?


// [[file:../literate/LexMachineTests.org::*Numbers][Numbers:2]]
it("Lexes a decimal", () => {
    streamFile("3355.4432", streamCallback);
    expect(interpreter.S).toMatchState("done");
    expect(interpreter.C.tokens).toEqual(
        [ Token.Number("3355.4432") ]);
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

// Strings


// [[file:../literate/LexMachineTests.org::*Strings][Strings:1]]
it("Lexes a simple string", () => {
    interpreter.send({ type: "DOUBLE_QUOTE", char: "\"" })
    expect(interpreter.S).toMatchState("string");
    interpreter.send({ type: "ALPHABETIC", char: "m" })
    expect(interpreter.S).toMatchState("string");
    interpreter.send({ type: "DOUBLE_QUOTE", char: "\"" })
    expect(interpreter.S).toMatchState("none");
    interpreter.send({ type: "EOF", char: undefined });
    expect(interpreter.S).toMatchState("done");
    expect(interpreter.C.tokens).toEqual(
        [ Token.String("\"m\"") ]);
})
// Strings:1 ends here

// [[file:../literate/LexMachineTests.org::*Strings][Strings:2]]
it("Lexes a string with everything except escapes", () => {
    const input = "\"abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()+=~`<>,.[]{}|-_'?/\"";
    expect(interpreter.S)
    streamFile(input, streamCallback);
    expect(interpreter.S).toMatchState("done");
    expect(interpreter.C.tokens).toEqual(
        [ Token.String(input) ]);
})
// Strings:2 ends here

// [[file:../literate/LexMachineTests.org::*Strings][Strings:3]]
it("Lexes a string with an escaped double quote", () => {
    const input = "\"\\\"\"";
    expect(interpreter.S)
    streamFile(input, streamCallback);
    expect(interpreter.S).toMatchState("done");
    expect(interpreter.C.tokens).toEqual(
        [ Token.String(input) ]);
})
// Strings:3 ends here

// Tapes


// [[file:../literate/LexMachineTests.org::*Tapes][Tapes:1]]
it("Lexes an empty tape", () => {
    streamFile("[]", streamCallback);
    expect(interpreter.S).toMatchState("done");
    expect(interpreter.C.tokens).toEqual(
        [ Token.OpenTape(), Token.CloseTape() ]);
})
// Tapes:1 ends here

// [[file:../literate/LexMachineTests.org::*Tapes][Tapes:2]]
it("Lexes an empty tape with params", () => {
    streamFile("()[]", streamCallback);
    expect(interpreter.S).toMatchState("done");
    expect(interpreter.C.tokens).toEqual(
        [ Token.OpenParams(), Token.CloseParams(), Token.OpenTape(), Token.CloseTape() ]);
})
// Tapes:2 ends here

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
    streamFile("ab _ z 3 33.44", streamCallback);
    expect(interpreter.S).toMatchState("done");
    expect(interpreter.C.tokens).toEqual(
        [
            Token.ValueIdentifier("ab").finalize(),
            Token.Blank(),
            Token.ValueIdentifier("z").finalize(),
            Token.Number("3"),
            Token.Number("33.44")
        ]);
})
// All together:2 ends here



// What about everything inside a tape?


// [[file:../literate/LexMachineTests.org::*All together][All together:3]]
it("Lexes a variety of tokens inside a tape", () => {
    streamFile("()[ ab _ z 3 33.44 ]", streamCallback);
    expect(interpreter.S).toMatchState("done");
    expect(interpreter.C.tokens).toEqual(
        [
            Token.OpenParams(),
            Token.CloseParams(),
            Token.OpenTape(),
            Token.ValueIdentifier("ab").finalize(),
            Token.Blank(),
            Token.ValueIdentifier("z").finalize(),
            Token.Number("3"),
            Token.Number("33.44"),
            Token.CloseTape(),
        ]);
})
// All together:3 ends here

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
    expect(await promise).toEqual([Token.Number("3")]);
    interpreter.stop();
})
// XState Interpreter =onDone()=:2 ends here
