function drawRect({context, x, y, width, height, color="white"}) {
	context.fillStyle = color;
	context.fillRect(x, y, width, height);
}

function randInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function randElement(list) {
// 	return list[Math.floor(Math.random()*list.length)];
// }

function shuffle(array) {
   return array.sort( () => Math.random() - 0.5 );
}

function randUnvistedNode(list) {
	let nodeList = shuffle(list);

	for(let node of nodeList) {
		if(node.visited === false) {
			return node;
		}
	}
	return null;
}

function remove(item, list) {
	let index = list.indexOf(item);
	list.slice(index, 1);
}

function mixColor(oldColor, strength = 1) {

	if(strength < 1) {
		let percent = Math.ceil(strength * 100);
		// console.log("percent", percent)
		if(randInt(0, 100) > percent) {
			return oldColor
		}
		strength = 1;
	}

	let rgb = oldColor.replace(/[^\d,]/g, '').split(',');
	let shift = randInt(-1 * strength, strength);
	let part = randInt(0, 2);

	rgb[part] = parseInt(rgb[part]) + shift;

	if(rgb[part] > 255 || rgb[part] < 0) {
		rgb[part] += shift * -2;
	}

	rgb[part] = rgb[part].toString();

	return "rgb(" + rgb[0].toString() + ", "+ rgb[1].toString() + ", " + rgb[2].toString() + ")";
}

class Stack {
	constructor() {
		this.contents = []
	}

	push(item) {
		this.contents.push(item);
	}

	pop() {
		return this.contents.pop();
	}

	length() {
		return this.contents.length;
	}
}

class MazeAlgorithm {
	constructor(map, startNode) {
		this.map = map;
		this.startNode = startNode;
	}

}

class Backtracking extends MazeAlgorithm {
	static map;
	static current;

	static stack = new Stack();
	constructor(map, startNode) {
		super(map, startNode);
	}

	static iterate(scene) {
		/*
	
		select random unvisited node
		create path between nodes 
		mark as visited
		add current to stack

		if no unvisted left
			pull from stack until finds node with unvisited neighbours

		*/

		let next = randUnvistedNode(this.current.neighbours);

		if(next === null) {
			while(this.stack.length() > 0) {
				let possibleCurrent = this.stack.pop()
				let possibleNext = randUnvistedNode(possibleCurrent.neighbours);
				if(possibleNext !== null) {
					this.current = possibleCurrent;
					next = possibleNext;
					break;
				}
			}
		}

		if(next === null) {
			return false;
		}

		// mark new node as visited
		next.visited = true;

		// create path between nodes
		this.current.edges.push(next);
		next.edges.push(this.current);

		// add current to stack
		this.stack.push(this.current)
		
		// next.color = mixColor(this.current.color, 5);

		this.current.draw(scene.context, scene.tileSize);
		this.current.drawEdges(scene.context, scene.tileSize);

		

		this.current = next;

		return true;
	}
}

class Node {
	constructor(x, y) {
		this.neighbours = [];
		this.x = x;
		this.y = y;
		this.visited = false;
		this.edges = [];
		this.color = "white";
	}

	draw(context, tileSize) {
		drawRect({
			context: context, 
			x: (2 * this.x + 1) * tileSize, 
			y: (2 * this.y + 1) * tileSize, 
			width: tileSize, 
			height: tileSize,
			color: this.color
		});
	}

	drawEdges(context, tileSize) {
		for(let edge of this.edges) {
			drawRect({
				context: context, 
				x: (this.x + edge.x + 1) * tileSize, 
				y: (this.y + edge.y + 1) * tileSize, 
				width: tileSize, 
				height: tileSize,
				color: edge.color
			});
			edge.draw(context, tileSize);
		}
	}
}

var TILE_SIZE = 20;
var REFRESH_RATE = 5;
var SPEED = 1;

class Scene {
	constructor(canvas) {
		this.canvas = canvas;
		this.context = canvas.getContext("2d");
		this.map = null;
		this.tileSize = TILE_SIZE;
		this.mazeAlgorithm = null;

		this.populateMap();
	}

	populateMap() {

		// temp canvas resizing code
		if(this.canvas.width % this.tileSize === 0) {
			this.canvas.width += this.tileSize;
		}
		if(this.canvas.height % this.tileSize === 0) {
			this.canvas.height += this.tileSize;
		}

		let width = ((this.canvas.width / this.tileSize) - 1) / 2;
		let height = ((this.canvas.height / this.tileSize) - 1) / 2;
		this.map = [];
		for(let i = 0; i < width; i++) {
			this.map.push([]);
			for(let j = 0; j < height; j++) {
				this.map[i].push(new Node(i, j));
			}
		}
		for(let i = 0; i < width; i++) {
			for(let j = 0; j < height; j++) {
				if(i !== 0) {
					this.map[i][j].neighbours.push(this.map[i - 1][j]);
				}
				if(j !== 0) {
					this.map[i][j].neighbours.push(this.map[i][j - 1]);
				}
				if(i !== width - 1) {
					this.map[i][j].neighbours.push(this.map[i + 1][j]);
				}
				if(j !== height - 1) {
					this.map[i][j].neighbours.push(this.map[i][j + 1]);
				}
			}
		}
	}

	drawMap() {
		for(let row of this.map) {
			for(let node of row) {
				if(node.visited) {
					drawRect({
						context: this.context, 
						x: (2 * node.x + 1) * this.tileSize, 
						y: (2 * node.y + 1) * this.tileSize, 
						width: this.tileSize, 
						height: this.tileSize
					});
				}
				
				for(let edge of node.edges) {
					drawRect({
						context: this.context, 
						x: (node.x + edge.x + 1) * this.tileSize, 
						y: (node.y + edge.y + 1) * this.tileSize, 
						width: this.tileSize, 
						height: this.tileSize
					});
				}
			}
		}
	}

	setAlgorithm(algo) {
		this.mazeAlgorithm = algo;
		this.mazeAlgorithm.map = this.map;
		this.mazeAlgorithm.current = this.map[0][0];
		this.mazeAlgorithm.current.visited = true;
		// this.mazeAlgorithm.current.color = "rgb(66, 220, 200)";
	}

	iterate() {
		this.mazeAlgorithm.iterate(this);
	}
}

function main() {
	let canvas = document.getElementById("canvas");
	let theScene = new Scene(canvas);

	console.log(theScene.map);

	theScene.setAlgorithm(Backtracking);

	let ptr = setInterval(function() {
		for(let i = 0; i < SPEED; i++) {
			theScene.iterate();
		}
		
	}, REFRESH_RATE);

}

main();

