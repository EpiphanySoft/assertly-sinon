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
        }
    };

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
    });

    afterEach(function () {
        Subject.add.restore();
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
        });

        describe('call', function () {
            it('should operate on call(1)', function () {
                expect(Subject.add).call(1).to.be.calledOn(Subject);

                try {
                    expect(Subject.add).call(1).to.not.be.calledOn(Subject);
                }
                catch (e) {
                    expect(e.message).to.be(`Expected add().call[1] to not be calledOn { add: add() }`);
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
                    expect(e.message).to.be(`Expected add().call[0] to not be calledOn { add: add() }`);
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
                    expect(e.message).to.be(`Expected add().call[0] to not be calledOn { add: add() }`);
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
                    expect(e.message).to.be(`Expected add().call[1] to not be calledOn { add: add() }`);
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
                    expect(e.message).to.be(`Expected add().call[2] to not be calledOn { add: add() }`);
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
                    expect(e.message).to.be(`Expected add().call[3] to not be calledOn { add: add() }`);
                }
            });
        });

        describe.only('throw', function () {
            it('should fail if not thrown', function () {
                debugger;
                expect(() => {
                    expect(Subject.add).firstCall.to.throw();
                }).to.throw(`Ex`);
            });
        });
    }); // spyCalls
});
