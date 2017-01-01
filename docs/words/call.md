# call

**`call(n)`**

This method will create a new `Assert` instance for the n'th call to the spy.

    expect(spy).call(2).to.be.calledOn(obj);

This is equivalent to:

    expect(spy.getCall(2)).to.be.calledOn(obj);

Which is also equivalent to:

    expect(spy.getCall(2).calledOn(obj)).to.be(true);
