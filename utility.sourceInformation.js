/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('utility.sourceInformation');
 * mod.thing == 'a thing'; // true
 */

var SourceInformation = class {
    
    constructor (Source){
        this.s = Source;
        this.aps = [];
    }
    
    calcAccessPoints(){
        if(thereIsSpaceAtPos(1, -1)){
            this.aps[aps.length] = new AccessPoint();
        }
        if(thereIsSpaceAtPos(0, -1)){
            this.aps[aps.length] = new AccessPoint();
        }
        if(thereIsSpaceAtPos(-1, -1)){
            this.aps[aps.length] = new AccessPoint();
        }
        if(thereIsSpaceAtPos(1, 1)){
            this.aps[aps.length] = new AccessPoint();
        }
        if(thereIsSpaceAtPos(0, 1)){
            this.aps[aps.length] = new AccessPoint();
        }
        if(thereIsSpaceAtPos(-1, 1)){
            this.aps[aps.length] = new AccessPoint();
        }
        if(thereIsSpaceAtPos(1, 0)){
            this.aps[aps.length] = new AccessPoint();
        }
        if(thereIsSpaceAtPos(-1, 0)){
            this.aps[aps.length] = new AccessPoint();
        }
    }
}

module.exports = SourceInformation;
            