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
		}
	}

	for (i=0;i<height;i++) {
		for (j=0;j<width;j++) {

			if(gen_trees){
				var decision = rnd(0,20);

				if(decision == 0){
					//--------FOREST GENERATION--------------
					var tree_count = rnd(5,100);
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
						var rnd_bottom = rnd(0,2);

						var p = rinda.shift(); //Current water tile

						//North flow
						if(p.y > 0 && rnd_top==2 && map[p.y-1][p.x]==0){
							checked[p.y-1][p.x]=1;
							var c = {
								x : p.x,
								y : p.y-1
							};
							rinda.push(c);

							map[p.y-1][p.x]=1;
						}
						//East flow
						if(p.x < width-1 && rnd_right==2 && map[p.y][p.x+1]==0){
							checked[p.y][p.x+1]=1;
							var c = {
								x : p.x+1,
								y : p.y
							};
							rinda.push(c);
							
							map[p.y][p.x+1]=1;
						}
						//West flow
						if(p.x > 0 && rnd_left==2 && map[p.y][p.x-1]==0){
							checked[p.y][p.x-1]=1;
							var c = {
								x : p.x-1,
								y : p.y
							};
							rinda.push(c);
							
							map[p.y][p.x-1]=1;
						}
						//Down flow
						if(p.y < height-1 && rnd_bottom==2 && map[p.y+1][p.x]==0){
							checked[p.y+1][p.x]=1;
							var c = {
								x : p.x,
								y : p.y+1
							};
							rinda.push(c);
							
							map[p.y+1][p.x]=1;
						}
						tree_count--;
					}
					//---------------------------------------
				}
			}

			if(gen_water){
				var decision = rnd(0,200);

				if(decision == 0){
					waters++;
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
						var rnd_bottom = rnd(1,30);

						var p = rinda.shift(); //Current water tile

						//North flow
						if(p.y > 0 && rnd_top>10 && map[p.y-1][p.x]==0){
							checked[p.y-1][p.x]=1;
							var c = {
								x : p.x,
								y : p.y-1
							};
							rinda.push(c);

							map[p.y-1][p.x]=2;
						}
						//East flow
						if(p.x < width-1 && rnd_right>10 && map[p.y][p.x+1]==0){
							checked[p.y][p.x+1]=1;
							var c = {
								x : p.x+1,
								y : p.y
							};
							rinda.push(c);

							map[p.y][p.x+1]=2;
						}
						//West flow
						if(p.x > 0 && rnd_left>10 && map[p.y][p.x-1]==0){
							checked[p.y][p.x-1]=1;
							var c = {
								x : p.x-1,
								y : p.y
							};
							rinda.push(c);

							map[p.y][p.x-1]=2;
						}
						//Down flow
						if(p.y < height-1 && rnd_left>10 && map[p.y+1][p.x]==0){
							checked[p.y+1][p.x]=1;
							var c = {
								x : p.x,
								y : p.y+1
							};
							rinda.push(c);

							map[p.y+1][p.x]=2;
						}
						water_count--;
					}
					//---------------------------------------
				}
			}
		}
	}


	return map;
}


function rnd(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}