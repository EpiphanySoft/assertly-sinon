# return

**`return([ valueOrMatcher ])`**

The `return` assertion checks that the target method returned:

    expect(spyOrCall).to.return();

The above is not concerned with the return value, just that the method returned. In
the case of a spy (not a spyCall), this assertion will pass if *any* calls made to
the method returned (as opposed to throwing an exception).

If the `valueOrMatcher` is passed, the return value is tested. If a `sinon.matcher`
is provided, it is used to test the return value. Otherwise, the return value is
tested using `===`.

    expect(spyOrCall).to.return(42);

For a spy, this will verify that at least one call to the method returned `42`.

A spyCall can use `return` as a property in the dot-chain:

    expect(spyCall).return.to.be.above(10);

    expect(spy).firstCall.return.to.be.above(10);

When using `return` on a spy, either the `always` or `only` modifiers can be given
as well.

 - `always` checks that all calls return a matching value. If any calls threw an
  exception, the assertion will fail.
 - `only` checks that all calls that do not throw an exception return a matching
 value. Calls that threw an exception are ignored.
 - In both cases, if no calls return a matching value, the assertion fails.

For example:

    // All calls return w/o exception:
    expect(spy).to.always.return();

    // Same as above
    expect(spy).to.only.return();

    // All calls must return 42 w/o exceptions:
    expect(spy).to.always.return(42);

    // All calls that return a value (ie, do not throw) must return 42:
    expect(spy).to.only.return(42);
