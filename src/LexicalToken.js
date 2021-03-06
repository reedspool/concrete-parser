// Token Factories

// [[file:../literate/LexicalToken.org::*Token Factories][Token Factories:1]]
const SimpleToken = (...args) => new _SimpleToken(...args);

class _SimpleToken {
    constructor(kind, type, original) {
        this.type = type;
        this.kind = kind;
        this.original = original;
    }

    is(token) {
        return this.kind == token.kind;
    }

    finalize() { /* noop */ return this; }

    asJS() {
        // Always return undefined if not specified in Token map
        if (! Token[this.kind].asJS) return;
        return Token[this.kind].asJS(this);
    }
}
// Token Factories:1 ends here



// Now for tokens of multiple characters, the lexer only receives one letter at a time, so further characters will be added to it.


// [[file:../literate/LexicalToken.org::*Token Factories][Token Factories:2]]
const ExpandableToken = (...args) => new _ExpandableToken(...args);

class _ExpandableToken extends _SimpleToken {
    constructor(...args) {
        super(...args);
    }

    push(char) {
        this.original += char;
    }
    
    finalize() { /* noop */ return this; }
}
// Token Factories:2 ends here



// Now we make specific factories for all identifier tokens, who extract the text of the identifier from the syntax that created it, e.g. =add!= is a CallIdentifier but the identifier is just "add".

// The simplest is a value identifier, where the identifier is the original exactly. This seems like a useless addition if they're just the same, but if all the identifiers work the same way it makes other code much simpler.


// [[file:../literate/LexicalToken.org::*Token Factories][Token Factories:3]]
const ValueIdentifierToken = (...args) => new _ValueIdentifierToken(...args);

class _ValueIdentifierToken extends _ExpandableToken {
    finalize() { this.identifier = this.original; return this; }
}
// Token Factories:3 ends here

// [[file:../literate/LexicalToken.org::*Token Factories][Token Factories:4]]
const AddressIdentifierToken = (...args) => new _AddressIdentifierToken(...args);

class _AddressIdentifierToken extends _ExpandableToken {
    finalize() { this.identifier = this.original.replace("@", ""); return this; }
}
// Token Factories:4 ends here

// [[file:../literate/LexicalToken.org::*Token Factories][Token Factories:5]]
const CallIdentifierToken = (...args) => new _CallIdentifierToken(...args);

class _CallIdentifierToken extends _ExpandableToken {
    finalize() { this.identifier = this.original.replace("!", ""); return this; }
}
// Token Factories:5 ends here

// [[file:../literate/LexicalToken.org::*Token Factories][Token Factories:6]]
const LabelIdentifierToken = (...args) => new _LabelIdentifierToken(...args);

class _LabelIdentifierToken extends _ExpandableToken {
    finalize() { this.identifier = this.original.replace(":", ""); return this; }
}
// Token Factories:6 ends here

// Token
// A data structure mapping token names to information about it.


// [[file:../literate/LexicalToken.org::*Token][Token:1]]
export const Token = {};
Token.ValueIdentifier = {
    event: "VALUE_IDENTIFIER",
    factory: ValueIdentifierToken,
};
Token.AddressIdentifier = {
    event: "ADDRESS_IDENTIFIER",
    factory: AddressIdentifierToken,
};
Token.CallIdentifier = {
    event: "CALL_IDENTIFIER",
    factory: CallIdentifierToken,
};
Token.LabelIdentifier = {
    event: "LABEL_IDENTIFIER",
    factory: LabelIdentifierToken,
};
Token.Number = {
    event: "NUMBER",
    factory: ExpandableToken,
    asJS: (token) => parseFloat(token.original)
};
Token.String = {
    event: "STRING",
    factory: ExpandableToken,
    asJS: (token) => eval(token.original)
};
Token.Blank = {
    event: "BLANK",
    factory: SimpleToken,
    literal: "_",
    asJS: (token) => null
};
Token.Comma = {
    event: "COMMA",
    factory: SimpleToken,
    literal: ","
};
Token.OpenTape = {
    event: "OPEN_TAPE",
    factory: SimpleToken,
    literal: "["
};
Token.CloseTape = {
    event: "CLOSE_TAPE",
    factory: SimpleToken,
    literal: "]"
};
Token.OpenParams = {
    event: "OPEN_PARAMS",
    factory: SimpleToken,
    literal: "("
};
Token.CloseParams = {
    event: "CLOSE_PARAMS",
    factory: SimpleToken,
    literal: ")"
};
Token.OpenInlineTape = {
    event: "OPEN_INLINE_TAPE",
    factory: SimpleToken,
    literal: "{"
};
Token.CloseInlineTape = {
    event: "CLOSE_INLINE_TAPE",
    factory: SimpleToken,
    literal: "}"
};
// Token:1 ends here



// We are going to replace the above token value for a factory function. We will replace all the information back onto it, as well as adding more useful stuff.


// [[file:../literate/LexicalToken.org::*Token][Token:2]]
Object.entries(Token).forEach(([kind, data]) => {    
    let fnCreate;
    data.kind = kind;
    
    // All complex factories are called the same way
    if (data.factory !== SimpleToken) {
        fnCreate = (char) => data.factory(kind, data.event, char);
    }
    else if (data.factory == SimpleToken) {
        fnCreate = () => SimpleToken(kind, data.event, data.literal);
    }
    else throw new Error(`Token ${kind} has no factory`)

    Token[kind] = fnCreate;

    Object.entries(data).forEach(([key, value]) => {
        Token[kind][key] = value;
    });
})
// Token:2 ends here
