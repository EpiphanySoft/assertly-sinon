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

const API = {
    getKind (thing) {
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
            always: true,
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
                let mod = this._modifiers;
                if (mod.only || mod.always) {
                    return spyOrCall.alwaysCalledOn(object);
                }
                return spyOrCall.calledOn(object);
            },

            calledWith (spyOrCall, ...args) {
                let mod = this._modifiers;
                let fn = (mod.only || mod.always) ? 'alwaysCalledWith' : 'calledWith';

                if (mod.match) {
                    fn = MATCH[fn];
                }
                else if (mod.exactly) {
                    fn = EXACT[fn];
                }

                return spyOrCall[fn](...args);
            },

            return: {
                evaluate (spyOrCall, value) {
                    let kind = API.getKind(spyCall);
                    let mod = this._modifiers;

                    if (kind === 'spyCall') {
                        return spyOrCall.returnValue === value;
                    }

                    if (mod.only || mod.always) {
                        return spyOrCall.alwaysReturned(value);
                    }

                    return spyOrCall.returned(value);
                },

                explain (spyOrCall) {
                    let kind = API.getKind(spyOrCall);

                    if (kind === 'spyCall') {
                        this.expectation += ` (got ${spyOrCall.returnValue})`;
                    }
                },

                get (spyCall) {
                    // expect(spy).firstCall.return.to.be.above(4);
                    // ==> only works for spyCall
                    return new Assert(spyCall.returnValue, this, {
                        description: `${Assert.print(spyCall)} return of`
                    });
                }
            },

            throw: {
                evaluate: function fn (spyOrCall, type) {
                    // If the method is not a spyCall, pass to original throw()
                    // assertion:
                    let ok, kind = API.getKind(spyOrCall);

                    if (kind === 'spyCall') {
                        ok = fn._super.call(this, spyOrCall.exception, type);
                    }
                    else if (kind === 'spy') {
                        let exceptions = spyOrCall.exceptions;
                        let mod = this._modifiers;
                        let only = mod.only;

                        if (!(ok = spyOrCall.threw())) {
                            return false;  // never threw... so we're done here
                        }
                        // ok is true...

                        if (mod.always || (only && !type)) {
                            ok = spyOrCall.alwaysThrew();

                            if (ok && type) {
                                // expect(spy).to.always.throw(type);
                                // ==> all calls must throw a matching exception
                                for (let e of exceptions) {
                                    if (!fn._super.call(this, e, type)) {
                                        ok = false;
                                        break;
                                    }
                                }
                            }
                            // else
                            // expect(spy).to.always.throw();
                            // expect(spy).to.only.throw();
                        }
                        else if (only) {
                            // expect(spy).to.only.throw(type);
                            // ==> all calls that throw must match exception
                            for (let e of exceptions) {
                                if (e && !fn._super.call(this, e, type)) {
                                    ok = false;
                                    break;
                                }
                            }
                        }
                        else if (type) {
                            // expect(spy).to.throw(type);
                            // ==> at least one call must throw a matching exception
                            ok = false;

                            for (let e of exceptions) {
                                if (e && fn._super.call(this, e, type)) {
                                    ok = true;
                                    break;
                                }
                            }
                        }
                        // else {
                        // expect(spy).to.throw();
                        // ==> at least one call must throw
                    }
                    else {
                        ok = fn._super.call(this, spyOrCall, ...this.expected);
                    }

                    return ok;
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

module.exports = API;
