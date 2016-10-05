function Man(){
	this.texture_name = skins[rnd(0,skins.length-1)]; //Name for the sprite texture to load
	this.name = names[rnd(0,names.length-1)];
	this.name_txt;
	this.scaling = 0.5; //Sprite scaling
	this.sprite; //Storing the sprite
	this.icon; //Icon above head
	this.blueprint; //Blueprint tile

	this.pos_x = rnd(4,map_prop.width-5); //X Position divided by tile size
	this.pos_y = rnd(4,map_prop.height-5); //Y Position divided by tile size
	this.reached = false; //Has reached the path's end point
	this.gotopos = { //Stores the current path's end point coords
		x : 0,
		y : 0
	}
	this.path; //Stores path
	
	this.age = rnd(16,77); //His age
	this.speed = rnd(4,6); //His speed

	this.skills = { //His skills
		building : rnd(1,3),
		forestry : rnd(2,3)
	};

	this.house_pos = { //House position
		x : -1,
		y : -1
	};
	this.house_sprite; //House sprite

	this.items = { //All that he has
		house : 0,
		apples : 0,
		wood : 0,
		fish : 0
	};

	this.task = []; //Task
}

Man.prototype.use_path = function (y,x,y2,x2,complete){


	this.pos_x = Math.floor(this.sprite.x/map_prop.tile_size);
	this.pos_y = Math.floor(this.sprite.y/map_prop.tile_size);


	//If the action is canceled
	if(typeof todo[this.gotopos.y][this.gotopos.x].action =='undefined'){
		this.path = [];
		this.path.length = 0;
		job[this.gotopos.y][this.gotopos.x]=0;
		if(this.task[0]==tasks.getResources)
			globTasksTaken.getWood--;
		if(this.task[0]==tasks.collectApples)
			globTasksTaken.getApples--;
		if(this.task[0]==tasks.goFishing)
			globTasksTaken.getFish--;
		if(this.task[0]==tasks.doBuilding)
			globTasksTaken.build--;

		this.task[0]=tasks.idle;
		return;
	}

	if(!complete){

	 	if((y+1 == y2 && x==x2)||(y-1 == y2 && x==x2)||(y == y2 && x+1 == x2)||(y == y2 && x-1 == x2))
	 	{

	 		this.reached=false;
	 		this.path = [];
	 		this.path.length = 0;

	 		if(this.task[0] == tasks.getResources){
	 			if(map[this.gotopos.y][this.gotopos.x]==1){
	 				this.cutTree();
	 			}else{
	 				this.getResources();
	 			}
	 		}
	 		if(this.task[0] == tasks.doBuilding){
	 			this.doBuilding();
 			}
 			if(this.task[0] == tasks.goHome){
	 			this.getHome();
 			}
 			if(this.task[0] == tasks.goFishing){
	 			this.doFishing();
 			}
 			if(this.task[0] == tasks.collectApples){
	 			this.collectApples();
 			}
 			return;
 		}

	 	 if(!this.reached){


	 		var ytmp = this.path[y][x].y;
	 		var xtmp = this.path[y][x].x;


	 		// if(2>1){
	 		if(map[ytmp][xtmp]==symbols.grass || map[ytmp][xtmp]==symbols.bridge || map[ytmp][xtmp]==symbols.floor || (todo[ytmp][xtmp].type==2 && map[ytmp][xtmp]==symbols.blueprint)){
		 		y = ytmp;
		 		x = xtmp;

		 		game.add.tween(this.sprite).to( { x: xtmp*map_prop.tile_size }, (this.speed*100)-30, "Linear", true);		
		 		game.add.tween(this.sprite).to( { y: ytmp*map_prop.tile_size }, (this.speed*100)-30, "Linear", true);

		 		game.time.events.add(this.speed*100, function(){
		 			this.use_path(y,x,y2,x2,complete);
		 		}, this);
		 	}else{
		 		console.log("MAPS : "+map[ytmp][xtmp]);
		 		this.path = [];
		 		this.path.length = 0;

		 		this.path = find_path(map,this.pos_y,this.pos_x,this.gotopos.y,this.gotopos.x,1);

		 		if(this.path!=0){
					this.use_path(this.pos_y,this.pos_x,this.gotopos.y,this.gotopos.x,false);	
				}else{
					this.path = [];
		 			this.path.length = 0;
		 			job[this.gotopos.y][this.gotopos.x]=0;
				}
		 	}
	 		// }else{
	 		// 	this.reached=true;
	 		// 	this.path = [];
				// this.path.length = 0;

				// job[this.gotopos.y][this.gotopos.x]=0;

				// this.path = find_path(map,this.pos_y,this.pos_x,this.gotopos.y,this.gotopos.x,1);

				// console.log(this.path);
				// debugger;
				// if(this.path!=0){
				// 	if(job[this.gotopos.y][this.gotopos.x]==0){
				// 		job[this.gotopos.y][this.gotopos.x]=1;
				// 		this.reached=false;
				// 		this.use_path(this.pos_y,this.pos_x,this.gotopos.y,this.gotopos.x,false);
						
				// 	}		
				// }

				// return;
	 		
	 	}
 }

}
Man.prototype.find_target_position = function(grid, xs,ys,target,blocked,action){
	var map = grid;
	var map_height = map.length;
	var map_width = map[0].length;

	var target_exists = false;

	//Make and checked array

	var checked = new Array();

	for (i=0;i<map_height;i++) {
	 checked[i]=new Array();
	 for (j=0;j<map_width;j++) {
	  checked[i][j]=0;
	 }
	}


	//Set starting coords

	var starting = {
		x : xs,
		y : ys
	};
	var target_pos = {
		x : 0,
		y : 0
	};

	var rinda = [];
	var prev_p;

	rinda.push(starting);
	checked[starting.y][starting.s] = 1;

	while(rinda.length > 0){

		
		// Current node
		var p = rinda.shift();
		prev_p = p;
		
	    //Found result
	 //    if(p===undefined){
	 //    	map[p.y][p.x]==target;
		// 	target_pos.x = prev_p.x;
		// 	target_pos.y = prev_p.y;

		// 	target_exists=true;
		// 	break;
		// } else 

		if(todo[p.y][p.x] != undefined){
			// console.log(map[p.y][p.x] + " ; "+job[p.y][p.x] + " ; "+);
			if(map[p.y][p.x]==target && job[p.y][p.x]==0 && todo[p.y][p.x].action==action){

				target_pos.x = p.x;
				target_pos.y = p.y;

				target_exists=true;
				break;
			}	
		}

		//Check north
	    if(p.y > 0){
		    if(checked[p.y-1][p.x]==0 && map[p.y-1][p.x]<blocked){
		        checked[p.y-1][p.x]=1;
		        var c = {
		            x : p.x,
		            y : p.y-1
		        };
		        rinda.push(c);
		    }
		}
		
		//Check east
	    if(p.x < map_width){
	    	if(checked[p.y][p.x+1]==0 && map[p.y][p.x+1]<blocked){
	    		checked[p.y][p.x+1]=1;
		        var c = {
		            x : p.x+1,
		            y : p.y
		        };
		        rinda.push(c);
		        // console.log(rinda);
	    	}
	    }

	    

	    //Check south
	    if(p.y < map_height-1){
	    	if(checked[p.y+1][p.x]==0 && map[p.y+1][p.x]<blocked){
	    		checked[p.y+1][p.x]=1;
	    		var c = {
		            x : p.x,
		            y : p.y+1
		        };
		        rinda.push(c);

	    	}
	    }

	    // //Check west
	    if(p.x > 0){
	    	if(checked[p.y][p.x-1]==0 && map[p.y][p.x-1]<blocked){
	    		checked[p.y][p.x-1]=1;
	    		var c = {
	    			x : p.x-1,
	    			y : p.y
	    		};
	    		rinda.push(c);

	    	}
	    }
		

	    //See filled nodes
	 //    var s = game.add.sprite(p.y*20, p.x*20, 'wall');
		// // s.scale.setTo(0.5);
		// s.alpha = 0.5;

	}

		if(!target_exists){
			return 0;
		}else{
			return target_pos;
		}
}


