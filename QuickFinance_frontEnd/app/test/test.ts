import * as loginTest from 'loginTest';

export function runTest() {
    mocha.setup('bdd');
    
    loginTest.describes();
    
    mocha.checkLeaks();
    mocha.run();
}