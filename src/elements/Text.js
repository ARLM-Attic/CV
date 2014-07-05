var Text = MapElement.extend({
	init: function(map, position, text, size, color){
		if(color === undefined) color = 'black';
		this.sprite = new PIXI.Text(text, {font: size + " CVFont", fill: color});
		this._super(map, undefined, position);
		map.getStage().addChild(this.sprite);
	}
});
