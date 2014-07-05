var SolidMapElement = MapElement.extend({
	init: function(map, texture, position, scale, width, height){
		this._super(map, texture, position, scale, width, height);
		this.position = position;
		this.solid = true;
		this.registerBase();
	},
	registerBase: function(){
		this.map.registerPlatform(this.position, this.sprite.width);
	}
});
