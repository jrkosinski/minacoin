'use strict'; 

const { TestProcess } = require('./TestProcess'); 

class TestProcessArray {
    constructor(count, basePortNumber) {
        this._array = []; 
        this._currentPortNum = basePortNumber;
        
        for(let n=0; n<count; n++) {
            this.add();
        }
    }
    
    add() {
        const proc = new TestProcess(++this._currentPortNum);
        this._array.push(proc); 
        this['proc' + this._array.length] = proc;
    }
    
    procAt(n) {
        return this._array[n]; 
    }
    
    start(index) {
        if (this._array[index]) {
            this._array[index].start(); 
        }
    }
    
    kill(index) {
        if (this._array[index]) {
            this._array[index].kill(); 
        }
    }
    
    startAll() {
        for(let p of this._array) {
            p.start();
        }
        return this;
    }
    
    killAll() {
        for(let p of this._array) {
            p.kill();
        }
    }    
}


module.exports = { TestProcessArray }