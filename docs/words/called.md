# called

**`called([ count ])`**

This assertion allows you to check whether a spy was called:

    expect(spy).to.be.called();

Or whether a spy was called a certain number of times:

    expect(spy).to.be.called(2);

Or was not called:

    expect(spy).to.not.be.called();
