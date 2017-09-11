
var creepUtility = require('utility.creep');
var roomPathing = require('room.pathing');

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep, roomName) {
    

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            //Set destination to closest source
            creep.memory.destinationID = roomPathing.getClosestSource(Game.getObjectById(creep.memory.locationID), roomName).id;
            creep.memory.pathPosition = 3;
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            //set destination to controller
            creep.memory.destinationID = Game.getObjectById(creep.memory.locationID).room.controller.id;
            creep.memory.pathPosition = 1;
	        creep.memory.upgrading = true;
	        creep.say('⚡ upgrade');
	        
	    }

	    if(creep.memory.upgrading) {
	        /*let room = Game.rooms[roomName];
            if(creep.upgradeController(room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(room.controller.pos, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            return true;*/
            
            let message = creep.upgradeController(Game.getObjectById(creep.memory.destinationID));
            if(message == ERR_NOT_IN_RANGE) {
                creepUtility.moveTowardsDestination(creep);//, {visualizePathStyle: {stroke: '#ffaa00'}});
            //    console.log(creep.name + ": AFrom: " + Game.getObjectById(creep.memory.locationID).pos + "  to: " +   Game.getObjectById(creep.memory.destinationID).pos);
            }else if(message == OK){
                creep.memory.locationID = creep.memory.destinationID;
            }
        }
        else {
            /*var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            return true;*/
            
            let message = creep.harvest(Game.getObjectById(creep.memory.destinationID));
            if(message == ERR_NOT_IN_RANGE) {
                creepUtility.moveTowardsDestination(creep);//, {visualizePathStyle: {stroke: '#ffaa00'}});
            //    console.log(creep.name + ": AFrom: " + Game.getObjectById(creep.memory.locationID).pos + "  to: " +   Game.getObjectById(creep.memory.destinationID).pos);
            }else if(message == OK){
                creep.memory.locationID = creep.memory.destinationID;
            }
        }
	},
	
	spawn: function(spawn){
	    console.log("Spawning upgrader");
        var newName = spawn.createCreep([WORK,CARRY,MOVE], undefined,
                {role: 'upgrader', 
                destinationID: roomPathing.getClosestSource(spawn, spawn.room.name).id, 
                locationID: spawn.id,
                pathPosition: 1,
                upgrading: false});
	}
};

module.exports = roleUpgrader;