//====================================//



Man.prototype.getResources = function (){
	this.path = [];
	this.path.length = 0;

	this.pos_x = Math.floor(this.sprite.x/map_prop.tile_size);
	this.pos_y = Math.floor(this.sprite.y/map_prop.tile_size);

	//Find the nearest tree
	var ending_pos = this.find_target_position(map,this.pos_x,this.pos_y,symbols.tree,2,1);
	this.gotopos = ending_pos;

	this.path = find_path(map,this.pos_y,this.pos_x,ending_pos.y,ending_pos.x,1);

	if(this.path!=0){
		if(job[this.gotopos.y][this.gotopos.x]==0){
			job[ending_pos.y][ending_pos.x]=1;

			this.use_path(this.pos_y,this.pos_x,ending_pos.y,ending_pos.x,false);	
		}			
	}else{
			job[ending_pos.y][ending_pos.x]=0;
			globTasksTaken.getWood--;
			this.task[0]=tasks.idle;
			return;
	}

	
}

Man.prototype.getApples = function (){
	this.path = [];
	this.path.length = 0;

	this.pos_x = Math.floor(this.sprite.x/map_prop.tile_size);
	this.pos_y = Math.floor(this.sprite.y/map_prop.tile_size);

	//Find the nearest tree
	var ending_pos = this.find_target_position(map,this.pos_x,this.pos_y,1,2,2);
	this.gotopos = ending_pos;

	this.path = find_path(map,this.pos_y,this.pos_x,ending_pos.y,ending_pos.x,1);

	if(this.path!=0){
		if(job[this.gotopos.y][this.gotopos.x]==0){
			job[ending_pos.y][ending_pos.x]=1;

			//Find if there is a path to that tree

			todo[this.gotopos.y][this.gotopos.x].started=true;			
			this.use_path(this.pos_y,this.pos_x,ending_pos.y,ending_pos.x,false);
			
		}

			
	}else{
			// job[ending_pos.y][ending_pos.x]=0;
			globTasksTaken.getWood--;
			this.task[0]=tasks.idle;
			return;
	}

	
}

