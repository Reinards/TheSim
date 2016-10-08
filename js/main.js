var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var map_prop = {
	width : 30,
	height : 30,
	camera_speed : 6,
	tile_size : 48
};

var game_prop = {
	game_over : false,
	timeFlow : 30
}

var map;
var waters=0;


var symbols = {
	grass:0,
	tree:1,
	wall:1.1,
	water:2,
	bridge:0.1,
	blueprint:0.2,
	floor:0.3
};

var symbols_live = {
	character : 0,
	goblin : 1
}

//An array of occupied tiles
var job = new Array();
var todo = new Array();

for (i=0;i<map_prop.height;i++) {
	job[i]=new Array();
	todo[i]=new Array();
	for (j=0;j<map_prop.width;j++) {
		job[i][j]=0;
		todo[i][j]=0;
	}
}

//Z-leveling groups
var ground; // <----------- Base tiles, buildings
var middle_level; // <----- Characters
var trees; // <------------ Trees
var ui; // <--------------- Icons,buttons,night overlay
var cursor_group; // <----- Cursor

//Portals
var g_portal_pos = {
	x : -1,
	y : -1,
}
var g_portal;
//---------

//Time area
var game_time = {
	minutes : 0,
	hours : 7,
	days : rnd(1,31),
	months : rnd(1,12),
	years : rnd(1000,2016),
	days_spent : 0
}
var night;
//---------

//Resources
var all_res = {
	wood : 0,
	apples : 0,
	fish : 0
}
//---------

//Text area
var style_res = {font: "20px Arial", fill: "#ffffff", align: "left"};
var style_name = {font: "14px Arial", fill: "#ffffff", align: "center"};

var txt_wood;
var txt_apples;
var txt_fish;
var panel;
var txt_time;

//---------

//Character design area
var skins = ["man","man2","man3","man4","man5","man6"];
var names = ["Edijs","Niks","Didzis","Reinards","Henrijs","Palamuts"];
//---------

//Task area
var tasks = {
	idle : 0,
	getResources : 1,
	doBuilding : 2,
	goFishing : 3,
	collectApples : 4,
	sleep : 5,
	goHome : 6,
	walk : 7,
	dead : 8
}

var globTasks = {
	getWood : 0,
	getApples : 0,
	getFish : 0,
	build : 0,
};
var globTasksTaken = {
	getWood : 0,
	getApples : 0,
	getFish : 0,
	build : 0
};
//Building
var materials_needed = {
	bridge : 3,
	tree : 2,
	// floor : 3,
	wall : 4
};
//House, Bridge
//---------

//Men area
var men = [];
//----------

//Goblin area
var goblins = [];
var allGoblins = 0;
//------------

