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
		if(cursor.now==2){ //Mark trees for collecting apples
			markAppleTree(game.input.mousePointer.x+game.camera.x,game.input.mousePointer.y+game.camera.y);
		}
		if(cursor.now==3){ //Mark fishing spot
			markFishingSpot(game.input.mousePointer.x+game.camera.x,game.input.mousePointer.y+game.camera.y);
		}
		if(cursor.now==4){ //Mark bridge spot
			placeBuilding(game.input.mousePointer.x+game.camera.x,game.input.mousePointer.y+game.camera.y,0);
		}
		if(cursor.now==5){ //Mark tree spot
			placeBuilding(game.input.mousePointer.x+game.camera.x,game.input.mousePointer.y+game.camera.y,1);
		}
		// if(cursor.now==6){ //Place floor
		// 	placeBuilding(game.input.mousePointer.x+game.camera.x,game.input.mousePointer.y+game.camera.y,2);
		// }
		if(cursor.now==7){ //Place wall
			placeBuilding(game.input.mousePointer.x+game.camera.x,game.input.mousePointer.y+game.camera.y,3);
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
	ui.add(orders);
	orders.events.onInputDown.add(function(){
		if(orders.selected)
			this.hideSection(0);
		else
			this.showSection(0);
	}, this);

	this.sections.push(orders);


	construct = game.add.sprite(800-48*3, 0, 'construct');
	construct.fixedToCamera=true;
	construct.visible=true;
	construct.selected=false;
	construct.subs = [];
	construct.inputEnabled = true;
	ui.add(construct);
	construct.events.onInputDown.add(function(){
		if(construct.selected)
			this.hideSection(1);
		else
			this.showSection(1);
	}, this);

	this.sections.push(construct);

	

	//====================Order subsections==========================
	



	cut = game.add.sprite(800-48*2, map_prop.tile_size*1, 'axe');
	cut.fixedToCamera=true;
	cut.visible = false;
	cut.inputEnabled = true;
	ui.add(cut);
	cut.events.onInputDown.add(function(){
		cursor.loadTexture('cut');
		cursor.now=1; //Mark trees
		game.world.bringToTop(cursor);
	}, this);
	orders.subs.push(cut);

	collect = game.add.sprite(800-48*2, map_prop.tile_size*2, 'collect');
	collect.fixedToCamera=true;
	collect.visible = false;
	collect.inputEnabled = true;
	ui.add(collect);
	collect.events.onInputDown.add(function(){
		cursor.loadTexture('basket');
		cursor.now=2; //Mark apple trees
		game.world.bringToTop(cursor);
	}, this);
	orders.subs.push(collect);

	fish = game.add.sprite(800-48*2, map_prop.tile_size*3, 'fish');
	fish.fixedToCamera=true;
	fish.visible = false;
	fish.inputEnabled = true;

	ui.add(fish);

	fish.events.onInputDown.add(function(){
		cursor.loadTexture('fishing');
		cursor.now=3; //Mark fishing spot
		game.world.bringToTop(cursor);
	}, this);

	orders.subs.push(fish);


	//=================================================================


	//======================Construction subsections===================

	bridge = game.add.sprite(800-48*3, map_prop.tile_size*1, 'bridge_ui');
	bridge.fixedToCamera=true;
	bridge.visible = false;
	bridge.inputEnabled = true;
	ui.add(bridge);
	bridge.events.onInputDown.add(function(){
		cursor.loadTexture('bridge');
		cursor.now=4; //Build bridge
		game.world.bringToTop(cursor);
		cursor.anchor.setTo(0.5);
	}, this);
	construct.subs.push(bridge);

	tree = game.add.sprite(800-48*3, map_prop.tile_size*2, 'plant_tree');
	tree.fixedToCamera=true;
	tree.visible = false;
	tree.inputEnabled = true;
	ui.add(tree);
	tree.events.onInputDown.add(function(){
		cursor.loadTexture('tree');
		cursor.now=5; //Plant tree
		game.world.bringToTop(cursor);
		cursor.anchor.setTo(0.5);
	}, this);
	construct.subs.push(tree);

	// floor = game.add.sprite(800-48*3, map_prop.tile_size*3, 'floor_gui');
	// floor.fixedToCamera=true;
	// floor.visible = false;
	// floor.inputEnabled = true;
	// ui.add(floor);
	// floor.events.onInputDown.add(function(){
	// 	cursor.loadTexture('floor');
	// 	cursor.now=6; //Lay floor
	// 	cursor.anchor.setTo(0.5);
	// 	game.world.bringToTop(cursor);
	// }, this);
	// construct.subs.push(floor);

	wall = game.add.sprite(800-48*3, map_prop.tile_size*3, 'wall_gui');
	wall.fixedToCamera=true;
	wall.visible = false;
	wall.inputEnabled = true;
	ui.add(wall);
	wall.events.onInputDown.add(function(){
		cursor.loadTexture('wall');
		cursor.now=7; //Place wall
		cursor.anchor.setTo(0.5);
		game.world.bringToTop(cursor);
	}, this);
	construct.subs.push(wall);

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