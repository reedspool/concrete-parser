// Preamble


// [[file:../literate/ParseMachineTests.org::*Preamble][Preamble:1]]
import * as ParseMachine from "../src/ParseMachine.js";
import { Machine, interpret } from "xstate";
import { Token } from "../src/LexicalToken";
import { ValueBlock, Tape } from "../src/Block";
import { InvertedPromise as Promise } from "inverted-promise";
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
    tree.appendValueBlock(Token.Blank());

    interpreter.send(Token.Blank());
    interpreter.send("DONE");

    expect(interpreter.S).toMatchState("done");
    expect(interpreter.C.tree).toEqual(tree);
})
// Simple:2 ends here

// Labels

// Labels are a quality of a tape. They name the specific cell of the block which comes after them.


// [[file:../literate/ParseMachineTests.org::*Labels][Labels:1]]
it("Parses a blank with a label", () => {
    tree.labelNextCell(Token.LabelIdentifier("abcd").finalize());
    tree.appendValueBlock(Token.Blank());
    tree.finalizeReferences();
    interpreter.send(Token.LabelIdentifier("abcd").finalize());
    interpreter.send(Token.Blank());
    interpreter.send("DONE");

    expect(interpreter.S).toMatchState("done");
    expect(interpreter.C.tree).toEqual(tree);
    expect(interpreter.C.tree.tape.labelsByIndex[0])
        .toEqual("abcd");
    expect(interpreter.C.tree.tape.labelsToIndex["abcd"])
        .toEqual(0);
    expect(interpreter.C.tree.tape.getBlockAtLabel("abcd")).toEqual(ValueBlock(Token.Blank()))
})
// Labels:1 ends here

// [[file:../literate/ParseMachineTests.org::*Labels][Labels:2]]
it("A label followed by a label is an error", () => {
    interpreter.send(Token.LabelIdentifier("abcd").finalize());
    expect(interpreter.S).toMatchState("ready.label.expectingBlock");
    const fn = () =>
        interpreter.send(Token.LabelIdentifier("abcd"));

    expect(fn).toThrowError();
})
// Labels:2 ends here

// [[file:../literate/ParseMachineTests.org::*Labels][Labels:3]]
it("A label at the end of a tape is an error", () => {
    interpreter.send(Token.LabelIdentifier("abcd"));
    expect(interpreter.S).toMatchState("ready.label.expectingBlock");
    const fn = () =>
          interpreter.send("DONE");
    expect(fn).toThrowError();
})
// Labels:3 ends here

// Commas


// [[file:../literate/ParseMachineTests.org::*Commas][Commas:1]]
it("Parses some value blocks with commas", () => {
    tree.appendComma();
    tree.appendValueBlock(Token.Blank());
    tree.appendValueBlock(Token.Blank());
    tree.appendComma();
    interpreter.send(Token.Comma());
    interpreter.send(Token.Blank());
    interpreter.send(Token.Blank());
    interpreter.send(Token.Comma());
    interpreter.send("DONE");

    expect(interpreter.S).toMatchState("done");
    expect(interpreter.C.tree).toEqual(tree);
    expect(interpreter.C.tree.tape.cells).toHaveLength(2);
    expect(interpreter.C.tree.tape.commas[0]).toBeTruthy();
    expect(interpreter.C.tree.tape.commas[2]).toBeTruthy();
})
// Commas:1 ends here

// Tapes


// [[file:../literate/ParseMachineTests.org::*Tapes][Tapes:1]]
it("Parses just an empty tape", () => {
    tree.openTape();
    tree.closeTape();
    interpreter.send(Token.OpenTape());
    interpreter.send(Token.CloseTape());
    interpreter.send("DONE");

    expect(interpreter.S).toMatchState("done");
    expect(interpreter.C.tree).toEqual(tree);
    expect(interpreter.C.tree.tape.cells).toHaveLength(1);
    expect(interpreter.C.tree.tape.cells[0]).toEqual(Tape());
})
// Tapes:1 ends here



// Tape with params


