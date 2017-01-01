'use strict';

const API = module.exports = {
    getKind (thing) {
        if (thing) {
            if (thing.isSinonProxy || (thing.proxy && thing.proxy.isSinonProxy)) {
                if (thing.getCall) {
                    return 'spy';
                }
                return 'spyCall';
            }

            if (thing.message && typeof thing.test === 'function' &&
                typeof thing.and === 'function' && typeof thing.or === 'function') {
                //TODO maybe there is a better way to recognize a matcher...
                return 'matcher';
            }
        }

        return false;
    },

    prettySpy (spy, name) {
        let getCall = spy.getCall;

        name = name || spy.displayName || spy.printf(`%n`);

        spy.inspect = function () {
            return `${name}()`;
        };

        spy.getCall = function (index) {
            let call = getCall.call(this, index);

            if (call) {
                call.inspect = function () {
                    return `${name}().call[${index}]`;
                };
            }

            return call;
        };

        return spy;
    },

    timesName (n) {
        if (n == null) {
            return '';
        }
        return API._timeNames[n] || (API._timeNames[n] = `${n} times`);
    },

    _timeNames: ['', 'once', 'twice', 'thrice'],

    init (Assert) {
        Assert.register({
            always: true,

            call: {
                invoke (spy, index) {
                    if (spy && spy.getCall) {
                        return new Assert(spy.getCall(index), this);
                    }
                }
            },

            called: {
                evaluate (spy, count) {
                    let calls = spy && spy.callCount;
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
                        phrase += API.timesName(spy.callCount);
                    }

                    this.expectation = `${API.timesName(count)}${phrase}`;
                }
            },

            calledOn (spyOrCall, object) {
                let kind = API.getKind(spyOrCall);

                if (kind === 'spy') {
                    let mod = this._modifiers;

                    if (mod.only || mod.always) {
                        return spyOrCall.alwaysCalledOn(object);
                    }

                    return spyOrCall.calledOn(object);
                }

                if (kind === 'spyCall') {
                    return spyOrCall.calledOn(object);
                }
            },

            calledWith (spyOrCall, ...args) {
                let kind = API.getKind(spyOrCall);
                let spy = kind === 'spy' && spyOrCall;

                if (spy || kind === 'spyCall') {
                    let calls = spy ? spy.getCalls() : [ spyOrCall ];
                    let mod = this._modifiers;
                    let always = mod.always || mod.only;
                    let fn = mod.match ? 'calledWithMatch': 'calledWith';
                    let matches = 0;
                    let k, n = args.length;

                    if (!calls.length) {
                        // no calls, so the "always" or "only" guys are declared
                        // passing since there were no violators.
                        //
                        //      expect(spy).to.only.be.calledWith(42);
                        //
                        // Never called is ... shrug :)
                        //
                        // But given:
                        //
                        //      expect(spy).to.be.calledWith(42);
                        //
                        // Never called is clearly not expected to pass...

                        return !!always;
                    }

                    for (let call of calls) {
                        k = call.args.length;

                        if ((mod.exactly ? n === k : n <= k) && call[fn](...args)) {
                            ++matches;

                            if (!always) {
                                return true;
                            }
                        }
                        else if (always) {
                            return false;
                        }
                    }

                    // Since there are calls, with "always" set we only get here if
                    // all calls matched. Without "always" we get here in any case.
                    // So this check ensures there was at least one match.
                    return matches > 0;
                }
            },

            return: {
                evaluate (spyOrCall, value) {
                    let kind = API.getKind(spyOrCall);
                    let mod = this._modifiers;
                    let noValue = !this.expected.length;
                    let matcher = !noValue && API.getKind(value) === 'matcher' && value;

                    if (kind === 'spyCall') {
                        if (spyOrCall.exception) {
                            return false;
                        }

                        let r = spyOrCall.returnValue;
                        return noValue || (matcher ? matcher.test(r) : (r === value));
                    }

                    if (kind === 'spy') {
                        let values = spyOrCall.returnValues;
                        let exceptions = spyOrCall.exceptions;
                        let always = mod.always;
                        let only = always || mod.only;
                        let n = 0;

                        for (let i = spyOrCall.callCount; i-- > 0; ) {
                            if (exceptions[i]) {
                                if (always) {
                                    return false;
                                }
                                continue;
                            }

                            let r = values[i];
                            r = noValue || (matcher ? matcher.test(r) : (r === value));
                            ++n;

                            if (r) {
                                // For non-always and non-only, one match is good...
                                if (!only) {
                                    return true;
                                }
                            }
                            else if (only) {
                                // For always or only, one mis-match is bad...
                                return false;
                            }
                        }

                        // If "always" or "only", we get here if all returns matched...
                        // Otherwise, we get here if we no returns matched...
                        if (only) {
                            return n > 0;
                        }

                        return false;
                    }

                    // Not a thing we recognize, but to support combining add-ons,
                    // just report failure...
                    return false;
                },

                explain (spyOrCall) {
                    let kind = API.getKind(spyOrCall);

                    if (kind === 'spyCall') {
                        this.expectation += ` (got ${spyOrCall.returnValue})`;
                    }
                },

                get (spyCall) {
                    let kind = API.getKind(spyCall);

                    if (kind === 'spyCall') {
                        // expect(spy).firstCall.return.to.be.above(4);
                        // ==> only works for spyCall
                        return new Assert(spyCall.returnValue, this, {
                            description: `${Assert.print(spyCall)} return of`
                        });
                    }
                }
            },

            throw: {
                evaluate: function evaluate (spyOrCall, type) {
                    // If the method is not a spyCall, pass to original throw()
                    // assertion:
                    let ok, kind = API.getKind(spyOrCall);

                    if (kind === 'spyCall') {
                        let e = spyOrCall.exception;
                        ok = e ? evaluate._super.call(this, e, type) : false;
                    }
                    else if (kind === 'spy') {
                        let exceptions = spyOrCall.exceptions;
                        let mod = this._modifiers;
                        let always = mod.always;
                        let only = mod.only;
                        let matcher = type && API.getKind(type) === 'matcher' && type;
                        let n = 0;
                        let first;

                        for (let e of exceptions) {
                            if (!e) {
                                // expect(spy).to.always.throw(type);
                                // expect(spy).to.only.throw();
                                // ==> all calls must throw a matching exception
                                if (always || (only && !type)) {
                                    this._threw = null;
                                    return false;
                                }
                                continue;
                            }

                            ++n;
                            if (matcher) {
                                e.matched = matcher.test(e);
                                this._threw = e;
                            }
                            else {
                                evaluate._super.call(this, e, type);
                            }

                            if (e.matched) {
                                if (!always && !only) {
                                    return true;
                                }
                                first = first || e;
                            }
                            else if (always || only) {
                                return false;
                            }
                        }

                        if (first) {
                            this._threw = first;
                        }

                        if (always || only) {
                            return n > 0;
                        }

                        return false;
                    }
                    else {
                        ok = evaluate._super.call(this, spyOrCall, ...this.expected);
                    }

                    return ok;
                }
            }
        });

        ['firstCall', 'secondCall', 'thirdCall', 'lastCall'].forEach(property => {
            Assert.register({
                [property]: {
                    get (spy) {
                        let kind = API.getKind(spy);

                        if (kind === 'spy') {
                            return new Assert(spy[property], this);
                        }
                    }
                }
            });
        });
    }
};
