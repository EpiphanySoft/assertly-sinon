'use strict';

const timeNames = ['', 'once', 'twice', 'thrice'];

function timesName (n) {
    if (n == null) {
        return '';
    }
    return timeNames[n] || (timeNames[n] = `${n} times`);
}

module.exports = {
    init (Assert, Util) {
        const print = Assert.print;

        Assert.print = function (obj) {
            debugger;
            if (obj) {
                if (obj.isSinonProxy) {
                    return `${obj.displayName}()`;
                }
                if (obj.proxy && obj.calledWith) {
                    return `${obj.proxy.displayName}()`;
                }
            }

            return print.apply(this, arguments);
        };

        Assert.register({
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

            calledOn (spyCall, object) {
                return spyCall.calledOn(object);
            },

            firstCall: {
                get (spyOrCall) {
                    return new Assert(spyOrCall.firstCall, this);
                }
            }
        })
    }
};
