// Preamble


// [[file:../literate/IndexTests.org::*Preamble][Preamble:1]]
import { parseFile } from "../src/index";
import * as Parser from "../src/Parser";
// Preamble:1 ends here

// Tests


// [[file:../literate/IndexTests.org::*Tests][Tests:1]]
it("Exposes everything it needs to.", () => {
    expect(parseFile).toBeDefined();
    expect(parseFile).toBe(Parser.parseFile);
})
// Tests:1 ends here
