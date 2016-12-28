# assertly-sinon
An [assertly](https://github.com/dongryphon/assertly) add-on [module](https://www.npmjs.com/package/assertly) for the [sinon](https://github.com/sinonjs/sinon) [module](https://www.npmjs.com/package/sinon).

WIP

## API

The `sinon` API provides many kinds of helpers for spying and mocking. The API's
provided by this add-on are designed to work with as many of these types as possible,
but for clarity the names used for parameters should convey the types supported.

Specifically, the following naming convention is used:

<table>
    <tr>
        <td>spy</td><td>A spy created by <tt>sinon.spy()</tt></td>
    </tr>
    <tr>
        <td>spyCall</td><td>A call to a spy returned by <tt>sinon.spy().getCall()</tt></td>
    </tr>
</table>

### call

**`call(n)`**

This method will form create a new `Assert` instance for the n'th call to the spy.

    expect(spy).call(2).to.be.calledOn(obj);

### called

**`called(n)`**

This assertion allows you to check whether a spy was called:

    expect(spy).to.be.called();

Or whether a spy was called a certain number of times:

    expect(spy).to.be.called(2);

Or was not called:

    expect(spy).to.not.be.called();

### calledOn

**`calledOn(obj)`**

This assertion checks that the spy method's `this` reference was `obj`:

    expect(spyOrCall).to.be.calledOn(obj);

If `spyOrCall` is the

Or whether a spy was called a certain number of times:

    expect(spy).to.be.called(2);

Or was not called:

    expect(spy).to.not.be.called();
