// Preamble


// [[file:../literate/IndexTests.org::*Preamble][Preamble:1]]
import { parseFile, Category } from "../src/index";
import * as Parser from "../src/Parser";
import * as Block from "../src/Block";
// Preamble:1 ends here

// Tests


// [[file:../literate/IndexTests.org::*Tests][Tests:1]]
it("Exposes everything it needs to.", () => {
    expect(parseFile).toBeDefined();
    expect(parseFile).toBe(Parser.parseFile);
    expect(Category).toBeDefined();
    expect(Category).toBe(Block.Category);
})
// Tests:1 ends here