function preload() {
	game.stage.backgroundColor = '#E8E8E8';


	//Tiles
	game.load.image('grass', 'assets/images/tiles/grass.png');  //grass
	game.load.image('grass2', 'assets/images/tiles/grass2.png'); //grass2
	game.load.image('floor', 'assets/images/tiles/floor.png'); //Wooden floor
	game.load.image('house', 'assets/images/tiles/house.png'); //house
	game.load.image('wall', 'assets/images/tiles/wall.png');  //wall
	game.load.image('bridge', 'assets/images/tiles/bridge.png');  //bridge
	game.load.image('tree', 'assets/images/tiles/tree.png');  //tree
	game.load.image('tree2', 'assets/images/tiles/tree2.png');  //tree3
	game.load.spritesheet('water', 'assets/images/tiles/water.png', 48, 48, 6); //water
	game.load.spritesheet('build', 'assets/images/tiles/build.png', 48, 48, 5);  //build
	game.load.spritesheet('sleep', 'assets/images/tiles/sleep.png', 48, 48, 5);  //sleep
	game.load.image('blueprint', 'assets/images/tiles/blueprint.png'); //blueprint

	//Portals
	game.load.spritesheet('goblin_portal', 'assets/images/tiles/portal1.png', 48, 48);

	//Characters
	game.load.image('man', 'assets/images/characters/man.png');
	game.load.image('man2', 'assets/images/characters/man2.png');
	game.load.image('man3', 'assets/images/characters/man3.png');
	game.load.image('man4', 'assets/images/characters/man4.png');
	game.load.image('man5', 'assets/images/characters/man5.png');
	game.load.image('man6', 'assets/images/characters/man6.png');

	game.load.spritesheet('goblin', 'assets/images/characters/goblin.png', 48, 48, 7);  //sleep

	//Cursors & UI
	game.load.image('wood', 'assets/images/ui/wood.png');
	game.load.image('apple', 'assets/images/ui/apple.png');
	game.load.image('fish_ui', 'assets/images/ui/fish.png');
	game.load.image('calendar', 'assets/images/ui/calendar.png');

	game.load.image('night', 'assets/images/ui/night.png');
	game.load.image('panel', 'assets/images/ui/panel.png');


	game.load.image('menu', 'assets/images/ui/menu.png');

	game.load.image('orders', 'assets/images/ui/orders.png');
		game.load.image('axe', 'assets/images/ui/axe.png');
		game.load.image('collect', 'assets/images/ui/collect.png');
		game.load.image('fish', 'assets/images/ui/fishing.png');

	game.load.image('construct', 'assets/images/ui/construct.png');
		game.load.image('bridge_ui', 'assets/images/ui/bridge.png');
		game.load.image('plant_tree', 'assets/images/ui/plant_tree.png');
		game.load.image('floor_gui', 'assets/images/ui/floor_gui.png');
		game.load.image('wall_gui', 'assets/images/ui/wall_gui.png');

	game.load.image('default', 'assets/images/cursors/default.png');
	game.load.image('cut', 'assets/images/cursors/cursor_cut.png');
	game.load.image('fishing', 'assets/images/cursors/fishing.png');
	game.load.image('basket', 'assets/images/cursors/basket.png');

	game.load.image('gameover', 'assets/images/ui/gameover.jpg');

}

function create() {

	//For fps
	game.time.advancedTiming = true; 

	//Generates a map
	map = generate_map(map_prop.width,map_prop.height,true,true);

	//Creates groups
	ground = game.add.group();
	trees = game.add.group();
	middle_level = game.add.group();
	ui = game.add.group();
	cursor_group = game.add.group();

	ui_manager = new UserInterface(); // <---------- Manages button clicks

	//Set world bounds and creates cursors
	game.world.setBounds(0, 0, map_prop.width*map_prop.tile_size, map_prop.height*map_prop.tile_size);
	cursors = game.input.keyboard.createCursorKeys();

	//Draw all the map tiles
	for(var i=0;i<map_prop.height;i++){
		for(var j=0;j<map_prop.width;j++){
			if(map[i][j]==0){
				var r = rnd(1,2);
				if(r==1)
					var tile = game.add.sprite(j*map_prop.tile_size, i*map_prop.tile_size, 'grass');
				else var tile = game.add.sprite(j*map_prop.tile_size, i*map_prop.tile_size, 'grass2');

				ground.add(tile);
			}
			if(map[i][j]==1){
				var tile_under = game.add.sprite(j*map_prop.tile_size, i*map_prop.tile_size, 'grass');
				
				var r = rnd(1,3);

				if(r>=2){
					var tile = game.add.sprite(j*map_prop.tile_size, i*map_prop.tile_size, 'tree');
					tile.worth = rnd(4,10);
				}else{
					var tile = game.add.sprite(j*map_prop.tile_size, i*map_prop.tile_size, 'tree2');
					tile.worth = rnd(4,10);
					tile.worth2 = rnd(1,5);
					tile.growth = 2.0;
				}
				trees.add(tile);
				ground.add(tile_under);
			}
			if(map[i][j]==2){
				var tile = game.add.sprite(j*map_prop.tile_size, i*map_prop.tile_size, 'water');
				tile.animations.add('wave');
    			tile.animations.play('wave', rnd(2,4), true);
    			ground.add(tile);
			}
		}
	}

	spawnPlayer(4,0,0);
	// spawnGoblin();
	// spawnGoblin();

	game.camera.x = men[0].pos_x*map_prop.tile_size-48;
	game.camera.y = men[0].pos_y*map_prop.tile_size-48;
	//-------------------------------------------------//

	//This will set all the ui
	set_icons();
	game.world.bringToTop(cursor_group);
	ui_manager.drawUI();

	game.time.events.loop(Phaser.Timer.SECOND, doStuff, this);
}


