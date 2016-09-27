var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var map_prop = {
	width : 30,
	height : 30,
	camera_speed : 6,
	tile_size : 48
};
var map;

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

//Z-leveling groups and trees'group
var ground;
var middle_level;
var trees;
var ui;

var theTop;
//Time area
var game_time = {
	minutes : 0,
	hours : 7,
	days : rnd(1,31),
	months : rnd(1,12),
	years : rnd(1000,2016)
}
var night;
//---------

//Resources
var all_res = {
	wood : 0,
	apples : 0,
}
//---------

//Text area
var style_res = {font: "20px Arial", fill: "#ffffff", align: "left"};
var style_name = {font: "14px Arial", fill: "#ffffff", align: "center"};

var txt_wood;
var txt_apples;
var panel;
var txt_time;

//---------

//Character design area
var skins = ["man","man2","man3","man4"];
var names = ["Edijs","Niks","Didzis","Reinards","Henrijs","Palamuts"];
//---------

//Task area
var tasks = ["None","Get Resources","Build House","Go Home","Sleep","Go Fishing"];

var globTasks = {
	getWood : 0,
	getApples : 0,
	// buildHouse : false,
	// goFishing : false
};
var globTasksTaken = {
	getWood : 0,
	getApples : 0
};
//House
var materials_needed = [30];
//---------

//Men area
var men = [];
//----------

function preload() {
	game.stage.backgroundColor = '#E8E8E8';


	//Load all the stuff needed
	game.load.image('grass', 'assets/images/grass.png');
	game.load.image('grass2', 'assets/images/grass2.png');
	game.load.image('house', 'assets/images/house.png');
	game.load.image('wall', 'assets/images/wall.png');
	game.load.image('tree', 'assets/images/tree.png');
	game.load.image('tree2', 'assets/images/tree2.png');
	game.load.image('house', 'assets/images/house.png');
	game.load.spritesheet('water', 'assets/images/water.png', 48, 48, 6);


	game.load.image('man', 'assets/images/man.png');
	game.load.image('man2', 'assets/images/man2.png');
	game.load.image('man3', 'assets/images/man3.png');
	game.load.image('man4', 'assets/images/man4.png');

	game.load.image('wood', 'assets/images/wood.png');
	game.load.image('night', 'assets/images/night.png');
	game.load.image('apple', 'assets/images/apple.png');
	game.load.image('calendar', 'assets/images/calendar.png');
	game.load.image('panel', 'assets/images/panel.png');
	game.load.spritesheet('build', 'assets/images/build.png', 48, 48, 5);
	game.load.spritesheet('sleep', 'assets/images/sleep.png', 48, 48, 5);

	game.load.image('working', 'assets/images/working.png');
	game.load.image('fishing', 'assets/images/fishing.png');
	game.load.image('blueprint', 'assets/images/blueprint.png');

	game.load.image('menu', 'assets/images/ui/menu.png');
	game.load.image('orders', 'assets/images/ui/orders.png');
		game.load.image('cut', 'assets/images/ui/cut.png');

	game.load.image('default', 'assets/images/cursors/default.png');

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

	ui_manager = new UserInterface();

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
				}
				// tile.scale.setTo(0.5);
				trees.add(tile);
				ground.add(tile_under);
			}
			if(map[i][j]==2){
				var tile = game.add.sprite(j*map_prop.tile_size, i*map_prop.tile_size, 'water');
				tile.animations.add('wave');
    			tile.animations.play('wave', rnd(2,4), true);
    			ground.add(tile);
    			// tile.scale.setTo(0.5);
			}
		}
	}

	//Spawn players
	player = new Man();
	player.pos_x=0;
	player.pos_y=0;

	player2 = new Man();
	player2.pos_x = 1;
	player2.pos_y = 1;

	men.push(player);
	men.push(player2);
	player.task[0]=tasks[0];
	player2.task[0]=tasks[0];

	player.sprite = game.add.sprite(player.pos_x*map_prop.tile_size, player.pos_y*map_prop.tile_size, player.texture_name);
	// player.sprite.scale.setTo(player.scaling);

	player2.sprite = game.add.sprite(player2.pos_x*map_prop.tile_size, player2.pos_y*map_prop.tile_size, player2.texture_name);
	// player2.sprite.scale.setTo(player2.scaling);

	middle_level.add(player.sprite);
	middle_level.add(player2.sprite);
	//-------------------------------------------------//

	//This will set all the ui
	set_icons();
	ui_manager.drawUI();

	game.time.events.loop(Phaser.Timer.SECOND, doStuff, this);
}


