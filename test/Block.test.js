// Preamble


// [[file:../literate/BlockTests.org::*Preamble][Preamble:1]]
import { Block, Tape } from "../src/Block";
import { Token } from "../src/LexicalToken";
// Preamble:1 ends here

// Tests 

// [[file:../literate/BlockTests.org::*Tests][Tests:1]]
it("Basic block", () => {
    const token = Token.Blank.factory();
    const block = Block(token);
    expect(block.token).toEqual(token);
})
// Tests:1 ends here

// [[file:../literate/BlockTests.org::*Tests][Tests:2]]
it("Basic tape", () => {
    const token = Token.Blank.factory();
    const block = Block(token);
    const tape = Tape();
    
    tape.append(block);
    
    expect(tape.cells.length).toBe(1);
    expect(tape.cells[0]).toEqual(block);
})
// Tests:2 ends here
