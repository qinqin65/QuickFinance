import * as loginTest from 'loginTest';
import * as utilTest from 'utilTest';
import * as storeTest from 'storeTest';
import * as setupTest from 'setupTest';

export function runTest() {
    mocha.setup('bdd');
    
    loginTest.describes();
    utilTest.describes();
    storeTest.describes();
    setupTest.describes();
    
    mocha.checkLeaks();
    mocha.run();
}