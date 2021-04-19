// #+TITLE: Block
// #+PROPERTY: header-args    :comments both :tangle ../src/Block.js

// A block is just a wrapper around a lexical token with a category.

// A category helps the interpreter know what to do with the block.


// [[file:../literate/Block.org::+begin_src js][No heading:1]]
export const Category = {
    Value: {},
    Op: {}
};
// No heading:1 ends here



// Automated additions to category.

// Each category has a name so a block can test whether that is its category.


// [[file:../literate/Block.org::+begin_src js][No heading:2]]
Object.entries(Category).forEach(([ name, value ]) => {
    value.name = name;
});
// No heading:2 ends here



// There are two categories of blocks, "value" and "op". The distinction is that values become arguments when executed, whereas ops do anything and everything else a program can do.


// [[file:../literate/Block.org::+begin_src js][No heading:3]]
export const ValueBlock = (token) => new _Block(token, Category.Value);
export const OpBlock = (token) => new _Block(token, Category.Op);
// No heading:3 ends here

// [[file:../literate/Block.org::+begin_src js][No heading:4]]
class _Block {
    constructor(token, category) {
        this.token = token;
        this.category = category;
    }
// No heading:4 ends here



// We want to easily check which category a block belongs to, e.g. =myBlock.is(Category.Value)=.


// [[file:../literate/Block.org::+begin_src js][No heading:5]]
    is(category) { return this.category.name == category.name; }
}
// No heading:5 ends here



// A tape is a container of blocks. It is always of category "Value".


// [[file:../literate/Block.org::+begin_src js][No heading:6]]
export const Tape = (...args) => new _Tape(...args);
// No heading:6 ends here

// [[file:../literate/Block.org::+begin_src js][No heading:7]]
class _Tape {
    constructor (isInline, params = []) {
        this.cells = [];
        this.params = params;
        this.labelsByIndex = [];
        this.labelsToIndex = {};
        this.isInline = isInline;
        this.category = Category.Value;
    }
    
    is(category) { return this.category.name == category.name; }

    append (block) {
        this.cells.push(block);
    }

    setLabel (token, index) {
        this.labelsByIndex[index] = token.original;
        this.labelsToIndex[token.original] = index;
    }
}
// No heading:7 ends here
