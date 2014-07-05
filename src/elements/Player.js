var Player = BaseElement.extend({
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
