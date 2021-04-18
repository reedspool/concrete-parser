// Preamble


// [[file:../literate/LexicalTokenTests.org::*Preamble][Preamble:1]]
import { Token } from "../src/LexicalToken.js";
// Preamble:1 ends here

// ValueIdentifier


// [[file:../literate/LexicalTokenTests.org::*ValueIdentifier][ValueIdentifier:1]]
it("Simple ValueIdentifier", () => {
    expect(Token.ValueIdentifier.factory("abcd")).toEqual({
        name: "ValueIdentifier",
        type: Token.ValueIdentifier.event,
        original: "abcd"
    })
})

it("ValueIdentifier can be added to", () => {
    const token = Token.ValueIdentifier.factory("a");
    token.push("b");
    expect(token).toEqual({
        name: "ValueIdentifier",
        type: Token.ValueIdentifier.event,
        original: "ab"
    })
})
// ValueIdentifier:1 ends here

// Blank


// [[file:../literate/LexicalTokenTests.org::*Blank][Blank:1]]
it("Blank", () => {
    expect(Token.Blank.factory()).toEqual({
        name: "Blank",
        type: Token.Blank.event,
        original: "_"
    })
})

it("Blank can NOT be added to", () => {
    const token = Token.Blank.factory();
    expect(() => token.push("a")).toThrowError();
})
// Blank:1 ends here

// Number


// [[file:../literate/LexicalTokenTests.org::*Number][Number:1]]
it("Number", () => {
    expect(Token.Number.factory("1")).toEqual({
        name: "Number",
        type: Token.Number.event,
        original: "1"
    })
})

it("Number can be added to", () => {
    const token = Token.Number.factory("0");
    token.push("1");
    expect(token).toEqual({
        name: "Number",
        type: Token.Number.event,
        original: "01"
    })
})
// Number:1 ends here
