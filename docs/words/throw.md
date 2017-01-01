# throw

**`throw([ criteria ])`**

This add-on extends the standard `throw` assertion provided by Assertly. With this
add-on, the `throw` assertion can check that a spy or spyCall threw an exception:

    expect(spyOrCall).to.throw();

The above is not concerned with what was thrown, just that the method threw. In
the case of a spy (not a spyCall), this assertion will pass if *any* calls made to
the method threw an exception.

If the `criteria` is passed, the exception object is tested. If a `sinon.matcher`
is provided as the `criteria`, it is used to test the exception. Otherwise, the normal
`throw` [matching](https://github.com/dongryphon/assertly/tree/master/docs/words/throw.md)
is used.

    expect(spyOrCall).to.throw('Bad things happened');

For a spy, this will verify that at least one call to the method threw an exception
with that text as a substring of the message.

When using `throw` on a spy, either the `always` or `only` modifiers can be given
as well.

 - `always` checks that all calls threw a matching value. If any calls returned
  normally, the assertion will fail.
 - `only` checks that all calls that threw an exception, threw a matching error.
  Calls that returned normally are ignored.
 - In both cases, if no calls threw a matching error, the assertion fails.

For example:

    // All calls threw an exception:
    expect(spy).to.always.throw();

    // Same as above:
    expect(spy).to.only.throw();

    // All calls threw an error with this substring in the message (any normal
    // returns will be a failure):
    expect(spy).to.always.throw('Bad things happened');

    // All calls that threw an error had this substring in the message (normal
    // returns are ignored):
    expect(spy).to.only.throw('Bad things happened');