// [[file:../literate/ParseMachineTests.org::*Tapes][Tapes:2]]
it("Parses an empty tape with an empty param list", () => {
    tree.openTape();
    tree.closeTape();
    interpreter.send(Token.OpenParams());
    expect(interpreter.S).toMatchState("ready.params.open");
    interpreter.send(Token.CloseParams());
    expect(interpreter.S).toMatchState("ready.params.expectingTape");
    interpreter.send(Token.OpenTape());
    interpreter.send(Token.CloseTape());
    interpreter.send("DONE");

    expect(interpreter.S).toMatchState("done");
    expect(interpreter.C.tree).toEqual(tree);
    expect(interpreter.C.tree.tape.cells).toHaveLength(1);
    expect(interpreter.C.tree.tape.cells[0]).toEqual(Tape());
})
// Tapes:2 ends here

// [[file:../literate/ParseMachineTests.org::*Tapes][Tapes:3]]
it("Parses an empty tape with a simple param list", () => {
    tree.addParamForNextTape(Token.ValueIdentifier("n").finalize());
    tree.openTape();
    tree.closeTape();
    tree.finalizeReferences();
    interpreter.send(Token.OpenParams());
    expect(interpreter.S).toMatchState("ready.params.open");
    interpreter.send(Token.ValueIdentifier("n").finalize());
    interpreter.send(Token.CloseParams());
    expect(interpreter.S).toMatchState("ready.params.expectingTape");
    interpreter.send(Token.OpenTape());
    interpreter.send(Token.CloseTape());
    interpreter.send("DONE");

    expect(interpreter.S).toMatchState("done");
    expect(interpreter.C.tree).toEqual(tree);
    expect(interpreter.C.tree.tape.cells).toHaveLength(1);
})
// Tapes:3 ends here

// [[file:../literate/ParseMachineTests.org::*Tapes][Tapes:4]]
it("Parses an empty tape with complex param list", () => {
    tree.addParamForNextTape(Token.ValueIdentifier("meow").finalize());
    tree.addParamForNextTape(Token.LabelIdentifier("abcd").finalize());
    tree.addParamForNextTape(Token.ValueIdentifier("cheese").finalize());
    tree.openTape();
    tree.closeTape();
    tree.finalizeReferences();
    interpreter.send(Token.OpenParams());
    expect(interpreter.S).toMatchState("ready.params.open");
    interpreter.send(Token.ValueIdentifier("meow").finalize());
    interpreter.send(Token.LabelIdentifier("abcd").finalize());
    expect(interpreter.S).toMatchState("ready.params.expectingDefaultValue");
    interpreter.send(Token.ValueIdentifier("cheese").finalize());
    interpreter.send(Token.CloseParams());
    expect(interpreter.S).toMatchState("ready.params.expectingTape");
    interpreter.send(Token.OpenTape());
    interpreter.send(Token.CloseTape());
    interpreter.send("DONE");

    expect(interpreter.S).toMatchState("done");
    expect(interpreter.C.tree).toEqual(tree);
    expect(interpreter.C.tree.tape.cells).toHaveLength(1);
})
// Tapes:4 ends here

// [[file:../literate/ParseMachineTests.org::*Tapes][Tapes:5]]
it("Duplicate parameter labels error", () => {
    interpreter.send(Token.OpenParams());
    expect(interpreter.S).toMatchState("ready.params.open");
    interpreter.send(Token.ValueIdentifier("meow").finalize());
    expect(interpreter.S).toMatchState("ready.params.open");
    const fn = () => interpreter.send(Token.LabelIdentifier("meow").finalize());

    expect(fn).toThrowError();
})
// Tapes:5 ends here

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

    tree.appendValueBlock(Token.Number("3"));

    interpreter.onDone(({ data }) => promise.resolve(data));
    interpreter.start();

    interpreter.send(Token.Number("3"));
    interpreter.send("DONE");
    expect(await promise).toEqual(tree);
    interpreter.stop();
})
// XState Interpreter =onDone()=:2 ends here
