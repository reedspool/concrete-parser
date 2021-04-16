// #+TITLE: Block
// #+PROPERTY: header-args    :comments both :tangle ../src/Block.js


// [[file:../literate/Block.org::+begin_src js][No heading:1]]
export const Number = (value) => {
    return {
        type: "number",
        value
    }
}
// No heading:1 ends here

// [[file:../literate/Block.org::+begin_src js][No heading:2]]
export const Blank = () => {
    return {
        type: "blank"
    }
}
// No heading:2 ends here

// [[file:../literate/Block.org::+begin_src js][No heading:3]]
export const String = (value) => {
    return {
        type: "string",
        value
    }
}
// No heading:3 ends here