function doStuff() {
	checkTask();
	updateTime();
}

function updateTime() {

	if(game_time.minutes<game_prop.timeFlow){
		game_time.minutes++;
	}else{
		game_time.minutes=0;
		if(game_time.hours<24){
			game_time.hours++;
			growTrees();
			if(game_time.hours == 19)
				game.add.tween(night).to( { alpha: 0.6 }, (game_prop.timeFlow*5), "Linear", true);
			else if(game_time.hours == 4)
				game.add.tween(night).to( { alpha: 0.0 }, (game_prop.timeFlow*5), "Linear", true);

		}
		else{
			game_time.hours=0;
			if(game_time.days<30){

				game_time.days++;
				game_time.days_spent++;
				

				if(game_time.days_spent==1)
					goblinWave(1);
				if(game_time.days_spent==3)
					goblinWave(2);
				if(game_time.days_spent==8)
					goblinWave(3);

			}else{
				game_time.days=0;
				if(game_time.months<12){
					game_time.months++;
				}else{
					game_time.months=0;
					game_time.years++;
				}
			}
		}
	}
	
	txt_time.text = game_time.hours+"H | "+game_time.days+"D | "+game_time.months+"M | "+game_time.years+"Y";
}

function update() {


	cursor.x = Math.floor(game.input.mousePointer.x+game.camera.x);
	cursor.y = Math.floor(game.input.mousePointer.y+game.camera.y);

	if(!game_prop.game_over){

		if (cursors.up.isDown)
	    {
	        game.camera.y -= map_prop.camera_speed;
	    }
	    else if (cursors.down.isDown)
	    {
	        game.camera.y += map_prop.camera_speed;
	    }

	    if (cursors.left.isDown)
	    {
	        game.camera.x -= map_prop.camera_speed;
	    }
	    else if (cursors.right.isDown)
	    {
	        game.camera.x += map_prop.camera_speed;
	    }
	}

}


/*If the man is idling, check for stuff to do*/
function checkTask(){
	if(!game_prop.game_over){
		for(var i=0;i<men.length;i++){
			var action=false;

			if(men[i].dead==false){

				if(men[i].task[0] == tasks.idle && men[i].idletime < 10){

					if(game_time.hours>=22 && game_time.hours <= 24){
						men[i].task[0]=tasks.goHome;
						men[i].goToSleep();
					}else{

						// console.log(globTasks.getWood + " " + globTasksTaken.getWood + " " + action);
						// 

						if(globTasks.getWood > 0 && globTasks.getWood > globTasksTaken.getWood && !action){
							men[i].task[0] = tasks.getResources;
							globTasksTaken.getWood+=1;
							men[i].getResources();
							action=true;
						}
						if(globTasks.getApples > 0 && globTasks.getApples > globTasksTaken.getApples && !action){

							men[i].task[0] = tasks.collectApples;
							globTasksTaken.getApples+=1;
							men[i].getApples();
							action=true;
						}
						if(globTasks.getFish > 0 && globTasks.getFish > globTasksTaken.getFish && !action){

							men[i].task[0] = tasks.goFishing;
							globTasksTaken.getFish+=1;
							men[i].goFishing();
							action=true;
						}
						if(globTasks.build > 0 && globTasks.build > globTasksTaken.build && !action){

							men[i].task[0] = tasks.doBuilding;
							globTasksTaken.build+=1;
							men[i].startBuilding();
							action=true;
						}

						if(!action){
							action=true;
							men[i].idletime++;
						}

					}

					
				}else if(men[i].task[0]==tasks.idle){
					men[i].idletime++;
					// 
					if(men[i].idletime >=10){
						men[i].idletime=0;
						men[i].idle();
					}
				}
				if(men[i].task[0] == tasks.sleep){
					if(game_time.hours>=7 && game_time.hours < 10){
						men[i].task[0]=tasks.idle;
						men[i].wakeUp();
					}	
				}
			}
		}
	}
}