Man.prototype.collectApples = function (){

	this.icon = game.add.sprite(this.gotopos.x*map_prop.tile_size+map_prop.tile_size/4, this.gotopos.y*map_prop.tile_size+map_prop.tile_size/4, 'basket');
	
	
	// game.world.bringToTop(ui);
	// game.world.sendToBack(ground);

	game.time.events.add(Phaser.Timer.SECOND * this.skills.forestry, function(){
		this.icon.kill();

		todo[this.gotopos.y][this.gotopos.x].destroy();
		todo[this.gotopos.y][this.gotopos.x] = 0;

		if(globTasks.getApples>0){
			globTasks.getApples--;
			globTasksTaken.getApples--;
		}

			//----------------------------
			for (var i = 0; i < trees.children.length; i++) {  
				var tree_x = Math.floor(trees.children[i].x/map_prop.tile_size);
				var tree_y = Math.floor(trees.children[i].y/map_prop.tile_size);

				if(tree_x == this.gotopos.x && tree_y == this.gotopos.y){
					var tree = trees.children[i];

					all_res.apples += tree.worth2;
					this.items.apples += tree.worth2;
					tree.worth2=0;

					txt_apples.text = all_res.apples;

					tree.loadTexture("tree");

					break;
				}
			}

			job[this.gotopos.y][this.gotopos.x]=0;

			this.reached=false;
			this.task[0]=tasks.idle;
			
	}, this);
}

