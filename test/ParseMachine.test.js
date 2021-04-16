// Preamble


// [[file:../literate/ParseMachineTests.org::*Preamble][Preamble:1]]
import * as ParseMachine from "../src/ParseMachine.js";
import { Machine } from "xstate";
import { AbstractSyntaxTree } from "../src/AbstractSyntaxTree"
import { TestInterpreter, toMatchState } from "xstate-jest-tools";
expect.extend({ toMatchState });

const parseMachine =
    Machine(ParseMachine.definition)
        .withConfig(ParseMachine.config)
        // Supply empty context to avoid warning
        .withContext({});

let interpreter;

beforeEach(() => {
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
it.skip("Parses just a blank", () => {
    interpreter.send({ type: "UNDERSCORE" })
    interpreter.send({ type: "EOF" })
    expect(interpreter.S).toMatchState("done");
    expect(interpreter.context.tree).toEqual(
        Block.Blank())
})
// Simple:2 ends here
