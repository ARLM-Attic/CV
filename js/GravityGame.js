var BaseElement = Class.extend({
	init: function(stage, texture, position){
		this.stage = stage;
		this.texture = PIXI.Texture.fromImage(texture);
		this.sprite = new PIXI.Sprite(this.texture);
		this.sprite.position.x = position.x;
		this.sprite.position.y = position.y;
		this.sprite.scale.y = 0.5;
		this.sprite.scale.x = 0.5;
		this.stage.getStage().addChild(this.sprite);
		this.stage.render();
		
	},
	getSprite: function(){
		return this.sprite;
	},
	changePosition: function(targetPosition, time){
		var elementThis = this;
		var sprite = this.sprite;
		stepX = (targetPosition.x - sprite.position.x) / (time/33);
		stepY = (targetPosition.y - sprite.position.y) / (time/33);
		var ticks = time/33;
		var transitionFunction = function(){
			sprite.position.x += stepX;
			sprite.position.y += stepY;
			if(--ticks > 0)
				setTimeout(transitionFunction, 33);
		};
		transitionFunction();
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
;var Position = Class.extend({
	init: function(x, y){
		this.x = x;
		this.y = y;
	}
});
;var RenderStage = Class.extend({
	init: function(width, height){
		this.renderer = new PIXI.WebGLRenderer(width, height);
		document.body.appendChild(this.renderer.view);
		this.stage = new PIXI.Stage();
	},
	getStage: function(){
		return this.stage;
	},
	getRenderer: function(){
		return this.renderer;
	},
	render: function(){
		this.renderer.render(this.stage);
	}
});
