function UserInterface(){
	this.selected = -1;
	this.allSections = true;
	this.sections = [];
}

UserInterface.prototype.drawUI = function(){

	theTop = game.add.sprite(0,0);
	theTop.fixedToCamera = true;
	theTop.width=800;
	theTop.height=600;
	theTop.inputEnabled=true;

	theTop.events.onInputDown.add(function(){
		if(cursor.now==1){ //Mark trees
			markTree(game.input.mousePointer.x+game.camera.x,game.input.mousePointer.y+game.camera.y);
		}
	}, this);

	ui.add(theTop);


	menu = game.add.sprite(800-48, 0, 'menu');
	menu.fixedToCamera=true;
	menu.inputEnabled = true;

	menu.events.onInputDown.add(function(){
		if(this.allSections)
			this.hideAll();
		else
			this.showAll();
		
	}, this);

	ui.add(menu);

	orders = game.add.sprite(800-48*2, 0, 'orders');
	orders.fixedToCamera=true;
	orders.visible=true;
	orders.selected=false;
	orders.subs = [];
	orders.inputEnabled = true;

	this.sections.push(orders);

	ui.add(orders);
	

	orders.events.onInputDown.add(function(){
		if(orders.selected)
			this.hideSection(0);
		else
			this.showSection(0);
	}, this);

	this.sections.push(orders);

	//Subsections
	cut = game.add.sprite(800-48*2, 48, 'cut');
	cut.fixedToCamera=true;
	cut.visible = false;
	cut.inputEnabled = true;

	ui.add(cut);

	cut.events.onInputDown.add(function(){
		cursor.loadTexture('working');
		cursor.now=1; //Mark trees
	}, this);

	orders.subs.push(cut);

};

UserInterface.prototype.hideAll = function(){

	this.allSections=false;
	
	for(var i=0;i<this.sections.length;i++){
		this.hideSection(i);
		this.sections[i].visible=false;
	}
}

UserInterface.prototype.showAll = function(){

	this.allSections=true;
	
	for(var i=0;i<this.sections.length;i++){
		this.sections[i].visible=true;
	}
}

UserInterface.prototype.showSection = function(n){
	this.sections[n].selected=true;
	for(var i=0;i<this.sections[n].subs.length;i++){
		this.sections[n].subs[i].visible=true;
	}
}
UserInterface.prototype.hideSection = function(n){
	this.sections[n].selected=false;

	for(var i=0;i<this.sections[n].subs.length;i++){
		this.sections[n].subs[i].visible=false;
	}
}