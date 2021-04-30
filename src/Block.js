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
    is(category, kind) {
        return this.category.name == category.name &&
            (! kind || this.category.kind == kind);
    }
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
        this.references = {};
        this.params = params;
        this.labelsByIndex = [];
        this.labelsToIndex = {};
        this.isInline = isInline;
        
        // Copy category to mutate
        this.category = { ...Category.Value };
        this.category.kind = "Tape";
    }
// No heading:11 ends here



// To make a shallow copy, we only need to make a shallow copy of fields that are going to change, and right now the only field that ever changes is cells.


// [[file:../literate/Block.org::+begin_src js][No heading:12]]
    shallowCopy() {
        const copy = Tape(this.isInline);
        copy.cells = [ ...this.cells ];
        copy.commas = this.commas;
        copy.references = this.references;
        copy.params = this.params;
        copy.labelsByIndes = this.labelsByIndex;
        copy.labelsToIndex = this.labelsToIndex;
        copy.isInline = this.isInline;
    }
    
    is(category, kind) {
        return this.category.name == category.name &&
            (! kind || this.category.kind == kind);
    }

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

    getBlockByLabel (label) {
        return this.cells[this.labelsToIndex[label]];
    }

    setBlockByLabel (label, block) {
        return this.cells[this.labelsToIndex[label]] = block;
    }

    getIndexOfLabel(label) {
        return this.labelsToIndex[label];
    }

    asJS() {
        return this.cells.map(block => block.asJS());
    }
// No heading:12 ends here



// After a tree is fully parsed, establish the relationship between all identifiers. These relationships are our references. Any identifier which does not refer to a label in its tape, local scope, or a tape outside it, lexical scope, must refer to a global. Later, when globals exist, any unfulfilled references are errors.

// Because parsing happens linearly, the parser must build these references after parsing is complete. If it tried to build these references while parsing, it would miss labels which are not yet parsed.

// Each tape will have its own reference map. The keys of this map come from the identifiers on this tape, as well as those on any tapes composed within this one. The values of the map describe how to find the cell labeled with that identifier.

// The reference values are one of three types. First, if the labeled cell exists on this tape or its parameters, the reference value has a type of "local" or "param". The second type is "upvalue," and is more complicated.

// Upvalues are references which do not refer to labeled cells on this tape. They must either refer to a cell in one of this tape's ancestors (the tapes in which this tape exists) or a global. Otherwise, that identifier is an error.

// Upvalues in this tape might also refer to upvalues from tapes within this one, creating a trail which points up the tape's ancestral tree until it matches a "local" reference, or a global.

// The process for building the references is conceptually simpler than the structure itself.

// 1. Establish all "param" references by looking at the label of each param.
// 2. Establish all "local" references by looking at each label on the tape.
// 3. Look at each block on this tape once again, and for each:
//    a. If it's a non-label identifier, if we already established that reference, do nothing. Otherwise, it must be an "upvalue".
//    b. If it's a tape, recurse and finalize its references. If that tape has any "upvalue" references, and we do not have an existing reference for that identifier, then copy the "upvalue" into this tape's reference map.


// [[file:../literate/Block.org::+begin_src js][No heading:13]]
    finalizeReferences() {
        // First, add all parameters
        this.params.forEach(({ label }, index) => {
            this.references[label] = { type: "param", label, index };
        });

        // Then, add all local labels
        Object.entries(this.labelsToIndex).forEach(([label, index]) => {
            this.references[label] = { type: "local", label, index };
        });

        // Then recurse on tapes and add any upvalues for missing references.
        this.cells.forEach((block) => {
            const { identifier } = block;
            if (identifier && ! this.references[identifier]) {
                this.references[identifier] = { type: "upvalue", label: identifier };
            }

            if (block.is(Category.Value, "Tape")) {
                block.finalizeReferences();

                Object.values(block.references).forEach((value) => {
                    const { label, type } = value;
                    if (type == "upvalue" && ! this.references[label]) {
                        this.references[label] = value;
                    }
                });
            }
        })
    }
}
// No heading:13 ends here
