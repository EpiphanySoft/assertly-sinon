# assertly-sinon
An [assertly](https://github.com/dongryphon/assertly) add-on [module](https://www.npmjs.com/package/assertly) for the [sinon](https://github.com/sinonjs/sinon) [module](https://www.npmjs.com/package/sinon).

WIP

## Assertions

### called

**`called(n)`**

This assertion allows you to check whether a spy was called:

    expect(spy).to.be.called();

Or whether a spy was called a certain number of times:

    expect(spy).to.be.called(2);

Or was not called:

    expect(spy).to.not.be.called();
