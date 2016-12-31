'use strict';

/* global describe, it, afterEach, beforeEach */

const Assert = require('assertly');
const Addon = require('../../index');
const sinon = require('sinon');

describe('Main', function () {
    class A extends Assert {}

    A.fullCallStacks = true;
    A.setup();
    A.register(Addon.init);

    const expect = A.expect.bind(A);

    const Subject = {
        add (a, b) {
            return a + b;
        },

        boom () {
            throw new Error('Kaboom');
        },

        sometimes (n) {
            if (n < 0) {
                throw new Error(`Poof${n}`);
            }
            return n;
        }
    };

    const SUBJECT = '{ add: add(), boom: boom(), sometimes: sometimes() }';

    function call (name, ...args) {
        try {
            Subject[name](...args);
        }
        catch (e) {
            // ignore
        }
    }

    function spy (object, method) {
        return Addon.prettySpy(sinon.spy(object, method));
    }

    beforeEach(function () {
        spy(Subject, 'add');
        spy(Subject, 'boom');
        spy(Subject, 'sometimes');
    });

    afterEach(function () {
        Subject.add.restore();
        Subject.boom.restore();
        Subject.sometimes.restore();
    });

    debugger
    let xx = sinon.match.same({});

    describe('spy', function () {
        describe('called', function () {
            it('should work with no calls', function () {
                expect(Subject.add).to.not.be.called();

                expect(() => {
                    expect(Subject.add).to.be.called();
                }).
                to.exactly.throw(`Expected add() to be called`);
            });

            it('should work with a single call', function () {
                let ret = Subject.add(2, 4);

                expect(ret).to.be(6);

                expect(Subject.add).to.be.called();

                expect(() => {
                    expect(Subject.add).to.not.be.called();
                }).
                to.exactly.throw(`Expected add() to not be called`);
            });

            it('should work with two calls', function () {
                let ret = Subject.add(2, 4);
                expect(ret).to.be(6);

                ret = Subject.add(4, 6);
                expect(ret).to.be(10);

                expect(Subject.add).to.be.called();

                expect(() => {
                    expect(Subject.add).to.not.be.called();
                }).
                to.exactly.throw(`Expected add() to not be called`);
            });
        });

        describe('called(0)', function () {
            it('should work no calls', function () {
                expect(Subject.add).to.be.called(0);

                expect(() => {
                    expect(Subject.add).not.to.be.called(0);
                }).
                to.exactly.throw(`Expected add() not to be called 0 times`);
            });

            it('should work with two calls', function () {
                let ret = Subject.add(2, 4);
                expect(ret).to.be(6);

                ret = Subject.add(4, 6);
                expect(ret).to.be(10);

                expect(Subject.add).to.not.be.called(0);

                expect(() => {
                    expect(Subject.add).to.be.called(0);
                }).
                to.exactly.throw(`Expected add() to be called 0 times not twice`);
            });
        });

        describe('called(n)', function () {
            it('should work with a single call', function () {
                let ret = Subject.add(2, 4);

                expect(ret).to.be(6);

                expect(Subject.add).to.be.called(1);

                expect(() => {
                    expect(Subject.add).to.not.be.called(1);
                }).
                to.exactly.throw(`Expected add() to not be called once`);

                expect(() => {
                    expect(Subject.add).to.be.called(3);
                }).
                to.exactly.throw(`Expected add() to be called thrice not once`);
            });

            it('should work with two calls', function () {
                let ret = Subject.add(2, 4);
                expect(ret).to.be(6);

                ret = Subject.add(4, 6);
                expect(ret).to.be(10);

                expect(Subject.add).to.be.called(2);

                expect(() => {
                    expect(Subject.add).to.be.called(1);
                }).
                to.exactly.throw(`Expected add() to be called once not twice`);

                expect(() => {
                    expect(Subject.add).to.be.called(4);
                }).
                to.exactly.throw(`Expected add() to be called 4 times not twice`);
            });
        });

        describe('return', function () {
            it('should match at least one return', function () {
                let ret = Subject.add(2, 4);
                expect(ret).to.be(6);

                ret = Subject.add(5, 6);
                expect(ret).to.be(11);

                expect(Subject.add).to.return(6);
                expect(Subject.add).to.return(11);

                expect(() => {
                    expect(Subject.add).to.return(7);
                }).
                to.exactly.throw(`Expected add() to return 7`);
            });

            it('should match all returns using only modifier', function () {
                let ret = Subject.add(2, 4);
                expect(ret).to.be(6);

                ret = Subject.add(0, 6);
                expect(ret).to.be(6);

                expect(Subject.add).to.only.return(6);

                expect(() => {
                    expect(Subject.add).to.not.only.return(6);
                }).
                to.exactly.throw(`Expected add() to not only return 6`);
            });

            it('should match all returns using always modifier', function () {
                let ret = Subject.add(2, 4);
                expect(ret).to.be(6);

                ret = Subject.add(0, 6);
                expect(ret).to.be(6);

                expect(Subject.add).to.always.return(6);

                expect(() => {
                    expect(Subject.add).to.not.always.return(6);
                }).
                to.exactly.throw(`Expected add() to not always return 6`);
            });

            it('should not match mixed returns using only modifier', function () {
                let ret = Subject.add(2, 4);
                expect(ret).to.be(6);

                ret = Subject.add(5, 6);
                expect(ret).to.be(11);

                expect(() => {
                    expect(Subject.add).to.only.return(6);
                }).
                to.exactly.throw(`Expected add() to only return 6`);
            });
        }); // return

        describe('throw', function () {
            beforeEach(function () {
                let ret = Subject.add(2, 4);
                expect(ret).to.be(6);

                ret = Subject.add(5, 6);
                expect(ret).to.be(11);

                ret = Subject.add(1, 2);
                expect(ret).to.be(3);

                ret = Subject.add(3, 2);
                expect(ret).to.be(5);

                call('boom');
                call('boom');
            });

            describe('basic', function () {
                it('should report if all calls throws', function () {
                    expect(Subject.boom).to.throw();

                    expect(() => {
                        expect(Subject.boom).to.not.throw();
                    }).
                    to.exactly.throw(`Expected boom() to not throw but it threw 'Kaboom'`);
                });

                it('should report if no call throws', function () {
                    expect(Subject.add).to.not.throw();

                    expect(() => {
                        expect(Subject.add).to.throw();
                    }).
                    to.exactly.throw(`Expected add() to throw but it did not throw`);
                });

                it('should report if only some calls throw', function () {
                    call('sometimes', -1); // throws
                    call('sometimes', 1);  // returns

                    expect(Subject.sometimes).to.throw();

                    expect(() => {
                        expect(Subject.sometimes).to.not.throw();
                    }).
                    to.exactly.throw(`Expected sometimes() to not throw but it threw 'Poof-1'`);
                });

                it('should match exception some calls throw', function () {
                    call('sometimes', -1); // throws
                    call('sometimes', -2); // throws
                    call('sometimes', 1);  // returns

                    expect(Subject.sometimes).to.throw(`Poof-1`);
                    expect(Subject.sometimes).to.throw(`Poof-2`);
                    expect(Subject.sometimes).to.return();

                    expect(() => {
                        expect(Subject.sometimes).to.not.throw(`Poof-1`);
                    }).
                    to.exactly.throw(`Expected sometimes() to not throw 'Poof-1' but it did`);

                    expect(() => {
                        expect(Subject.sometimes).to.always.return();
                    }).
                    to.exactly.throw(`Expected sometimes() to always return`);
                });
            });

            describe('always', function () {
                it('should reject if no call throws', function () {
                    expect(Subject.add).to.not.always.throw();

                    expect(() => {
                        expect(Subject.add).to.always.throw();
                    }).
                    to.exactly.throw(`Expected add() to always throw but it did not throw`);
                });

                it('should reject match if no call throws', function () {
                    expect(Subject.add).to.not.always.throw(`Poof`);

                    expect(() => {
                        expect(Subject.add).to.always.throw('Poof');
                    }).
                    to.exactly.throw(`Expected add() to always throw 'Poof' but it did not throw`);
                });

                it('should pass if all calls throw', function () {
                    call('sometimes', -1); // throws
                    call('sometimes', -2); // throws

                    expect(Subject.sometimes).to.always.throw();
                    expect(Subject.sometimes).to.not.return();

                    expect(() => {
                        expect(Subject.sometimes).to.not.always.throw();
                    }).
                    to.exactly.throw(`Expected sometimes() to not always throw but it threw 'Poof-1'`);

                    expect(() => {
                        expect(Subject.sometimes).to.return();
                    }).
                    to.exactly.throw(`Expected sometimes() to return`);
                });

                it('should pass if all throws match', function () {
                    call('sometimes', -1); // throws
                    call('sometimes', -1); // throws

                    expect(Subject.sometimes).to.always.throw(`Poof-1`);
                    expect(Subject.sometimes).to.not.return();

                    expect(() => {
                        expect(Subject.sometimes).to.not.always.throw(`Poof-1`);
                    }).
                    to.exactly.throw(`Expected sometimes() to not always throw 'Poof-1' but it did`);

                    expect(() => {
                        expect(Subject.sometimes).to.always.throw(`Poof-2`);
                    }).
                    to.exactly.throw(`Expected sometimes() to always throw 'Poof-2' but it threw 'Poof-1'`);
                });

                it('should reject if all throws match but some calls do not throw', function () {
                    call('sometimes', -1); // throws
                    call('sometimes', -1); // throws
                    call('sometimes', 1);  // returns

                    expect(Subject.sometimes).to.not.always.throw(`Poof-1`);
                    expect(Subject.sometimes).to.return();

                    expect(() => {
                        expect(Subject.sometimes).to.always.throw(`Poof-1`);
                    }).
                    to.exactly.throw(`Expected sometimes() to always throw 'Poof-1' but it did not throw`);

                    expect(() => {
                        expect(Subject.sometimes).to.always.throw(`Poof-2`);
                    }).
                    to.exactly.throw(`Expected sometimes() to always throw 'Poof-2' but it threw 'Poof-1'`);
                });

                it('should reject if only some calls throw', function () {
                    call('sometimes', -1); // throws
                    call('sometimes', -2); // throws
                    call('sometimes', 1);  // returns

                    expect(Subject.sometimes).to.not.always.throw();
                    expect(Subject.sometimes).to.return();

                    expect(() => {
                        expect(Subject.sometimes).to.always.throw();
                    }).
                    to.exactly.throw(`Expected sometimes() to always throw but it did not throw`);

                    expect(() => {
                        expect(Subject.sometimes).to.not.return();
                    }).
                    to.exactly.throw(`Expected sometimes() to not return`);
                });

                it('should reject if only some throws match', function () {
                    call('sometimes', -1); // throws
                    call('sometimes', -2); // throws
                    call('sometimes', 1);  // returns

                    expect(Subject.sometimes).to.throw(`Poof-1`);
                    expect(Subject.sometimes).to.throw(`Poof-2`);
                    expect(Subject.sometimes).to.return();

                    expect(() => {
                        expect(Subject.sometimes).to.always.throw(`Poof-1`);
                    }).
                    to.exactly.throw(`Expected sometimes() to always throw 'Poof-1' but it threw 'Poof-2'`);

                    expect(() => {
                        expect(Subject.sometimes).to.always.throw(`Poof-2`);
                    }).
                    to.exactly.throw(`Expected sometimes() to always throw 'Poof-2' but it threw 'Poof-1'`);

                    expect(() => {
                        expect(Subject.sometimes).to.always.return();
                    }).
                    to.exactly.throw(`Expected sometimes() to always return`);
                });
            });

            describe('only', function () {
                it('should reject if no call throws', function () {
                    expect(Subject.add).to.not.only.throw();

                    expect(() => {
                        expect(Subject.add).to.only.throw();
                    }).
                    to.exactly.throw(`Expected add() to only throw but it did not throw`);
                });

                it('should reject match if no call throws', function () {
                    expect(Subject.add).to.not.only.throw(`Poof`);

                    expect(() => {
                        expect(Subject.add).to.only.throw('Poof');
                    }).
                    to.exactly.throw(`Expected add() to only throw 'Poof' but it did not throw`);
                });

                it('should pass if all calls throw', function () {
                    call('sometimes', -1); // throws
                    call('sometimes', -2); // throws

                    expect(Subject.sometimes).to.only.throw();
                    expect(Subject.sometimes).to.not.return();

                    expect(() => {
                        expect(Subject.sometimes).to.not.only.throw();
                    }).
                    to.exactly.throw(`Expected sometimes() to not only throw but it threw 'Poof-1'`);

                    expect(() => {
                        expect(Subject.sometimes).to.return();
                    }).
                    to.exactly.throw(`Expected sometimes() to return`);
                });

                it('should pass if all throws match', function () {
                    call('sometimes', -1); // throws
                    call('sometimes', -1); // throws

                    expect(Subject.sometimes).to.only.throw(`Poof-1`);
                    expect(Subject.sometimes).to.not.return();

                    expect(() => {
                        expect(Subject.sometimes).to.not.only.throw(`Poof-1`);
                    }).
                    to.exactly.throw(`Expected sometimes() to not only throw 'Poof-1' but it did`);

                    expect(() => {
                        expect(Subject.sometimes).to.only.throw(`Poof-2`);
                    }).
                    to.exactly.throw(`Expected sometimes() to only throw 'Poof-2' but it threw 'Poof-1'`);
                });

                it('should pass if all throws match even if some calls do not throw', function () {
                    call('sometimes', -1); // throws
                    call('sometimes', -1); // throws
                    call('sometimes', 1);  // returns

                    expect(Subject.sometimes).to.only.throw(`Poof-1`);
                    expect(Subject.sometimes).to.return();

                    expect(() => {
                        expect(Subject.sometimes).to.not.only.throw(`Poof-1`);
                    }).
                    to.exactly.throw(`Expected sometimes() to not only throw 'Poof-1' but it did`);

                    expect(() => {
                        expect(Subject.sometimes).to.only.throw(`Poof-2`);
                    }).
                    to.exactly.throw(`Expected sometimes() to only throw 'Poof-2' but it threw 'Poof-1'`);
                });

                it('should reject if only some calls throw', function () {
                    call('sometimes', -1); // throws
                    call('sometimes', -2); // throws
                    call('sometimes', 1);  // returns

                    expect(Subject.sometimes).to.not.only.throw();
                    expect(Subject.sometimes).to.return();

                    expect(() => {
                        expect(Subject.sometimes).to.only.throw();
                    }).
                    to.exactly.throw(`Expected sometimes() to only throw but it did not throw`);

                    expect(() => {
                        expect(Subject.sometimes).to.not.return();
                    }).
                    to.exactly.throw(`Expected sometimes() to not return`);
                });

                it('should reject if only some throws match', function () {
                    call('sometimes', -1); // throws
                    call('sometimes', -2); // throws
                    call('sometimes', 1);  // returns

                    expect(Subject.sometimes).to.throw(`Poof-1`);
                    expect(Subject.sometimes).to.throw(`Poof-2`);
                    expect(Subject.sometimes).to.return();

                    expect(() => {
                        expect(Subject.sometimes).to.only.throw(`Poof-1`);
                    }).
                    to.exactly.throw(`Expected sometimes() to only throw 'Poof-1' but it threw 'Poof-2'`);

                    expect(() => {
                        expect(Subject.sometimes).to.only.throw(`Poof-2`);
                    }).
                    to.exactly.throw(`Expected sometimes() to only throw 'Poof-2' but it threw 'Poof-1'`);

                    expect(() => {
                        expect(Subject.sometimes).to.always.return();
                    }).
                    to.exactly.throw(`Expected sometimes() to always return`);
                });
            });
        });
    }); // spy

    describe('spyCall', function () {
        beforeEach(function () {
            let ret = Subject.add(2, 4);
            expect(ret).to.be(6);

            ret = Subject.add(5, 6);
            expect(ret).to.be(11);

            ret = Subject.add(1, 2);
            expect(ret).to.be(3);

            ret = Subject.add(3, 2);
            expect(ret).to.be(5);

            call('boom');
        });

        describe('call', function () {
            it('should operate on call(1)', function () {
                expect(Subject.add).call(1).to.be.calledOn(Subject);

                expect(() => {
                    expect(Subject.add).call(1).to.not.be.calledOn(Subject);
                }).
                to.exactly.throw(`Expected add().call[1] to not be calledOn ${SUBJECT}`);
            });

            it('should return null for call() beyond callCount', function () {
                expect(Subject.add).call(1e9).to.be(null);

                expect(() => {
                    expect(Subject.add).call(1e9).to.not.be(null);
                }).
                to.exactly.throw(`Expected null to not be null`);
            });
        });

        describe('calledOn', function () {
            it('should work with a single call', function () {
                expect(Subject.add.firstCall).to.be.calledOn(Subject);

                expect(() => {
                    expect(Subject.add.firstCall).to.not.be.calledOn(Subject);
                }).
                to.exactly.throw(`Expected add().call[0] to not be calledOn ${SUBJECT}`);
            });
        });

        describe('firstCall', function () {
            it('should operate on first call', function () {
                expect(Subject.add).firstCall.to.be.calledOn(Subject);

                expect(() => {
                    expect(Subject.add).firstCall.to.not.be.calledOn(Subject);
                }).
                to.exactly.throw(`Expected add().call[0] to not be calledOn ${SUBJECT}`);
            });
        });

        describe('secondCall', function () {
            it('should operate on second call', function () {
                expect(Subject.add).secondCall.to.be.calledOn(Subject);

                expect(() => {
                    expect(Subject.add).secondCall.to.not.be.calledOn(Subject);
                }).
                to.exactly.throw(`Expected add().call[1] to not be calledOn ${SUBJECT}`);
            });
        });

        describe('thirdCall', function () {
            it('should operate on third call', function () {
                expect(Subject.add).thirdCall.to.be.calledOn(Subject);

                expect(() => {
                    expect(Subject.add).thirdCall.to.not.be.calledOn(Subject);
                }).
                to.exactly.throw(`Expected add().call[2] to not be calledOn ${SUBJECT}`);
            });
        });

        describe('lastCall', function () {
            it('should operate with multiple calls', function () {
                expect(Subject.add).lastCall.to.be.calledOn(Subject);

                expect(() => {
                    expect(Subject.add).lastCall.to.not.be.calledOn(Subject);
                }).
                to.exactly.throw(`Expected add().call[3] to not be calledOn ${SUBJECT}`);
            });
        });

        describe('return', function () {
            it('should match exact values on first call', function () {
                expect(Subject.add).firstCall.to.return(6);

                expect(() => {
                    expect(Subject.add).firstCall.to.return(7);
                }).
                to.exactly.throw(`Expected add().call[0] to return 7 (got 6)`);
            });

            it('should expose return value to subsequent assertions', function () {
                expect(Subject.add).firstCall.return.to.be(6);

                expect(() => {
                    expect(Subject.add).firstCall.return.to.be(7);
                }).
                to.exactly.throw(`Expected add().call[0] return of 6 to be 7`);

                expect(() => {
                    expect(Subject.add).firstCall.return.to.be.above(10);
                }).
                to.exactly.throw(`Expected add().call[0] return of 6 to be above 10`);
            });
        });

        describe('throw', function () {
            it('should report a thrown exception', function () {
                expect(Subject.boom).firstCall.to.throw();

                expect(() => {
                    expect(Subject.boom).firstCall.to.not.throw();
                }).to.throw(`Expected boom().call[0] to not throw but it threw 'Kaboom'`);
            });

            it('should report no thrown exception', function () {
                expect(Subject.add).firstCall.to.not.throw();

                expect(() => {
                    expect(Subject.add).firstCall.to.throw();
                }).to.throw(`Expected add().call[0] to throw but it did not throw`);
            });

            it('should fail if not thrown', function () {
                expect(() => {
                    expect(Subject.add).firstCall.to.throw();
                }).to.throw(`Expected add().call[0] to throw but it did not throw`);
            });
        });
    }); // spyCalls
});
