// Preamble


// [[file:../literate/BlockTests.org::*Preamble][Preamble:1]]
import { ValueBlock, Tape, OpBlock, Category } from "../src/Block";
import { Token } from "../src/LexicalToken";
// Preamble:1 ends here

// Basics 

// [[file:../literate/BlockTests.org::*Basics][Basics:1]]
it("Basic value block", () => {
    const token = Token.Blank();
    const block = ValueBlock(token);
    expect(block.token).toEqual(token);
    expect(block.asJS()).toEqual(null);
    expect(block.is(Category.Value)).toBe(true);
})
// Basics:1 ends here

// [[file:../literate/BlockTests.org::*Basics][Basics:2]]
it("Basic op block", () => {
    const token = Token.CallIdentifier("abcd!");
    const block = OpBlock(token);
    expect(block.token).toEqual(token);
    expect(block.is(Category.Op)).toBe(true);
    expect(block.category.name).toBe("Op");
})
// Basics:2 ends here

// [[file:../literate/BlockTests.org::*Basics][Basics:3]]
it("Basic tape", () => {
    const token = Token.Blank();
    const block = ValueBlock(token);
    const tape = Tape();
    
    tape.append(block);
    
    expect(tape.cells.length).toBe(1);
    expect(tape.cells[0]).toEqual(block);
    expect(tape.is(Category.Value)).toBe(true);
    expect(tape.asJS()).toEqual([ null ]);
})
// Basics:3 ends here
