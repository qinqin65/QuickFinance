import * as topic from 'dojo/topic';
import * as Store from '../store';
import * as stateCode from 'stateCode';
import * as chai from 'ref/js/chai';

export let describes = function() {
    describe("Store_FinancePreviewStore", function() {
        let financePreviewStore = Store.financePreviewStore;
        let topicHandler = [];

        after(function() {
            topicHandler.forEach((topicItem)=>topicItem.remove());
        });

        it("should get right data set", function(done) {
            let year = '2016';
            let month = '9';
            let day = '10';
            let type = stateCode.OUTCOME;
            financePreviewStore.setParam(year, month, day, type);
            financePreviewStore.requestStore();

            let handler = topic.subscribe('finance/financeDataChanged', function() {
                let data: Array<any> = financePreviewStore.getStore();
                chai.assert.lengthOf(data, 24, 'the length should be 24');
                chai.assert.typeOf(data[0], 'number', 'the data type must be number');
                done();
            });
            topicHandler.push(handler);
        });
    });
}