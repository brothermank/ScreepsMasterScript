/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('management.behaviour');
 * mod.thing == 'a thing'; // true
 */
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

var behaviourManager = {
    
    startTasks: function(roomName){
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var harvesters2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester2');
        
        let room = Game.rooms[roomName];
        
        if(harvesters.length + harvesters2.length > -1){
            for(var name in Game.creeps) {
                var creep = Game.creeps[name];
                if(creep.memory.role == 'harvester') {
                  // console.log("Calling harvester1 with room name: " + roomName);
                    
                    roleHarvester.run(creep, 0, roomName);
                }
                if(creep.memory.role == 'harvester2') {
                   // console.log("Calling harvester2 with room name: " + roomName);
                    roleHarvester.run(creep, 1, roomName);
                }
                if(creep.memory.role == 'upgrader') {
                   // console.log("Calling upgrader with room name: " + roomName);
                   roleUpgrader.run(creep, roomName);
                }
                if(creep.memory.role == 'builder') {
                    //console.log(roomName);
                    if(!roleBuilder.run(creep, roomName)){
                        roleUpgrader.run(creep, roomName);
                    }
                }
            }
        }else{
            for(var name in Game.creeps) {
                var creep = Game.creeps[name];
                
                roleHarvester.run(creep,1);
            }
        }
    }
}

module.exports = behaviourManager;