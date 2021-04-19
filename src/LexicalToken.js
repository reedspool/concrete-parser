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
    factoryType: ExpandableToken,
};
Token.AddressIdentifier = {
    event: "ADDRESS_IDENTIFIER",
    factoryType: ExpandableToken,
};
Token.CallIdentifier = {
    event: "CALL_IDENTIFIER",
    factoryType: ExpandableToken,
};
Token.LabelIdentifier = {
    event: "LABEL_IDENTIFIER",
    factoryType: ExpandableToken,
};
Token.Number = {
    event: "NUMBER",
    factoryType: ExpandableToken,
};
Token.String = {
    event: "STRING",
    factoryType: ExpandableToken,
};
Token.Blank = {
    event: "BLANK",
    factoryType: SimpleToken,
    literal: "_"
};
Token.OpenTape = {
    event: "OPEN_TAPE",
    factoryType: SimpleToken,
    literal: "["
};
Token.CloseTape = {
    event: "CLOSE_TAPE",
    factoryType: SimpleToken,
    literal: "]"
};
Token.OpenParams = {
    event: "OPEN_PARAMS",
    factoryType: SimpleToken,
    literal: "("
};
Token.CloseParams = {
    event: "CLOSE_PARAMS",
    factoryType: SimpleToken,
    literal: ")"
};
Token.OpenInlineTape = {
    event: "OPEN_INLINE_TAPE",
    factoryType: SimpleToken,
    literal: "{"
};
Token.CloseInlineTape = {
    event: "CLOSE_INLINE_TAPE",
    factoryType: SimpleToken,
    literal: "}"
};
// Token:1 ends here



// Now construct the factories and add other automatic information.


// [[file:../literate/LexicalToken.org::*Token][Token:2]]
Object.entries(Token).forEach(([name, value]) => {
    value.name = name;
    
    if (value.factoryType == ExpandableToken) {
        value.factory = (char) => ExpandableToken(name, value.event, char);
    }
    else if (value.factoryType == SimpleToken) {
        value.factory = () => SimpleToken(name, value.event, value.literal);
    }
    else throw new Error(`Token ${name} has no factory`)
})
// Token:2 ends here
