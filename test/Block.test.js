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
    expect(block.is(Category.Value, Token.Blank.kind)).toBe(true);
})
// Basics:1 ends here

// [[file:../literate/BlockTests.org::*Basics][Basics:2]]
it("Basic op block", () => {
    const token = Token.CallIdentifier("abcd!");
    const block = OpBlock(token);
    expect(block.token).toEqual(token);
    expect(block.is(Category.Op)).toBe(true);
    expect(block.is(Category.Op, Token.CallIdentifier.kind)).toBe(true);
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
    expect(tape.is(Category.Value, "Tape")).toBe(true);
    expect(tape.asJS()).toEqual([ null ]);
})
// Basics:3 ends here

// Tapes


// [[file:../literate/BlockTests.org::*Tapes][Tapes:1]]
it("Instantiate a tape", () => {
    const tape = Tape();
    expect(tape.is(Category.Value, "ValueIdentifier")).toBe(false);
    expect(tape.is(Category.Value, "Tape")).toBeTruthy();
    expect(tape.asJS()).toEqual([]);
});
// Tapes:1 ends here

// Making a block from a JS value


// [[file:../literate/BlockTests.org::*Making a block from a JS value][Making a block from a JS value:1]]
it("Number block from JS value, no token", () => {
    const block = ValueBlock.fromJS(5);

    expect(block.token).toBeUndefined();
    expect(block.is(Category.Value)).toBe(true);
    expect(block.asJS()).toEqual(5);
})
// Making a block from a JS value:1 ends here

// [[file:../literate/BlockTests.org::*Making a block from a JS value][Making a block from a JS value:2]]
it("Number block from falsey JS value, no token", () => {
    const block = ValueBlock.fromJS(0);

    expect(block.token).toBeUndefined();
    expect(block.is(Category.Value)).toBe(true);
    expect(block.is(Category.Value, Token.Number.kind)).toBe(true);
    expect(block.asJS()).toEqual(0);
})
// Making a block from a JS value:2 ends here

// Falsiness


// [[file:../literate/BlockTests.org::*Falsiness][Falsiness:1]]
it("Most blocks are truthy", () => {
    const token = Token.Blank();
    const block = ValueBlock(token);
    expect(block.truthy()).toEqual(true);
})
// Falsiness:1 ends here

// [[file:../literate/BlockTests.org::*Falsiness][Falsiness:2]]
it("Most blocks are truthy", () => {
    const block = ValueBlock.fromJS(0);

    expect(block.truthy()).toBe(false);
})
// Falsiness:2 ends here
