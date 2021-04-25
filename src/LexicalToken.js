// Token Factories

// [[file:../literate/LexicalToken.org::*Token Factories][Token Factories:1]]
const SimpleToken = (...args) => new _SimpleToken(...args);

class _SimpleToken {
    constructor(name, type, original) {
        this.type = type;
        this.name = name;
        this.original = original;
    }

    is(token) {
        return this.name == token.name;
    }

    finalize() { /* noop */ return this; }
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
};
Token.String = {
    event: "STRING",
    factory: ExpandableToken,
};
Token.Blank = {
    event: "BLANK",
    factory: SimpleToken,
    literal: "_"
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



// Now construct the factories and add other automatic information.


// [[file:../literate/LexicalToken.org::*Token][Token:2]]
Object.entries(Token).forEach(([name, value]) => {
    value.name = name;
    
    // All complex factories are called the same way
    if (value.factory !== SimpleToken) {
        value.create = (char) => value.factory(name, value.event, char);
    }
    else if (value.factory == SimpleToken) {
        value.create = () => SimpleToken(name, value.event, value.literal);
    }
    else throw new Error(`Token ${name} has no factory`)
})
// Token:2 ends here
