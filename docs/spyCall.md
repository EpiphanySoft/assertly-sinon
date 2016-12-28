# Sinon Spy Call API Mapping

The sinon [Spy Call API](http://sinonjs.org/docs/#spycall) provides many methods that
return `true` if a particular call to a spy matched certain criteria.

There are two ways to arrive at a `spyCall`. The first is to pass a `spyCall` to the
`expect()` method:

    expect(spy.firstCall).to.be...

The second is to start with a [spy](./spy.md) and use helpers provided by this add-on:

    expect(spy).firstCall.to.be...

In either case, the `Assert` instance is now directed at a `spyCall`.

The following table shows the mapping of these API's to equivalent assertions.

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
        <td>spyCall.calledWithMatch(a, b, ...)</td>  <td>expect(spyCall).to.be.match.calledWith(a, b, ...)</td>
    </tr>
    <tr>
        <td>spyCall.notCalledWith(a, b, ...)</td>  <td>expect(spyCall).to.not.be.calledWith(a, b, ...)</td>
    </tr>
    <tr>
        <td>spyCall.notCalledWithMatch(a, b, ...)</td>  <td>expect(spyCall).to.not.be.match.calledWith(a, b, ...)</td>
    </tr>
</table>
<br>
