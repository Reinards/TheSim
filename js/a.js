var reached=false;


function find_path(grid, ye, xe, ys, xs, blocked,special,blueprints){

	//Clone map

	var map = grid;
	var map_height = map.length;
	var map_width = map[0].length;

	var path_exists = false;

	//Make path array and checked array

	var route = new Array();
	var checked = new Array();

	for (i=0;i<map_height;i++) {
	 route[i]=new Array();
	 checked[i]=new Array();
	 for (j=0;j<map_width;j++) {
	  route[i][j]={x:0,y:0};
	  checked[i][j]=0;
	 }
	}

	// console.log(checked);

	//Set starting and ending coords

	var starting = {
		x : xs,
		y : ys
	};

	var ending = {
		x : xe,
		y : ye
	};

	// console.log(starting);
	
	//Create queue

	var rinda = [];
	var prev_p;

	rinda.push(starting);
	checked[starting.y][starting.x] = 1;


	route[starting.y][starting.x].x = starting.x;
	route[starting.y][starting.x].y = starting.y;

	while(rinda.length > 0){

		
		// Current node
		var p = rinda.shift();
		prev_p = p;
		
		// console.log(p.x + " " + p.y);
		
	    //Found result
	    if(p===undefined){
			ending.x = prev_p.x;
			ending.y = prev_p.y;
			// console.log("Result");
			path_exists=true;
			break;
		} else if(p.x==ending.x && p.y==ending.y){
			// console.log("Result");
			path_exists=true;
			break;
		}	

		if(blueprints){
			//Check north
		    if(p.y > 0){
			    if(checked[p.y-1][p.x]==0 && (map[p.y-1][p.x]<blocked || map[p.y-1][p.x]==special)){
			        checked[p.y-1][p.x]=1;
			        var c = {
			            x : p.x,
			            y : p.y-1
			        };
			        rinda.push(c);      

			        route[p.y-1][p.x].x = p.x;
		            route[p.y-1][p.x].y = p.y;
			    }
			}
			//Check east
		    if(p.x < map_width){
		    	if(checked[p.y][p.x+1]==0 && (map[p.y][p.x+1]<blocked || map[p.y][p.x+1]==special)){
		    		checked[p.y][p.x+1]=1;
			        var c = {
			            x : p.x+1,
			            y : p.y
			        };
			        rinda.push(c);

			        route[p.y][p.x+1].x = p.x;
		            route[p.y][p.x+1].y = p.y;
		    	}
		    }
		    //Check south
		    if(p.y < map_height-1){
		    	if(checked[p.y+1][p.x]==0 && (map[p.y+1][p.x]<blocked || map[p.y+1][p.x]==special)){
		    		checked[p.y+1][p.x]=1;
		    		var c = {
			            x : p.x,
			            y : p.y+1
			        };
			        rinda.push(c);

			        route[p.y+1][p.x].x = p.x;
		            route[p.y+1][p.x].y = p.y;
		    	}
		    }
		    // //Check west
		    if(p.x > 0){
		    	if(checked[p.y][p.x-1]==0 && (map[p.y][p.x-1]<blocked || map[p.y][p.x-1]==special)){
		    		checked[p.y][p.x-1]=1;
		    		var c = {
		    			x : p.x-1,
		    			y : p.y
		    		};
		    		rinda.push(c);

		    		route[p.y][p.x-1].x = p.x;
		    		route[p.y][p.x-1].y = p.y;
		    	}
		    }
		}else{
			//Check north
		    if(p.y > 0){
			    if(checked[p.y-1][p.x]==0 && (map[p.y-1][p.x]<blocked || map[p.y-1][p.x]==special) && map[p.y-1][p.x]!=symbols.blueprint){
			        checked[p.y-1][p.x]=1;
			        var c = {
			            x : p.x,
			            y : p.y-1
			        };
			        rinda.push(c);      

			        route[p.y-1][p.x].x = p.x;
		            route[p.y-1][p.x].y = p.y;
			    }
			}
			//Check east
		    if(p.x < map_width){
		    	if(checked[p.y][p.x+1]==0 && (map[p.y][p.x+1]<blocked || map[p.y][p.x+1]==special) && map[p.y][p.x+1]!=symbols.blueprint){
		    		checked[p.y][p.x+1]=1;
			        var c = {
			            x : p.x+1,
			            y : p.y
			        };
			        rinda.push(c);

			        route[p.y][p.x+1].x = p.x;
		            route[p.y][p.x+1].y = p.y;
		    	}
		    }
		    //Check south
		    if(p.y < map_height-1){
		    	if(checked[p.y+1][p.x]==0 && (map[p.y+1][p.x]<blocked || map[p.y+1][p.x]==special) && map[p.y+1][p.x]!=symbols.blueprint){
		    		checked[p.y+1][p.x]=1;
		    		var c = {
			            x : p.x,
			            y : p.y+1
			        };
			        rinda.push(c);

			        route[p.y+1][p.x].x = p.x;
		            route[p.y+1][p.x].y = p.y;
		    	}
		    }
		    // //Check west
		    if(p.x > 0){
		    	if(checked[p.y][p.x-1]==0 && (map[p.y][p.x-1]<blocked || map[p.y][p.x-1]==special) && map[p.y][p.x-1]!=symbols.blueprint){
		    		checked[p.y][p.x-1]=1;
		    		var c = {
		    			x : p.x-1,
		    			y : p.y
		    		};
		    		rinda.push(c);

		    		route[p.y][p.x-1].x = p.x;
		    		route[p.y][p.x-1].y = p.y;
		    	}
		    }
		}
	    //See filled nodes

		// s.scale.setTo(0.5);

	}

	if(!path_exists){
		return 0;
	}else{
		return route;
	}
	
}


function find_target_position(grid, xs,ys,target,blocked){
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
		if(map[p.y][p.x]==target){

			target_pos.x = prev_p.x;
			target_pos.y = prev_p.y;

			target_exists=true;
			break;
		}	


		//Check north
	    if(p.y > 0){
		    if(checked[p.y-1][p.x]==0 && map[p.x-1][p.y]<blocked){
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
}

// function use_path(x,y,x2,y2){
//  	if(x==x2 && y==y2){
//  		return;
//  	}
//  	if(!reached){
//  		var xtmp = x, ytmp = y;
//  		ytmp = r[x][y].y;
//  		xtmp = r[x][y].x;
 		
//  		y = ytmp;
//  		x = xtmp;
		
// 		game.add.tween(me).to( { x: y*20 }, 200, "Linear", true);		
// 		game.add.tween(me).to( { y: x*20 }, 200, "Linear", true);

// 		// me.x = y*20;
//  		// me.y = x*20;
//  	}
//  	game.time.events.add(200, function(){
//  		use_path(x,y,x2,y2);
//  	}, this);
	
// }