Man.prototype.cutTree = function (){
		// this.pos_x = Math.floor(this.sprite.x/map_prop.tile_size);
		// this.pos_y = Math.floor(this.sprite.y/map_prop.tile_size);
		// this.pos_x = this.gotopos.x;
		// this.pos_y = this.gotopos.y;


		this.icon = game.add.sprite(this.gotopos.x*map_prop.tile_size+map_prop.tile_size/4, this.gotopos.y*map_prop.tile_size+map_prop.tile_size/4, 'cut');
		
		todo[this.gotopos.y][this.gotopos.x].started=true;

		game.time.events.add(Phaser.Timer.SECOND * this.skills.forestry, function(){
			this.icon.kill();

			this.destroy_tree(this.gotopos.x,this.gotopos.y);
			map[this.gotopos.y][this.gotopos.x] = symbols.grass;
			todo[this.gotopos.y][this.gotopos.x].destroy();
			todo[this.gotopos.y][this.gotopos.x] = 0;

			if(globTasks.getWood>0){
				globTasks.getWood--;
				globTasksTaken.getWood--;
			}
			
			this.reached=false;
			this.task[0]=tasks.idle;
		}, this);
}

Man.prototype.destroy_tree = function(pos_x,pos_y){
	var tree;
	for (var i = 0; i < trees.children.length; i++) {  
		var tree_x = Math.floor(trees.children[i].x/map_prop.tile_size);
		var tree_y = Math.floor(trees.children[i].y/map_prop.tile_size);

		if(tree_x == this.gotopos.x && tree_y == this.gotopos.y){
			tree = trees.children[i];
			break;
		}
	}

	map[pos_y][pos_x]=0;

	job[this.gotopos.y][this.gotopos.x]=0;

	all_res.wood += tree.worth;
	this.items.wood += tree.worth;

	if(tree.worth2>0){
		all_res.apples += tree.worth2;
		this.items.apples += tree.worth2;
	}
	
	txt_wood.text = all_res.wood;
	txt_apples.text = all_res.apples;
	tree.destroy();
}
/*Man.prototype.buildHouse = function(){
	if(this.house_pos.x >=0){
		this.blueprint = game.add.sprite(this.house_pos.x*map_prop.tile_size, this.house_pos.y*map_prop.tile_size, 'blueprint');
		ground.add(this.blueprint);
		this.blueprint.alpha = 0.5;

		this.items.wood-=materials_needed[0];
		all_res.wood-=materials_needed[0];
		txt_wood.text = all_res.wood;

		this.path = find_path(map,this.pos_y,this.pos_x,this.house_pos.y,this.house_pos.x,2);

		if(this.path!=0){
			this.use_path(this.pos_y,this.pos_x,this.house_pos.y,this.house_pos.x,false);
		}
	}else{
		var spot_x = Math.floor(this.sprite.x/map_prop.tile_size);
		var spot_y = Math.floor(this.sprite.y/map_prop.tile_size);

		if((spot_y==map_prop.height && spot_x==0)){
			if(map[spot_y][spot_x+1]==0){
					this.house_pos.x = spot_x+1;
					this.house_pos.y = spot_y;
					this.buildHouse();
			}else if(map[spot_y-1][spot_x]==0){
					this.house_pos.x = spot_x;
					this.house_pos.y = spot_y-1;
					this.buildHouse();
			}
		}else if((spot_y==map_prop.height && spot_x==map_prop.width)){
			if(map[spot_y][spot_x-1]==0){
					this.house_pos.x = spot_x-1;
					this.house_pos.y = spot_y;
					this.buildHouse();
			}else if(map[spot_y-1][spot_x]==0){
					this.house_pos.x = spot_x;
					this.house_pos.y = spot_y-1;
					this.buildHouse();
			}
		}else if((spot_y==0 && spot_x==0)){
			if(map[spot_y][spot_x+1]==0){
					this.house_pos.x = spot_x+1;
					this.house_pos.y = spot_y;
					this.buildHouse();
			}else if(map[spot_y+1][spot_x]==0){
					this.house_pos.x = spot_x;
					this.house_pos.y = spot_y+1;
					this.buildHouse();
			}
		}else if((spot_y==0 && spot_x==map_prop.width)){
			if(map[spot_y][spot_x+1]==0){
					this.house_pos.x = spot_x+1;
					this.house_pos.y = spot_y;
					this.buildHouse();
			}else if(map[spot_y+1][spot_x]==0){
					this.house_pos.x = spot_x;
					this.house_pos.y = spot_y+1;
					this.buildHouse();
			}
		}else if((spot_y>0 && spot_y < map_prop.height && spot_x==0)){
			if(map[spot_y][spot_x+1]==0){
					this.house_pos.x = spot_x+1;
					this.house_pos.y = spot_y;
					this.buildHouse();
			}else if(map[spot_y-1][spot_x]==0){
					this.house_pos.x = spot_x;
					this.house_pos.y = spot_y-1;
					this.buildHouse();
			}else if(map[spot_y+1][spot_x]==0){
					this.house_pos.x = spot_x;
					this.house_pos.y = spot_y+1;
					this.buildHouse();
			}
		}else if((spot_y>0 && spot_y < map_prop.height && spot_x==map_prop.width)){
			if(map[spot_y][spot_x+1]==0){
					this.house_pos.x = spot_x-1;
					this.house_pos.y = spot_y;
					this.buildHouse();
			}else if(map[spot_y-1][spot_x]==0){
					this.house_pos.x = spot_x;
					this.house_pos.y = spot_y-1;
					this.buildHouse();
			}else if(map[spot_y+1][spot_x]==0){
					this.house_pos.x = spot_x;
					this.house_pos.y = spot_y+1;
					this.buildHouse();
			}
		}else if((spot_y==0 && spot_x>0 && spot_x < map_prop.width)){
			if(map[spot_y][spot_x+1]==0){
					this.house_pos.x = spot_x+1;
					this.house_pos.y = spot_y;
					this.buildHouse();
			}else if(map[spot_y][spot_x-1]==0){
					this.house_pos.x = spot_x-1;
					this.house_pos.y = spot_y;
					this.buildHouse();
			}else if(map[spot_y+1][spot_x]==0){
					this.house_pos.x = spot_x;
					this.house_pos.y = spot_y+1;
					this.buildHouse();
			}
		}else if((spot_y==map_prop.height && spot_x>0 && spot_x < map_prop.width)){
			if(map[spot_y][spot_x+1]==0){
					this.house_pos.x = spot_x+1;
					this.house_pos.y = spot_y;
					this.buildHouse();
			}else if(map[spot_y][spot_x-1]==0){
					this.house_pos.x = spot_x-1;
					this.house_pos.y = spot_y;
					this.buildHouse();
			}else if(map[spot_y-1][spot_x]==0){
					this.house_pos.x = spot_x;
					this.house_pos.y = spot_y-1;
					this.buildHouse();
			}
		}else{
			if(map[spot_y][spot_x+1]==0){
					this.house_pos.x = spot_x+1;
					this.house_pos.y = spot_y;
					this.buildHouse();
			}else if(map[spot_y][spot_x-1]==0){
					this.house_pos.x = spot_x-1;
					this.house_pos.y = spot_y;
					this.buildHouse();
			}else if(map[spot_y+1][spot_x]==0){
					this.house_pos.x = spot_x;
					this.house_pos.y = spot_y+1;
					this.buildHouse();
			}else if(map[spot_y-1][spot_x]==0){
					this.house_pos.x = spot_x;
					this.house_pos.y = spot_y-1;
					this.buildHouse();
			}
		}

	}
}*/
Man.prototype.startBuilding = function(x){
	this.path = [];
	this.path.length = 0;

	this.pos_x = Math.floor(this.sprite.x/map_prop.tile_size);
	this.pos_y = Math.floor(this.sprite.y/map_prop.tile_size);

	//Find a buildable building
	var ending_pos = this.find_target_position(map,this.pos_x,this.pos_y,symbols.blueprint,1,5);
	this.gotopos = ending_pos;
	
	if(todo[this.pos_y][this.pos_x].type==2 && job[this.pos_y][this.pos_x]==0){
		ending_pos.x = this.pos_x;
		ending_pos.y = this.pos_y;
		this.gotopos = ending_pos;
	}

	if(ending_pos!=0){

		if(todo[ending_pos.y][ending_pos.x].type==0){
			this.path = find_path(map,this.pos_y,this.pos_x,ending_pos.y,ending_pos.x,1,null,false);	
		}
		if(todo[ending_pos.y][ending_pos.x].type==1){

			this.path = find_path(map,this.pos_y,this.pos_x,ending_pos.y,ending_pos.x,1,null,false);
		}
		if(todo[ending_pos.y][ending_pos.x].type==2){//Floor

			if(map[this.pos_y][this.pos_y]==symbols.blueprint){
				console.log("yees");
				this.reached=false;
	 		this.path = [];
	 		this.path.length = 0;
				// if(map[this.pos_y-1][this.pos_x]==symbols.grass || map[this.pos_)
				this.gotopos.x = this.pos_x;
				this.gotopos.y = this.pos_y;
				this.doBuilding();
			}else
				this.path = find_path(map,this.pos_y,this.pos_x,ending_pos.y,ending_pos.x,1,null,true);
		}
		if(todo[ending_pos.y][ending_pos.x].type==3){

			this.path = find_path(map,this.pos_y,this.pos_x,ending_pos.y,ending_pos.x,1,null,false);
		}
		
	}
	else this.path = 0;

	if(this.path!=0){
		if(job[this.gotopos.y][this.gotopos.x]==0){
			job[ending_pos.y][ending_pos.x]=1;
			console.log("Get building");
			//Find if there is a path to that tree
			this.use_path(this.pos_y,this.pos_x,ending_pos.y,ending_pos.x,false);
			
		}

			
	}else{
			// job[ending_pos.y][ending_pos.x]=0;
			globTasksTaken.build--;
			this.task[0]=tasks.idle;
			return;
	}
}
Man.prototype.doBuilding = function(){
	todo[this.gotopos.y][this.gotopos.x].alpha=0;
	this.blueprint = game.add.sprite(this.gotopos.x*map_prop.tile_size, this.gotopos.y*map_prop.tile_size, 'build');
	this.blueprint.animations.add('build');
	this.blueprint.animations.play('build', this.skills.building/3, false);

	todo[this.gotopos.y][this.gotopos.x].started=true;


	this.blueprint.animations.currentAnim.onComplete.add(function () {

		this.blueprint.destroy();

		if(todo[this.gotopos.y][this.gotopos.x].type==0){ //Bridge
			var tile = game.add.sprite(this.gotopos.x*map_prop.tile_size, this.gotopos.y*map_prop.tile_size, 'bridge');
			map[this.gotopos.y][this.gotopos.x]=symbols.bridge;
			ground.add(tile);
		}
		if(todo[this.gotopos.y][this.gotopos.x].type==1){ //Tree
			var tile = game.add.sprite(this.gotopos.x*map_prop.tile_size, this.gotopos.y*map_prop.tile_size, 'tree');
			tile.scale.setTo(0.5);

			tile.x+=map_prop.tile_size/4;
			tile.y+=map_prop.tile_size/4;

			tile.worth = rnd(1,4);
			tile.worth2 = 0;
			tile.growth = 0.0;
			map[this.gotopos.y][this.gotopos.x]=symbols.tree;

			trees.add(tile);
		}
		if(todo[this.gotopos.y][this.gotopos.x].type==2){ //Floor

			var tile;
			for (var i = 0; i < ground.children.length; i++) {  
				var tile_x = Math.floor(ground.children[i].x/map_prop.tile_size);
				var tile_y = Math.floor(ground.children[i].y/map_prop.tile_size);

				if(tile_x == this.gotopos.x && tile_y == this.gotopos.y){
					tile = ground.children[i];
					break;
				}
			}
			map[this.gotopos.y][this.gotopos.x]=symbols.grass;
			tile.loadTexture("floor");
		}
		if(todo[this.gotopos.y][this.gotopos.x].type==3){ //Bridge
			var tile = game.add.sprite(this.gotopos.x*map_prop.tile_size, this.gotopos.y*map_prop.tile_size, 'wall');
			map[this.gotopos.y][this.gotopos.x]=symbols.wall;
			ground.add(tile);
		}
		todo[this.gotopos.y][this.gotopos.x].destroy();
		todo[this.gotopos.y][this.gotopos.x]=0;
		job[this.gotopos.y][this.gotopos.x]=0;

		globTasks.build--;
		globTasksTaken.build--;
		this.task[0]=tasks.idle;
	 	

	 	// game.world.bringToTop(middle_level);
	 	// game.world.bringToTop(ui);
	 }, this);
}
Man.prototype.goToSleep = function(){
	if(this.items.house>0){
		var ending_pos = {
			x : this.house_pos.x,
			y : this.house_pos.y
		}
		this.gotopos = ending_pos;

		this.pos_x = Math.floor(this.sprite.x/map_prop.tile_size);
		this.pos_y = Math.floor(this.sprite.y/map_prop.tile_size);

		//Find if there is a path to the house
		this.path = find_path(map,this.pos_y,this.pos_x,ending_pos.y,ending_pos.x,2,3);
		// console.log(this.path);
			
		if(this.path!=0){
			//Go to that tree

			this.use_path(this.pos_y,this.pos_x,ending_pos.y,ending_pos.x,false);
		}
	}else{
		var side = rnd(0,4);
		if(side<=2){
			this.task[0]=tasks.sleep;

			// this.sprite.angle = 90;
			game.add.tween(this.sprite).to( { angle: 90 }, 300, "Linear", true);	

			this.sprite.anchor.setTo(0.5);
			this.sprite.x+=24;
			this.sprite.y+=24;

			game.time.events.add(310 * this.skills.forestry, function(){
				this.icon = game.add.sprite(this.sprite.x+40, this.sprite.y, 'sleep');
				this.icon.animations.add('sleeping');
	    		this.icon.animations.play('sleeping', 4, true);
	    		this.icon.anchor.setTo(0.5);
	    		this.icon.scale.setTo(0.5);
			}, this);

			
		}else{
			this.task[0]=tasks.sleep;

			// this.sprite.angle = 270;
			game.add.tween(this.sprite).to( { angle: -90 }, 300, "Linear", true);	

			this.sprite.anchor.setTo(0.5);
			this.sprite.x+=24;
			this.sprite.y+=24;

			game.time.events.add(310 * this.skills.forestry, function(){
				this.icon = game.add.sprite(this.sprite.x-40, this.sprite.y, 'sleep');
				this.icon.animations.add('sleeping');
	    		this.icon.animations.play('sleeping', 4, true);
	    		this.icon.anchor.setTo(0.5);
	    		this.icon.scale.setTo(0.5);
	    	}, this);
		}
	}
	
}
// Man.prototype.getHome = function(){
// 	this.task[0]=tasks.sleep;
// 	this.sprite.alpha=0;
// 	this.icon = game.add.sprite(this.house_pos.x*map_prop.tile_size, this.house_pos.y*map_prop.tile_size, 'sleep');

