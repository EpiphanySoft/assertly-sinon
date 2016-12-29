'use strict';

/* global describe, it, afterEach, beforeEach */

const Assert = require('assertly');
const Addon = require('../../index');
const sinon = require('sinon');

describe('Main', function () {
    class A extends Assert {}

    A.setup();
    A.register(Addon.init);

    const expect = A.expect.bind(A);

    const Subject = {
        add (a, b) {
            return a + b;
        },

        boom () {
            throw new Error('Kaboom');
        }
    };

    const SUBJECT = '{ add: add(), boom: boom() }'

    function spy (object, method) {
        let ret = sinon.spy(object, method);
        let spy = object[method];
        let getCall = spy.getCall;

        spy.inspect = function () {
            return `${method}()`;
        };

        spy.getCall = function (index) {
            let call = getCall.call(this, index);

            if (call) {
                call.inspect = function () {
                    return `${method}().call[${index}]`;
                };
            }

            return call;
        };

        return ret;
    }

    beforeEach(function () {
        spy(Subject, 'add');
        spy(Subject, 'boom');
    });

    afterEach(function () {
        Subject.add.restore();
        Subject.boom.restore();
    });

    describe('called', function () {
        it('should work with no calls', function () {
            expect(Subject.add).to.not.be.called();

            try {
                expect(Subject.add).to.be.called();
            }
            catch (e) {
                expect(e.message).to.be(`Expected add() to be called`);
            }
        });

        it('should work with a single call', function () {
            let ret = Subject.add(2, 4);

            expect(ret).to.be(6);

            expect(Subject.add).to.be.called();

            try {
                expect(Subject.add).to.not.be.called();
            }
            catch (e) {
                expect(e.message).to.be(`Expected add() to not be called`);
            }
        });

        it('should work with two calls', function () {
            let ret = Subject.add(2, 4);
            expect(ret).to.be(6);

            ret = Subject.add(4, 6);
            expect(ret).to.be(10);

            expect(Subject.add).to.be.called();

            try {
                expect(Subject.add).to.not.be.called();
            }
            catch (e) {
                expect(e.message).to.be(`Expected add() to not be called`);
            }
        });
    });

    describe('called(0)', function () {
        it('should work with a single call', function () {
            // let ret = Subject.add(2, 4);
            //
            // expect(ret).to.be(6);

            expect(Subject.add).to.be.called(0);

            try {
                expect(Subject.add).not.to.be.called(0);
            }
            catch (e) {
                expect(e.message).to.be(`Expected add() not to be called 0 times`);
            }
        });

        it('should work with two calls', function () {
            let ret = Subject.add(2, 4);
            expect(ret).to.be(6);

            ret = Subject.add(4, 6);
            expect(ret).to.be(10);

            expect(Subject.add).to.not.be.called(0);

            try {
                expect(Subject.add).to.be.called(0);
            }
            catch (e) {
                expect(e.message).to.be(`Expected add() to be called 0 times not twice`);
            }
        });
    });

    describe('called(n)', function () {
        it('should work with a single call', function () {
            let ret = Subject.add(2, 4);

            expect(ret).to.be(6);

            expect(Subject.add).to.be.called(1);

            try {
                expect(Subject.add).to.not.be.called(1);
            }
            catch (e) {
                expect(e.message).to.be(`Expected add() to not be called once`);
            }

            try {
                expect(Subject.add).to.be.called(3);
            }
            catch (e) {
                expect(e.message).to.be(`Expected add() to be called thrice not once`);
            }
        });

        it('should work with two calls', function () {
            let ret = Subject.add(2, 4);
            expect(ret).to.be(6);

            ret = Subject.add(4, 6);
            expect(ret).to.be(10);

            expect(Subject.add).to.be.called(2);

            try {
                expect(Subject.add).to.be.called(1);
            }
            catch (e) {
                expect(e.message).to.be(`Expected add() to be called once not twice`);
            }

            try {
                expect(Subject.add).to.be.called(4);
            }
            catch (e) {
                expect(e.message).to.be(`Expected add() to be called 4 times not twice`);
            }
        });
    });

    describe('spyCalls', function () {
        beforeEach(function () {
            let ret = Subject.add(2, 4);
            expect(ret).to.be(6);

            ret = Subject.add(5, 6);
            expect(ret).to.be(11);

            ret = Subject.add(1, 2);
            expect(ret).to.be(3);

            ret = Subject.add(3, 2);
            expect(ret).to.be(5);

            try {
                Subject.boom();
            }
            catch (e) {
                // ignore... it is supposed to throw to be seen by spy
            }
        });

        describe('call', function () {
            it('should operate on call(1)', function () {
                expect(Subject.add).call(1).to.be.calledOn(Subject);

                try {
                    expect(Subject.add).call(1).to.not.be.calledOn(Subject);
                }
                catch (e) {
                    expect(e.message).to.be(`Expected add().call[1] to not be calledOn ${SUBJECT}`);
                }
            });

            it('should return null for call() beyond callCount', function () {
                expect(Subject.add).call(1e9).to.be(null);

                try {
                    expect(Subject.add).call(1e9).to.not.be(null);
                }
                catch (e) {
                    expect(e.message).to.be(`Expected null to not be null`);
                }
            });
        });

        describe('calledOn', function () {
            it('should work with a single call', function () {
                expect(Subject.add.firstCall).to.be.calledOn(Subject);

                try {
                    expect(Subject.add.firstCall).to.not.be.calledOn(Subject);
                }
                catch (e) {
                    expect(e.message).to.be(`Expected add().call[0] to not be calledOn ${SUBJECT}`);
                }
            });
        });

        describe('firstCall', function () {
            it('should operate on first call', function () {
                expect(Subject.add).firstCall.to.be.calledOn(Subject);

                try {
                    expect(Subject.add).firstCall.to.not.be.calledOn(Subject);
                }
                catch (e) {
                    expect(e.message).to.be(`Expected add().call[0] to not be calledOn ${SUBJECT}`);
                }
            });
        });

        describe('secondCall', function () {
            it('should operate on second call', function () {
                expect(Subject.add).secondCall.to.be.calledOn(Subject);

                try {
                    expect(Subject.add).secondCall.to.not.be.calledOn(Subject);
                }
                catch (e) {
                    expect(e.message).to.be(`Expected add().call[1] to not be calledOn ${SUBJECT}`);
                }
            });
        });

        describe('thirdCall', function () {
            it('should operate on third call', function () {
                expect(Subject.add).thirdCall.to.be.calledOn(Subject);

                try {
                    expect(Subject.add).thirdCall.to.not.be.calledOn(Subject);
                }
                catch (e) {
                    expect(e.message).to.be(`Expected add().call[2] to not be calledOn ${SUBJECT}`);
                }
            });
        });

        describe('lastCall', function () {
            it('should operate with multiple calls', function () {
                expect(Subject.add).lastCall.to.be.calledOn(Subject);

                try {
                    expect(Subject.add).lastCall.to.not.be.calledOn(Subject);
                }
                catch (e) {
                    expect(e.message).to.be(`Expected add().call[3] to not be calledOn ${SUBJECT}`);
                }
            });
        });

        describe('return', function () {
            it('should match exact values on first call', function () {
                expect(Subject.add).firstCall.to.return(6);

                try {
                    expect(Subject.add).firstCall.to.return(7);
                }
                catch (e) {
                    expect(e.message).to.be(`Expected add().call[0] to return 7 (got 6)`);
                }
            });

            it('should expose return value to subsequent assertions', function () {
                expect(Subject.add).firstCall.return.to.be(6);

                try {debugger
                    expect(Subject.add).firstCall.return.to.be(7);
                }
                catch (e) {
                    expect(e.message).to.be(`Expected add().call[0] return of 6 to be 7`);
                }
            });
        });

        describe('throw', function () {
            it('should report a thrown exception', function () {
                expect(Subject.boom).firstCall.to.throw();

                expect(() => {
                    expect(Subject.boom).firstCall.to.not.throw();
                }).to.throw(`Expected boom().call[0] to not throw but it threw 'Kaboom'`);
            });

            it('should fail if not thrown', function () {
                expect(() => {
                    expect(Subject.add).firstCall.to.throw();
                }).to.throw(`Expected add().call[0] to throw but it did not throw`);
            });
        });
    }); // spyCalls
});
