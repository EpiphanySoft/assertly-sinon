# Sinon Spy API Mapping

The sinon [Spy API](http://sinonjs.org/docs/#spies-api) provides many methods that
return `true` if the spy was used in a particular way. The following table shows
the mapping of these API's to equivalent assertions.

<code><table>
    <tr>
        <td>spy.callCount == 7</td>  <td>expect(spy).to.be.called(7)</td>
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
</table></code>
