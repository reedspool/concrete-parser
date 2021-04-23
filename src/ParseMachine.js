// Preamble


// [[file:../literate/ParseMachine.org::*Preamble][Preamble:1]]
import { Machine } from "xstate";
import { assign } from '@xstate/immer';
import { Token } from "./LexicalToken"
import { Block, Tape } from "./Block"
import { AbstractSyntaxTree } from "./AbstractSyntaxTree"
// Preamble:1 ends here

// Definition

// Standard start to initialize itself with all necessary internal structure.


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
// Definition:1 ends here



// The machine spends its entire life cycle in the "ready" state, where it can accept anything valid.

// The "ready" state has sub-states which dictate different sequences of valid tokens by overriding/shadowing the accepted events.

// First, the simplest tokens are the ones which get added to the tape as blocks unto themselves. One could describe these as "atomic values".

// Almost all the top-level tokens except labels switch the label-substate back to "any", because they are valid labels.


// [[file:../literate/ParseMachine.org::*Definition][Definition:2]]
        ready : {
            on: {
                [Token.ValueIdentifier.event] : {
                    target: ".label.any",
                    actions: [ "addValueBlockToTape" ]
                },
                [Token.AddressIdentifier.event] : {
                    target: ".label.any",
                    actions: [ "addValueBlockToTape" ]
                },
                [Token.CallIdentifier.event] : {
                    target: ".label.any",
                    actions: [ "addOpBlockToTape" ]
                },
                [Token.String.event] : {
                    target: ".label.any",
                    actions: [ "addValueBlockToTape" ]
                },
                [Token.Number.event] : {
                    target: ".label.any",
                    actions: [ "addValueBlockToTape" ]
                },
                [Token.Blank.event] : {
                    target: ".label.any",
                    actions: [ "addValueBlockToTape" ]
                },
// Definition:2 ends here



// Commas are not blocks, they bind value blocks together. So they don't add a block to the tape.


// [[file:../literate/ParseMachine.org::*Definition][Definition:3]]
                [Token.Comma.event] : {
                    target: ".label.any",
                    actions: [ "addCommaToTape" ]
                },
// Definition:3 ends here



// If we get a label, it must label a block, so we move into the sub-state in which a block must come next.


// [[file:../literate/ParseMachine.org::*Definition][Definition:4]]
                [Token.LabelIdentifier.event] : {
                    target: ".label.expectingBlock",
                    actions: [ "labelNextBlock" ]
                },
// Definition:4 ends here



// Tokens which open and close tapes are a little more complicated than the simple block tokens.


// [[file:../literate/ParseMachine.org::*Definition][Definition:5]]
                [Token.OpenTape.event] : {
                    target: ".label.any",
                    actions: [ "openTape" ]
                },
                [Token.CloseTape.event] : {
                    actions: [ "closeTape" ]
                },
                [Token.OpenInlineTape.event] : {
                    target: ".label.any",
                    actions: [ "openInlineTape" ]
                },
                [Token.CloseInlineTape.event] : {
                    actions: [ "closeInlineTape" ]
                },
// Definition:5 ends here



// Parameter lists are one of the most complicated constructs in the syntax, so they deserve their own sub-state.


// [[file:../literate/ParseMachine.org::*Definition][Definition:6]]
                [Token.OpenParams.event] : {
                    target: [ ".label.any", ".params.open" ],
                    actions: [ "openParams" ]
                },
            },
// Definition:6 ends here



// Now we describe the sub-states. First, the parameters' sub-state. Basic parameters are labels, which will point to the argument in the same position. When a ValueIdentifier is present alone as a parameter, its value is used as if it were a label.

// The use of ValueIdentifiers in parameter lists as labels can be confusing since LabelIdentifiers also appear in parameter lists, when they describe default values. When a LabelIdentifier appears, a value block /must/ follow it to fulfill the default value, although that might be a blank block.

// Two labels in a parameter list cannot be exactly the same. This logic is handled in the AbstractSyntaxTree implementation.

// Most of the time, this sub-state is in the "not" state, because most of a program is not within a parameter list. This sub-state does not change anything about the parent "ready" state.

// Note the use of the wildcard event, ="*"=, which overrides/shadows /all/ events. Many possible tokens are invalid in a parameter list.


// [[file:../literate/ParseMachine.org::*Definition][Definition:7]]
            type: "parallel",
            states : {
                params : {
                    initial: "not",
                    states : {
                        not: {},
                        open: {
                            on: {
                                [Token.CloseParams.event] : {
                                    target: "expectingTape"
                                },
                                [Token.ValueIdentifier.event] : {
                                    actions: [ "addTokenToParams" ]
                                },
                                [Token.LabelIdentifier.event] : {
                                    target: "expectingDefaultValue",
                                    actions: [ "addTokenToParams" ]
                                },
                                "*" : { actions: [ "invalidParamTokenError" ] }
                            }
                        },
// Definition:7 ends here



// The list of explicit token events here are all the valid tokens which fulfill default values.

// In the future, I would like to accept complex sequences like tapes as default parameters.


// [[file:../literate/ParseMachine.org::*Definition][Definition:8]]
                        expectingDefaultValue : {
                            on: {
                                [Token.Number.event] : {
                                    target: "open",
                                    actions: [ "addTokenToParams" ]
                                },
                                [Token.String.event] : {
                                    target: "open",
                                    actions: [ "addTokenToParams" ]
                                },
                                [Token.AddressIdentifier.event] : {
                                    target: "open",
                                    actions: [ "addTokenToParams" ]
                                },
                                [Token.ValueIdentifier.event] : {
                                    target: "open",
                                    actions: [ "addTokenToParams" ]
                                },
                                [Token.CloseParams.event] : {
                                    actions : [ "unfulfilledDefaultValueError" ]
                                },
                                "*" : {
                                    actions: [ "unfulfilledDefaultValueError" ]
                                },
                            }
                        },
// Definition:8 ends here



// After a parameter list, the next token /must/ be an "open tape", =[=.


// [[file:../literate/ParseMachine.org::*Definition][Definition:9]]
                        expectingTape: {
                            on: {
                                [Token.OpenTape.event] : {
                                    target: "not",
                                    actions: [ "openTape" ]
                                },
                                "*" : {
                                    actions : [ "paramsWithoutTapeError" ]
                                }
                            }
                        },
                    },
                },
// Definition:9 ends here



// The next sub-state is the label sub-state. This simply describes two invalid cases for subsequent tokens after labels. First, there cannot be multiple labels consecutively, a block must come between. Second, a =DONE= event after a label, but before another block which the label points to, is an error.


// [[file:../literate/ParseMachine.org::*Definition][Definition:10]]
                label: {
                    initial: "any",
                    states: {
                        any : {},
                        expectingBlock : {
                            on : {
                                DONE : { actions: "labelWithNoBlockError" },
                                [Token.LabelIdentifier.event] : {
                                    actions: "consecutiveLabelsError"
                                },
                            }
                        }
                    },
                }
            }
        },
