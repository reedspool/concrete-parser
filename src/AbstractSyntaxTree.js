// #+TITLE: Abstract Syntax Tree
// #+PROPERTY: header-args    :comments both :tangle ../src/AbstractSyntaxTree.js

// Factory wrapper because I don't like =new= keyword.


// [[file:../literate/AbstractSyntaxTree.org::+begin_src js][No heading:1]]
import { Block, Tape } from "../src/Block";
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
        this.unfinishedParameterList = [];
    }

    appendBlock(token) {
        this.tape.append(Block(token));
    }

    labelNextCell(token) {
        this.tape.setLabel(
            token, this.tape.cells.length);
    }

    openTape(isInline) {
        this.unfinishedTapeStack.push(this.tape);
        this.tape = Tape(isInline, this.unfinishedParameterList);
        // Reset the parameter list for next time
        this.unfinishedParameterList = [];
    }

    // Pop the stack and add the tape we have been building to it
    closeTape() {
        const tape = this.unfinishedTapeStack.pop();
        tape.append(this.tape);
        this.tape = tape;
    }

    addParamForNextTape(token) {
        const last = this.unfinishedParameterList.slice(-1)[0];
        
        if (last && last.label.is(Token.LabelIdentifier.name) && ! last.default) {
            // If the last was a label, this is the default value for it
            last.default = token;
        }
        else if (token.is(Token.LabelIdentifier.name) ||
                token.is(Token.ValueIdentifier.name)) {
            if (this.parameterNameAlreadyUsed(token)) {
                throw new Error(`Duplicate parameter names not allowed: ${token.original}`);
            }
            
            this.unfinishedParameterList.push({
                label: token
            });
        }
        else {
            throw new Error(`Unexpected parameter ${token.original}, ${token.name}`);
        }
    }

    parameterNameAlreadyUsed(token) {
        return this.unfinishedParameterList.find(param => 
            param.label.original == token.original);
    }
}
// No heading:3 ends here
