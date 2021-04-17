// Preamble


// [[file:../literate/ParserTests.org::*Preamble][Preamble:1]]
import { parseFile } from "../src/Parser";
import { AbstractSyntaxTree } from "../src/AbstractSyntaxTree";
// Preamble:1 ends here

// Parse File Tests

// Blank file.


// [[file:../literate/ParserTests.org::*Parse File Tests][Parse File Tests:1]]
it.skip("Can parse a blank file and produce a blank tree", async () => {
    const expected = AbstractSyntaxTree();
    const parsed = await parseFile("");

    expect(parsed).toEqual(expected);
})
// Parse File Tests:1 ends here



// Blank-ish file, just filled with whitespace.


// [[file:../literate/ParserTests.org::*Parse File Tests][Parse File Tests:2]]
it("Can parse a file of only whitespace and produce a blank tree", async () => {
    const expected = AbstractSyntaxTree();
    const parsed = await parseFile("  \t  \n  ");

    expect(parsed).toEqual(expected);
})
// Parse File Tests:2 ends here

// Parse Single Block Tests


// [[file:../literate/ParserTests.org::*Parse Single Block Tests][Parse Single Block Tests:1]]
it.skip("Parses a single blank", () => {
    const tree = Parser.single("_")
    expect(tree).toEqual(Block.Blank())
})
// Parse Single Block Tests:1 ends here



// Turning off these tests since I'm not ready for them, got to build them machine first.


// [[file:../literate/ParserTests.org::*Parse Single Block Tests][Parse Single Block Tests:2]]
it.skip("Parses a big integer", () => {
    const tree = Parser.single("33554432")
    expect(tree).toEqual(Block.Number(33554432))
})

it.skip("Parses a string", () => {
    const tree = Parser.single("\"Hello\"")
    expect(tree).toEqual(Block.String("Hello"))
})
// Parse Single Block Tests:2 ends here
