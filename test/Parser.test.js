// Preamble


// [[file:../literate/ParserTests.org::*Preamble][Preamble:1]]
import { parseFile } from "../src/Parser";
import { AbstractSyntaxTree } from "../src/AbstractSyntaxTree";
import { Token } from "../src/LexicalToken";
import { ValueBlock, OpBlock } from "../src/Block";
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
it("Can parse a blank file and produce a blank tree", async () => {
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
    expected.appendValueBlock(Token.Blank());
    expect(parsed).toEqual(expected);
})
// Parse Single Block Tests:1 ends here



// Turning off these tests since I'm not ready for them, got to build them machine first.


// [[file:../literate/ParserTests.org::*Parse Single Block Tests][Parse Single Block Tests:2]]
it("Parses a single number", async () => {
    const parsed = await parseFile("33554.432");
    expected.appendValueBlock(Token.Number("33554.432"));
    expect(parsed).toEqual(expected);
})

it("Parses a single string", async () => {
    const parsed = await parseFile("\"Hello\"");
    expected.appendValueBlock(Token.String("\"Hello\""));
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
    expected.appendValueBlock(Token.Number("1"));
    expected.appendValueBlock(Token.Number("2"));
    expected.appendComma();
    expected.appendValueBlock(Token.Number("3"));
    expected.appendComma();
    expected.appendValueBlock(Token.Number("4"));
    expect(parsed).toEqual(expected);
})
// Parse Series of blocks and commas:1 ends here

// Parse labels


// [[file:../literate/ParserTests.org::*Parse labels][Parse labels:1]]
it("Parses labels on blocks", async () => {
    const parsed = await parseFile("a: b");
    expected.labelNextCell(Token.LabelIdentifier("a:").finalize());
    expected.appendValueBlock(Token.ValueIdentifier("b").finalize());
    expected.finalizeReferences();
    expect(parsed.tape.references).toBeDefined();
    expect(parsed.tape.references["a"]).toBeDefined();
    expect(parsed).toEqual(expected);
})
// Parse labels:1 ends here

// Parse then mutate labels and commas


// [[file:../literate/ParserTests.org::*Parse then mutate labels and commas][Parse then mutate labels and commas:1]]
it("Parses labels and commas then add blocks", async () => {
    const parsed = await parseFile("a: b 1, 2 c: d");
    expected.labelNextCell(Token.LabelIdentifier("a:").finalize());
    expected.appendValueBlock(Token.ValueIdentifier("b").finalize());
    expected.appendComma();
    expected.appendValueBlock(Token.Number("2"));
    expected.labelNextCell(Token.LabelIdentifier("c:").finalize());
    expected.appendValueBlock(Token.ValueIdentifier("d").finalize());
    expected.finalizeReferences();

    expected.tape.insert(ValueBlock(Token.Number("1")), 1);
    
    expected.finalizeReferences();

    expect(parsed).toEqual(expected);
})
// Parse then mutate labels and commas:1 ends here

// [[file:../literate/ParserTests.org::*Parse then mutate labels and commas][Parse then mutate labels and commas:2]]
it("Parses labels and commas then remove blocks", async () => {
    const parsed = await parseFile("a: b, 1, 3 c: d");
    expected.labelNextCell(Token.LabelIdentifier("a:").finalize());
    expected.appendValueBlock(Token.ValueIdentifier("b").finalize());
    expected.appendComma();
    expected.appendValueBlock(Token.Number("1"));
    expected.appendComma();
    expected.appendValueBlock(Token.Number("2"));
    expected.appendComma();
    expected.appendValueBlock(Token.Number("3"));
    expected.labelNextCell(Token.LabelIdentifier("c:").finalize());
    expected.appendValueBlock(Token.ValueIdentifier("d").finalize());
    expected.finalizeReferences();

    expected.tape.remove(2, 1);

    expected.finalizeReferences();

    expect(parsed).toEqual(expected);
})
// Parse then mutate labels and commas:2 ends here

// Parse Op blocks and identifiers


// [[file:../literate/ParserTests.org::*Parse Op blocks and identifiers][Parse Op blocks and identifiers:1]]
it("Parses op blocks and identifiers", async () => {
    const parsed = await parseFile("call! @address value");
    expected.appendOpBlock(Token.CallIdentifier("call!"));
    expected.appendValueBlock(Token.AddressIdentifier("@address"));
    expected.appendValueBlock(Token.ValueIdentifier("value"));
    expected.finalizeReferences();
    expect(parsed.tape.references).toBeDefined();
    expect(parsed.tape.references["call"]).toBeDefined();
    expect(parsed.tape.references["call"].type).toBe("upvalue");
    expect(parsed).toEqual(expected);
})
// Parse Op blocks and identifiers:1 ends here