// Definition:10 ends here



// We can receive =DONE= event at almost any time, at which point the machine finalizes. Once in the "done" state, the machine cannot receive any more events.


// [[file:../literate/ParseMachine.org::*Definition][Definition:11]]
        done: {
            type: "final",
            data: (C) => C.tree
        }
    },
    on : {
        DONE: { target: "done" }
    }
};
// Definition:11 ends here

// Configuration


// [[file:../literate/ParseMachine.org::*Configuration][Configuration:1]]
export const config = {
    actions: {
        initialize: assign((C, E) => {
            C.tree = AbstractSyntaxTree();
        }),
        addValueBlockToTape: assign((C, E) => {
            C.tree.appendValueBlock(E);
        }),
        addOpBlockToTape: assign((C, E) => {
            C.tree.appendOpBlock(E);
        }),
        addCommaToTape: assign((C, E) => {
            C.tree.appendComma();
        }),
        labelNextBlock: assign((C, E) => {
            C.tree.labelNextCell(E)
        }),
        consecutiveLabelsError : (C, E) => {
            throw new Error("Cannot have two labels in a row");
        },
        labelWithNoBlockError : (C, E) => {
            throw new Error("Cannot have a label at the end of a tape");
        },
        unfulfilledDefaultValueError : (C, E) => {
            throw new Error("A string, number, blank, value identifier, or address must come after a label identifier in a parameter list");
        },
        paramsWithoutTapeError : (C, E) => {
            throw new Error("After params list, next token must be \"[\"");
        },
        invalidParamTokenError : (C, E) => {
            throw new Error("Invalid token in params list")
        },
        addTokenToParams : assign((C, E) => {
            C.tree.addParamForNextTape(E);
        }),
        openTape : assign((C, E) => {
            C.tree.openTape();
        }),
        closeTape : assign((C, E) => {
            C.tree.closeTape();
        }),
        openInlineTape : assign((C, E) => {
            C.tree.openTape(true);
        }),
        closeInlineTape : assign((C, E) => {
            // Closing an inline tape is the same as a normal one
            C.tree.closeTape();
        }),
    },
    guards : {}
};
// Configuration:1 ends here

// Initialize


// [[file:../literate/ParseMachine.org::*Initialize][Initialize:1]]
export const init = () => Machine(definition, config).withContext({});
// Initialize:1 ends here
