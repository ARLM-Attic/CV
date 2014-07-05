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
;var MapElement = BaseElement.extend({
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
;var SolidMapElement = MapElement.extend({
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
;var Basecom = SolidMapElement.extend({
	init: function(map, position){
		this.width = 744;
		this._super(map, 'sprites/basecom.png', position);
		this.sprite.width = this.width;
	},
	registerBase: function(){
		var pos = new Position(this.position.x, this.position.y + 295);
		this.map.registerPlatform(pos, this.width);
	}
});
;var Karlsruhe = SolidMapElement.extend({
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
;var Map = BaseElement.extend({
	spritePositions: {left: 1, middle: 2600, end: 2942, height: 600},
	lowerBase: 580,
	textureFile: "sprites/background.png",
	init: function(stage, width){
		this._super(stage, this.textureFile, new Position(0,0));
		this.texture.setFrame(new PIXI.Rectangle(0, 0, this.spritePositions.left, this.spritePositions.height));
		
		var partWidth = this.spritePositions.middle - this.spritePositions.left;
		var spaceToFill = width - this.spritePositions.left - (this.spritePositions.end - this.spritePositions.middle);
		var partCount = spaceToFill/partWidth;
		var frameRectangle = new PIXI.Rectangle(this.spritePositions.left, 0, partWidth, this.spritePositions.height);
		var middleTexture = new PIXI.Texture(PIXI.BaseTexture.fromImage(this.textureFile));
		middleTexture.setFrame(frameRectangle);

		for(var i = 1; i <= partCount; i++){
			var part = new PIXI.Sprite(middleTexture);
			part.position.y = 0;
			part.position.x = this.spritePositions.left + (i - 1) * partWidth;
			this.sprite.addChild(part);
		}
		
		this.changePosition(new Position(400, 0), 1);
		
		this.mapObjects = {};
	},
	getBaseHeight: function(position){
		var result = this.lowerBase;
		var inlineObjects = this.mapObjects[Math.floor(position.x)];
		if(inlineObjects !== undefined){
			for(var i = 0; i < inlineObjects.length; i++){
				var elementPosition = inlineObjects[i];
				if(position.y <= elementPosition.y){
					result = Math.min(elementPosition.y, result);
				}
			}
		}
		return result;
	},
	getStage: function(){
		return this.sprite;
	},
	registerPlatform: function(position, width){
		for(; width >= 0; width--){
			if(this.mapObjects[position.x + width] === undefined){
				this.mapObjects[position.x + width] = [];
			}
			this.mapObjects[position.x + width].push(position);
		}
	},
	addItems: function(mapItems){
		for(var i = 0; i < mapItems.length; i++){
			var item = mapItems[i];
			var position = new Position(item.x, item.y);
			switch(item.item){
				case 'platform':
					new Platform(this, position, item.width);
					break;
				case 'text':
					new Text(this, position, item.text, item.size, item.color);
					break;
				case 'school':
					new School(this, position);
					break;
				case 'basecom':
					new Basecom(this, position);
					break;
				case 'sap':
					new Sap(this, position);
					break;
				case 'karlsruhe':
					new Karlsruhe(this, position);
					break;
			}
		}
	}
});
;var Platform = SolidMapElement.extend({
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
;var Player = BaseElement.extend({
	speed: 10,
	maxRunMultiplier: 3,
	runMultiplierStep: 0.3,
	jumpHeight: 100,
	jumpInterval: 200,
	moveInterval: 100,
	fallSpeedStep: 26,
	fallInterval: 100,
	winkInterval: 170,
	jumpMiddairDuration: 150,
	jumpRunIncreaseFactor: 0.5,
	init: function(stage, map){
		this.currentSprite = 1;
		this.tiemout = 0;
		this.invalidationTimeout = 0;
		this.currentRunMultiplier = 1;
		this.fallSpeed = 0;
		this.moving = false;
		this.run = false;
		this.jumping = false;
		this.falling = false;
		this.map = map;
		this._super(stage, "sprites/jonas.png", new Position(100, 380));
		this.texture.setFrame(new PIXI.Rectangle(0, 0, 500, 500));
		this.sprite.scale.x = 0.4;
		this.sprite.scale.y = 0.4;
		this.refreshFootY();
		this.attachKeyListener();
		this.wink();
	},
	attachKeyListener: function(){
		var playerThis = this;
		var pressedKeys = {};
		$(window).keydown(function(key){
			switch(key.keyCode){
				case 39: //->
				case 68: //d
					key.preventDefault();
					if(pressedKeys[key.keyCode]) return;
					pressedKeys[key.keyCode] = true;
					playerThis.moveRight(true);
					break;
				case 37: //<-
				case 65: //a
					key.preventDefault();
					if(pressedKeys[key.keyCode]) return;
					pressedKeys[key.keyCode] = true;
					playerThis.moveLeft(true);
					break;
				case 16: //Shift
				case 17: //CTRL
					key.preventDefault();
					if(pressedKeys[key.keyCode]) return;
					pressedKeys[key.keyCode] = true;
					playerThis.run = true;
					break;
				case 32: //Space
					key.preventDefault();
					if(pressedKeys[key.keyCode]) return;
					pressedKeys[key.keyCode] = true;
					playerThis.jump(true);
					break;
			}
		}).keyup(function(key){
			pressedKeys[key.keyCode] = false;
			switch(key.keyCode){
				case 39: //->
				case 68: //d
				case 37: //<-
				case 65: //a
					playerThis.stop();
					key.preventDefault();
					break;
				case 17: //CTRL
				case 16: //Shift
					playerThis.run = false;
					key.preventDefault();
					break;
				case 32: //Space
					playerThis.stopJump();
					key.preventDefault();
					break;
			}
		});
	},
	moveRight: function(start){
		if(this.moving) return;
		this.move(start, -this.speed, [1, 4]);
	},
	move: function(start, delta, textureBounds){
		var playerThis = this;
		if(start){
			this.moving = true;
			this.currentRunMultiplier = 1;
		}
		if(!this.moving) return;
		if(!this.jumping && !this.falling)
			this.currentSprite++; //Change sprites
		if(this.currentSprite > textureBounds[1] || this.currentSprite < textureBounds[0]){
			this.currentSprite = textureBounds[0];
		}
		this.texture.setFrame(new PIXI.Rectangle(this.currentSprite * 500, 0, 500, 500));
		//Change run speed
		if(this.run){
			this.currentRunMultiplier += this.runMultiplierStep;
			this.currentRunMultiplier = Math.min(this.currentRunMultiplier, this.maxRunMultiplier);
		} else if(this.currentRunMultiplier > 1 && !(this.jumping || this.falling)) {
			this.currentRunMultiplier -= this.runMultiplierStep;
		} else if(this.currentRunMultiplier < 1) {
			this.currentRunMultiplier = 1;
		}
		//Make movement
		var newX = this.map.sprite.position.x + delta * this.currentRunMultiplier;
		console.log(newX);
		if(newX > 600) return;
		this.map.changePosition(new Position(newX, this.map.sprite.position.y), 100);
		clearTimeout(this.timeout);
		this.timeout = setTimeout(function(){
			playerThis.move(false, delta, textureBounds);
		}, this.moveInterval);
		this.invalidatePosition();
	},
	moveLeft: function(start){
		if(this.moving) return;
		this.move(start, this.speed, [5, 8]);
	},
	stop: function(){
		var playerThis = this;
		if(this.jumping || this.falling){
			setTimeout(function(){
				playerThis.stop();
			}, 50);
			return;
		}
		this.moving = false;
		this.currentRunMultiplier = 1;
		clearTimeout(this.timeout);
	},
	jump: function(start){
		var playerThis = this;
		if(this.falling) return;
		if(start) this.jumping = true;
		if(!this.jumping) return;
		var jumpHeight = this.jumpHeight * Math.max(this.currentRunMultiplier * this.jumpRunIncreaseFactor, 1);
		var jumpDuration = this.jumpInterval * Math.max(this.currentRunMultiplier * this.jumpRunIncreaseFactor, 1);
		this.changePosition(new Position(this.sprite.position.x, this.sprite.position.y - jumpHeight), jumpDuration);
		setTimeout(function(){
			playerThis.stopJump();
		}, jumpDuration + this.jumpMiddairDuration);
	},
	stopJump: function(){
		this.jumping = false;
		this.invalidatePosition();
	},
	refreshFootY: function(){
		this.footY = (this.sprite.position.y + this.sprite.height);
	},
	//Has to be called in order to make the player fall down after a movement. Makes a ground detection
	invalidatePosition: function(){
		var playerThis = this;
		if(this.jumping){
			//can't fall down if currently jumping, wait for jump to end
			setTimeout(function(){
				playerThis.invalidatePosition();
			}, 50);
			return;
		}
		this.refreshFootY();
		var fallHeight = this.map.getBaseHeight(new Position(200 + this.map.sprite.position.x * - 1, this.footY)) - this.sprite.height;
		if(this.sprite.position.y < fallHeight){
			var duration = (fallHeight-this.sprite.position.y) / this.fallSpeedStep * this.fallInterval;
			this.falling = true;
			this.changePosition(new Position(this.sprite.position.x, fallHeight), duration);
			clearTimeout(this.invalidationTimeout);
			this.invalidationTimeout = setTimeout(function(){
				playerThis.falling = false;
			}, duration);
		}
	},
	wink: function(){
		var playerThis = this;
		var moveIntervalBuffer = this.moveInterval;
		this.moveInterval = this.winkInterval;
		this.move(true, 0, [9, 11]);
		setTimeout(function(){
			playerThis.stop();
			playerThis.moveInterval = moveIntervalBuffer;
		}, 1000);
	}
});
;var Sap = SolidMapElement.extend({
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
;var School = SolidMapElement.extend({
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
;var Text = MapElement.extend({
	init: function(map, position, text, size, color){
		if(color === undefined) color = 'black';
		this.sprite = new PIXI.Text(text, {font: size + " CVFont", fill: color});
		this._super(map, undefined, position);
		map.getStage().addChild(this.sprite);
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
		this.renderer = new PIXI.autoDetectRenderer(width, height);
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
