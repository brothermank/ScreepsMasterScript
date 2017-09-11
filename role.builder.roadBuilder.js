/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder.roadBuilder');
 * mod.thing == 'a thing'; // true
 */

var roadBuilder = {
    
	buildRoad: function(ret, creep){ //pos1, pos2, creep){
        
        for(i = 0; i < ret.path.length; i++){
            let p = new RoomPosition(ret.path[i].x, ret.path[i].y, ret.path[i].roomName);
            let structures = p.lookFor(LOOK_STRUCTURES);
            let constructionSites = p.lookFor(LOOK_CONSTRUCTION_SITES);
            
            //If there is not already a structure and no construction ongiong, start constructing a road
            if(!structures.length && !constructionSites.length){
                creep.room.createConstructionSite(p, STRUCTURE_ROAD);
                if(creep.build(constructionSites[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(p, {visualizePathStyle: {stroke: '#00b200'}});
                }
                return true;
            }
            //If there is a construction site for a road, work on it
            if(constructionSites.length && constructionSites[0].structureType == STRUCTURE_ROAD){
                if(creep.build(constructionSites[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(p, {visualizePathStyle: {stroke: '#00b200'}});
                }
                return true;
            }
        }
        
        return false;   
	},
	
	buildRoadAps: function(aps, creep, roomName){
	    for(i = 0; i < aps.length; i++){
            let p = new RoomPosition(aps[i].x, aps[i].y, roomName);
            let structures = p.lookFor(LOOK_STRUCTURES);
            let constructionSites = p.lookFor(LOOK_CONSTRUCTION_SITES);
            
            //If there is not already a structure and no construction ongiong, start constructing a road
            if(!structures.length && !constructionSites.length){
                creep.room.createConstructionSite(p, STRUCTURE_ROAD);
                if(creep.build(constructionSites[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(p, {visualizePathStyle: {stroke: '#00b200'}});
                }
                return true;
            }
            //If there is a construction site for a road, work on it
            if(constructionSites.length && constructionSites[0].structureType == STRUCTURE_ROAD){
                if(creep.build(constructionSites[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(p, {visualizePathStyle: {stroke: '#00b200'}});
                }
                return true;
            }
        }
        
        return false;   
	}
}

module.exports = roadBuilder;