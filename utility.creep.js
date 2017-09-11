/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('utility.creep');
 * mod.thing == 'a thing'; // true
 */

var roomPathing = require('room.pathing');

var lastMileTravel = function(des2, creep){
    let sources = des2.room.memory.sourceInformation;
    for(i = 0; i < sources.length; i++){
//        console.log("Soruce id: " + sources[i].sID + "  expected id:" + des2.id + "  Game object: "+  Game.getObjectById(sources[i].sID));
        if(sources[i].sID == des2.id){
            for(k = 0; k < sources[i].aps.length; k++){
                //If there is not any creeps at the access point go to access point
                let pos = (new RoomPosition(sources[i].aps[k].x, sources[i].aps[k].y, Game.getObjectById(sources[i].sID).room.name));
                let thingAtPos = pos.lookFor(LOOK_CREEPS).length;
//                console.log(creep.name + ": thing at pos:" + thingAtPos);
                if(!thingAtPos){
                    creep.moveTo(pos);
                    return true;
                }
            }
            return false;
        }
    }
    //console.log(creep.name + ": Last mile travel: no access point");
    
}

module.exports = {
    
    requestAccess: function(creep){
        
    },
    
    moveTowardsDestination: function(creep){
        let des1 = Game.getObjectById(creep.memory.locationID);
        let des2 = Game.getObjectById(creep.memory.destinationID);
         
        if(des1.id != des2.id){
            if(creep.pos == des2){
                creep.memory.locationID = des2.id;
                return true;
            }
            
            let path = roomPathing.getPathBetween(des1, des2).path;
//            console.log("Des1: " + des1 + " des2: " + des2 +  "Path: "+ path + " name: " + creep.name);
            let lPathPosition = creep.memory.pathPosition;
            
            if(lPathPosition >= path.length){
                creep.memory.pathPosition = lPathPosition;
                lastMileTravel(des2, creep);    
                return true;
            }
            
            let dPos = new RoomPosition(path[lPathPosition].x, path[lPathPosition].y, path[lPathPosition].roomName);
            let statement1 = !(creep.pos.x == path[lPathPosition].x);
            let statement2 = !(creep.pos.y == path[lPathPosition].y);
            let statement = statement1 || statement2;
//            console.log(creep.name + ": Pos: "+ creep.pos.x + "," + creep.pos.y + " destination: " + path[lPathPosition].x + "," + path[lPathPosition].y + " index: " + lPathPosition + 
//                    "  statement1: " + statement1 + " statement2: " + statement2 + " statement: " + statement);
            
            if(statement){
//                console.log("If");
//                console.log(creep.name + ": moving to: " + path[lPathPosition].x + "," +  path[lPathPosition].y +"   id: " + lPathPosition);
                creep.moveTo(dPos);
            }
            else{
//                console.log("Else");
                lPathPosition++;
                if(lPathPosition >= path.length){
                    creep.memory.pathPosition = lPathPosition;
                    lastMileTravel(des2, creep);    
                    return true;
                }
//                console.log(creep.name + ": moving to: " + path[lPathPosition].x + "," +  path[lPathPosition].y +"   id: " + lPathPosition);
                creep.moveTo(dPos);
            }
            creep.memory.pathPosition = lPathPosition;
            return false;
        }else{
    
            return true;
        }
        //console.log(creep.name + ": New path position: " + lPathPosition + " actual: " + creep.memory.pathPosition);
        
        
    },
    
    travelTime: function(creep, dpos, roomName){
        let ret = PathFinder.search(
            creep.pos, {pos: dpos, range: 3},
            {
                plainCost: 2,
                swampCost: 10,
        
                roomCallback: function(roomName) {
        
                    let room = Game.rooms[roomName];//Game.rooms[roomName];
                    // In this example `room` will always exist, but since 
                    // PathFinder supports searches which span multiple rooms 
                    // you should be careful!
                    if (!room) return;
                    let costs = new PathFinder.CostMatrix;
            
                    room.find(FIND_STRUCTURES).forEach(function(struct) {
                        if(struct.structureType == STRUCTURE_ROAD){
                            costs.set(struct.pos.x, struct.pos.y, 1);
                        }
                        else if (struct.structureType !== STRUCTURE_CONTAINER &&
                                (struct.structureType !== STRUCTURE_RAMPART ||
                                !struct.my)) {
                            // Dont path through non-walkable buildings
                            costs.set(struct.pos.x, struct.pos.y, 0xff);
                        }
                    });
        
                    return costs;
                },
            }
        );
    }
};