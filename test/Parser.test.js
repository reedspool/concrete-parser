// Preamble


// [[file:../literate/ParserTests.org::*Preamble][Preamble:1]]
import { parseFile } from "../src/Parser";
import { AbstractSyntaxTree } from "../src/AbstractSyntaxTree";
import { Token } from "../src/LexicalToken";
// Preamble:1 ends here

// [[file:../literate/ParserTests.org::*Preamble][Preamble:2]]
let expected;
beforeEach(() => {
    expected = AbstractSyntaxTree();
})
// Preamble:2 ends here

// Parse File Tests

// Blank file.


// [[file:../literate/ParserTests.org::*Parse File Tests][Parse File Tests:1]]
it.skip("Can parse a blank file and produce a blank tree", async () => {
    const parsed = await parseFile("");
    expect(parsed).toEqual(expected);
})
// Parse File Tests:1 ends here



// Blank-ish file, just filled with whitespace.


// [[file:../literate/ParserTests.org::*Parse File Tests][Parse File Tests:2]]
it("Can parse a file of only whitespace and produce a blank tree", async () => {
    const parsed = await parseFile("  \t  \n  ");
    expect(parsed).toEqual(expected);
})
// Parse File Tests:2 ends here

// Parse Single Block Tests


// [[file:../literate/ParserTests.org::*Parse Single Block Tests][Parse Single Block Tests:1]]
it("Parses a single blank", async () => {
    const parsed = await parseFile("_");
    expected.appendValueBlock(Token.Blank.create());
    expect(parsed).toEqual(expected);
})
// Parse Single Block Tests:1 ends here



// Turning off these tests since I'm not ready for them, got to build them machine first.


// [[file:../literate/ParserTests.org::*Parse Single Block Tests][Parse Single Block Tests:2]]
it("Parses a single number", async () => {
    const parsed = await parseFile("33554.432");
    expected.appendValueBlock(Token.Number.create("33554.432"));
    expect(parsed).toEqual(expected);
})

it("Parses a single string", async () => {
    const parsed = await parseFile("\"Hello\"");
    expected.appendValueBlock(Token.String.create("\"Hello\""));
    expect(parsed).toEqual(expected);
})
// Parse Single Block Tests:2 ends here

// Parse Series of blocks and commas


// [[file:../literate/ParserTests.org::*Parse Series of blocks and commas][Parse Series of blocks and commas:1]]
it("Parses a single comma", async () => {
    const parsed = await parseFile(",");
    expected.appendComma();
    expect(parsed).toEqual(expected);
})

it("Parses a few blocks with commas", async () => {
    const parsed = await parseFile(", 1 2,3 , 4");
    expected.appendComma();
    expected.appendValueBlock(Token.Number.create("1"));
    expected.appendValueBlock(Token.Number.create("2"));
    expected.appendComma();
    expected.appendValueBlock(Token.Number.create("3"));
    expected.appendComma();
    expected.appendValueBlock(Token.Number.create("4"));
    expect(parsed).toEqual(expected);
})
// Parse Series of blocks and commas:1 ends here
