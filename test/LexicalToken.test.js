// Preamble


// [[file:../literate/LexicalTokenTests.org::*Preamble][Preamble:1]]
import { Token } from "../src/LexicalToken.js";
// Preamble:1 ends here

// ValueIdentifier


// [[file:../literate/LexicalTokenTests.org::*ValueIdentifier][ValueIdentifier:1]]
it("Simple ValueIdentifier", () => {
    expect(Token.ValueIdentifier.create("abcd").finalize()).toEqual({
        name: "ValueIdentifier",
        type: Token.ValueIdentifier.event,
        original: "abcd",
        identifier: "abcd"
    })
})

it("ValueIdentifier can be added to", () => {
    const token = Token.ValueIdentifier.create("a");
    token.push("b");
    token.finalize();
    expect(token).toEqual({
        name: "ValueIdentifier",
        type: Token.ValueIdentifier.event,
        original: "ab",
        identifier: "ab"
    })
})
// ValueIdentifier:1 ends here

// CallIdentifier


// [[file:../literate/LexicalTokenTests.org::*CallIdentifier][CallIdentifier:1]]
it("Simple CallIdentifier", () => {
    expect(Token.CallIdentifier.create("abcd!").finalize()).toEqual({
        name: "CallIdentifier",
        type: Token.CallIdentifier.event,
        original: "abcd!",
        identifier: "abcd"
    })
})
// CallIdentifier:1 ends here

// AddressIdentifier


// [[file:../literate/LexicalTokenTests.org::*AddressIdentifier][AddressIdentifier:1]]
it("Simple AddressIdentifier", () => {
    expect(Token.AddressIdentifier.create("@abcd").finalize()).toEqual({
        name: "AddressIdentifier",
        type: Token.AddressIdentifier.event,
        original: "@abcd",
        identifier: "abcd"
    })
})
// AddressIdentifier:1 ends here

// LabelIdentifier


// [[file:../literate/LexicalTokenTests.org::*LabelIdentifier][LabelIdentifier:1]]
it("Simple LabelIdentifier", () => {
    expect(Token.LabelIdentifier.create("abcd:").finalize()).toEqual({
        name: "LabelIdentifier",
        type: Token.LabelIdentifier.event,
        original: "abcd:",
        identifier: "abcd"
    })
});
// LabelIdentifier:1 ends here

// Blank


// [[file:../literate/LexicalTokenTests.org::*Blank][Blank:1]]
it("Blank", () => {
    expect(Token.Blank.create()).toEqual({
        name: "Blank",
        type: Token.Blank.event,
        original: "_"
    })
})

it("Blank can NOT be added to", () => {
    const token = Token.Blank.create();
    expect(() => token.push("a")).toThrowError();
})
// Blank:1 ends here

// Number


// [[file:../literate/LexicalTokenTests.org::*Number][Number:1]]
it("Number", () => {
    expect(Token.Number.create("1")).toEqual({
        name: "Number",
        type: Token.Number.event,
        original: "1"
    })
})

it("Number can be added to", () => {
    const token = Token.Number.create("0");
    token.push("1");
    expect(token).toEqual({
        name: "Number",
        type: Token.Number.event,
        original: "01"
    })
})
// Number:1 ends here
