// Preamble


// [[file:../literate/ParserTests.org::*Preamble][Preamble:1]]
import * as Parser from "../src/Parser";
import * as Block from "../src/Block";
// Preamble:1 ends here

// Tests


// [[file:../literate/ParserTests.org::*Tests][Tests:1]]
it("Parses a single blank", () => {
    const tree = Parser.single("_")
    expect(tree).toEqual(Block.Blank())
})
// Tests:1 ends here



// Turning off these tests since I'm not ready for them, got to build them machine first.


// [[file:../literate/ParserTests.org::*Tests][Tests:2]]
it.skip("Parses a big integer", () => {
    const tree = Parser.single("33554432")
    expect(tree).toEqual(Block.Number(33554432))
})

it.skip("Parses a string", () => {
    const tree = Parser.single("\"Hello\"")
    expect(tree).toEqual(Block.String("Hello"))
})
// Tests:2 ends here
