import * as loginTest from 'loginTest';
import * as utilTest from 'utilTest';
import * as storeTest from 'storeTest';

export function runTest() {
    mocha.setup('bdd');
    
    loginTest.describes();
    utilTest.describes();
    storeTest.describes();
    
    mocha.checkLeaks();
    mocha.run();
}