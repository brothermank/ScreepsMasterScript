
var creepUtility = require('utility.creep');
var roomPathing = require('room.pathing');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep, sourceIndex, roomName) {
        var functionPerformed = false;
        //console.log("Location: " + Game.getObjectById(creep.memory.locationID).pos.x + "," + Game.getObjectById(creep.memory.locationID).pos.y +"   destination:" + Game.getObjectById(creep.memory.destinationID).pos.x+ "," 
        //        + Game.getObjectById(creep.memory.destinationID).pos.y + " name: " + creep.name);
        if(creep.carry.energy == 0 && !creep.memory.harvesting){
           // console.log(creep.name + ": Source: " + Game.getObjectById(creep.memory.locationID));
            creep.memory.destinationID = roomPathing.getClosestSource(Game.getObjectById(creep.memory.locationID), roomName).id;
            creep.memory.harvesting = true;
            creep.memory.pathPosition = 1;
        }
        else if(creep.carry.energy == creep.carryCapacity && creep.memory.harvesting){
            //console.log("Location:  " + creep.memory.locationID);
            //console.log(creep.name + ": Delivering energy, " + roomName);
            creep.memory.destinationID = roomPathing.getClosestSpawn(Game.getObjectById(creep.memory.locationID), roomName).id;
            creep.memory.harvesting = false;
            creep.memory.pathPosition = 1;
       
        }
        
        if(creep.memory.harvesting){
            let message = creep.harvest(Game.getObjectById(creep.memory.destinationID));
            if(message == ERR_NOT_IN_RANGE) {
                creepUtility.moveTowardsDestination(creep);//, {visualizePathStyle: {stroke: '#ffaa00'}});
            //    console.log(creep.name + ": AFrom: " + Game.getObjectById(creep.memory.locationID).pos + "  to: " +   Game.getObjectById(creep.memory.destinationID).pos);
            }else if(message == OK){
                creep.memory.locationID = creep.memory.destinationID;
            }
            
         }else{
            let message = creep.transfer(Game.getObjectById(creep.memory.destinationID), RESOURCE_ENERGY);
            if(message == ERR_NOT_IN_RANGE){
                creepUtility.moveTowardsDestination(creep);
           //     console.log(creep.name + ": BFrom: " + Game.getObjectById(creep.memory.locationID).pos + "  to: " +   Game.getObjectById(creep.memory.destinationID).pos);
            }else if(message == OK){
                creep.memory.locationID = creep.memory.destinationID;
            }
        }
        
        
        /*
	   if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            let res = creep.harvest(sources[sourceIndex]);
            if(res == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[sourceIndex], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            return true;
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
                
                return true;
            }
            return false;
            /*else{
                var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return structure.structureType == STRUCTURE_CONTROLLER;
                        }
                });
                if(targets.length > 0) {
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
        }*/
        
	},
	
	spawn: function(spawn, harvesterType){
	    console.log("Spawning " + harvesterType);
	    var newName = spawn.createCreep([WORK,CARRY,MOVE], undefined, 
                {role: harvesterType, 
                destinationID: roomPathing.getClosestSource(spawn, spawn.room.name).id, 
                locationID: spawn.id, 
                pathPosition: 0,
                harvesting: true});
    }
};

module.exports = roleHarvester;