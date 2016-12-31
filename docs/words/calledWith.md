# calledWith

**`calledWith(...args)`**

This assertion checks that the spy method's arguments match those provided as `args`.
Arguments beyond those given to the assertion are not checked.

    expect(spyOrCall).to.be.calledWith(1, 2);

If `spyOrCall` is a spy, the `always` or `only` modifiers can be applied to check all
calls made on the spy.

    expect(spy).to.always.be.calledWith(1, 2);

A spy can also use the `exactly` modifier or `match` modifiers`:

    expect(spy).to.be.exactly.calledWith(1, 2);

    expect(spy).to.be.match.calledWith(1, 2);

The above can be combined with `always`:

    expect(spy).to.be.always.exactly.calledWith(1, 2);

    expect(spy).to.be.always.match.calledWith(1, 2);

The above snippets are equivalent to these direct spy API's:

    expect(spyOrCall.calledWith(1, 2)).to.be(true);
    expect(spy.alwaysCalledWith(1, 2)).to.be(true);
    expect(spy.calledWithExactly(1, 2)).to.be(true);
    expect(spy.calledWithMatch(1, 2)).to.be(true);
    expect(spy.alwaysCalledWithExactly(1, 2)).to.be(true);
    expect(spy.alwaysCalledWithMatch(1, 2)).to.be(true);
