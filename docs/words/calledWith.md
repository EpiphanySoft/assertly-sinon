# calledWith

**`calledWith(...args)`**

This assertion checks that the spy or spyCall method arguments match those provided as
`args`. Arguments beyond those given to the assertion are not checked.

    expect(spyOrCall).to.be.calledWith(1, 2);

If `spyOrCall` is a spy, the `always` or `only` modifiers can be applied to check all
calls made on the spy.

    expect(spy).to.always.be.calledWith(1, 2);

A spy can also use the `exactly` or `match` modifiers:

    expect(spy).to.be.exactly.calledWith(1, 2);

    expect(spy).to.match.calledWith(1, 2);

The above can be combined with `always`:

    expect(spy).to.be.always.exactly.calledWith(1, 2);

    expect(spy).to.always.match.calledWith(1, 2);

With sinon, there is no API that combines `always`, `match` and `exactly`, however,
this can be done with this add-on:

    expect(spy).to.always.exactly.match.calledWith(1, 2);

In summary, the following modifiers apply when used on a spy:

 - `always` (or `only`) - Checks that all calls made match.
 - `exactly` - Checks that the number of arguments is an exact match. Normally,
  arguments passed to the method beyond those passed to the assertion are ignored.
 - `match` - Uses `sinon.match` on each argument passed to the assertion. The
  resulting matcher is then used to decide if each argument is a match.
