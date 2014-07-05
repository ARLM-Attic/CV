var School = SolidMapElement.extend({
	init: function(map, position){
		this.width = 744;
		this._super(map, 'sprites/school.png', position);
		this.sprite.width = this.width;
	},
	registerBase: function(){
		var pos = new Position(this.position.x, this.position.y + 315);
		this.map.registerPlatform(pos, this.width);
	}
});
