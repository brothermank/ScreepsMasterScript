/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('room.initialize');
 * mod.thing == 'a thing'; // true
 */
 
var AccessPoint = class {
    
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


var SourceInformation = class {
    
    constructor (source){
        this.sID = source.id;
        this.aps = [];
    }
    
    thereIsSpaceAtPos(modx, mody){
        let isSpace = true;
        let source = Game.getObjectById(this.sID);
        let p = new RoomPosition(source.pos.x + modx, source.pos.y + mody, source.room.name);
       
        p.lookFor(LOOK_STRUCTURES).forEach(function(struct) {
                    if (struct.structureType !== STRUCTURE_CONTAINER &&
                            (struct.structureType !== STRUCTURE_RAMPART ||
                            !struct.my) && struct.structureType !== STRUCTURE_ROAD) {
                        // Dont path through non-walkable buildings
                        isSpace = false;
                        return false;
                    }
                });
        let t = p.lookFor(LOOK_TERRAIN);
        p.lookFor(LOOK_TERRAIN).forEach(function(terrain) {
                    if (terrain == 'wall') {
                        // Dont path through non-walkable buildings
                        isSpace = false;
                        return false;
                    }
                });
        
        return isSpace;
    }
    
    calcAccessPoints(){
        let first = true;
        let source = Game.getObjectById(this.sID);
        if(this.thereIsSpaceAtPos(1, -1)){
            this.aps[this.aps.length] = new AccessPoint(source.pos.x + 1, source.pos.y - 1);
        }
        if(this.thereIsSpaceAtPos(0, -1)){
            this.aps[this.aps.length] = new AccessPoint(source.pos.x, source.pos.y - 1);
        }
        if(this.thereIsSpaceAtPos(-1, -1)){
            this.aps[this.aps.length] = new AccessPoint(source.pos.x - 1, source.pos.y - 1);
        }
        if(this.thereIsSpaceAtPos(1, 1)){
            this.aps[this.aps.length] = new AccessPoint(source.pos.x + 1, source.pos.y + 1);
        }
        if(this.thereIsSpaceAtPos(0, 1)){
            this.aps[this.aps.length] = new AccessPoint(source.pos.x, source.pos.y + 1);
        }
        if(this.thereIsSpaceAtPos(-1, 1)){
            this.aps[this.aps.length] = new AccessPoint(source.pos.x - 1, source.pos.y + 1);
        }
        if(this.thereIsSpaceAtPos(1, 0)){
            this.aps[this.aps.length] = new AccessPoint(source.pos.x + 1, source.pos.y);
        }
        if(this.thereIsSpaceAtPos(-1, 0)){
            this.aps[this.aps.length] = new AccessPoint(source.pos.x - 1, source.pos.y);
        }
    }
    
}

var roomInitializer = {
    
    initializeRoom: function(room) {
        console.log("Initialized room " + room.name);
        let sources = room.find(FIND_SOURCES);
        let spawns = room.find(FIND_MY_SPAWNS);
        let controller = room.controller;
        
        let si = [];
        for(i in sources){
            si[si.length] = new SourceInformation(sources[i]);
            si[si.length - 1].calcAccessPoints();
        }
        
        for(j in spawns){
            si[si.length] = new SourceInformation(spawns[j]);
            si[si.length - 1].calcAccessPoints();
        }
        si[si.length] = new SourceInformation(controller);
        room.memory.sourceInformation = si;
    }
    
}
    
    

module.exports = roomInitializer;



