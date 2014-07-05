var Map = BaseElement.extend({
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
