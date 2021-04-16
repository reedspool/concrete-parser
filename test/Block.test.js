// Block test preamble


// [[file:../literate/BlockTests.org::*Block test preamble][Block test preamble:1]]
import * as Block from "../src/Block";
// Block test preamble:1 ends here

// Unit Tests

// [[file:../literate/BlockTests.org::*Unit Tests][Unit Tests:1]]
it("Blank", () => {
    const block = Block.Blank();
    expect(block).toEqual({
        type : "blank"
    })
})
// Unit Tests:1 ends here

// [[file:../literate/BlockTests.org::*Unit Tests][Unit Tests:2]]
it("Numbers", () => {
    const block = Block.Number(7.5);
    expect(block).toEqual({
        type : "number",
        value: 7.5
    })
})
// Unit Tests:2 ends here

// [[file:../literate/BlockTests.org::*Unit Tests][Unit Tests:3]]
it("String", () => {
    const block = Block.String("Hello");
    expect(block).toEqual({
        type : "string",
        value: "Hello"
    })
})
// Unit Tests:3 ends here
