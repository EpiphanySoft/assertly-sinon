# Sinon Spy API Mapping

The sinon [Spy API](http://sinonjs.org/docs/#spies-api) provides many methods that
return `true` if the spy was used in a particular way. The following table shows
the mapping of these API's to equivalent assertions.

<table>
    <tr>
        <td><tt>spy.callCount == 7</tt></td><td><tt>expect(spy).to.be.called(7)</tt></td>
        <td><tt>spy.called</tt></td><td><tt>expect(spy).to.be.called()</tt></td>
        <td><tt>spy.calledOnce</tt></td><td><tt>expect(spy).to.be.called(1)</tt></td>
        <td><tt>spy.calledTwice</tt></td><td><tt>expect(spy).to.be.called(2)</tt></td>
        <td><tt>spy.calledThrice</tt></td><td><tt>expect(spy).to.be.called(3)</tt></td>
    </tr>
</table>
