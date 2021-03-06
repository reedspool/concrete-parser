// Preamble


// [[file:../literate/CharacterStreamTests.org::*Preamble][Preamble:1]]
import { stream, streamFile, Kind, getKind } from "../src/CharacterStream";
// Preamble:1 ends here

// Stream


// [[file:../literate/CharacterStreamTests.org::*Stream][Stream:1]]
it("Takes a string of letters and streams characters", () => {
    const mock = jest.fn();
    const input = "test";
    stream(input, mock);
    expect(mock).toHaveBeenCalledTimes(input.length);
    // NthCalledWith is 1-based
    expect(mock).toHaveBeenNthCalledWith(1, { type: Kind.Alphabetic.event, char: "t" });
    expect(mock).toHaveBeenNthCalledWith(2, { type: Kind.Alphabetic.event, char: "e" });
    expect(mock).toHaveBeenNthCalledWith(3, { type: Kind.Alphabetic.event, char: "s" });
    expect(mock).toHaveBeenNthCalledWith(4, { type: Kind.Alphabetic.event, char: "t" });
})
// Stream:1 ends here

// Stream File


// [[file:../literate/CharacterStreamTests.org::*Stream File][Stream File:1]]
it("Takes a string of letters and streams characters plus EOF", () => {
    const mock = jest.fn();
    const input = "test";
    streamFile(input, mock);
    expect(mock).toHaveBeenCalledTimes(input.length + 1);
    // NthCalledWith is 1-based
    expect(mock).toHaveBeenNthCalledWith(1, { type: Kind.Alphabetic.event, char: "t" });
    expect(mock).toHaveBeenNthCalledWith(2, { type: Kind.Alphabetic.event, char: "e" });
    expect(mock).toHaveBeenNthCalledWith(3, { type: Kind.Alphabetic.event, char: "s" });
    expect(mock).toHaveBeenNthCalledWith(4, { type: Kind.Alphabetic.event, char: "t" });
    expect(mock).toHaveBeenNthCalledWith(5, { type: Kind.EOF.event, char: undefined });
})
// Stream File:1 ends here

// Unknown character


// [[file:../literate/CharacterStreamTests.org::*Unknown character][Unknown character:1]]
it("Unknown character throws an error", () => {
    const input = "\x00";
    const fn = () => streamFile(input, mock);
    expect(fn).toThrowError();
})
// Unknown character:1 ends here

// Kind

// First test that all valid characters have a "kind."


// [[file:../literate/CharacterStreamTests.org::*Kind][Kind:1]]
it("All valid characters have a kind", () => {
    const testCharHasKind = (char) => {
        const kind = getKind(char);
        expect(kind.name).toBeDefined();
        expect(kind).toBe(Kind[kind.name]);
        expect(kind).not.toEqual(Kind.Unknown);
    }
    const rangeHasKind = (start, end) => {
        let i = start.charCodeAt(0);
        const last = end.charCodeAt(0);
        for (; i <= last; i++) {
            const char = String.fromCharCode(i);
            testCharHasKind(char);
        }
    }

    rangeHasKind("a", "z");
    rangeHasKind("A", "Z");
    rangeHasKind("0", "9");

    // Now check all literals
    ["_", ".", "!", "@", "[", "]", "(", ")", "{", "}", ":", " ", "\t", "\n", "\"", ","]
        .forEach(testCharHasKind);
})
// Kind:1 ends here



// Next test that kind has the correct shape

// I don't know how to do this kind of complex structure testing idiomatically with Jest, so making up my own failure. I guess this is what TypeScript is great for.


// [[file:../literate/CharacterStreamTests.org::*Kind][Kind:2]]
it("All kinds have valid shape", () => {
    const fail = (msg) =>
        expect(msg).not.toBeDefined();
    Object.entries(Kind).forEach(
        ([name, value]) => {
            expect(value.name).toBe(name);

            if (value.literal && value.group) {
                fail(`Kind ${name} has both literal and group`);
            }
            else if (value.literal) {
                expect(typeof value.literal).toBe("string")
                expect(value.literal).toHaveLength(1);
            }
            else if (value.group) {
                expect(Array.isArray(value.group)).toBe(true);
                value.group.forEach((g) => {
                    if (typeof g == "string") {
                        expect(g).toHaveLength(1);
                    }
                    else if (typeof g == "object") {
                        expect(g.type).toBe("range");
                        expect(typeof g.start).toBe("string");
                        expect(g.start).toHaveLength(1);
                        expect(typeof g.end).toBe("string");
                        expect(g.end).toHaveLength(1);
                    }
                })
            }
        });

})
// Kind:2 ends here
