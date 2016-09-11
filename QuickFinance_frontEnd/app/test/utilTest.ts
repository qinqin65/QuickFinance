import * as Util from '../util';
import * as chai from 'ref/js/chai';

export let describes = function() {
    describe("Util_getCountDays", function() {
        it("should get right counts of day of specified date", function() {
            chai.assert.equal(Util.getCountDays('2016/8/8'), 31, 'August must have 31 days');
            chai.assert.equal(Util.getCountDays('2016/9/10'), 30, ' September must have 30 days');
        });
    });
}