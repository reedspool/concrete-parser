// #+TITLE: Block
// #+PROPERTY: header-args    :comments both :tangle ../src/Block.js

// A block is just a wrapper around a lexical token


// [[file:../literate/Block.org::+begin_src js][No heading:1]]
export const Block = (...args) => new _Block(...args);
// No heading:1 ends here

// [[file:../literate/Block.org::+begin_src js][No heading:2]]
class _Block {
    constructor(token) {
        this.token = token;
    }
}
// No heading:2 ends here



// A tape is a container of blocks


// [[file:../literate/Block.org::+begin_src js][No heading:3]]
export const Tape = (...args) => new _Tape(...args);
// No heading:3 ends here

// [[file:../literate/Block.org::+begin_src js][No heading:4]]
class _Tape {
    constructor (isInline, params = []) {
        this.cells = [];
        this.params = params;
        this.labelsByIndex = [];
        this.labelsToIndex = {};
        this.isInline = isInline;
    }

    append (block) {
        this.cells.push(block);
    }

    setLabel (token, index) {
        this.labelsByIndex[index] = token.original;
        this.labelsToIndex[token.original] = index;
    }
}
// No heading:4 ends here
