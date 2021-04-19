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
}
// Token Factories:2 ends here

// Token
// A data structure mapping token names to information about it.


// [[file:../literate/LexicalToken.org::*Token][Token:1]]
export const Token = {};
Token.ValueIdentifier = {
    event: "VALUE_IDENTIFIER",
    factory: ExpandableToken,
};
Token.AddressIdentifier = {
    event: "ADDRESS_IDENTIFIER",
    factory: ExpandableToken,
};
Token.CallIdentifier = {
    event: "CALL_IDENTIFIER",
    factory: ExpandableToken,
};
Token.LabelIdentifier = {
    event: "LABEL_IDENTIFIER",
    factory: ExpandableToken,
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
    
    if (value.factory == ExpandableToken) {
        value.create = (char) => ExpandableToken(name, value.event, char);
    }
    else if (value.factory == SimpleToken) {
        value.create = () => SimpleToken(name, value.event, value.literal);
    }
    else throw new Error(`Token ${name} has no factory`)
})
// Token:2 ends here
