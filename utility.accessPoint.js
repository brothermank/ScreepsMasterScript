/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('utility.accessPoint');
 * mod.thing == 'a thing'; // true
 */
 
var accessPoint = class {
    
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.claims =[{start:0, end:0}];
    }
    
    update() {
        for(c in this.claims){
            c.start--;
            c.end--;
        }
    }
    
    makeClaim(claim){
        for(c in this.claims){
            if((c.start < claim.end && c.end > claim.end) || (c.end > claim.start && c.start < claim.start)){
                return false;
            }
        }
        this.claims[this.claims.length] = {start:claim.start, end: claim.end};
        return true;
    }
}

module.exports = AccessPoint;