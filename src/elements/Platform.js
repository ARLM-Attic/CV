var Platform = SolidMapElement.extend({
	init: function(map, position, width){
		this.width = width;
		this._super(map, 'sprites/platform.png', position);
		this.sprite.width = width;
	},
	registerBase: function(){
		var pos = new Position(this.position.x, this.position.y + 20);
		
		this.map.registerPlatform(pos, this.width);
	}
});
