var goblin_tasks = {
	hunt : "Hunt people",
	idle : "Idle",
	goHome : "Go to the portal",
	destroy : "Destroy obstacles"
}

function Goblin() {

	this.sprite; //Storing the sprite
	this.icon; //Icon above head
	this.idletime=0;
	this.victim=0;
	this.victim_id=-1;
	this.reached=false;
	this.portal_pos = {
		x:-1,
		y:-1
	}

	this.pos_x = 0;
	this.pos_y = 0; //Y Position divided by tile size
	this.gotopos = { //Stores the current path's end point coords
		x : 0,
		y : 0
	}
	this.path; //Stores path
	
	this.speed = 5; //His speed

	this.health = 60;
	this.dead = false;
	this.power = rnd(5,6);
	this.needsToBeDestroyed=false;

	this.task; //Task
}

Goblin.prototype.use_path = function (y,x,y2,x2,complete){

	this.pos_x = Math.floor(this.sprite.x/map_prop.tile_size);
	this.pos_y = Math.floor(this.sprite.y/map_prop.tile_size);

	if(complete){
		if(this.victim_id>=0){
			if(this.task!=goblin_tasks.goHome && Math.floor(men[this.victim_id].sprite.x/48) != x2 && Math.floor(men[this.victim_id].sprite.y/48 != y2)){
				console.log("in");
				this.reached=true;
				this.searchForFlesh();
				return;
			}
		}

		if(y==y2 && x==x2)
	 	{	
	 		
	 		if(this.task==goblin_tasks.goHome){
	 			this.needsToBeDestroyed=true;
	 			destroyCreature(symbols_live.goblin);
	 			return;
	 		}else{
				if(Math.floor(men[this.victim_id].sprite.x/48) != x2 || Math.floor(men[this.victim_id].sprite.y/48) != y2){
					this.reached=true;
					this.searchForFlesh();
					return;
				}else{
					this.path = [];
			 		this.path.length = 0;
			 		// this.task[0]=goblin_tasks.idle;
			 		this.reached=true;

			 		this.fightMen();
		 			return;
				}
	 		}
	 		// 
	 		

 		}

 		if(!this.reached){

 			// 
	 		var ytmp = this.path[y][x].y;
	 		var xtmp = this.path[y][x].x;


	 		// if(2>1){
	 		if(map[ytmp][xtmp]==symbols.grass || map[ytmp][xtmp]==symbols.bridge || map[ytmp][xtmp]==symbols.floor){
		 		y = ytmp;
		 		x = xtmp;

		 		game.add.tween(this.sprite).to( { x: xtmp*map_prop.tile_size }, (this.speed*100)-30, "Linear", true);		
		 		game.add.tween(this.sprite).to( { y: ytmp*map_prop.tile_size }, (this.speed*100)-30, "Linear", true);

		 		game.time.events.add(this.speed*100, function(){
		 			this.use_path(y,x,y2,x2,complete);
		 		}, this);
		 	}else{
		 		this.reached=true;
				this.searchForFlesh();
		 	}
	 		
	 	}

	}else if(!complete){

	 	if((y+1 == y2 && x==x2)||(y-1 == y2 && x==x2)||(y == y2 && x+1 == x2)||(y == y2 && x-1 == x2))
	 	{
	 		console.log("reached");
	 		this.reached=false;
	 		this.path = [];
	 		this.path.length = 0;

	 		if(this.task == goblin_tasks.destroy){
	 			console.log("reached2");
	 			game.time.events.add(1500, function(){
	 				this.destroyTree(x2,y2);
			 	}, this);
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
		 	}
	 		
	 	}
	}
}

