# calledOn

**`calledOn(obj)`**

This assertion checks that the spy method's `this` reference was `obj`:

    expect(spyOrCall).to.be.calledOn(obj);

If `spyOrCall` is a spy, the `always` or `only` modifiers can be applied to check all
calls made on the spy.

    expect(spy).to.always.be.calledOn(obj);

The above snippets are equivalent to these direct spy API's:

    expect(spyOrCall.calledOn(obj)).to.be(true);
    expect(spy.alwaysCalledOn(obj)).to.be(true);
