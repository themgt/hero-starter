/* 

  The only function that is required in this file is the "move" function

  You MUST export the move function, in order for your code to run
  So, at the bottom of this code, keep the line that says:

  module.exports = move;

  The "move" function must return "North", "South", "East", "West", or "Stay"
  (Anything else will be interpreted by the game as "Stay")
  
  The "move" function should accept two arguments that the website will be passing in: 
    - a "gameData" object which holds all information about the current state
      of the battle

    - a "helpers" object, which contains useful helper functions
      - check out the helpers.js file to see what is available to you

    (the details of these objects can be found on javascriptbattle.com/rules)

  This file contains four example heroes that you can use as is, adapt, or
  take ideas from and implement your own version. Simply uncomment your desired
  hero and see what happens in tomorrow's battle!

  Such is the power of Javascript!!!

*/

//TL;DR: If you are new, just uncomment the 'move' function that you think sounds like fun!
//       (and comment out all the other move functions)


// // The "Northerner"
// // This hero will walk North.  Always.
// var move = function(gameData, helpers) {
//   var myHero = gameData.activeHero;
//   return 'North';
// };

// // The "Blind Man"
// // This hero will walk in a random direction each turn.
// var move = function(gameData, helpers) {
//   var myHero = gameData.activeHero;
//   var choices = ['North', 'South', 'East', 'West'];
//   return choices[Math.floor(Math.random()*4)];
// };

// // The "Priest"
// // This hero will heal nearby friendly champions.
// var move = function(gameData, helpers) {
//   var myHero = gameData.activeHero;
//   if (myHero.health < 60) {
//     return helpers.findNearestHealthWell(gameData);
//   } else {
//     return helpers.findNearestTeamMember(gameData);
//   }
// };

// The "Unwise Assassin"
// This hero will attempt to kill the closest enemy hero. No matter what.
var move = function(gameData, helpers) {
  var myHero = gameData.activeHero;
  var healthWellStats = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function(boardTile) {
    return boardTile.type === 'HealthWell'
  });
  
  var closeEnemy = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function(boardTile) {
    return boardTile.type === 'Hero' && boardTile.team !== myHero.team
  });
  
  var closeMine = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function(boardTile) {
    if (boardTile.type === 'DiamondMine') {
      if (boardTile.owner) {
        return boardTile.owner.team !== myHero.team;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }, gameData.board);
  
  var distanceToHealthWell = healthWellStats.distance;
  var directionToHealthWell = healthWellStats.direction;
  var weak_enemy = helpers.findNearestWeakerEnemy(gameData);
  var friend = helpers.findNearestTeamMember(gameData);
  
  if (myHero.health < 80 && distanceToHealthWell === 1) {
    //Heal if you aren't full health and are close to a health well already
    console.log("[AI BOT]: grabbing health: " + directionToHealthWell);
     return directionToHealthWell;
  } else if (myHero.health < 20) {
    console.log("[AI BOT]: need health: " + directionToHealthWell);
     return directionToHealthWell;
  } else{
    if(closeMine.direction != null && (closeEnemy.direction == null || (closeMine.distance < closeEnemy.distance || closeEnemy.health > myHero.health))){
      console.log("[AI BOT]: mine! " + closeMine.direction);
      return closeMine.direction;
    } else if (closeEnemy != null && closeEnemy.health <= myHero.health){
      console.log("[AI BOT]: attack!: " + closeEnemy.direction);
      return closeEnemy.direction;
    } else if (weak_enemy){
      console.log("[AI BOT]: attack weakling!: " + weak_enemy);
      return weak_enemy;
    } else if (friend){
      console.log("[AI BOT]: friend!: " + friend);
      return friend;
    } else{
      console.log("[AI BOT]: need health to fight! " + directionToHealthWell);
      return directionToHealthWell;
    }
  }
};

// // The "Careful Assassin"
// // This hero will attempt to kill the closest weaker enemy hero.
// var move = function(gameData, helpers) {
//   var myHero = gameData.activeHero;
//   if (myHero.health < 50) {
//     return helpers.findNearestHealthWell(gameData);
//   } else {
//     return helpers.findNearestWeakerEnemy(gameData);
//   }
// };

// // The "Safe Diamond Miner"
/*var move = function(gameData, helpers) {
  var myHero = gameData.activeHero;

  //Get stats on the nearest health well
  var healthWellStats = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function(boardTile) {
    if (boardTile.type === 'HealthWell') {
      return true;
    }
  });
  var distanceToHealthWell = healthWellStats.distance;
  var directionToHealthWell = healthWellStats.direction;
  

  if (myHero.health < 40) {
    //Heal no matter what if low health
    return directionToHealthWell;
  } else if (myHero.health < 100 && distanceToHealthWell === 1) {
    //Heal if you aren't full health and are close to a health well already
    return directionToHealthWell;
  } else {
    //If healthy, go capture a diamond mine!
    return helpers.findNearestNonTeamDiamondMine(gameData);
  }
};*/

// // The "Selfish Diamond Miner"
// // This hero will attempt to capture diamond mines (even those owned by teammates).
// var move = function(gameData, helpers) {
//   var myHero = gameData.activeHero;

//   //Get stats on the nearest health well
//   var healthWellStats = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function(boardTile) {
//     if (boardTile.type === 'HealthWell') {
//       return true;
//     }
//   });

//   var distanceToHealthWell = healthWellStats.distance;
//   var directionToHealthWell = healthWellStats.direction;

//   if (myHero.health < 40) {
//     //Heal no matter what if low health
//     return directionToHealthWell;
//   } else if (myHero.health < 100 && distanceToHealthWell === 1) {
//     //Heal if you aren't full health and are close to a health well already
//     return directionToHealthWell;
//   } else {
//     //If healthy, go capture a diamond mine!
//     return helpers.findNearestUnownedDiamondMine(gameData);
//   }
// };

// // The "Coward"
// // This hero will try really hard not to die.
// var move = function(gameData, helpers) {
//   return helpers.findNearestHealthWell(gameData);
// }


// Export the move function here
module.exports = move;
