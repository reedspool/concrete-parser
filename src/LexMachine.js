// Preamble


// [[file:../literate/LexMachine.org::*Preamble][Preamble:1]]
import { Machine } from "xstate";
import { assign } from '@xstate/immer';
import { Token } from "./LexicalToken";
import { Kind } from "./CharacterStream";
// Preamble:1 ends here

// Definition

// Lexing is a great target for a simple state machine. An XState statechart is a little overboard for this problem, but why not? We're already going to use the super powers of a statechart for parsing, so might as well.

// Here's the basic setup. Since we're dealing with text, we definitely want a strict machine. If we get the wrong kind of character at the wrong time, it will throw an error.


// [[file:../literate/LexMachine.org::*Definition][Definition:1]]
export const definition = {
    strict: true,
    id: "LexMachine",
// Definition:1 ends here



// First, messages we can receive at any time. We can /almost/ always receive an EOF, in which case we finalize the token we were reading and stop receiving more events.

// If there is a time we /cannot/ receive an EOF, we will override this EOF and make it throw an error. An example of a time when we cannot receive an EOF is when we receive a bunch of numbers, then a period, and no more numbers, e.g. =1523.=.


// [[file:../literate/LexMachine.org::*Definition][Definition:2]]
    on : {
        [Kind.EOF.event]: [
            {
                cond: "isCurrentToken",
                actions: ["cleanupCurrentToken"],
                target: "done"
            },
            { target: "done" }
        ]
    },
// Definition:2 ends here



// Standard statechart pattern, make it immediately initialize itself before accepting any more events. =initialize= will set up all internal structures.


// [[file:../literate/LexMachine.org::*Definition][Definition:3]]
    initial: "uninitialized",
    states: {
        uninitialized : {
            entry: [ "initialize" ],
            always: "none"
        },
// Definition:3 ends here



// The fun really starts. The states at the top level represent what kind of token we're currently constructing. When we start, or after we've finished another token, we don't know what kind of token we'll get next, hence =none= accepts any start of any token.

// Lots of tokens are just a single characters and will not invoke a state change.


// [[file:../literate/LexMachine.org::*Definition][Definition:4]]
        none : {
            on: {
                [Kind.Underscore.event] : { actions : ["insertBlankToken"] },
                [Kind.Alphabetic.event] : {
                    target: "identifier",
                    actions: ["startValueIdentifierToken"],
                },
                [Kind.AtSign.event]: {
                    target: "identifier",
                    actions: ["startAddressIdentifierToken"]
                },
                [Kind.Numeric.event]: {
                    target: "number",
                },
                [Kind.Whitespace.event]: { actions: [ "noop" ] },
            }
        },
// Definition:4 ends here



// An identifier starts with any alphabetic character followed by any alphabetic, numeric, or underscore characters.

// Note: address and colon identifiers cannot end with an exclamation.


// [[file:../literate/LexMachine.org::*Definition][Definition:5]]
        identifier: {
            on : {
                [Kind.Alphabetic.event] : { actions: [ "addCharToCurrentToken" ] },
                [Kind.Numeric.event] : { actions: [ "addCharToCurrentToken" ] },
                [Kind.Underscore.event] : {
                    actions : [ "addCharToCurrentToken"]
                },
                [Kind.Whitespace.event] : {
                    target: "none",
                    actions : [ "cleanupCurrentToken"]
                },
                [Kind.Colon.event] : [
                    {
                        cond: "isCurrentTokenValueIdentifier",
                        target: "labelIdentifier",
                        actions : [ "addCharToCurrentToken" ]
                    },
                    { actions: "badChar" }
                ],
                [Kind.Exclamation.event] : [
                    {
                        cond: "isCurrentTokenValueIdentifier",
                        target: "callIdentifier",
                        actions : [ "addCharToCurrentToken" ]
                    },
                    { actions: "badChar" }
                ]
            }
        },
// Definition:5 ends here



// When an identifier ends with an exclamation mark, that means it's a CallIdentifier. That's the end of this token


// [[file:../literate/LexMachine.org::*Definition][Definition:6]]
        callIdentifier: {
            entry : "transposeToCallIdentifier",
            exit: "cleanupCurrentToken",
            always: "none"
        },
// Definition:6 ends here



// Very similar to CallIdentifiers, when an identifier ends with a colon, that means it's a LabelIdentifier. That's the end of this token


// [[file:../literate/LexMachine.org::*Definition][Definition:7]]
        labelIdentifier: {
            entry : "transposeToLabelIdentifier",
            exit: "cleanupCurrentToken",
            always: "none"
        },
// Definition:7 ends here



// Numbers contain only numeric characters and optionally one period. If it has one period, it's a decimal number and /must/ have more numeric characters after the period.


// [[file:../literate/LexMachine.org::*Definition][Definition:8]]
        number: {
            entry: ["startNumberToken"],
            on: {
                [Kind.Numeric.event] : { actions: [ "addCharToCurrentToken" ] },
                [Kind.Period.event] : {
                    actions: [ "addCharToCurrentToken" ],
                    target: "decimalNumberPre"
                },
                [Kind.Whitespace.event] : {
                    target: "none",
                    actions : [ "cleanupCurrentToken"]
                }
            }
        },
// Definition:8 ends here



// Ensure that decimal numbers have a number after the period with separate states.

// If we get an EOF here, it's an error because there was no numeric supplied after the period.


// [[file:../literate/LexMachine.org::*Definition][Definition:9]]
        decimalNumberPre: {
            on: {
                [Kind.Numeric.event] : {
                    actions: [ "addCharToCurrentToken" ],
                    target: "decimalNumberPost"
                },
                [Kind.EOF.event]: { actions: [ "badChar" ] },
            }
        },
        decimalNumberPost: {
            on: {
                [Kind.Numeric.event] : { actions: [ "addCharToCurrentToken" ] },
                [Kind.Whitespace.event] : {
                    target: "none",
                    actions : [ "cleanupCurrentToken"]
                }
            }
        },
// Definition:9 ends here

// [[file:../literate/LexMachine.org::*Definition][Definition:10]]
        done: { final : true }
    },
};
// Definition:10 ends here

