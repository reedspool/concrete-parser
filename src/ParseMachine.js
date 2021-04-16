// [[file:../literate/ParseMachine.org::*Preamble][Preamble:1]]
import { Machine } from "xstate";
import { assign } from '@xstate/immer';
import { Token } from "./LexicalToken"
import { AbstractSyntaxTree } from "./AbstractSyntaxTree"
// Preamble:1 ends here

// [[file:../literate/ParseMachine.org::*Definition][Definition:1]]
export const definition = {
    strict: true,
    id: "ParseMachine",
    initial: "uninitialized",
    states: {
        uninitialized : {
            entry: [ "initialize" ],
            always: "ready"
        },
        ready : {
            on: {
                [Token.ValueIdentifier.event] : {
                    actions: [ "addToTape" ]
                }
            }
        },
        done: { final : true }
    },
    on : {
        EOF: { target: "done" }
    }
};
// Definition:1 ends here

// [[file:../literate/ParseMachine.org::*Configuration][Configuration:1]]
export const config = {
    actions: {
        initialize: assign((C, E) => {
            C.tree = AbstractSyntaxTree();
        }),
        addCharToCurrentBlock: assign((C, E) => {
            C.currentBlock
        })
    },
    guards : {}
};
// Configuration:1 ends here

// [[file:../literate/ParseMachine.org::*Initialize][Initialize:1]]
export const init = () => Machine(definition, config);
// Initialize:1 ends here
