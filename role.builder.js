

var roadBuilder = require('role.builder.roadBuilder');
var creepUtility = require('utility.creep');
var roomPathing = require('room.pathing');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep, roomName) {
        
        
        let room = Game.rooms[roomName];
	    if(creep.memory.building && creep.carry.energy == 0) {
            //console.log(creep.name + ": Source: " + Game.getObjectById(creep.memory.locationID));
	        //creep.memory.destinationID = roomPathing.getClosestSource(Game.getObjectById(creep.memory.locationID), roomName).id;
            creep.memory.building = false;
            //creep.memory.pathPosition = 1;
            creep.say('🔄 harvest');
        }
	    else if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
            creep.say('🚧 build');
        }
        
        
	    if(creep.memory.building) {
	        console.log(creep.name + ": check b");
	        let sources = room.find(FIND_SOURCES);
	        let paths = room.memory.paths;
	        
	        let buildingRoad = false;
	        
	        for(z = 0; z < paths.length; z++){
	            if(roadBuilder.buildRoad(paths[z].path1, creep)){
	                room.memory.pathingDone = false;
	                room.memory.paths[z].path1.pathDone = false;
	                return true;
	            } else {
	                room.memory.paths[z].path1.pathDone = true;
	            }
	            if(roadBuilder.buildRoad(paths[z].path1, creep)){
	                room.memory.pathingDone = false;
	                room.memory.paths[z].path2.pathDone = false;
	                return true; 
	            } else {
	                room.memory.paths[z].path2.pathDone = true;
	            }
	        }
	        let points = room.memory.sourceInformation;
	        for(i = 0; i < points.length; i++){
	            let roomName2 = Game.getObjectById(points[i].sID).room.name;
	            if(roadBuilder.buildRoadAps(points[i].aps, creep, roomName2)){
	                room.memory.pathingDone = false;
	            }
	        }
	        
	        room.memory.pathingDone = true;
	        
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#99ff99'}});
                    functionPerformed = true;
                }
                return true;
            }
            return false;
            
	    }
	    else {
	        var sources = room.find(FIND_SOURCES);
            if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                //creepUtility.moveTowardsDestination(creep);//, {visualizePathStyle: {stroke: '#ffaa00'}});
                creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});//Game.getObjectById(creep.memory.destinationID).pos);
                functionPerformed = true;
            }
	    }
	    
	    return false;
	    
	},
	
	spawn: function(spawn){
	    console.log("Spawning builder");
        var newName = spawn.createCreep([WORK,CARRY,MOVE], undefined,
                {role: 'builder', 
                destinationID: roomPathing.getClosestSource(spawn, spawn.room.name).id, 
                locationID: spawn.id, 
                pathPosition: 1,
                building: false});
	}
};

module.exports = roleBuilder;