'use strict';

const timeNames = ['', 'once', 'twice', 'thrice'];

function timesName (n) {
    if (n == null) {
        return '';
    }
    return timeNames[n] || (timeNames[n] = `${n} times`);
}

const EXACT = {
    calledWith: 'calledWithExactly',
    alwaysCalledWith: 'alwaysCalledWithExactly'
};
const MATCH = {
    calledWith: 'calledWithMatch',
    alwaysCalledWith: 'alwaysCalledWithMatch'
};

const Export = {
    getSpyType (thing) {
        if (thing && thing.proxy && thing.proxy.isSinonProxy) {
            if (thing.getCall) {
                return 'spy';
            }
            return 'spyCall';
        }

        return false;
    },

    init (Assert, Util) {
        Assert.register({
            exactly: true,

            call: {
                invoke (spy, index) {
                    return new Assert(spy.getCall(index), this);
                }
            },

            called: {
                evaluate (spy, count) {
                    let calls = spy.callCount;
                    return (count == null) ? calls > 0 : calls === count;
                },

                explain (spy, count) {
                    if (count == null) {
                        return;
                    }

                    // expect(fn).to.be.called(2);
                    // Pass: "expected fn to be called twice"
                    // Fail: "expected fn to be called twice not once"

                    // expect(fn).to.not.be.called(2);
                    // Pass: "expected fn to not be called twice and was called once"
                    // Fail: "expected fn to not be called twice"

                    let not = this._modifiers.not;

                    let phrase = this.failed ? (not ? '' : ' not ') :
                        (not ? ' and was called ' : '');

                    if (phrase) {
                        phrase += timesName(spy.callCount);
                    }

                    this.expectation = `${timesName(count)}${phrase}`;
                }
            },

            calledOn (spyOrCall, object) {
                if (this._modifiers.only) {
                    return spyOrCall.alwaysCalledOn(object);
                }
                return spyOrCall.calledOn(object);
            },

            calledWith (spyOrCall, ...args) {
                let mod = this._modifiers;
                let fn = mod.only ? 'alwaysCalledWith' : 'calledWith';

                if (mod.match) {
                    fn = MATCH[fn];
                }
                else if (mod.exactly) {
                    fn = EXACT[fn];
                }

                return spyOrCall[fn](...args);
            },

            return: {
                evaluate (spyCall, value) {
                    return spyCall.returnValue === value;
                },

                explain (spyCall) {
                    this.expectation += ` (got ${spyCall.returnValue})`;
                },

                get (spyCall) {
                    let a = new Assert(spyCall.returnValue, this, {
                        description: `${Assert.print(spyCall)} return of`
                    });
debugger
                    return a;
                }
            },

            throw: {
                evaluate: function fn (spyCall, type) {
                    // If the method is not a spyCall, pass to original throw()
                    // assertion:
                    let kind = Export.getSpyType(spyCall);

                    if (kind === 'spyCall') {
                        let e = spyCall.exception;
                        let ok = false;

                        if (e) {
                            ok = true;
                            let msg = e.message;

                            if (typeof type === 'string') {
                                ok = (msg.indexOf(type) > -1);
                            }
                            else if (type) {
                                ok = type.test(msg);
                            }

                            e.matched = ok;
                            this._threw = e;
                        }

                        return ok;
                    }

                    return fn._super.call(this, spyCall, ...this.expected);
                }
            }
        });

        ['firstCall', 'secondCall', 'thirdCall', 'lastCall'].forEach(property => {
            Assert.register({
                [property]: {
                    get (spy) {
                        return new Assert(spy[property], this);
                    }
                }
            });
        });
    }
};

module.exports = Export;
