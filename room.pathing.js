/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('room.pathing');
 * mod.thing == 'a thing'; // true
 */

var Path = class {
    
    constructor(des1, des2, path1, path2){
        this.des1ID = des1.id;
        this.des2ID = des2.id;
        this.path1 = path1;
        this.path2 = path2;
        this.pathDone = false;
    }
    
}

var latPath = function(source){
    
}

var layPath = function(des1, des2, paths, roomName){
        
    //Paths that goes away from destination
    let veryIllegalPaths1 = [];
    
    //Paths that goes neither away nor to the destination
    let illegalPaths1 = [];
    
    for(i in paths){
        //If path1s destination (des2ID) is going towards the current origin destination (des1), it is very illegal
        if(Game.getObjectById(paths[i].des2ID) == des1){
            veryIllegalPaths1[veryIllegalPaths1.length] = paths[i].path1;
                
            //If path1s origin (des1ID) is not the current origin destination (des1), it is illeagl
            if(Game.getObjectById(paths[i].des1ID) != des1) {
                illegalPaths1[illegalPaths1.length] = paths[i].path1;
            }
        }
        //If path2s destination (des1ID) is going towards the current origin destination (des1), it is very illegal
        else if(Game.getObjectById(paths[i].des1ID) == des1){
            veryIllegalPaths1[veryIllegalPaths1.length] = paths[i].path2;
            
            //If path2s origin (des2ID) is not the current origin destination (des1), it is illeagl
            if(Game.getObjectById(paths[i].des2ID) != des1) {
                illegalPaths1[illegalPaths1.length] = paths[i].path2;
            }
        }
    }
    
    //Construct path from des1 to des2
    let ret1 = PathFinder.search(
        des1.pos, {pos: des2.pos, range: 2},
        {
            plainCost: 1,
            swampCost: 1,
    
            roomCallback: function(roomName) {
    
                let room = Game.rooms[roomName];//Game.rooms[roomName];
                // In this example `room` will always exist, but since 
                // PathFinder supports searches which span multiple rooms 
                // you should be careful!
                if (!room) return;
                let costs = new PathFinder.CostMatrix;
        
                //Dont path over structures that are not walkable
                room.find(FIND_STRUCTURES).forEach(function(struct) {
                    if (struct.structureType !== STRUCTURE_CONTAINER &&
                            (struct.structureType !== STRUCTURE_RAMPART ||
                            !struct.my) && struct.structureType !== STRUCTURE_ROAD) {
                        // Dont path through non-walkable buildings
                        costs.set(struct.pos.x, struct.pos.y, 0xff);
                    }
                });
                //Dont path over constructionsite that wont be walkable
                room.find(FIND_CONSTRUCTION_SITES).forEach(function(struct) {
                    let structT = struct.structureType;
                    if (structT !== STRUCTURE_CONTAINER &&
                            (structT !== STRUCTURE_RAMPART ||
                            !struct.my) || structT !== STRUCTURE_ROAD) {
                        // Dont path through construction sites that will not be walkable
                        costs.set(struct.pos.x, struct.pos.y, 0xff);
                    }
                        costs.set(struct.pos.x, struct.pos.y, 0xff);
                });
                
                //Strongly discourage pathing along illegal paths. Mark potential crossroad points
                illegalPaths1.forEach(function(ret){
                    for(i = 0; i < ret.path.length; i++){
                        if(((i + 1) % 5) == 0 || ((i + 1) % 5) == 1 ){
                            costs.set(ret.path[i].x, ret.path[i].y, 6);
                        }
                        else{ //Potential crossroad over illegal path
                            costs.set(ret.path[i].x, ret.path[i].y, 2);
                        }
                    }
                });
                //Very strongly discourage pathing allong very illegal paths. Discourage crossing very illegal paths
                veryIllegalPaths1.forEach(function(ret){
                    for(i = 0; i < ret.path.length; i++){
                        if(((i + 1) % 4) == 0 || ((i + 1) % 4) == 1 ){
                            //Dont completely block a potential crossroad
                            if(costs.get(ret.path[i].x, ret.path[i].y) != 2){
                                costs.set(ret.path[i].x, ret.path[i].y, 10);
                            }
                            else{//Potential crossroad over very illegal path
                                costs.set(ret.path[i].x, ret.path[i].y, 3);
                            }
                        }
                        else {//Potential crossroad over very illegal path
                            costs.set(ret.path[i].x, ret.path[i].y, 3);
                        }
                    }
                });
    
                return costs;
            },
        }
    );
    
    let illegalPaths2 = [];
    let veryIllegalPaths2 = [];
    
    //Count path1 as very illegal
    veryIllegalPaths2[0] = ret1;
    
    for(i in paths){
        //If path1s destination (des2ID) is going towards the current origin destination (des2), it is very illegal
        if(Game.getObjectById(paths[i].des2ID) == des2){
            veryIllegalPaths2[veryIllegalPaths2.length] = paths[i].path1;
                
            //If path1s origin (des1ID) is not the current origin destination (des2), it is illeagl
            if(Game.getObjectById(paths[i].des1ID) != des2) {
                illegalPaths2[illegalPaths2.length] = paths[i].path1;
            }
        }
        //If path2s destination (des1ID) is going towards the current origin destination (des2), it is very illegal
        else if(Game.getObjectById(paths[i].des1ID) == des2){
            veryIllegalPaths2[veryIllegalPaths2.length] = paths[i].path2;
            
            //If path2s origin (des2ID) is not the current origin destination (des2), it is illeagl
            if(Game.getObjectById(paths[i].des2ID) != des2) {
                illegalPaths2[illegalPaths2.length] = paths[i].path2;
            }
        }
    }
    
    let ret2 = PathFinder.search(
        des2.pos, {pos: des1.pos, range: 2},
        {
            plainCost: 1,
            swampCost: 1,
    
            roomCallback: function(roomName) {
    
                let room = Game.rooms[roomName];//Game.rooms[roomName];
                // In this example `room` will always exist, but since 
                // PathFinder supports searches which span multiple rooms 
                // you should be careful!
                if (!room) return;
                let costs = new PathFinder.CostMatrix;
        
                //Dont path over structures that are not walkable
                room.find(FIND_STRUCTURES).forEach(function(struct) {
                    if (struct.structureType !== STRUCTURE_CONTAINER &&
                            (struct.structureType !== STRUCTURE_RAMPART ||
                            !struct.my) && struct.structureType !== STRUCTURE_ROAD) {
                        // Dont path through non-walkable buildings
                        costs.set(struct.pos.x, struct.pos.y, 0xff);
                    }
                });
                //Dont path over constructionsite that wont be walkable
                room.find(FIND_CONSTRUCTION_SITES).forEach(function(struct) {
                    let structT = struct.structureType;
                    if (structT !== STRUCTURE_CONTAINER &&
                            (structT !== STRUCTURE_RAMPART ||
                            !struct.my) || structT !== STRUCTURE_ROAD) {
                        // Dont path through construction sites that will not be walkable
                        costs.set(struct.pos.x, struct.pos.y, 0xff);
                    }
                        costs.set(struct.pos.x, struct.pos.y, 0xff);
                });
                
                //Strongly discourage pathing along illegal paths. Mark potential crossroad points
                illegalPaths2.forEach(function(ret){
                    for(i = 0; i < ret.path.length; i++){
                        if(((i + 1) % 5) == 0 || ((i + 1) % 5) == 1 ){
                            costs.set(ret.path[i].x, ret.path[i].y, 6);
                        }
                        else{ //Potential crossroad over illegal path
                            costs.set(ret.path[i].x, ret.path[i].y, 2);
                        }
                    }
                });
                //Very strongly discourage pathing allong very illegal paths. Discourage crossing very illegal paths
                veryIllegalPaths2.forEach(function(ret){
                    for(i = 0; i < ret.path.length; i++){
                        if(((i + 1) % 4) == 0 || ((i + 1) % 4) == 1 ){
                            //Dont completely block a potential crossroad
                            //console.log(ret.path[i].x);
                            if(costs.get(ret.path[i].x, ret.path[i].y) != 2){
                                costs.set(ret.path[i].x, ret.path[i].y, 10);
                            }
                            else{//Potential crossroad over very illegal path
                                costs.set(ret.path[i].x, ret.path[i].y, 3);
                            }
                        }
                        else {//Potential crossroad over very illegal path
                            costs.set(ret.path[i].x, ret.path[i].y, 3);
                        }
                    }
                });
    
                return costs;
            },
        }
    );
    
    return (new Path(des1, des2, ret1, ret2));
    
}
    
