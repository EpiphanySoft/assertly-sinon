# firstCall

**`firstCall`**

This property getter is used to return a spyCall assertion from a spy assertion
where the spyCall is the `firstCall` to the spy:

    expect(spy).firstCall.to...

The above is equivalent to:

    expect(spy.firstCall).to...
