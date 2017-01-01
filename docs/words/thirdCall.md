# thirdCall

**`thirdCall`**

This property getter is used to return a spyCall assertion from a spy assertion
where the spyCall is the `thirdCall` to the spy:

    expect(spy).thirdCall.to...

The above is equivalent to:

    expect(spy.thirdCall).to...
