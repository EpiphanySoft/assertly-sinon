# Sinon Spy API Mapping

The sinon [Spy API](http://sinonjs.org/docs/#spies-api) provides many methods that
return `true` if the spy was used in a particular way.

The following table shows the mapping of these API's to equivalent assertions.

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
        <td>spy.firstCall (et al)</td>  <td>expect(spy).firstCall.to.be...</td>
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
        <td>spy.calledWithMatch(a, b, ...)</td>  <td>expect(spy).to.be.match.calledWith(a, b, ...)</td>
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
        <td>spy.alwaysCalledWithMatch(a, b, ...)</td>  <td>expect(spy).to.be.always.match.calledWith(a, b, ...)</td>
    </tr>
    <tr>
        <td>spy.neverCalledWith(a, b, ...)</td>  <td>expect(spy).to.not.be.calledWith(a, b, ...)</td>
    </tr>
    <tr>
        <td>spy.neverCalledWithMatch(a, b, ...)</td>  <td>expect(spy).to.not.be.match.calledWith(a, b, ...)</td>
    </tr>
</table>
<br>

When the Spy API returns a Spy Call, see [spyCall](./spyCall.md).
