// #+TITLE: Abstract Syntax Tree Tests
// #+PROPERTY: header-args    :comments both :tangle ../test/AbstractSyntaxTree.test.js


// [[file:../literate/AbstractSyntaxTreeTests.org::+begin_src js][No heading:1]]
import { AbstractSyntaxTree } from "../src/AbstractSyntaxTree"
import { Token } from "../src/LexicalToken"
import { Block, Tape } from "../src/Block"

describe("Basics", () => {
    it("Can be initialized", () => {
        const tree = AbstractSyntaxTree(true);
        expect(tree).toBeDefined();
        expect(tree.root).toBeTruthy();
    })
})
// No heading:1 ends here

// [[file:../literate/AbstractSyntaxTreeTests.org::+begin_src js][No heading:2]]
it("Can add Token to tape", () => {
    const tree = AbstractSyntaxTree();
    tree.appendBlock(Token.Number.factory("3"));
    expect(tree.tape.cells).toEqual(
        [Block(Token.Number.factory("3"))]);
})
// No heading:2 ends here
