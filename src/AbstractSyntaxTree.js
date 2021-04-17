// #+TITLE: Abstract Syntax Tree
// #+PROPERTY: header-args    :comments both :tangle ../src/AbstractSyntaxTree.js

// Factory wrapper because I don't like =new= keyword.


// [[file:../literate/AbstractSyntaxTree.org::+begin_src js][No heading:1]]
export const AbstractSyntaxTree = (...args) => new _AbstractSyntaxTree(...args);
// No heading:1 ends here

// [[file:../literate/AbstractSyntaxTree.org::+begin_src js][No heading:2]]
class _AbstractSyntaxTree {
    constructor() {
        this.root = true;
        this.currentTape = [];
    }

    addToCurrentTape(token) {
        this.currentTape.push(token);
    }
}
// No heading:2 ends here
