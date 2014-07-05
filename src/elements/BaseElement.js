var BaseElement = Class.extend({
	init: function(stage, texture, position){
		this.stage = stage;
		if(texture !== undefined){
			this.texture = PIXI.Texture.fromImage(texture);
			this.sprite = new PIXI.Sprite(this.texture);
		}
		this.sprite.position.x = position.x;
		this.sprite.position.y = position.y;
		this.stage.getStage().addChild(this.sprite);
		this.moveTimeout = 0;
		
	},
	getSprite: function(){
		return this.sprite;
	},
	changePosition: function(targetPosition, time){
		var sprite = this.sprite;
		stepX = (targetPosition.x - sprite.position.x) / (time/33);
		stepY = (targetPosition.y - sprite.position.y) / (time/33);
		var ticks = time/33;
		this.transitionFunction(sprite, stepX, stepY, ticks, targetPosition);
	},
	transitionFunction: function(sprite, stepX, stepY, ticks, targetPosition){
		clearTimeout(this.moveTimeout);
		var elementThis = this;
		sprite.position.x += stepX;
		sprite.position.y += stepY;
		if(--ticks > 0)
			this.moveTimeout = setTimeout(function(){
				elementThis.transitionFunction(sprite, stepX, stepY, ticks, targetPosition);
			}, 33);
		else {
			sprite.position.x = targetPosition.x;
			sprite.position.y = targetPosition.y;
		}
	},
	changeScale: function(targetScale, time){
		var elementThis = this;
		var sprite = this.sprite;
		stepScaleX = (targetScale.x - sprite.scale.x) / (time/33);
		stepScaleY = (targetScale.y - sprite.scale.y) / (time/33);

		var ticks = time/33;
		var transitionFunction = function(){
			sprite.scale.x += stepScaleX;
			sprite.scale.y += stepScaleY;
			if(--ticks > 0)
				setTimeout(transitionFunction, 33);
		};
		transitionFunction();
	}
});
