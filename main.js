

var spawner = require('management.spawns');
var garbageCollector = require('management.memory');
var behaviourManager = require('management.behaviour');
    
var roomInitializer = require('room.initialize');

var pather = require('room.pathing');

var roomNames = 'W24N41';
var spawnName = 'SMain';

module.exports.loop = function () {
    
    
        //Game.rooms[roomNames].memory.isInitialized = false;
    if(!Game.rooms[roomNames].memory.isInitialized){
        Game.rooms[roomNames].memory.isInitialized = true;
        roomInitializer.initializeRoom(Game.rooms[roomNames], true); 
        pather.layPaths(Game.rooms[roomNames]);
    }
    
    
    garbageCollector.cleanDeadUnits();

    spawner.managePopulation(Game.spawns[spawnName]);
    
    behaviourManager.startTasks(roomNames);
    
    //pather.visualizePaths(roomNames);
}