// Parse Operator call identifiers, operator addresses, and labels

// [[file:../literate/ParserTests.org::*Parse Operator call identifiers, operator addresses, and labels][Parse Operator call identifiers, operator addresses, and labels:1]]
it("Parses single character operator call identifiers, addresses and labels", async () => {
    const parsed = await parseFile("+: + - @* / % >, < = & | ~");
    expected.labelNextCell(Token.LabelIdentifier("+:").finalize());
    expected.appendOpBlock(Token.CallIdentifier("+"));
    expected.appendOpBlock(Token.CallIdentifier("-"));
    expected.appendValueBlock(Token.AddressIdentifier("@*"));
    expected.appendOpBlock(Token.CallIdentifier("/"));
    expected.appendOpBlock(Token.CallIdentifier("%"));
    expected.appendOpBlock(Token.CallIdentifier(">"));
    expected.appendComma();
    expected.appendOpBlock(Token.CallIdentifier("<"));
    expected.appendOpBlock(Token.CallIdentifier("="));
    expected.appendOpBlock(Token.CallIdentifier("&"));
    expected.appendOpBlock(Token.CallIdentifier("|"));
    expected.appendOpBlock(Token.CallIdentifier("~"));
    expected.finalizeReferences();
    expect(parsed.tape.references).toBeDefined();
    expect(parsed.tape.references["+"].type).toBe("local");
    expect(parsed.tape.references["-"].type).toBe("upvalue");
    expect(parsed.tape.references["*"].type).toBe("upvalue");
    expect(parsed.tape.references["/"].type).toBe("upvalue");
    expect(parsed.tape.references["%"].type).toBe("upvalue");
    expect(parsed.tape.references[">"].type).toBe("upvalue");
    expect(parsed.tape.references["<"].type).toBe("upvalue");
    expect(parsed.tape.references["="].type).toBe("upvalue");
    expect(parsed.tape.references["&"].type).toBe("upvalue");
    expect(parsed.tape.references["|"].type).toBe("upvalue");
    expect(parsed.tape.references["~"].type).toBe("upvalue");
    expect(parsed).toEqual(expected);
})
// Parse Operator call identifiers, operator addresses, and labels:1 ends here

// [[file:../literate/ParserTests.org::*Parse Operator call identifiers, operator addresses, and labels][Parse Operator call identifiers, operator addresses, and labels:2]]
it("Parses multichar operator call identifiers, addresses and labels", async () => {
    const parsed = await parseFile("++: +- @** // %% <>, >< == && || ~~");
    expected.labelNextCell(Token.LabelIdentifier("++:").finalize());
    expected.appendOpBlock(Token.CallIdentifier("+-"));
    expected.appendValueBlock(Token.AddressIdentifier("@**"));
    expected.appendOpBlock(Token.CallIdentifier("//"));
    expected.appendOpBlock(Token.CallIdentifier("%%"));
    expected.appendOpBlock(Token.CallIdentifier("<>"));
    expected.appendComma();
    expected.appendOpBlock(Token.CallIdentifier("><"));
    expected.appendOpBlock(Token.CallIdentifier("=="));
    expected.appendOpBlock(Token.CallIdentifier("&&"));
    expected.appendOpBlock(Token.CallIdentifier("||"));
    expected.appendOpBlock(Token.CallIdentifier("~~"));
    expected.finalizeReferences();
    expect(parsed.tape.references).toBeDefined();
    expect(parsed.tape.references["++"].type).toBe("local");
    expect(parsed.tape.references["+-"].type).toBe("upvalue");
    expect(parsed.tape.references["**"].type).toBe("upvalue");
    expect(parsed.tape.references["//"].type).toBe("upvalue");
    expect(parsed.tape.references["%%"].type).toBe("upvalue");
    expect(parsed.tape.references["<>"].type).toBe("upvalue");
    expect(parsed.tape.references["><"].type).toBe("upvalue");
    expect(parsed.tape.references["=="].type).toBe("upvalue");
    expect(parsed.tape.references["&&"].type).toBe("upvalue");
    expect(parsed.tape.references["||"].type).toBe("upvalue");
    expect(parsed.tape.references["~~"].type).toBe("upvalue");
    expect(parsed).toEqual(expected);
})
// Parse Operator call identifiers, operator addresses, and labels:2 ends here

// Parse tapes


// [[file:../literate/ParserTests.org::*Parse tapes][Parse tapes:1]]
it("Parses an empty tape", async () => {
    const parsed = await parseFile("()[]");
    expected.openTape();
    expected.closeTape();
    expect(parsed).toEqual(expected);
})
// Parse tapes:1 ends here

