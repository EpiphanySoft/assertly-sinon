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

    beforeEach(function () {
        sinon.spy(Subject, 'add');
    });

    afterEach(function () {
        Subject.add.restore();
    });

    describe('smoke', function () {
        it('should not smoke', function () {
            //expect(A.registry.foo).to.not.be(undefined);
        });
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

        it('should work with a two calls', function () {
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

        it('should work with a two calls', function () {
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

        it('should work with a two calls', function () {
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

    describe.only('calledOn', function () {
        it('should work with a single call', function () {
            let ret = Subject.add(2, 4);

            expect(ret).to.be(6);

            expect(Subject.add.firstCall).to.be.calledOn(Subject);

            try {
                expect(Subject.add.firstCall).to.not.be.calledOn(Subject);
            }
            catch (e) {
                expect(e.message).to.be(`Expected add() to not be called once`);
            }
        });
    });

    describe('firstCall', function () {
        it('should operate on first call', function () {
            let ret = Subject.add(2, 4);

            expect(ret).to.be(6);

            expect(Subject.add).firstCall.to.be.calledOn(Subject);

            try {
                expect(Subject.add).firstCall.to.not.be.calledOn(Subject);
            }
            catch (e) {
                expect(e.message).to.be(`Expected add() to not be called once`);
            }
        });
    });
});