module.exports = {
    
    layPaths: function(room){
        let sources = room.find(FIND_SOURCES);
        let controller = room.controller;
        let spawns = room.find(FIND_MY_SPAWNS);
        
        let paths = [];
        
        //Prioritize path from sources -> Spawns
        for(q = 0; q < sources.length; q++){
            for(j = 0; j < spawns.length; j++){
                paths[paths.length] = layPath(sources[q], spawns[j], paths);
            }
        }
        
        //Second priority path from sources -> Controller
        for(q = 0; q < sources.length; q++){
            paths[paths.length] = layPath(sources[q], controller, paths);
        }
        
        //Last priority path from source -> controller
        for(j = 0; j < spawns.length; j++){
            paths[paths.length] = layPath(spawns[j], controller, paths);
        }
        
        room.memory.paths = paths;
    },
    
    getPath: function(des1, des2, roomName){
        let paths = room.memory.paths;
        for(k = 0; k < paths.length; k++){
            if(des1.id == paths[k].des1ID && des2.id == paths[k].des2ID){
                return paths[k].path1;   
            }
            if(des1.id == paths[k].des2ID && des2.id == paths[k].des1ID){
                return paths[k].path2;
            }
        }
    },
    
    getClosestSource : function(des1, roomName){
        let room = Game.rooms[roomName];
        let paths = room.memory.paths;
        let sources = room.find(FIND_SOURCES);
        
        let lowestCost = Infinity;
        let index = -1;
        
        for(k = 0; k < paths.length; k++){
            for(j = 0; j < sources.length; j++){
                //console.log("Source index: " + j + "   room name: " + room.name);
                if(paths[k].des1ID == des1.id && paths[k].des2ID == sources[j].id){
                    if(pahts[k].path1.path.length < lowestCost){
                        lowestCost = paths[k].path1.path.length;
                        index = j;
                    }
                }
                if(paths[k].des2ID == des1.id && paths[k].des1ID == sources[j].id){
                    if(paths[k].path2.path.length < lowestCost){
                        lowestCost = paths[k].path1.path.length;
                        index = j;
                    }
                }
            }
        }
        if(index != -1){
            return sources[index];
        }
    },
    
    getClosestSpawn : function(des1, roomName){
        let room = Game.rooms[roomName];
        let paths = room.memory.paths;
        let sources = room.find(FIND_MY_SPAWNS);
        
        let lowestCost = Infinity;
        let index = -1;
        console.log("ROom: " + room + "  paths: " + paths + "  sources: " + sources);
        for(k = 0; k < paths.length; k++){
            for(j = 0; j < sources.length; j++){
                if(paths[k].des1ID == des1.id && paths[k].des2ID == sources[j].id){
                    if(paths[k].path1.path.length < lowestCost){
                        lowestCost = paths[k].path1.path.length;
                        index = j;
                    }
                }
                if(paths[k].des2ID == des1.id && paths[k].des1ID == sources[j].id){
                    if(paths[k].path2.path.length < lowestCost){
                        lowestCost = paths[k].path1.path.length;
                        index = j;
                    }
                }
            }
        }
        
        if(index != -1){
            return sources[index];
        }
    },
    
    visualizePaths : function(roomName){
        let room = Game.rooms[roomName];
        let paths = room.memory.paths;
        
        
        for(i = 0; i < paths.length; i++){
            for(j = 1; j < paths[i].path1.path.length; j++){
                if(paths[i].path1.path[j - 1].roomName == paths[i].path1.path[j].roomName) {
                    let v = new RoomVisual(paths[i].path1.path[j].roomName).circle(paths[i].path1.path[j - 1].x,paths[i].path1.path[j - 1].y).line(paths[i].path1.path[j - 1].x
                            ,paths[i].path1.path[j - 1].y,paths[i].path1.path[j].x,paths[i].path1.path[j].y);
                }
            }
            for(j = 1; j < paths[i].path2.path.length; j++){
                if(paths[i].path2.path[j - 1].roomName == paths[i].path2.path[j].roomName){
                    let v = new RoomVisual(paths[i].path2.path[j].roomName).circle(paths[i].path2.path[j - 1].x,paths[i].path2.path[j - 1].y).line(paths[i].path2.path[j - 1].x
                            ,paths[i].path2.path[j - 1].y,paths[i].path2.path[j].x,paths[i].path2.path[j].y);
                }
            }
        }
    },
    
    getPathBetween: function(des1, des2){
        
        let room = des1.room;
        let paths = room.memory.paths;
        
        for(i = 0; i < paths.length; i++){
            if(paths[i].des1ID == des1.id && paths[i].des2ID == des2.id){
                return paths[i].path1;
            }
            if(paths[i].des2ID == des1.id && paths[i].des1ID == des2.id){
                return paths[i].path2;
            }
        }
    }
    



    
};