// Configuration


// [[file:../literate/LexMachine.org::*Configuration][Configuration:1]]
export const config = {
    actions: {
        // Need a noop because XState does not recognize empty event handlers
        noop : () => { /* Do nothing */ },
        initialize: assign((C, E) => {
            C.tokens = [];
        }),
        startValueIdentifierToken: assign((C, E) => {
            C.currentToken = Token.ValueIdentifier.factory(E.char)
        }),
        startAddressIdentifierToken: assign((C, E) => {
            C.currentToken = Token.AddressIdentifier.factory(E.char)
        }),
        transposeToCallIdentifier: assign((C, E) => {
            C.currentToken = Token.CallIdentifier.factory(
                C.currentToken.original);
        }),
        transposeToLabelIdentifier: assign((C, E) => {
            C.currentToken = Token.LabelIdentifier.factory(
                C.currentToken.original);
        }),
        startNumberToken: assign((C, E) => {
            C.currentToken = Token.Number.factory(E.char)
        }),
        insertBlankToken: assign((C, E) => {
            C.tokens.push(Token.Blank.factory());
        }),
        addCharToCurrentToken: assign((C, E) => {
            C.currentToken.push(E.char);
        }),
        badChar: (C, E) => {
            throw new Error("Bad Character");
        },
        cleanupCurrentToken : assign((C, E) => {
            C.tokens.push(C.currentToken)
            C.currentToken = null;
        })
    },
    guards : {
        isCurrentToken: (C, E) => C.currentToken,
        isNoCurrentToken: (C, E) => ! C.currentToken,
        isCurrentTokenValueIdentifier: (C, E) => C.currentToken.type == Token.ValueIdentifier.event,
    }
};
// Configuration:1 ends here

// Initialize


// [[file:../literate/LexMachine.org::*Initialize][Initialize:1]]
export const init = () => Machine(definition, config);
// Initialize:1 ends here
