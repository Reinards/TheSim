//0-grass
//1-tree
//2-water
//3-house
//9-wall

function generate_map(width,height,gen_trees,gen_water){
	var map = new Array();

	for (i=0;i<height;i++) {
		map[i]=new Array();
		for (j=0;j<width;j++) {
			map[i][j]=0;

			if(gen_trees){
				var decision = rnd(0,15);

				if(decision == 0){
					//--------LAKE GENERATION--------------
					var tree_count = rnd(5,150);
					// var water_count = 5;

					map[i][j]=1;
						
					var checked = new Array();

					for (q=0;q<height;q++) {
						checked[q]=new Array();
						for (w=0;w<width;w++) {
							checked[q][w]=0;
						}
					}

					var starting = {
						x : j,
						y : i
					};

					var rinda = [];

					rinda.push(starting);
					checked[starting.y][starting.x] = 1;

					// for(var q = 0;q<water_count;q++){
					while(rinda.length > 0 && tree_count>0){
						var rnd_top = rnd(0,2);
						var rnd_right = rnd(0,2);
						var rnd_left = rnd(0,2);

						var p = rinda.shift(); //Current water tile

						if(p.x > 0 && p.x < width && p.y > 0 && p.y < height){
							//North flow
							if(rnd_top==2 && map[p.y-1][p.x]==0){
								checked[p.y-1][p.x]=1;
								var c = {
									x : p.x,
									y : p.y-1
								};
								rinda.push(c);

								map[p.y-1][p.x]=1;
							}
							//East flow
							if(rnd_right==2 && map[p.y][p.x+1]==0){
								checked[p.y][p.x+1]=1;
								var c = {
									x : p.x+1,
									y : p.y
								};
								rinda.push(c);

								map[p.y][p.x+1]=1;
							}
							//West flow
							if(rnd_left==2 && map[p.y][p.x-1]==0){
								checked[p.y][p.x-1]=1;
								var c = {
									x : p.x-1,
									y : p.y
								};
								rinda.push(c);

								map[p.y][p.x-1]=1;
							}
							// //South flow
							// if(rnd_bottom>7 && map[p.y+1][p.x]==0){
							// 	checked[p.y+1][p.x]=1;
							// 	var c = {
							// 		x : p.x,
							// 		y : p.y+1
							// 	};
							// 	rinda.push(c);

							// 	map[p.y+1][p.x]=2;
							// }

						   //  	if(rnd_right>10 && map[p.y][p.x+1]==0){
									// checked[p.y][p.x+1]=1;
							  //       var c = {
							  //           x : p.x+1,
							  //           y : p.y
							  //       };
							  //       rinda.push(c);

							  //       map[p.y][p.x+1];
						   //  	}
						}
						water_count--;
					}
					//---------------------------------------
				}
			}

			if(gen_water){
				var decision = rnd(0,200);

				if(decision == 0){

				//--------LAKE GENERATION--------------
					var water_count = rnd(5,30);
					// var water_count = 5;

					map[i][j]=2;
						
					var checked = new Array();

					for (q=0;q<height;q++) {
						checked[q]=new Array();
						for (w=0;w<width;w++) {
							checked[q][w]=0;
						}
					}

					var starting = {
						x : j,
						y : i
					};

					var rinda = [];

					rinda.push(starting);
					checked[starting.y][starting.x] = 1;

					// for(var q = 0;q<water_count;q++){
					while(rinda.length > 0 && water_count>0){
						var rnd_top = rnd(1,30);
						var rnd_right = rnd(1,30);
						var rnd_left = rnd(1,30);

						var p = rinda.shift(); //Current water tile

						if(p.x > 0 && p.x < width && p.y > 0 && p.y < height){
							//North flow
							if(rnd_top>10 && map[p.y-1][p.x]==0){
								checked[p.y-1][p.x]=1;
								var c = {
									x : p.x,
									y : p.y-1
								};
								rinda.push(c);

								map[p.y-1][p.x]=2;
							}
							//East flow
							if(rnd_right>10 && map[p.y][p.x+1]==0){
								checked[p.y][p.x+1]=1;
								var c = {
									x : p.x+1,
									y : p.y
								};
								rinda.push(c);

								map[p.y][p.x+1]=2;
							}
							//West flow
							if(rnd_left>10 && map[p.y][p.x-1]==0){
								checked[p.y][p.x-1]=1;
								var c = {
									x : p.x-1,
									y : p.y
								};
								rinda.push(c);

								map[p.y][p.x-1]=2;
							}
							// //South flow
							// if(rnd_bottom>7 && map[p.y+1][p.x]==0){
							// 	checked[p.y+1][p.x]=1;
							// 	var c = {
							// 		x : p.x,
							// 		y : p.y+1
							// 	};
							// 	rinda.push(c);

							// 	map[p.y+1][p.x]=2;
							// }

						   //  	if(rnd_right>10 && map[p.y][p.x+1]==0){
									// checked[p.y][p.x+1]=1;
							  //       var c = {
							  //           x : p.x+1,
							  //           y : p.y
							  //       };
							  //       rinda.push(c);

							  //       map[p.y][p.x+1];
						   //  	}
						}
						water_count--;
					}
					//---------------------------------------
				}
			}
		}
	}

	// for(var i=0;i<trees;i++){
	// 	var decision = rnd(1,6);

	// 	if(decision >= 3){
	// 		var coords = gen_rnd_pos(width,height,map);

	// 		console.log("After | "+i);
	// 		console.log(coords);
	// 		if(coords.x >= 0 && coords.y >= 0)
	// 			map[coords.y][coords.x]=1;
	// 	}
	// }

	return map;
}

// function gen_rnd_pos(w,h,map){

// 	var temp_map = map;

// 	var temp_x = rnd(0,9);
// 	var temp_y = rnd(0,9);


// 	if(temp_map[temp_y][temp_x]==0){
// 		var coords = {
// 			x : 0,
// 			y : 0
// 		};

// 		if(temp_x >= 0 && temp_y >=0){
// 			coords.x = temp_x;
// 			coords.y = temp_y;
// 		}

// 		console.log("Before");
// 		console.log(coords);
		
// 		return coords;

// 	}else{
// 		gen_rnd_pos(w,h,temp_map);
// 	}

// }

function rnd(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}
