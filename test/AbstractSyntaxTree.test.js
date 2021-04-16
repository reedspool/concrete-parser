// #+TITLE: Abstract Syntax Tree Tests
// #+PROPERTY: header-args    :comments both :tangle ../test/AbstractSyntaxTree.test.js


// [[file:../literate/AbstractSyntaxTreeTests.org::+begin_src js][No heading:1]]
import { AbstractSyntaxTree } from "../src/AbstractSyntaxTree"

describe("Basics", () => {
    it("Can be initialized", () => {
        const tree = AbstractSyntaxTree();
        expect(tree).toBeDefined();
        expect(tree.root).toBeTruthy();
    })
})
// No heading:1 ends here
