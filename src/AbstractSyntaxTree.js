// #+TITLE: Abstract Syntax Tree
// #+PROPERTY: header-args    :comments both :tangle ../src/AbstractSyntaxTree.js


// [[file:../literate/AbstractSyntaxTree.org::+begin_src js][No heading:1]]
export const AbstractSyntaxTree = function () {
    return new AST();
}

function AST() {
    this.root = true;
}
// No heading:1 ends here
