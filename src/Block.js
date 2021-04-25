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

// Subcategories are equivalent to the "kind" of token or the type of the JS value used to create it.


// [[file:../literate/Block.org::+begin_src js][No heading:4]]
const jsTypesToKind = {
    number: Token.Number.kind,
    string: Token.String.kind,
    null: Token.Blank.kind
};
// No heading:4 ends here

// [[file:../literate/Block.org::+begin_src js][No heading:5]]
export const ValueBlock = (token) => new _Block(token, Category.Value);
ValueBlock.fromJS = (js) => new _Block(undefined, Category.Value, js);
export const OpBlock = (token) => new _Block(token, Category.Op);
// No heading:5 ends here



// Always finalize a given token. If there is an identifier or a jsValue present after finalizing, lift it up to the block so users do not have to check the token exists and then inspect it.


// [[file:../literate/Block.org::+begin_src js][No heading:6]]
class _Block {
    constructor(token, category, jsValue) {
        this.jsValue = jsValue;

        // Copy category so we can modify it with determined kind
        this.category = { ...category };

        if (token) {
            token.finalize();
            this.identifier = token.identifier;
            this.token = token;
            this.category.kind = token.kind;
        }
        else if (typeof jsValue != "undefined") {
            const kind = jsTypesToKind[typeof jsValue];

            if (! kind) throw new Error(`No kind defined for JS value "${jsValue}", type "${typeof jsValue}"`);
            
            this.category.kind = kind;
        }
        else throw new Error("Block must be constructed with initial Token or JS Value");
    }
// No heading:6 ends here



// We want to easily check which category a block belongs to, e.g. =myBlock.is(Category.Value)=.


// [[file:../literate/Block.org::+begin_src js][No heading:7]]
    is(category, kind) { return this.category.name == category.name && (! kind || this.category.kind == kind ); }
// No heading:7 ends here



// Any value block can exit the Concrete environment into JavaScript land.

// How to convert the block into a JS value depends on what it contains.

// Blocks are immutable so we can cache the value instead of recalculating it.


// [[file:../literate/Block.org::+begin_src js][No heading:8]]
    asJS() {
        if (typeof this.jsValue != "undefined") return this.jsValue;

        // Returns undefined if unable to convert
        this.jsValue = this.token.asJS();
        
        if (typeof this.jsValue == "undefined") {
            throw new Error(`Block of token type ${this.token.kind} cannot be converted to JS`);
        }

        return this.jsValue;
    }
// No heading:8 ends here



// Close the block class


// [[file:../literate/Block.org::+begin_src js][No heading:9]]
}
// No heading:9 ends here



// A tape is a container of blocks. It is always of category "Value".


// [[file:../literate/Block.org::+begin_src js][No heading:10]]
export const Tape = (...args) => new _Tape(...args);
// No heading:10 ends here

// [[file:../literate/Block.org::+begin_src js][No heading:11]]
class _Tape {
    constructor (isInline, params = []) {
        this.cells = [];
        this.commas = {};
        this.params = params;
        this.labelsByIndex = [];
        this.labelsToIndex = {};
        this.isInline = isInline;
        
        // Copy category to mutate
        this.category = { ...Category.Value };
        this.category.kind = "Tape";
    }
    
    is(category) { return this.category.name == category.name; }

    isEmpty() { return this.cells.length == 0; }

    append (block) {
        this.cells.push(block);
    }

    appendComma () {
        this.commas[this.cells.length] = true;
    }

    setLabel (label, index) {
        this.labelsByIndex[index] = label;
        this.labelsToIndex[label] = index;
    }

    getBlockAtLabel (label) {
        return this.cells[this.labelsToIndex[label]];
    }

    setBlockAtLabel (label, block) {
        return this.cells[this.labelsToIndex[label]] = block;
    }

    asJS() {
        return this.cells.map(block => block.asJS());
    }
}
// No heading:11 ends here
