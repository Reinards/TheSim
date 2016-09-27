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
		wood : 0
	};

	this.task = []; //Task
}

Man.prototype.use_path = function (y,x,y2,x2,complete){

	this.pos_x = Math.floor(this.sprite.x/map_prop.tile_size);
	this.pos_y = Math.floor(this.sprite.y/map_prop.tile_size);


	if(typeof todo[this.gotopos.y][this.gotopos.x].action =='undefined'){
		this.path.length = 0;
		job[this.gotopos.y][this.gotopos.x]=0;
		if(this.task[0]==tasks[1])
			globTasksTaken.getWood--;
		this.task[0]=tasks[0];
		return;
	}

	// console.log(this.reached);
	if(complete){
		if(x==x2 && y==y2){
			// this.reached=true;
			this.path.length = 0;

			if(this.task == tasks[1]){
				if(map[y][x]==1){
					this.cutTree();
				}else{
					this.getResources();
				}
			}
			if(this.task == tasks[2]){
				this.doBuilding();
	 			// this.items.wood -= materials_needed[0];
	 			// all_res-=materials_needed[0];
	 		}
	 		return;
	 	}

	 	if(!this.reached){
	 		var xtmp = x, ytmp = y;
	 		ytmp = this.path[y][x].y;
	 		xtmp = this.path[y][x].x;

	 		
	 		y = ytmp;
	 		x = xtmp;

	 		game.add.tween(this.sprite).to( { x: xtmp*map_prop.tile_size }, (this.speed*100)-30, "Linear", true);		
	 		game.add.tween(this.sprite).to( { y: ytmp*map_prop.tile_size }, (this.speed*100)-30, "Linear", true);

			// this.sprite.x = x*20;
	 		// this.sprite.y = y*20;
	 		game.time.events.add(this.speed*100, function(){
	 			this.use_path(y,x,y2,x2,complete);
	 		}, this);
	 	}

	}else{
	// console.log(y+"/"+y2+" | "+x+"/"+x2);
	 	if((y+1 == y2 && x==x2)||(y-1 == y2 && x==x2)||(y == y2 && x+1 == x2)||(y == y2 && x-1==x2)){

	 		// this.reached=true;
	 		this.path.length = 0;

	 		if(this.task[0] == tasks[1]){
	 			if(map[this.gotopos.y][this.gotopos.x]==1){
	 				this.cutTree();
	 			}else{
	 				this.getResources();
	 			}
	 		}
	 		if(this.task[0] == tasks[2]){
	 			this.doBuilding();
 			}
 			if(this.task[0] == tasks[3]){
	 			this.getHome();
 			}
 			if(this.task[0] == tasks[5]){
	 			this.doFishing();
 			}
 			return;
 		}

	 	 if(!this.reached){

	 		var xtmp = x, ytmp = y;
	 		// if(this.task[0]==tasks[3]){
	 		// 	console.log(xtmp+" "+ytmp);
	 		// }
	 		ytmp = this.path[y][x].y;
	 		xtmp = this.path[y][x].x;

	 		// console.log(xtmp+" "+ytmp);
	 		
	 		y = ytmp;
	 		x = xtmp;

	 		game.add.tween(this.sprite).to( { x: xtmp*map_prop.tile_size }, (this.speed*100)-30, "Linear", true);		
	 		game.add.tween(this.sprite).to( { y: ytmp*map_prop.tile_size }, (this.speed*100)-30, "Linear", true);

			// this.sprite.x = x*20;
	 		// this.sprite.y = y*20;
	 		game.time.events.add(this.speed*100, function(){
	 			this.use_path(y,x,y2,x2,complete);
	 		}, this);
	 	}
 }

};

Man.prototype.getResources = function (){
	// console.log("get");

	this.pos_x = Math.floor(this.sprite.x/map_prop.tile_size);
	this.pos_y = Math.floor(this.sprite.y/map_prop.tile_size);

	//Find the nearest tree
	var ending_pos = this.find_target_position(map,this.pos_x,this.pos_y,1,2);
	this.gotopos = ending_pos;

	this.path = find_path(map,this.pos_y,this.pos_x,ending_pos.y,ending_pos.x,1);

	if(this.path!=0){
		if(job[this.gotopos.y][this.gotopos.x]==0){
			job[ending_pos.y][ending_pos.x]=1;
			//Find if there is a path to that tree
			
			this.use_path(this.pos_y,this.pos_x,ending_pos.y,ending_pos.x,false);
			
		}

			
	}else{
			// job[ending_pos.y][ending_pos.x]=0;
			globTasksTaken.getWood--;
			this.task[0]=tasks[0];
			return;
	}

	
};

Man.prototype.cutTree = function (){
		// this.pos_x = Math.floor(this.sprite.x/map_prop.tile_size);
		// this.pos_y = Math.floor(this.sprite.y/map_prop.tile_size);
		// this.pos_x = this.gotopos.x;
		// this.pos_y = this.gotopos.y;


		this.icon = game.add.sprite(this.gotopos.x*map_prop.tile_size+map_prop.tile_size/4, this.gotopos.y*map_prop.tile_size+map_prop.tile_size/4, 'working');
		
		game.world.bringToTop(ui);
		game.world.sendToBack(ground);

		game.time.events.add(Phaser.Timer.SECOND * this.skills.forestry, function(){
			this.icon.kill();

			this.destroy_tree(this.gotopos.x,this.gotopos.y);
			todo[this.gotopos.y][this.gotopos.x].destroy();
			if(globTasks.wood>0){
				globTasks.getWood--;
				globTasksTaken.getWood--;
			}
			
			this.reached=false;
			this.task[0]=tasks[0];
		}, this);
};

