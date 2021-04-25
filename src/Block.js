// #+TITLE: Block
// #+PROPERTY: header-args    :comments both :tangle ../src/Block.js

// A block is just a wrapper around a lexical token with a category.

// Preamble:


// [[file:../literate/Block.org::+begin_src js][No heading:1]]
import { Token } from "./LexicalToken";
// No heading:1 ends here



// A category helps the interpreter know what to do with the block.


// [[file:../literate/Block.org::+begin_src js][No heading:2]]
export const Category = {
    Value: {},
    Op: {}
};
// No heading:2 ends here



// Automated additions to category.

// Each category has a name so a block can test whether that is its category.


// [[file:../literate/Block.org::+begin_src js][No heading:3]]
Object.entries(Category).forEach(([ name, value ]) => {
    value.name = name;
});
// No heading:3 ends here



// There are two categories of blocks, "value" and "op". The distinction is that values become arguments when executed, whereas ops do anything and everything else a program can do.


// [[file:../literate/Block.org::+begin_src js][No heading:4]]
export const ValueBlock = (token) => new _Block(token, Category.Value);
export const OpBlock = (token) => new _Block(token, Category.Op);
// No heading:4 ends here



// Always finalize a given token. If there is an identifier, lift it up to the block so users do not have to check the token exists and then inspect it.


// [[file:../literate/Block.org::+begin_src js][No heading:5]]
class _Block {
    constructor(token, category) {
        this.token = token;
        this.category = category;

        this.token?.finalize();
        this.identifier = this.token?.identifier;
    }
// No heading:5 ends here



// We want to easily check which category a block belongs to, e.g. =myBlock.is(Category.Value)=.


// [[file:../literate/Block.org::+begin_src js][No heading:6]]
    is(category) { return this.category.name == category.name; }
// No heading:6 ends here



// Any value block can exit the Concrete environment into JavaScript land.

// How to convert the block into a JS value depends on what it contains.

// Blocks are immutable so we can cache the value instead of recalculating it.


// [[file:../literate/Block.org::+begin_src js][No heading:7]]
    asJS() {
        if (typeof this.jsValue != "undefined") return this.jsValue;

        if (this.token.is(Token.Blank)) {
            this.jsValue = null;
        }
        else if (this.token.is(Token.Number)) {
            this.jsValue = parseFloat(this.token.original);
        }
        else if (this.token.is(Token.String)) {
            // TODO: HOW DO WE NOT USE EVAL HERE OTHER THAN CONSTRUCTING THE STRING IN A DIFFERENT WAY
            this.jsValue = eval(this.token.original);
        }
        else {
            throw new Error(`Block of token type ${this.token.name} cannot be converted to JS`);
        }
        
        return this.jsValue;
    }
// No heading:7 ends here



// Close the block class


// [[file:../literate/Block.org::+begin_src js][No heading:8]]
}
// No heading:8 ends here



// A tape is a container of blocks. It is always of category "Value".


// [[file:../literate/Block.org::+begin_src js][No heading:9]]
export const Tape = (...args) => new _Tape(...args);
// No heading:9 ends here

// [[file:../literate/Block.org::+begin_src js][No heading:10]]
class _Tape {
    constructor (isInline, params = []) {
        this.cells = [];
        this.commas = {};
        this.params = params;
        this.labelsByIndex = [];
        this.labelsToIndex = {};
        this.isInline = isInline;
        this.category = Category.Value;
    }
    
    is(category) { return this.category.name == category.name; }

    isEmpty() { return this.cells.length == 0; }

    append (block) {
        this.cells.push(block);
    }

    appendComma () {
        this.commas[this.cells.length] = true;
    }

    setLabel (token, index) {
        this.labelsByIndex[index] = token.original;
        this.labelsToIndex[token.original] = index;
    }

    asJS() {
        return this.cells.map(block => block.asJS());
    }
}
// No heading:10 ends here