// 	this.icon.animations.add('sleeping');
//     this.icon.animations.play('sleeping', 4, true);
// }
Man.prototype.wakeUp = function(){
	if(this.items.house>0){
		this.sprite.alpha = 1;
		this.icon.destroy();
	}else{
		game.add.tween(this.sprite).to( { angle: 0 }, 300, "Linear", true);	
		this.sprite.angle = 0;
		this.icon.destroy();

		this.sprite.anchor.setTo(0);
			this.sprite.x-=24;
			this.sprite.y-=24;
	}
	
}
Man.prototype.goFishing = function(){

	this.path = [];
	this.path.length = 0;

	var ending_pos = this.find_target_position(map,this.pos_x,this.pos_y,2,3,3)
	this.gotopos = ending_pos;

	this.path = find_path(map,this.pos_y,this.pos_x,ending_pos.y,ending_pos.x,1);

	if(this.path!=0){
		if(job[ending_pos.y][ending_pos.x]==0){
		job[ending_pos.y][ending_pos.x]=1;

		this.pos_x = Math.floor(this.sprite.x/map_prop.tile_size);
		this.pos_y = Math.floor(this.sprite.y/map_prop.tile_size);

		this.use_path(this.pos_y,this.pos_x,ending_pos.y,ending_pos.x,false);
		
		}

		
	}else{
		jobs[this.gotopos.y][this.gotopos.x];
		globTasksTaken.getFish--;
		this.task[0]=tasks.idle;
		return;
	}

	
}
Man.prototype.doFishing = function(){
	this.icon = game.add.sprite(Math.floor(this.sprite.x/map_prop.tile_size*map_prop.tile_size)+12, Math.floor(this.sprite.y/map_prop.tile_size*map_prop.tile_size)+24, 'fishing');
	
	todo[this.gotopos.y][this.gotopos.x].started=true;

	// game.world.bringToTop(ui);
	// game.world.sendToBack(ground);

	todo[this.gotopos.y][this.gotopos.x].alpha=0;

	var fishingTime = rnd(7000,15000);
	var reps = rnd(2,4);

	game.time.events.add(fishingTime, function(){
		var r = rnd(1,2);
		this.items.fish+=r;
		all_res.fish+=r;
		txt_fish.text = all_res.fish;

		game.time.events.add(fishingTime, function(){
			var r = rnd(1,2);
			this.items.fish+=r;
			all_res.fish+=r;
			txt_fish.text = all_res.fish;

			if(reps>=3){

				game.time.events.add(fishingTime, function(){
					var r = rnd(1,2);
					this.items.fish+=r;
					all_res.fish+=r;
					txt_fish.text = all_res.fish;

					if(reps>=4){

						game.time.events.add(fishingTime, function(){
							var r = rnd(1,2);
							this.items.fish+=r;
							all_res.fish+=r;
							txt_fish.text = all_res.fish;

							job[this.gotopos.y][this.gotopos.x]=0;

							todo[this.gotopos.y][this.gotopos.x].destroy();
							todo[this.gotopos.y][this.gotopos.x]=0;

							if(globTasks.getFish>0){
								globTasks.getFish--;
							}
							globTasksTaken.getFish--;

							this.icon.kill();
							this.reached=false;
							this.task[0]=tasks.idle;
							return;

						}, this);

					}else{
						todo[this.gotopos.y][this.gotopos.x].destroy();

						if(globTasks.getFish>0){
							globTasks.getFish--;
							globTasksTaken.getFish--;
						}

						this.icon.kill();
						this.reached=false;
						this.task[0]=tasks.idle;
						return;
					}

				}, this);

			}else{
				todo[this.gotopos.y][this.gotopos.x].destroy();

				if(globTasks.getFish>0){
					globTasks.getFish--;
					globTasksTaken.getFish--;
				}

				this.icon.kill();
				this.reached=false;
				this.task[0]=tasks.idle;
				return;
			}

		}, this);
	}, this);
}