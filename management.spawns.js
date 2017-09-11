/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('management.spawns');
 * mod.thing == 'a thing'; // true
 */

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

var spawner = {

    /** @param {Creep} creep **/
    managePopulation: function(spawn) {
        
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        //console.log('Harvesters: ' + harvesters.length);
        var harvesters2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester2');
        //console.log('Harvesters: ' + harvesters.length);
        
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        //console.log('Harvesters: ' + harvesters.length);
        
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        //console.log('Harvesters: ' + harvesters.length);
        
        if(spawn.energy >= 300){
            //console.log("Harvester 1 count: " + harvesters.length + "  harvester 2 count: " + harvesters2.length + " builder count: " + builders.length +
            //         + " upgrader count: " + upgraders.length);
            if(harvesters.length < 2) {
                roleHarvester.spawn(spawn, 'harvester');
            }
            else if(harvesters2.length < 0) {
                roleHarvester.spawn(spawn, 'harvester2');
            }
            else if(upgraders.length < 1) {
                //console.log("Please spawn upgrader");
                roleUpgrader.spawn(spawn);
            }
            else if(builders.length < 1) {
                //console.log("Please spawn builder");
                roleBuilder.spawn(spawn);
            }
            else if(upgraders.length < 3) {
                //console.log("Please spawn upgrader");
                roleUpgrader.spawn(spawn);
            }
            else if(builders.length < 6) {
                //console.log("Please spawn builder");
                roleBuilder.spawn(spawn);
            }
            else if(upgraders.length < 6) {
                //console.log("Please spawn upgrader");
                roleUpgrader.spawn(spawn);
            }
        }
        
	}
};


module.exports = spawner;