function set_icons(){

	cursor = game.add.sprite(game.input.mousePointer.x, game.input.mousePointer.y, 'default');
	cursor.now = 0;
	cursor_group.add(cursor);

	night = game.add.sprite(0, 0,'night');
	night.fixedToCamera = true;
	night.alpha = 0;


	panel = game.add.sprite(0, 0,'panel');
	panel.fixedToCamera = true;
	panel.alpha = 0.8;

	panel2 = game.add.sprite(0, 570,'panel');
	panel2.fixedToCamera = true;
	panel2.alpha = 0.8;
	panel2.width = 280;
	panel2.height = 30;

	var wood = game.add.sprite(5, 5, 'wood');
	wood.fixedToCamera=true;

	var apple = game.add.sprite(5, 35, 'apple');
	apple.fixedToCamera=true;

	var fish = game.add.sprite(5, 70, 'fish_ui');
	fish.fixedToCamera=true;

	var calendar = game.add.sprite(4, 574, 'calendar');
	calendar.fixedToCamera=true;

	txt_wood = game.add.text(30, 7, all_res.wood, style_res);
	txt_wood.fixedToCamera = true;

	txt_apples = game.add.text(30, 39, all_res.apples, style_res);
	txt_apples.fixedToCamera = true;

	txt_fish = game.add.text(30, 70, all_res.fish, style_res);
	txt_fish.fixedToCamera = true;

	txt_time = game.add.text(34, 575, game_time.hours+"H | "+game_time.days+"D | "+game_time.months+"M | "+game_time.years+"Y", style_res);
	txt_time.fixedToCamera = true;


	// var orders = game.add.sprite(800-48, 0, 'orders');
	// orders.fixedToCamera=true;

	// var orders1 = game.add.sprite(800-48, 46, 'cut');
	// orders1.fixedToCamera=true;

	
	ui.add(night);
	ui.add(panel);
	ui.add(wood);
	ui.add(txt_wood);
	ui.add(apple);
	ui.add(txt_apples);
	ui.add(fish);
	ui.add(txt_fish);

}

function markTree(mx,my){

	var tempChoosed=false;

	var tmx = Math.floor(mx/map_prop.tile_size);
	var tmy = Math.floor(my/map_prop.tile_size);

	if(map[tmy][tmx]==1 && todo[tmy][tmx]==0 && !tempChoosed){
		todo[tmy][tmx]=game.add.sprite(tmx*map_prop.tile_size+map_prop.tile_size/4, tmy*map_prop.tile_size+map_prop.tile_size/4, 'cut');
		todo[tmy][tmx].action = 1;
		todo[tmy][tmx].started=false;
		todo[tmy][tmx].alpha = 0.5;

		globTasks.getWood +=1;
		tempChoosed=true;


	 }else if(map[tmy][tmx]==1 && todo[tmy][tmx].action==1 && !tempChoosed && !todo[tmy][tmx].started){
	 	todo[tmy][tmx].destroy();
	 	todo[tmy][tmx]=0;

	 	if(globTasks.getWood>0){
	 		globTasks.getWood--;
	 	}
	}

}

function markAppleTree(mx,my){

	var tempChoosed=false;
	var treeNow;

	var tmx = Math.floor(mx/map_prop.tile_size);
	var tmy = Math.floor(my/map_prop.tile_size);

	for (var i = 0; i < trees.children.length; i++) {  
		var tree_x = Math.floor(trees.children[i].x/map_prop.tile_size);
		var tree_y = Math.floor(trees.children[i].y/map_prop.tile_size);

		if(tree_x == tmx && tree_y == tmy){
			treeNow = trees.children[i];
			break;
		}
	}


	if(map[tmy][tmx]==1 && todo[tmy][tmx]==0 && !tempChoosed && treeNow.worth2>0){
		todo[tmy][tmx]=game.add.sprite(tmx*map_prop.tile_size+map_prop.tile_size/4, tmy*map_prop.tile_size+map_prop.tile_size/4, 'basket');
		todo[tmy][tmx].action = 2;
		todo[tmy][tmx].alpha = 0.5;
		todo[tmy][tmx].started=false;

		globTasks.getApples +=1;
		tempChoosed=true;

	 }else if(map[tmy][tmx]==1 && todo[tmy][tmx].action==2 && !tempChoosed && treeNow.worth2>0 && !todo[tmy][tmx].started){
	 	todo[tmy][tmx].destroy();
	 	todo[tmy][tmx]=0;

	 	if(globTasks.getApples>0){
	 		globTasks.getApples--;
	 	}
	}

	// 
}