Goblin.prototype.find_target_position = function(grid, xs,ys,target,blocked){
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
			if(map[p.y][p.x]==target){

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

Goblin.prototype.destroyTree = function(x,y){
	var tree;
	for (var i = 0; i < trees.children.length; i++) {  
		var tree_x = Math.floor(trees.children[i].x/map_prop.tile_size);
		var tree_y = Math.floor(trees.children[i].y/map_prop.tile_size);

		if(tree_x == x && tree_y == y){
			tree = trees.children[i];
			break;
		}
	}

	map[y][x]=0;

	tree.destroy();
	this.searchForFlesh();
}

Goblin.prototype.goHome = function (){
	this.reached=false;
	this.path = [];
	this.path.length = 0;

	this.task=goblin_tasks.goHome;

	this.victim = 0;
	this.victim_id = -1;

	this.normalPos(this.sprite.x,this.sprite.y);

	this.path = find_path(map,this.pos_y,this.pos_x,this.portal_pos.y,this.portal_pos.x,1,null,true);

	if(this.path!=0){

		this.use_path(this.pos_y,this.pos_x,this.portal_pos.y,this.portal_pos.x,true);
	}
	
}

Goblin.prototype.fightMen = function() {
	if(this.victim_id>=0){

		if(!men[this.victim_id].dead){
			this.normalPos(this.sprite.x,this.sprite.y);
			// 
			// 

			if(this.pos_x == Math.floor(men[this.victim_id].sprite.x/48) && this.pos_y == Math.floor(men[this.victim_id].sprite.y/48)){

				var hitChance = rnd(0,100);

				if(hitChance>60){
					if(!men[this.victim_id].dead && men[this.victim_id].task[0]!=tasks.walk){

						game.camera.flash("0xBF2C2C");

						men[this.victim_id].health-=this.power;

						if(men[this.victim_id].health>0){
							game.time.events.add(2000, function(){
				 				this.fightMen();
				 			}, this);
						}else{
							men[this.victim_id].die();
							this.victim=0;
							this.victim_id=-1;
							checkGame();

							if(game_time.hours >=7 && game_time.hours <= 9){
								this.goHome();
							}else{
								game.time.events.add(1500, function(){
				 				this.searchForFlesh();
				 				}, this);
							}
						}
					
					}else{
						game.time.events.add(1500, function(){
				 			this.searchForFlesh();
				 		}, this);
					}
				}else{
					if(!this.dead && men[this.victim_id].task[0]!=tasks.walk){

						game.camera.flash("0x2CA33C");

						this.health-=men[this.victim_id].power;

						if(this.health>0){
							game.time.events.add(2000, function(){
				 				this.fightMen();
				 			}, this);
						}else{
							//He dies
							this.victim=0;
							this.victim_id=-1;
							this.needsToBeDestroyed=true;
							destroyCreature(symbols_live.goblin);
						
						}
					
					}else{
						game.time.events.add(1500, function(){
				 			this.searchForFlesh();
				 		}, this);
					}
				}

				
				
			}else{
				this.searchForFlesh();
			}
		}else{
			if(game_time.hours >=7 && game_time.hours <= 8){
				this.goHome();
			}else{
				this.victim_id = -1;
				this.victim = 0;
				this.searchForFlesh();
			}
		}

		
	}
}

Goblin.prototype.findObstacle = function(){
	this.path = [];
	this.path.length = 0;

	this.normalPos(this.sprite.x,this.sprite.y);

	//Find the nearest tree
	var ending_pos = this.find_target_position(map,this.pos_x,this.pos_y,symbols.tree,2);
	this.gotopos = ending_pos;

	this.path = find_path(map,this.pos_y,this.pos_x,ending_pos.y,ending_pos.x,1);

	if(this.path!=0){
		this.task = goblin_tasks.destroy;
		this.use_path(this.pos_y,this.pos_x,ending_pos.y,ending_pos.x,false);				
	}else{
		return;
	}
}

Goblin.prototype.searchForFlesh = function() {

	if(this.victim_id==-1){

		this.reached=false;
		this.path = [];
		this.path.length = 0;

		//Nearest victim finding
		var id=-1;
		var best=1000000;

		this.normalPos(this.sprite.x,this.sprite.y);

		for(var i=0;i<men.length;i++){
			var temp_diff_x = this.pos_x-Math.floor(men[i].sprite.x/48);
			if(temp_diff_x<0)temp_diff_x=temp_diff_x*(-1);

			var temp_diff_y = this.pos_y-Math.floor(men[i].sprite.y/48);
			if(temp_diff_y<0)temp_diff_y=temp_diff_y*(-1);

			

			if(temp_diff_x+temp_diff_y<best && !men[i].dead){
				best = temp_diff_x+temp_diff_y;
				id=i;
			}
				// 
		}

		


		// if(max<=0)no_victims=true;
		if(id>=0){
			this.victim = men[id];
			this.victim_id = id;
			var victim_pos = {
				x : Math.floor(this.victim.sprite.x/map_prop.tile_size),
				y : Math.floor(this.victim.sprite.y/map_prop.tile_size)
			}

			this.normalPos(this.sprite.x,this.sprite.y);

			this.path = find_path(map,this.pos_y,this.pos_x,victim_pos.y,victim_pos.x,1,null,true);

			if(this.path!=0){
				
				this.task = goblin_tasks.hunt;
				this.use_path(this.pos_y,this.pos_x,victim_pos.y,victim_pos.x,true);
			}else{
				this.findObstacle();
			}
		}
	}else{
		
		this.reached=false;
		this.path = [];
		this.path.length = 0;

		var victim_pos = {
			x : Math.floor(men[this.victim_id].sprite.x/map_prop.tile_size),
			y : Math.floor(men[this.victim_id].sprite.y/map_prop.tile_size)
		}
		this.path = find_path(map,this.pos_y,this.pos_x,victim_pos.y,victim_pos.x,1,null,true);
		
		if(this.path!=0){
			
			this.task = goblin_tasks.hunt;
			this.use_path(this.pos_y,this.pos_x,victim_pos.y,victim_pos.x,true);
		}else{
			this.findObstacle();
		}
	}
};

Goblin.prototype.normalPos = function(x,y) {
	this.pos_x = Math.floor(x/map_prop.tile_size),
	this.pos_y = Math.floor(y/map_prop.tile_size);
};