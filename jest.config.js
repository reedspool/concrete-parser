// =jest.config.js=
// :PROPERTIES:
// :header-args: :comments both :tangle jest.config.js
// :END:

// Because my custom package =xstate-jest-tools= is not Babel-transformed yet, this project must specifically inform Jest's Babel transformer to *not* ignore it, and transform it as well:


// [[file:README.org::*=jest.config.js=][=jest.config.js=:1]]
module.exports = {
    transformIgnorePatterns: [
        "node_modules/(?!xstate-jest-tools)"
    ]
}
// =jest.config.js=:1 ends here
