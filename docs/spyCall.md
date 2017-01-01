# Sinon Spy Call API Mapping

The sinon [Spy Call API](http://sinonjs.org/docs/#spycall) provides many methods that
return `true` if a particular call to a spy matched certain criteria.

There are two ways to state assertions on a `spyCall`. The first is to pass a `spyCall`
directly to the `expect()` method:

    expect(spy.firstCall).to.be...

The second is to use `epxect` on the [spy](./spy.md) and use the helper properties
such as `firstCall`:

    expect(spy).firstCall.to.be...

In either case, the `Assert` instance is now directed at a `spyCall` and the following
assertions can be used:

 - [`calledOn`](words/calledOn.md)
 - [`calledWith`](words/calledWith.md)
 - [`return`](words/return.md)
 - [`throw`](words/throw.md)

If you are familiar with the sinon API, the following table shows the mapping of
those API's to equivalent assertions.

<br>
<table style="font-family:monospace">
    <tr>
        <td>spyCall.calledOn(obj)</td>  <td>expect(spyCall).to.be.calledOn(obj)</td>
    </tr>
    <tr>
        <td>spyCall.calledWith(a, b, ...)</td>  <td>expect(spyCall).to.be.calledWith(a, b, ...)</td>
    </tr>
    <tr>
        <td>spyCall.calledWithExactly(a, b, ...)</td>  <td>expect(spyCall).to.be.exactly.calledWith(a, b, ...)</td>
    </tr>
    <tr>
        <td>spyCall.calledWithMatch(a, b, ...)</td>  <td>expect(spyCall).to.match.calledWith(a, b, ...)</td>
    </tr>
    <tr>
        <td>spyCall.notCalledWith(a, b, ...)</td>  <td>expect(spyCall).to.not.be.calledWith(a, b, ...)</td>
    </tr>
    <tr>
        <td>spyCall.notCalledWithMatch(a, b, ...)</td>  <td>expect(spyCall).to.not.match.calledWith(a, b, ...)</td>
    </tr>
    <tr>
        <td>spyCall.returnValue === x</td>  <td>expect(spyCall).to.return(x)</td>
    </tr>
    <tr>
        <td>spyCall.returnValue > x</td>  <td>expect(spyCall).to.return.gt(x)</td>
    </tr>
    <tr>
        <td>spyCall.threw()</td>  <td>expect(spyCall).to.throw()</td>
    </tr>
    <tr>
        <td>spyCall.threw('Message')</td>  <td>expect(spyCall).to.throw()</td>
    </tr>
    <tr>
        <td>spyCall.threw(RangeError)</td>  <td>expect(spyCall).to.throw(RangeError)</td>
    </tr>
</table>
<br>
