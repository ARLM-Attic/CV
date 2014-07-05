var MapElement = BaseElement.extend({
	init: function(map, texture, position, scale, width, height){
		this._super(map, texture, position);
		this.map = map;
		this.solid = false;
		if(scale !== undefined)
			this.sprite.scale.x = this.sprite.scale.y = scale;
		if(height !== undefined)
			this.sprite.height = height;
		if(width !== undefined)
			this.sprite.width = width;
	}
});
