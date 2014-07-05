var Text = MapElement.extend({
	init: function(map, position, text, size, color, headline){
		if(color === undefined) color = 'black';
		var font = 'CVFont';
		if(headline) font = 'CVHead';
		this.sprite = new PIXI.Text(text, {font: size + " " + font, fill: color});
		this._super(map, undefined, position);
		map.getStage().addChild(this.sprite);
	}
});
