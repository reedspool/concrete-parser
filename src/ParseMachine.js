// Preamble


// [[file:../literate/ParseMachine.org::*Preamble][Preamble:1]]
import { Machine } from "xstate";
import { assign } from '@xstate/immer';
import { Token } from "./LexicalToken"
import { AbstractSyntaxTree } from "./AbstractSyntaxTree"
// Preamble:1 ends here

// Definition

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
                    actions: [ "addTokenToTape" ]
                },
                [Token.Number.event] : {
                    actions: [ "addTokenToTape" ]
                },
                [Token.Blank.event] : {
                    actions: [ "addTokenToTape" ]
                }
            }
        },
        done: {
            type: "final",
            data: (C) => C.tree
        }
    },
    on : {
        DONE: { target: "done" }
    }
};
// Definition:1 ends here

// Configuration


// [[file:../literate/ParseMachine.org::*Configuration][Configuration:1]]
export const config = {
    actions: {
        initialize: assign((C, E) => {
            C.tree = AbstractSyntaxTree();
        }),
        addTokenToTape: assign((C, E) => {
            C.tree.addToCurrentTape(E);
        })
    },
    guards : {}
};
// Configuration:1 ends here

// Initialize


// [[file:../literate/ParseMachine.org::*Initialize][Initialize:1]]
export const init = () => Machine(definition, config).withContext({});
// Initialize:1 ends here