// [[file:../literate/ParserTests.org::*Parse tapes][Parse tapes:2]]
it("Parses identity tape", async () => {
    const parsed = await parseFile("(n)[ n ]");
    expected.addParamForNextTape(
        Token.ValueIdentifier("n").finalize());
    expected.openTape();
    expected.appendValueBlock(Token.ValueIdentifier("n"));
    expected.closeTape();
    expected.finalizeReferences();
    expect(parsed.tape.cells[0].references).toBeDefined();
    expect(parsed.tape.cells[0].references["n"]).toBeDefined();
    expect(parsed.tape.cells[0].references["n"].type)
        .toBe("param");
    expect(parsed).toEqual(expected);
})
// Parse tapes:2 ends here

// [[file:../literate/ParserTests.org::*Parse tapes][Parse tapes:3]]
it("Parses tape with globals", async () => {
    const parsed = await parseFile("()[ n ]");
    expected.openTape();
    expected.appendValueBlock(Token.ValueIdentifier("n"));
    expected.closeTape();
    expected.finalizeReferences();
    expect(parsed.tape.cells[0].references).toBeDefined();
    expect(parsed.tape.cells[0].references["n"]).toBeDefined();
    expect(parsed.tape.cells[0].references["n"].type)
        .toBe("upvalue");
    expect(parsed.tape.references).toBeDefined();
    expect(parsed.tape.references["n"]).toBeDefined();
    expect(parsed.tape.references["n"].type)
        .toBe("upvalue");
    expect(parsed).toEqual(expected);
})
// Parse tapes:3 ends here

// Parse inline tapes


// [[file:../literate/ParserTests.org::*Parse inline tapes][Parse inline tapes:1]]
it("Parses an empty inline tape", async () => {
    const parsed = await parseFile("{}");
    expected.openTape(true);
    expected.closeTape();
    expect(parsed).toEqual(expected);
})
// Parse inline tapes:1 ends here

// [[file:../literate/ParserTests.org::*Parse inline tapes][Parse inline tapes:2]]
it("Parses inline tape with globals", async () => {
    const parsed = await parseFile("{ n }");
    expected.openTape(true);
    expected.appendValueBlock(Token.ValueIdentifier("n"));
    expected.closeTape();
    expected.finalizeReferences();
    expect(parsed.tape.cells[0].isInline).toBe(true);
    expect(parsed.tape.cells[0].references).toBeDefined();
    expect(parsed.tape.cells[0].references["n"]).toBeDefined();
    expect(parsed.tape.cells[0].references["n"].type)
        .toBe("upvalue");
    expect(parsed.tape.references).toBeDefined();
    expect(parsed.tape.references["n"]).toBeDefined();
    expect(parsed.tape.references["n"].type)
        .toBe("upvalue");
    expect(parsed).toEqual(expected);
})
// Parse inline tapes:2 ends here

// asJS() on blocks


// [[file:../literate/ParserTests.org::*asJS() on blocks][asJS() on blocks:1]]
it("asJS() works on a variety of blocks", async () => {
    const parsed = await parseFile("_ \"Hello World!\" 1 1.2");
    const [ blank, string, integer, decimal ] = parsed.tape.cells;
    
    expect(blank).toEqual(ValueBlock(Token.Blank()));
    expect(blank.asJS()).toEqual(null);
    
    expect(string).toEqual(
        ValueBlock(Token.String("\"Hello World!\"")));
    expect(string.asJS()).toEqual("Hello World!");
    
    expect(integer).toEqual(
        ValueBlock(Token.Number("1")));
    expect(integer.asJS()).toEqual(1);
    
    expect(decimal).toEqual(
        ValueBlock(Token.Number("1.2")));
    expect(decimal.asJS()).toEqual(1.2);
})
// asJS() on blocks:1 ends here

// [[file:../literate/ParserTests.org::*asJS() on blocks][asJS() on blocks:2]]
it("asJS() errors on blocks which cannot be converted", async () => {
    const parsed = await parseFile("label: call! @address value");
    const [ call, address, value ] = parsed.tape.cells;
    
    expect(call).toEqual(
        OpBlock(Token.CallIdentifier("call!")));
    expect(() => value.asJS()).toThrowError();
    expect(value).toEqual(ValueBlock(Token.ValueIdentifier("value")));
    expect(() => value.asJS()).toThrowError();
    expect(value).toEqual(ValueBlock(Token.ValueIdentifier("value")));
    expect(() => value.asJS()).toThrowError();
})
// asJS() on blocks:2 ends here