function markFishingSpot(mx,my){

	var tempChoosed=false;
	var isPath=false;

	var tmx = Math.floor(mx/map_prop.tile_size);
	var tmy = Math.floor(my/map_prop.tile_size);

	if(tmy>0 && tmy<map_prop.height && tmx>0 && tmx<map_prop.width){
		if(map[tmy-1][tmx]==0 || map[tmy][tmx+1]==0 || map[tmy+1][tmx]==0 || map[tmy][tmx-1]==0){
			isPath=true;
		}else if(map[tmy-1][tmx]==symbols.bridge || map[tmy][tmx+1]==symbols.bridge || map[tmy+1][tmx]==symbols.bridge || map[tmy][tmx-1]==symbols.bridge){
			isPath=true;
		}
	}
	


	if(map[tmy][tmx]==2 && todo[tmy][tmx]==0 && !tempChoosed && isPath && globTasks.getFish<waters){
		todo[tmy][tmx]=game.add.sprite(tmx*map_prop.tile_size+map_prop.tile_size/4, tmy*map_prop.tile_size+map_prop.tile_size/4, 'fishing');
		todo[tmy][tmx].action = 3;
		todo[tmy][tmx].alpha = 0.5;
		todo[tmy][tmx].started=false;

		globTasks.getFish +=1;
		tempChoosed=true;

	 }else if(map[tmy][tmx]==2 && todo[tmy][tmx].action==3 && !tempChoosed && !todo[tmy][tmx].started){
	 	todo[tmy][tmx].destroy();
	 	todo[tmy][tmx]=0;

	 	if(globTasks.getFish>0){
	 		globTasks.getFish--;
	 	}
	}

	// 
}
function placeBuilding(mx,my,x){

	var tmx = Math.floor(mx/map_prop.tile_size);
	var tmy = Math.floor(my/map_prop.tile_size);


	if(x==0){ //Bridge
		if(map[tmy][tmx]==symbols.water && todo[tmy][tmx]==0 && all_res.wood>=materials_needed.bridge){
			
			//Izveido tur blueprintu
			todo[tmy][tmx]=game.add.sprite(tmx*map_prop.tile_size, tmy*map_prop.tile_size, 'bridge');
			todo[tmy][tmx].action = 5;
			todo[tmy][tmx].alpha = 0.5;
			todo[tmy][tmx].type = 0;
			todo[tmy][tmx].started=false;

			map[tmy][tmx]=symbols.blueprint;

			all_res.wood-=materials_needed.bridge;
			globTasks.build++;

		}else if(todo[tmy][tmx].action==5 && !todo[tmy][tmx].started){

			map[tmy][tmx]=symbols.water;

			todo[tmy][tmx].destroy();
			todo[tmy][tmx]=0;
			all_res.wood+=materials_needed.bridge;
			globTasks.build--;

		}
		txt_wood.text = all_res.wood;
	}

	if(x==1){ //Tree
		if(map[tmy][tmx]==symbols.grass && todo[tmy][tmx]==0 && all_res.apples>=materials_needed.tree){

			todo[tmy][tmx]=game.add.sprite(tmx*map_prop.tile_size, tmy*map_prop.tile_size, 'tree');
			todo[tmy][tmx].action = 5;
			todo[tmy][tmx].alpha = 0.5;
			todo[tmy][tmx].scale.setTo(0.5);
			todo[tmy][tmx].x+=map_prop.tile_size/4;
			todo[tmy][tmx].y+=map_prop.tile_size/4;
			todo[tmy][tmx].type = 1;
			todo[tmy][tmx].started=false;

			map[tmy][tmx]=symbols.blueprint;

			all_res.apples-=materials_needed.tree;
			globTasks.build++;

		}else if(todo[tmy][tmx].action==5 && !todo[tmy][tmx].started){
			todo[tmy][tmx].destroy();
			todo[tmy][tmx]=0;

			map[tmy][tmx]=symbols.grass;

			all_res.apples+=materials_needed.tree;
			globTasks.build--;
		}
		txt_wood.text = all_res.wood;
		txt_apples.text = all_res.apples;
	}

	// if(x==2){ //Floor
	// 	if(map[tmy][tmx]==symbols.grass && todo[tmy][tmx]==0 && all_res.wood>=materials_needed.floor){
			
	// 		//Izveido tur blueprintu
	// 		todo[tmy][tmx]=game.add.sprite(tmx*map_prop.tile_size, tmy*map_prop.tile_size, 'floor');
	// 		todo[tmy][tmx].action = 5;
	// 		todo[tmy][tmx].alpha = 0.5;
	// 		todo[tmy][tmx].type = 2;
	// 		todo[tmy][tmx].started=false;

	// 		map[tmy][tmx]=symbols.blueprint;

	// 		all_res.wood-=materials_needed.floor;
	// 		globTasks.build++;

	// 	}else if(todo[tmy][tmx].action==5 && !todo[tmy][tmx].started){

	// 		map[tmy][tmx]=symbols.grass;

	// 		todo[tmy][tmx].destroy();
	// 		todo[tmy][tmx]=0;
	// 		all_res.wood+=materials_needed.floor;
	// 		globTasks.build--;

	// 	}
	// 	txt_wood.text = all_res.wood;
	// }

	if(x==3){ //Wall
		if((map[tmy][tmx]==symbols.grass || map[tmy][tmx]==symbols.floor) && todo[tmy][tmx]==0 && all_res.wood>=materials_needed.wall){
			
			//Izveido tur blueprintu
			todo[tmy][tmx]=game.add.sprite(tmx*map_prop.tile_size, tmy*map_prop.tile_size, 'wall');
			todo[tmy][tmx].action = 5;
			todo[tmy][tmx].alpha = 0.5;
			todo[tmy][tmx].type = 3;
			todo[tmy][tmx].started=false;

			map[tmy][tmx]=symbols.blueprint;

			all_res.wood-=materials_needed.wall;
			globTasks.build++;

		}else if(todo[tmy][tmx].action==5 && !todo[tmy][tmx].started){

			map[tmy][tmx]=symbols.wall;

			todo[tmy][tmx].destroy();
			todo[tmy][tmx]=0;
			all_res.wood+=materials_needed.wall;
			globTasks.build--;

		}
		txt_wood.text = all_res.wood;
	}
}

