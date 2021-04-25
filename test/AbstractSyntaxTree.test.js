// #+TITLE: Abstract Syntax Tree Tests
// #+PROPERTY: header-args    :comments both :tangle ../test/AbstractSyntaxTree.test.js


// [[file:../literate/AbstractSyntaxTreeTests.org::+begin_src js][No heading:1]]
import { AbstractSyntaxTree } from "../src/AbstractSyntaxTree"
import { Token } from "../src/LexicalToken"
import { ValueBlock, Tape } from "../src/Block"

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
    tree.appendValueBlock(Token.Number("3"));
    expect(tree.tape.cells).toEqual(
        [ValueBlock(Token.Number("3"))]);
})
// No heading:2 ends here

// [[file:../literate/AbstractSyntaxTreeTests.org::+begin_src js][No heading:3]]
it("Tree starts out empty", () => {
    const tree = AbstractSyntaxTree();
    expect(tree.isEmpty()).toBeTruthy();
})
// No heading:3 ends here

// [[file:../literate/AbstractSyntaxTreeTests.org::+begin_src js][No heading:4]]
it("Tree after adding a block is no longer empty", () => {
    const tree = AbstractSyntaxTree();
    tree.appendValueBlock(Token.Number("3"));
    expect(tree.isEmpty()).toBeFalsy();
})
// No heading:4 ends here