function doStuff() {
	checkTask();
	updateTime();
}

function updateTime() {

	if(game_time.minutes<10){
		game_time.minutes++;
	}else{
		game_time.minutes=0;
		if(game_time.hours<24){
			game_time.hours++;
			if(game_time.hours == 19)
				game.add.tween(night).to( { alpha: 0.6 }, (10000*5), "Linear", true);
			else if(game_time.hours == 4)
				game.add.tween(night).to( { alpha: 0.0 }, (10000*5), "Linear", true);

		}
		else{
			game_time.hours=0;
			if(game_time.days<30){
				game_time.days++;
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


	cursor.x = game.input.mousePointer.x+game.camera.x;
	cursor.y = game.input.mousePointer.y+game.camera.y;


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


/*If the man is idling, check for stuff to do*/
function checkTask(){

//["None","Get Resources","Build House","Go Home","Sleep","Go Fishing"];

	for(var i=0;i<men.length;i++){
		//If the man is idling
		if(men[i].task[0] == tasks[0]){

			if(game_time.hours>=22 && game_time.hours <= 24){
				men[i].task[0]=tasks[3];
				men[i].goToSleep();
			}else{

				console.log("B-"+globTasksTaken.getWood+"/"+globTasks.getWood);
				if(globTasks.getWood > 0 && globTasks.getWood > globTasksTaken.getWood){

					// console.log(men[i]);

					men[i].task[0] = tasks[1];
					globTasksTaken.getWood+=1;
					men[i].getResources();
				}
				// If the man has no house
				// if(men[i].items.house == 0){
				// 	if(men[i].items.wood >= materials_needed[0]){
				// 		men[i].task[0]=tasks[2];
				// 		men[i].buildHouse();
				// 	}else{
				// 		men[i].task[0]=tasks[1];
				// 		men[i].getResources();
				// 	}
				// }else{
				// 	// console.log(men[i].items.house);
				// 	men[i].task[0]=tasks[5];
				// 	men[i].goFishing();
				// }
			}

			
		}
		if(men[i].task[0] == tasks[4]){
			if(game_time.hours>=7 && game_time.hours < 10){
				men[i].task[0]=tasks[0];
				men[i].wakeUp();
			}	
		}
	}
}



function set_icons(){

	cursor = game.add.sprite(game.input.mousePointer.x, game.input.mousePointer.y, 'default');
	cursor.now = 0;
	game.world.bringToTop(cursor);

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

	var calendar = game.add.sprite(4, 574, 'calendar');
	calendar.fixedToCamera=true;

	txt_wood = game.add.text(30, 7, all_res.wood, style_res);
	txt_wood.fixedToCamera = true;

	txt_apples = game.add.text(30, 39, all_res.apples, style_res);
	txt_apples.fixedToCamera = true;

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

}

function markTree(mx,my){

	var tempChoosed=false;

	// if(game.camera.y>0){

	// }

	var tmx = Math.floor(mx/map_prop.tile_size);
	var tmy = Math.floor(my/map_prop.tile_size);

	// console.log(tmx+" "+tmy);

	if(map[tmy][tmx]==1 && todo[tmy][tmx]==0 && !tempChoosed){
		todo[tmy][tmx]=game.add.sprite(tmx*map_prop.tile_size+map_prop.tile_size/4, tmy*map_prop.tile_size+map_prop.tile_size/4, 'working');
		todo[tmy][tmx].action = 1;
		todo[tmy][tmx].alpha = 0.5;

		globTasks.getWood +=1;
		tempChoosed=true;

	 }else if(map[tmy][tmx]==1 && todo[tmy][tmx].action==1 && !tempChoosed){
	 	todo[tmy][tmx].destroy();
	 	todo[tmy][tmx]=0;

	 	if(globTasks.getWood>0){
	 		globTasks.getWood--;
	 	}
	}

	// console.log(globTasks.getWood);
}

function rnd(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}