function growTrees(){

	trees.forEach(function(tree) {
		
		if(tree.worth2<=6 && tree.growth==2.0){
        	tree.worth2+=2;
        }
        if(tree.worth2>=6){
        	tree.loadTexture("tree2");
        }

        if (tree.growth < 1.0)
        {
            tree.growth += 0.2;
        }
        if(tree.growth == 1.0){
        	game.add.tween(tree.scale).to( { x: 1, y:1 }, 500, "Linear", true);
        	tree.anchor.setTo(0);
        	game.add.tween(tree).to( { x: tree.x-map_prop.tile_size/4, y:tree.y-=map_prop.tile_size/4 }, 500, "Linear", true);
        	tree.growth=2.0;
        	tree.worth2=0;
        }
        
    });
}

function spawnPlayer(n,x,y){
	var temp_pl_pos = {
		x : x,
		y : y
	};
	

	while(temp_pl_pos.x==0){
		var tpx = rnd(1,map_prop.width-2);
		var tpy = rnd(1,map_prop.height-2);
		if(map[tpy][tpx]==0 && map[tpy-1][tpx]==0 && map[tpy][tpx+1]==0 && map[tpy+1][tpx]==0 && map[tpy][tpx-1]==0){
			temp_pl_pos.x = tpx;
			temp_pl_pos.y = tpy;
		}
	}

	for(var i=0;i<n;i++){
		var temp_pl = new Man();
		temp_pl.task[0]=tasks.idle;

		if(i==0){
			temp_pl.pos_x = temp_pl_pos.x;
			temp_pl.pos_y = temp_pl_pos.y;
		}
		if(i==1){
			temp_pl.pos_x = temp_pl_pos.x;
			temp_pl.pos_y = temp_pl_pos.y-1;
		}
		if(i==2){
			temp_pl.pos_x = temp_pl_pos.x+1;
			temp_pl.pos_y = temp_pl_pos.y;
		}
		if(i==3){
			temp_pl.pos_x = temp_pl_pos.x;
			temp_pl.pos_y = temp_pl_pos.y+1;
		}
		if(i==4){
			temp_pl.pos_x = temp_pl_pos.x-1;
			temp_pl.pos_y = temp_pl_pos.y;
		}
		

		temp_pl.sprite = game.add.sprite(temp_pl.pos_x*map_prop.tile_size, temp_pl.pos_y*map_prop.tile_size, temp_pl.texture_name);

		middle_level.add(temp_pl.sprite);

		men.push(temp_pl);
	}

}

