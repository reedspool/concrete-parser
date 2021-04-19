// Preamble


// [[file:../literate/BlockTests.org::*Preamble][Preamble:1]]
import { ValueBlock, Tape, OpBlock, Category } from "../src/Block";
import { Token } from "../src/LexicalToken";
// Preamble:1 ends here

// Tests 

// [[file:../literate/BlockTests.org::*Tests][Tests:1]]
it("Basic value block", () => {
    const token = Token.Blank.factory();
    const block = ValueBlock(token);
    expect(block.token).toEqual(token);
    expect(block.is(Category.Value)).toBe(true);
})
// Tests:1 ends here

// [[file:../literate/BlockTests.org::*Tests][Tests:2]]
it("Basic op block", () => {
    const token = Token.CallIdentifier.factory("abcd!");
    const block = OpBlock(token);
    expect(block.token).toEqual(token);
    expect(block.is(Category.Op)).toBe(true);
})
// Tests:2 ends here

// [[file:../literate/BlockTests.org::*Tests][Tests:3]]
it("Basic tape", () => {
    const token = Token.Blank.factory();
    const block = ValueBlock(token);
    const tape = Tape();
    
    tape.append(block);
    
    expect(tape.cells.length).toBe(1);
    expect(tape.cells[0]).toEqual(block);
    expect(tape.is(Category.Value)).toBe(true);
})
// Tests:3 ends here
