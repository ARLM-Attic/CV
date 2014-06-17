var RenderStage = Class.extend({
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
