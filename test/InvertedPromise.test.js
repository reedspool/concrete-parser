// Preamble


// [[file:../literate/InvertedPromiseTests.org::*Preamble][Preamble:1]]
import { InvertedPromise } from "../src/InvertedPromise";
// Preamble:1 ends here

// =.resolve()=


// [[file:../literate/InvertedPromiseTests.org::*=.resolve()=][=.resolve()=:1]]
it("Resolves as expected", async () => {
    const result = "test";
    const promise = InvertedPromise();
    promise.resolve(result);

    expect(await promise).toEqual(result);
})
// =.resolve()=:1 ends here

// [[file:../literate/InvertedPromiseTests.org::*=.resolve()=][=.resolve()=:2]]
it("Reject or resolve after resolve has no effect", async () => {
    const result = "test";
    const promise = InvertedPromise();
    promise.resolve(result);
    promise.reject(new Error("test 2"))
    promise.resolve("test3")

    expect(await promise).toEqual(result);
})
// =.resolve()=:2 ends here

// =.reject()=


// [[file:../literate/InvertedPromiseTests.org::*=.reject()=][=.reject()=:1]]
it("Rejects as expected", async () => {
    const result = new Error("Test");
    const promise = InvertedPromise();
    promise.reject(result);

    // "Catch and release", turn the rejection into a resolution.
    expect(await promise.catch(a => a)).toEqual(result);
})
// =.reject()=:1 ends here

// [[file:../literate/InvertedPromiseTests.org::*=.reject()=][=.reject()=:2]]
it("Reject or resolve after reject has no effect", async () => {
    const result = new Error("test");
    const promise = InvertedPromise();
    promise.reject(result);
    promise.reject(new Error("test 2"))
    promise.resolve("test3")

    // "Catch and release", turn the rejection into a resolution.
    expect(await promise.catch(a => a)).toEqual(result);
})
// =.reject()=:2 ends here

// Acting like a built-in Promise


// [[file:../literate/InvertedPromiseTests.org::*Acting like a built-in Promise][Acting like a built-in Promise:1]]
it("Resolving a passed callback, it acts just like a built-in Promise", async () => {
    const result = "test";
    const promise = InvertedPromise((resolve) => resolve(result));

    expect(await promise).toBe(result);
})
// Acting like a built-in Promise:1 ends here

// [[file:../literate/InvertedPromiseTests.org::*Acting like a built-in Promise][Acting like a built-in Promise:2]]
it("Rejecting a passed callback, it acts just like a built-in Promise", async () => {
    const result = new Error("test");
    const promise = InvertedPromise((_, reject) => reject(result));

    expect(await promise.catch(a => a)).toBe(result);
})
// Acting like a built-in Promise:2 ends here

// [[file:../literate/InvertedPromiseTests.org::*Acting like a built-in Promise][Acting like a built-in Promise:3]]
it("Can use the new keyword with a callback", async () => {
    const result = "test";
    const promise = new InvertedPromise((resolve) => resolve(result));

    expect(await promise).toBe(result);
})
// Acting like a built-in Promise:3 ends here
