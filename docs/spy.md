# Sinon Spy API Mapping

The sinon [Spy API](http://sinonjs.org/docs/#spies-api) provides many methods that
return `true` if the spy was used in a particular way. The API's are used to implement
these assertions:

 - [`call`](words/call.md)
 - [`called`](words/called.md)
 - [`calledOn`](words/calledOn.md)
 - [`calledWith`](words/calledWith.md)
 - [`return`](words/return.md)
 - [`throw`](words/throw.md)

And these properties:

 - [`firstCall`](words/firstCall.md)
 - [`secondCall`](words/secondCall.md)
 - [`thirdCall`](words/thirdCall.md)
 - [`lastCall`](words/lastCall.md)

When the Spy API returns a Spy Call, see [spyCall](./spyCall.md).

If you are familiar with the sinon API, however, the following table shows the mapping
of those API's to equivalent assertions.

<br>
<table style="font-family:monospace">
    <tr>
        <td>spy.callCount === 7</td>  <td>expect(spy).to.be.called(7)</td>
    </tr>
    <tr>
        <td>spy.called</td>  <td>expect(spy).to.be.called()</td>
    </tr>
    <tr>
        <td>spy.calledOnce</td>  <td>expect(spy).to.be.called(1)</td>
    </tr>
    <tr>
        <td>spy.calledTwice</td>  <td>expect(spy).to.be.called(2)</td>
    </tr>
    <tr>
        <td>spy.calledThrice</td>  <td>expect(spy).to.be.called(3)</td>
    </tr>
    <tr>
        <td>spy.firstCall</td>  <td>expect(spy).firstCall.to.be...</td>
    </tr>
    <tr>
        <td>spy.secondCall</td>  <td>expect(spy).secondCall.to.be...</td>
    </tr>
    <tr>
        <td>spy.thirdCall</td>  <td>expect(spy).thirdCall.to.be...</td>
    </tr>
    <tr>
        <td>spy.lastCall</td>  <td>expect(spy).lastCall.to.be...</td>
    </tr>
    <tr>
        <td>spy.calledOn(obj)</td>  <td>expect(spy).to.be.calledOn(obj)</td>
    </tr>
    <tr>
        <td>spy.calledWith(a, b, ...)</td>  <td>expect(spy).to.be.calledWith(a, b, ...)</td>
    </tr>
    <tr>
        <td>spy.calledWithExactly(a, b, ...)</td>  <td>expect(spy).to.be.exactly.calledWith(a, b, ...)</td>
    </tr>
    <tr>
        <td>spy.calledWithMatch(a, b, ...)</td>  <td>expect(spy).to.match.calledWith(a, b, ...)</td>
    </tr>
    <tr>
        <td>spy.alwaysCalledOn(obj)</td>  <td>expect(spy).to.be.always.calledOn(obj)</td>
    </tr>
    <tr>
        <td>spy.alwaysCalledWith(a, b, ...)</td>  <td>expect(spy).to.be.always.calledWith(a, b, ...)</td>
    </tr>
    <tr>
        <td>spy.alwaysCalledWithExactly(a, b, ...)</td>  <td>expect(spy).to.be.always.exactly.calledWith(a, b, ...)</td>
    </tr>
    <tr>
        <td>spy.alwaysCalledWithMatch(a, b, ...)</td>  <td>expect(spy).to.always.match.calledWith(a, b, ...)</td>
    </tr>
    <tr>
        <td>spy.neverCalledWith(a, b, ...)</td>  <td>expect(spy).to.not.be.calledWith(a, b, ...)</td>
    </tr>
    <tr>
        <td>spy.neverCalledWithMatch(a, b, ...)</td>  <td>expect(spy).to.not.match.calledWith(a, b, ...)</td>
    </tr>
</table>
<br>

With sinon, there is no API that combines `always`, `match` and `exactly`, however,
this can be done with this add-on:

    expect(spy).to.always.exactly.match.calledWith(a, b, ...);
