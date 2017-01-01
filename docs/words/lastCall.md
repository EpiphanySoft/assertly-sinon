# lastCall

**`lastCall`**

This property getter is used to return a spyCall assertion from a spy assertion
where the spyCall is the `lastCall` to the spy:

    expect(spy).lastCall.to...

The above is equivalent to:

    expect(spy.lastCall).to...
