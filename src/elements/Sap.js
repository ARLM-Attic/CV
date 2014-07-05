var Sap = SolidMapElement.extend({
	init: function(map, position){
		this.width = 838;
		this._super(map, 'sprites/sap.png', position);
		this.sprite.width = this.width;
	},
	registerBase: function(){
		var pos = new Position(this.position.x, this.position.y + 380);
		this.map.registerPlatform(pos, this.width);
	}
});