function spawnGoblin(){
	
		var temp_go = new Goblin();
		temp_go.task="Idle";

		temp_go.pos_x = g_portal_pos.x;
		temp_go.pos_y = g_portal_pos.y;
		
		

		temp_go.sprite = game.add.sprite(temp_go.pos_x*map_prop.tile_size, temp_go.pos_y*map_prop.tile_size, "goblin");
		temp_go.portal_pos.x = g_portal_pos.x;
		temp_go.portal_pos.y = g_portal_pos.y;

		temp_go.task[0]="n";

		temp_go.sprite.animations.add('move');
    	temp_go.sprite.animations.play('move', rnd(14,15), true);

		middle_level.add(temp_go.sprite);

		goblins.push(temp_go);
		allGoblins+=1;

		temp_go.searchForFlesh();
}

function goblinWave(n){
	while(g_portal_pos.x==-1){
		var tpx = rnd(1,map_prop.width-2);
		var tpy = rnd(1,map_prop.height-2);

		

		if(map[tpy][tpx]==0 && map[tpy-1][tpx]==0 && map[tpy][tpx+1]==0 && map[tpy+1][tpx]==0 && map[tpy][tpx-1]==0){
			g_portal_pos.x = tpx;
			g_portal_pos.y = tpy;

		}
	}

	g_portal = game.add.sprite(g_portal_pos.x*map_prop.tile_size, g_portal_pos.y*map_prop.tile_size, "goblin_portal");

	ground.add(g_portal);
	g_portal.animations.add('magic');
    g_portal.animations.play('magic', 3, true);


	if(n==1){
		spawnGoblin();
	}
	if(n==2){
		for(var i=0;i<4;i++){
			game.time.events.add(i*800, function(){
			 	spawnGoblin();
			}, this);	
		}
	}
	if(n==3){
		for(var i=0;i<10;i++){
			game.time.events.add(i*800, function(){
			 	spawnGoblin();
			}, this);
		}
	}
	
}

function destroyCreature(x){
	if(x == symbols_live.goblin){
		for(var i=0;i<goblins.length;i++){
			if(goblins[i].needsToBeDestroyed){
				goblins[i].sprite.destroy();
				goblins[i]=0;
				allGoblins-=1;

				if(allGoblins==0){
					console.log("en");
					g_portal.destroy();
					g_portal=0;
					g_portal_pos.x=-1;
					g_portal_pos.y=-1;
					return;
				}
			}
		}
	}
}

function rnd(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

function checkGame(){
	if(!game_prop.game_over){
		var menCount = men.length;
		var deadCount = 0;
		for(var i=0;i<men.length;i++){
			if(men[i].dead)deadCount++;
		}

		if(menCount==deadCount){
			gameOver();
		}
	}
}

function gameOver(){
	game_prop.game_over=true;

	var eg = game.add.sprite(game.camera.x+400, game.camera.y+300, 'gameover');
	eg.inputEnabled = true;
	eg.anchor.setTo(0.5);
	eg.alpha=0;

	game.world.bringToTop(cursor_group);

	game.add.tween(eg).to( { alpha: 1.0 }, (2000), "Linear", true);

	eg.events.onInputDown.add(function(){
		if(eg.alpha==1)
			location.reload();
	}, this);

}