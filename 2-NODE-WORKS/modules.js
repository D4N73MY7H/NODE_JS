const C = require('./test-module_1')
const calc1 = new C()
console.log(calc1.add(2, 5))


const calc2 = require('./test-module_2')
console.log(calc2.add(2, 5))