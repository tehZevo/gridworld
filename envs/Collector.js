var GridWorld = require("../GridWorld.js");

module.exports = class Collector extends GridWorld
{
  constructor(size, apples, peppers, oobKill, window)
  {
    super(size, 3, window);

    this.placeTries = 1000;
    this.level = 1; //streak
    this.oobKill = oobKill;

    this.numApples = apples || 1;
    this.numPeppers = peppers || 1;
    this.playerType = 0;
    this.appleType = 1;
    this.pepperType = 2;

    this.player = null;

    this.messages = true;

    this.reset();
  }

  reset()
  {
    super.reset();

    this.level = 1;

    this.createLevel();
  }

  createLevel()
  {
    //place player
    this.player = this.placeMultipleTries(this.playerType);

    //place apples
    for(var i = 0; i < this.numApples; i++)
    {
      this.placeMultipleTries(this.appleType);
    }

    for(var i = 0; i < this.numPeppers; i++)
    {
      this.placeMultipleTries(this.pepperType);
    }
  }

  //steps the game, returns reward
  step(action)
  {
    var reward = 0;
    var newPos = this.calcNewPos(action);

    reward += this.movePlayer(newPos.x, newPos.y);

    return reward;
  }

  message(msg)
  {
    if(this.messages)
    {
      console.log(msg);
    }
  }

  movePlayer(newX, newY)
  {
    var reward = 0;

    //trying to move oob
    if(!this.isInBounds(newX, newY))
    {
      if(this.oobKill)
      {
        this.message("A mysterious force resets your progress.");
        this.level = 1;
        this.reset();
        return -1;
      }

      newX = this.player.x;
      newY = this.player.y;
      reward -= 1;
    }

    //peppers
    else if(this.isObjectAt(newX, newY, this.pepperType))
    {
      this.removeType(newX, newY, this.pepperType);
      this.message("You ate an unpleasantly spicy pepper.");
      this.level = 1;
      this.placeMultipleTries(this.pepperType);
      reward -= 1;
    }
    //apples
    else if(this.isObjectAt(newX, newY, this.appleType))
    {
      this.removeType(newX, newY, this.appleType);
      this.message("You ate a delicious apple!");
      this.level++;
      this.placeMultipleTries(this.appleType);
      reward += 1;
    }

    //set new position
    this.player.x = newX;
    this.player.y = newY;

    return reward;
  }

  placeMultipleTries(type)
  {
    for(var i = 0; i < this.placeTries; i++)
    {
      var p = this.randPos();

      var obj = this.placeIfEmpty(p.x, p.y, type);

      if(obj)
      {
        return obj;
      }
    }
  }

  calcNewPos(action)
  {
    var dx = action[0];
    var dy = action[1];
    var newPos = {x: this.player.x, y: this.player.y};

    if(Math.abs(dx) >= Math.abs(dy))
    {
      newPos.x += Math.sign(dx);
    }
    else
    {
      newPos.y += Math.sign(dy);
    }

    return newPos;
  }

}
