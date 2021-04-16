// Token Factories

// [[file:../literate/LexicalToken.org::*Token Factories][Token Factories:1]]
const SimpleToken = (...args) => new _SimpleToken(...args);

class _SimpleToken {
    constructor(type, original) {
        this.type = type;
        this.original = original;
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
Token.LabelIdentifier = {
    event: "LABEL_IDENTIFIER",
    factoryType: ExpandableToken,
};
Token.Number = {
    event: "NUMBER",
    factoryType: ExpandableToken,
};
Token.Blank = {
    event: "BLANK",
    factoryType: SimpleToken,
    literal: "_"
};
Token.OpenFold = {
    event: "OPEN_FOLD",
    factoryType: SimpleToken,
    literal: "["
};
Token.CloseFold = {
    event: "CLOSE_FOLD",
    factoryType: SimpleToken,
    literal: "]"
};
Token.OpenArgs = {
    event: "OPEN_ARGS",
    factoryType: SimpleToken,
    literal: "("
};
Token.CloseArgs = {
    event: "CLOSE_ARGS",
    factoryType: SimpleToken,
    literal: ")"
};
Token.OpenInlineFold = {
    event: "OPEN_INLINE_FOLD",
    factoryType: SimpleToken,
    literal: "{"
};
Token.CloseInlineFold = {
    event: "CLOSE_INLINE_FOLD",
    factoryType: SimpleToken,
    literal: "}"
};
// Token:1 ends here



// Now construct the factories


// [[file:../literate/LexicalToken.org::*Token][Token:2]]
Object.entries(Token).forEach(([name, value]) => {
    if (value.factoryType == ExpandableToken) {
        value.factory = (char) => ExpandableToken(value.event, char);
    }
    else if (value.factoryType == SimpleToken) {
        value.factory = () => SimpleToken(value.event, value.literal);
    }
    else throw new Error(`Token ${name} has no factory`)
})
// Token:2 ends here
