// Preamble


// [[file:../literate/Parser.org::*Preamble][Preamble:1]]
import * as Block from "../src/Block";
// Preamble:1 ends here

// Actually parsing a stream of characters

// I wrote code to pass just the simplest case first:


// [[file:../literate/Parser.org::*Actually parsing a stream of characters][Actually parsing a stream of characters:1]]
export const single = (source) => {
    if (source == "_") return Block.Blank();
}
// Actually parsing a stream of characters:1 ends here
