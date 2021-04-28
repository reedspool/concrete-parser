// #+TITLE: Abstract Syntax Tree
// #+PROPERTY: header-args    :comments both :tangle ../src/AbstractSyntaxTree.js

// Factory wrapper because I don't like =new= keyword.


// [[file:../literate/AbstractSyntaxTree.org::+begin_src js][No heading:1]]
import { ValueBlock, OpBlock, Tape } from "../src/Block";
import { Token } from "../src/LexicalToken";
// No heading:1 ends here

// [[file:../literate/AbstractSyntaxTree.org::+begin_src js][No heading:2]]
export const AbstractSyntaxTree = (...args) => new _AbstractSyntaxTree(...args);
// No heading:2 ends here

// [[file:../literate/AbstractSyntaxTree.org::+begin_src js][No heading:3]]
class _AbstractSyntaxTree {
    constructor(isRoot) {
        this.root = isRoot;
        this.tape = Tape();
        this.unfinishedTapeStack = [];
        this.unfinishedParamList = [];
    }

    isEmpty() {
        return this.tape.isEmpty() &&
            this.unfinishedTapeStack.length == 0;
    }

    _appendBlock(block) { this.tape.append(block); }

    appendValueBlock(token) { this._appendBlock(ValueBlock(token)); }

    appendOpBlock(token) { this._appendBlock(OpBlock(token)); }

    appendComma() { this.tape.appendComma(); }

    labelNextCell(token) {
        this.tape.setLabel(
            token.identifier, this.tape.cells.length);
    }

    openTape(isInline) {
        this.unfinishedTapeStack.push(this.tape);
        this.tape = Tape(isInline, this.unfinishedParamList);
        // Reset the param list for next time
        this.unfinishedParamList = [];
    }
// No heading:3 ends here



// Pop the stack and add the tape we have been building to it.


// [[file:../literate/AbstractSyntaxTree.org::+begin_src js][No heading:4]]
    closeTape() {
        const tape = this.unfinishedTapeStack.pop();
        tape.append(this.tape);
        this.tape = tape;
    }

    addParamForNextTape(token) {
        const last = this.unfinishedParamList.slice(-1)[0];

        if (last && last.isExpectingDefault) {
            // If the last was a label, this is the default value for it
            last.default = token;
            delete last.isExpectingDefault;
        }
        else if (token.is(Token.LabelIdentifier) ||
                token.is(Token.ValueIdentifier)) {
            if (this.isParamNameAlreadyUsed(token)) {
                throw new Error(`Duplicate parameter names not allowed: ${token.identifier}`);
            }

            this.unfinishedParamList.push({
                label: token.identifier,
                isExpectingDefault: token.is(Token.LabelIdentifier),
                default: ValueBlock(Token.Blank())
            });
        }
        else {
            throw new Error(`Unexpected parameter ${token.original}, ${token.kind}`);
        }
    }

    isParamNameAlreadyUsed(token) {
        return this.unfinishedParamList.find(param =>
            param.label == token.identifier);
    }
// No heading:4 ends here



// Build all references on the tape.


// [[file:../literate/AbstractSyntaxTree.org::+begin_src js][No heading:5]]
    finalizeReferences() {
        this.tape.finalizeReferences();
    }
}
// No heading:5 ends here
