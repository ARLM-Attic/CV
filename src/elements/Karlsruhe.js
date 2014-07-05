var Karlsruhe = SolidMapElement.extend({
	init: function(map, position){
		this.width = 600;
		this._super(map, 'sprites/karlsruhe.png', position);
		this.sprite.width = this.width;
	},
	registerBase: function(){
		var pos = new Position(this.position.x, this.position.y + 252);
		this.map.registerPlatform(pos, this.width);
	}
});
