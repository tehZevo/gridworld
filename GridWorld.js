module.exports = class GridWorld
{
  //TODO: add functionality for extra data in state (game state, etc)?

  /** window = range around focus to draw, -1 for full observability */
  constructor(size, types, window)
  {
    this.size = size || 5;
    //an array of strings
    this.types = types;
    this.window = window == null ? -1 : window;

    //focus around which to draw for partial observability
    this.focus = {x: 0, y: 0};

    this.objects = [];

    this.reset();
  }

  reset()
  {
    this.objects = [];
    //override me
  }

  //steps the game according to the given action, return reward
  step(action)
  {
    //override me
    return 0;
  }

  /** sets the focus position for partial observability */
  setFocus(x, y)
  {
    this.focus.x = x;
    this.focus.y = y;
  }

  /** returns a 1d array representing the state */
  getState()
  {
    var size = this.window < 0 ? this.size : this.window * 2 + 1;
    var offset = this.window < 0 ? this.focus : {x: 0, y: 0};

    //create 0-filled ndarray
    var arr = new Array(this.types * size * size).fill(0);
    var ndarr = ndarray(arr,
      [this.types, size, size]);

    //draw all objects to the array (1s)
    this.objects.forEach((e) =>
      ndarr.set(e.type, e.x + offset.x, e.y + offset.y, 1));

    return arr;
  }

  findObjectsOfType(type)
  {
    return this.objects.filter((e) => e.type == type);
  }

  getObjectsAt(x, y)
  {
    return this.objects.filter((e) => e.x == x && e.y == y);
  }

  getObject(x, y, type)
  {
    return this.objects.filter((e) => e.x == x && e.y == y && e.type == type)[0];
  }

  placeIfEmpty(x, y, type)
  {
    if(this.isEmpty(x, y))
    {
      return this.placeType(x, y, type);
    }
  }

  placeType(x, y, type)
  {
    if(this.isObjectAt(x, y, type))
    {
      return this.getObject(x, y, type);
    }

    var obj = {x: x, y: y, type: type};

    this.objects.push(obj);

    return obj;
  }

  removeType(x, y, type)
  {
    this.objects = this.objects.filter((e) =>
      !(e.x == x && e.y == y && e.type == type)
    );
  }

  isInBounds(x, y)
  {
    return x >= 0 && x < this.size && y >= 0 && y < this.size;
  }

  isObjectAt(x, y, type)
  {
    return this.getObject(x, y, type) != null;
  }

  isEmpty(x, y)
  {
    return this.getObjectsAt(x, y).length == 0;
  }

  randPos()
  {
    var x = Math.floor(Math.random() * this.size);
    var y = Math.floor(Math.random() * this.size);

    return {x:x, y:y};
  }

  distance(x1, y1, x2, y2)
  {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
  }
}

var ndarray = require("ndarray");
