// import * as mocha from 'ref/js/mocha';
// import 'static/quick/ref/js/mocha.js';
// import 'static/quick/ref/js/chai.js';
import * as loginTest from 'loginTest';

export function runTest() {
    mocha.setup('bdd');
    
    loginTest.describes();
    
    mocha.checkLeaks();
    mocha.run();
}