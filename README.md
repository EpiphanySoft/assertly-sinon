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
    <tr>
        <td>spyOrCall</td><td>Either a <tt>spy</tt> or a <tt>spyCall</tt></td>
    </tr>
</table>

See these documents for the mapping of the sinon [Spy API](docs/spy.md) and
[Spy Call API](docs/spyCall.md).

 - [`call`](docs/words/call.md)
 - [`called`](docs/words/called.md)
 - [`calledOn`](docs/words/calledOn.md)