Man.prototype.find_target_position = function(grid, xs,ys,target,blocked){
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
			if(map[p.y][p.x]==target && job[p.y][p.x]==0 && todo[p.y][p.x].action==1){

				target_pos.x = p.x;
				target_pos.y = p.y;

				// console.log(target_pos.y);

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
	    // var s = game.add.sprite(p.y*20, p.x*20, 'wall');
		// s.scale.setTo(0.5);

	}

		if(!target_exists){
			return 0;
		}else{
			return target_pos;
		}
};
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
};
Man.prototype.buildHouse = function(){
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

		// if(spot_y > 0 && spot_y < map_prop.height && spot_x > 0 && spot_x < map_prop.width){
		// 	if(map[spot_y-1][spot_x]==0){
		// 			this.house_pos.x = spot_x;
		// 			this.house_pos.y = spot_y-1;
		// 			this.buildHouse();
		// 	}else if(map[spot_y][spot_x+1]==0){
		// 			this.house_pos.x = spot_x+1;
		// 			this.house_pos.y = spot_y;
		// 			this.buildHouse();
		// 	}else if(map[spot_y+1][spot_x]==0){
		// 			this.house_pos.x = spot_x;
		// 			this.house_pos.y = spot_y+1;
		// 			this.buildHouse();
		// 	}else if(map[spot_y][spot_x-1]==0){
		// 			this.house_pos.x = spot_x-1;
		// 			this.house_pos.y = spot_y;
		// 			this.buildHouse();
		// 	}else if(ma[spot_y][spot_x]==0){
		// 		this.house_pos.x = spot_x;
		// 		this.house_pos.y = spot_y;
		// 		this.buildHouse();
		// 	}
		// }
	}
};
Man.prototype.doBuilding = function(){
	this.blueprint.destroy();
	this.blueprint = game.add.sprite(this.house_pos.x*map_prop.tile_size, this.house_pos.y*map_prop.tile_size, 'build');
	this.blueprint.animations.add('build');
	this.blueprint.animations.play('build', this.skills.building/3, false);


	this.blueprint.animations.currentAnim.onComplete.add(function () {

		this.blueprint.destroy();

		map[this.house_pos.y][this.house_pos.x]=3;

		this.name_txt = game.add.text(this.house_pos.x*map_prop.tile_size+24, this.house_pos.y*map_prop.tile_size+48, this.name, style_name);
		this.name_txt.anchor.setTo(0.5,0);

		this.items.house = 1;
		this.task[0]=tasks[0];
	 	this.house_sprite = game.add.sprite(this.house_pos.x*map_prop.tile_size, this.house_pos.y*map_prop.tile_size, 'house');
	 	this.house_sprite.scale.setTo(2);

	 	game.world.bringToTop(ui);
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
			this.task[0]=tasks[4];

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
			this.task[0]=tasks[4];

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
Man.prototype.getHome = function(){
	this.task[0]=tasks[4];
	this.sprite.alpha=0;
	this.icon = game.add.sprite(this.house_pos.x*map_prop.tile_size, this.house_pos.y*map_prop.tile_size, 'sleep');

	this.icon.animations.add('sleeping');
    this.icon.animations.play('sleeping', 4, true);
}
Man.prototype.wakeUp = function(){
	if(this.items.house>0){
		this.sprite.alpha = 1;
		this.icon.destroy();
	}else{
		game.add.tween(this.sprite).to( { angle: 0 }, 300, "Linear", true);	
		this.sprite.angle = 0;
		this.icon.destroy();
	}
	
}
Man.prototype.goFishing = function(){
	var ending_pos = this.find_target_position(map,this.pos_x,this.pos_y,2,3)
	this.gotopos = ending_pos;

	if(job[ending_pos.y][ending_pos.x]==0){
		job[ending_pos.y][ending_pos.x]=1;

		this.pos_x = Math.floor(this.sprite.x/map_prop.tile_size);
		this.pos_y = Math.floor(this.sprite.y/map_prop.tile_size);

		//Find if there is a path to that tree
		this.path = find_path(map,this.pos_y,this.pos_x,ending_pos.y,ending_pos.x,1,2);
		
		if(this.path!=0){
			//Go to that tree

			this.use_path(this.pos_y,this.pos_x,ending_pos.y,ending_pos.x,false);
		}
	}else{
		game.time.events.add(Phaser.Timer.SECOND*2, function(){
			//Try again later
			this.goFishing();
		}, this);
	}
}
Man.prototype.doFishing = function(){
	this.icon = game.add.sprite(Math.floor(this.sprite.x/map_prop.tile_size*map_prop.tile_size)+12, Math.floor(this.sprite.y/map_prop.tile_size*map_prop.tile_size)+24, 'fishing');
		
	game.world.bringToTop(ui);
	game.world.sendToBack(ground);
}