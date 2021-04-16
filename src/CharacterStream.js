// #+TITLE: Character Stream
// #+PROPERTY: header-args    :comments both :tangle ../src/CharacterStream.js

// A simple function to take a string of source code and call a callback with each character and its "kind". "Kind" in this context means what kind of character it is with respect to lexical analysis.


// [[file:../literate/CharacterStream.org::+begin_src js][No heading:1]]
export const stream = (source, callback) => {
    const len = source.length;
    for (let i = 0; i < source.length; i++) {
        const char = source[i];
        callback(getKind(char).event, char);
    }
}
// No heading:1 ends here



// Streaming a file is the same as a normal stream except it ends with =EOF=


// [[file:../literate/CharacterStream.org::+begin_src js][No heading:2]]
export const streamFile = (source, callback) => {
    stream(source, callback);
    callback(Kind.EOF.event, undefined);
}
// No heading:2 ends here



// A data structure mapping a name for a kind of character or range of characters to information about it

// The "event" field of each kind is upper-cased so it fits the "type" field of our XState Machine events.

// Then, we have to describe what characters belong to that kind, which we do in a few different ways.

// If the kind has a "literal" field, then only one character is of that kind, and it's the value of that field.

// If the kind has a "group" field, the group is an array containing "range" objects or single character strings.

// "Range" objects have a type field of "range", and "start" and "end" fields such that all characters between and including those characters are part of that kind.


// [[file:../literate/CharacterStream.org::+begin_src js][No heading:3]]
export const Kind = {};
Kind.Alphabetic = {
    event: "ALPHABETIC",
    group: [
        { type: "range", start: "a", end: "z" },
        { type: "range", start: "A", end: "Z" }
    ]
};
Kind.Numeric = {
    event: "NUMERIC",
    group: [
        { type: "range", start: "0", end: "9" }
    ]
};
Kind.Whitespace = {
    event: "WHITESPACE",
    group: [" ", "\t"]
};
Kind.Underscore = {
    event: "UNDERSCORE",
    literal: "_",
};
Kind.Colon = {
    event: "COLON",
    literal: ":",
};
Kind.Period = {
    event: "PERIOD",
    literal: ".",
};
Kind.Exclamation = {
    event: "EXCLAMATION",
    literal: "!",
};
Kind.AtSign = {
    event: "AT_SIGN",
    literal: "@",
};
Kind.OpenFold = {
    event: "OPEN_FOLD",
    literal: "[",
};
Kind.CloseFold = {
    event: "CLOSE_FOLD",
    literal: "]",
};
Kind.OpenArgs = {
    event: "OPEN_ARGS",
    literal: "(",
};
Kind.CloseArgs = {
    event: "CLOSE_ARGS",
    literal: ")",
};
Kind.OpenInlineFold = {
    event: "OPEN_INLINE_FOLD",
    literal: "{",
};
Kind.CloseInlineFold = {
    event: "CLOSE_INLINE_FOLD",
    literal: "}",
};
Kind.EOF = {
    event: "EOF",
};
// No heading:3 ends here



// Repeat all kind names in their contents, to aid debugging and testing.


// [[file:../literate/CharacterStream.org::+begin_src js][No heading:4]]
Object.entries(Kind).forEach(([ kind, value ]) => {
    value.name = kind;
})
// No heading:4 ends here



// Construct a cache of all valid characters to their respective kind.

// TODO: This cache might make the "test" field above unnecessary.


// [[file:../literate/CharacterStream.org::+begin_src js][No heading:5]]
const charToKind = {};

// Loop inclusive range and set each char in that range to kind.
// Convert to and from charCode just for easy increment.
const charRangeEstablishKind = (start, end, kind) => {
    let i = start.charCodeAt(0);
    const last = end.charCodeAt(0);
    for (; i <= last; i++) charToKind[String.fromCharCode(i)] = kind;
}

// Now one loop through all the kinds to map all the literals
Object.entries(Kind).forEach(([ kind, { literal, group } ]) => {
    if (literal) charToKind[literal] = kind;
    if (group) {
        // Group items are either range objects or literals
        for (let i = 0; i < group.length; i++) {
            const g = group[i];
            if (g?.type == "range")
                charRangeEstablishKind(g.start, g.end, kind)
            if (typeof g == "string") charToKind[g] = kind;
        }
    }
})
// No heading:5 ends here



// Isolate the logic for pairing the char to the kind.

// Always throw an error if the type of character is unknown.


// [[file:../literate/CharacterStream.org::+begin_src js][No heading:6]]
export const getKind = (char) => {
    const kind = charToKind[char];
    if (kind) return Kind[kind];
    throw new Error(`Unreadable character: ${char}`);
}
// No heading:6 ends here
