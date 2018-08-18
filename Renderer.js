module.exports = class Renderer
{
  constructor(game, canvas, statsCanvas, stateCanvas)
  {
    this.game = game;
    this.statsCanvas = statsCanvas;
    this.stateCanvas = stateCanvas;
    this.canvas = canvas;
    this.g = canvas.getContext("2d");
  }

  updateStats(stats)
  {
    this.stats = stats;
  }

  render()
  {
    var g = this.g;
    var size = this.game.size;
    var w = this.canvas.width / size;
    var h = this.canvas.height / size;

    g.fillStyle = "rgb(0, 0, 0)";
  	g.strokeStyle = "rgb(0, 0, 0)";
    g.fillRect(0, 0, this.canvas.width,  this.canvas.height);

    var colors = ["rgb(127, 127, 255)", "rgb(127, 255, 127)", "rgb(255, 127, 127)"];
    for(var k in this.game.objects)
    {
      var obj = this.game.objects[k];
      var color = colors[obj.type];
      g.fillStyle = color;

      g.fillRect(obj.x * w, obj.y * h, w, h);
      g.strokeRect(obj.x * w, obj.y * h, w, h);
    }

    g.font = "20px sans-serif"
  	g.fillStyle = "rgb(255, 255, 255)";
  	g.strokeStyle = "rgb(0, 0, 0)";

    var str = "Level: " + this.game.level + ", Ticks: " + this.stats.ticks;
  	g.fillText(str, 16, 32);
  	g.strokeText(str, 16, 32);

    str = "Max Level: " + this.stats.maxLevel + ", TPS: " + (Math.round(this.stats.tps * 100) / 100);
  	g.fillText(str, 16, 32 * 2);
  	g.strokeText(str, 16, 32 * 2);

    var loss = Math.floor(this.stats.lossLerp * 1000) / 1000;
    str = "Loss ~" + loss;
  	g.fillText(str, 16, 32 * 3);
  	g.strokeText(str, 16, 32 * 3);

    str = "Memory: " + this.stats.tensors + " tensors (" + this.stats.bytes + " bytes)";
  	g.fillText(str, 16, 32 * 4);
  	g.strokeText(str, 16, 32 * 4);

    this.renderStats();
  }

  renderStats()
  {
    var g = this.statsCanvas.getContext("2d");
    var w = this.statsCanvas.width;
    var h = this.statsCanvas.height;

    var reward = (1 - (this.stats.reward / 2 + 0.5)) * h; //1- because 0 is at the top
    var rewardLerp = (1 - (this.stats.rewardLerp / 2 + 0.5)) * h;
    var loss = (1 - (this.stats.loss / 2 + 0.5)) * h;
    var lossLerp = (1 - (this.stats.lossLerp / 2 + 0.5)) * h;

    g.fillStyle = "rgb(0, 0, 0)"
    g.fillRect(w - 2, 0, 1, h);
    g.fillStyle = "rgb(64, 64, 64)"
    g.fillRect(w - 2, h / 2, 1, 1); //dark gray = center (0)
    g.fillStyle = "rgb(128, 255, 128)"
    g.fillRect(w - 2, reward - 2, 1, 1); //light green = reward
    g.fillStyle = "rgb(0, 256, 0)"
    g.fillRect(w - 2, rewardLerp - 2, 1, 1); //green = rewardlerp
    g.fillStyle = "rgb(255, 128, 128)";
    g.fillRect(w - 2, loss - 2, 1, 1); //light red = loss
    g.fillStyle = "rgb(255, 0, 0)";
    g.fillRect(w - 2, lossLerp - 2, 1, 1); //red = loss lerp

    var data = g.getImageData(0, 0, w, h);
    g.putImageData(data, -1, 0);
  }
}
