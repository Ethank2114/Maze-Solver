function drawRect({context, x, y, width, height, color="white"}) {
	context.fillStyle = color;
	context.fillRect(x, y, width, height);
}

function drawLine({context, x1, y1, x2, y2, p1=undefined, p2=undefined, width=1, color="Black"}) {
	context.lineWidth = width;

	context.beginPath();
	// by points
	if(p1 !== undefined && p2 !== undefined) {
		context.moveTo(p1.x, p1.y);
		context.lineTo(p2.x, p2.y);
	// by x1, y1
	} else {
		context.moveTo(x1, y1);
		context.lineTo(x2, y2);
	}
	
	context.strokeStyle = color;
	context.stroke();
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
	contents;

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

class SolverAlgorithm {}

class DepthFirst extends SolverAlgorithm {
	static start;
	static end;
	static current;
	
	static stack;

	static path = [];

	static constructor(start, end) {
		this.start = start;
		this.end = end;
		this.stack = new Stack();

		this.current = this.start;
		this.stack.push(this.current);
	}

	static iterate(scene) {
		/*
		start at the current
		pop the last from stack
		check for match, if found return
		add edges to stack
		repeat until match or stack empty
		*/

		if(this.current === this.end) {
			this.stack.push(this.current);
			return this.stack.contents;
		}

		let next = randUnvistedNode(this.current.edges);

		if(next === null) {
			while(this.stack.length() > 0) {
				let possibleCurrent = this.stack.pop()
				let possibleNext = randUnvistedNode(possibleCurrent.edges);
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
		
		next.color = mixColor(this.current.color, COLORVARIENCE);

		this.current.draw(scene.context, scene.tileSize);
		this.current.drawEdges(scene.context, scene.tileSize);

		this.current = next;

		return true;

	}
}

class MazeAlgorithm {}

class Backtracking extends MazeAlgorithm {

	static current;
	static stack;

	static constructor(root) {
		this.root = root;
		this.current = this.root;
		this.stack = new Stack();
		this.current.visited = true;
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

	getUnvistedEdges() {
		return this.edges.filter(function(node) {
			return !node.visited;
		});
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

var TILE_SIZE = 10;
var REFRESH_RATE = 1;
var SPEED = 1;
var COLORVARIENCE = 5;

class Scene {
	constructor(canvas) {
		this.canvas = canvas;
		this.context = canvas.getContext("2d");
		this.map = null;
		this.tileSize = TILE_SIZE;
		this.mazeAlgorithm = null;
		this.solverAlgorithm = null;

		this.solution;

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

	clearVisited() {
		for(let row of this.map) {
			for(let node of row) {
				node.visited = false;
			}
		}
	}

	setMaze(algo) {
		this.mazeAlgorithm = algo;
		let middle = Math.floor(this.map.length / 2);
		// let start = this.map[0][0];
		let start = this.map[middle][middle];
		this.mazeAlgorithm.constructor(start);
	}

	setSolver(algo) {
		this.solverAlgorithm = algo;
		let start = this.map[0][0];
		let end = this.map[this.map.length - 1][this.map[0].length - 1];
		this.solverAlgorithm.constructor(start, end);
		this.solverAlgorithm.current.color = "rgb(66, 220, 200)";

	}

	setSolution(solution) {
		this.solution = solution;
	}

	iterateMaze() {
		return this.mazeAlgorithm.iterate(this);
	}

	iterateSolver() {
		return this.solverAlgorithm.iterate(this);
	}

	drawSolution() {
		for(let i = 0; i < this.solution.length - 1; i++) {

			let p1 = {
				x: (2 * this.solution[i].x + (3/2)) * this.tileSize, 
				y: (2 * this.solution[i].y + (3/2)) * this.tileSize
			};
			let p2 = {
				x: (2 * this.solution[i + 1].x + (3/2)) * this.tileSize, 
				y: (2 * this.solution[i + 1].y + (3/2)) * this.tileSize
			};

			drawLine({
				context: this.context,
				p1: p1,
				p2: p2,
				color: "red",
				width: 2
			})
		}	
	}
}

function main() {
	let canvas = document.getElementById("canvas");
	let theScene = new Scene(canvas);

	theScene.setMaze(Backtracking);
	theScene.setSolver(DepthFirst);

	var ptr = setInterval(function() {
		for(let i = 0; i < SPEED; i++) {
			if(!theScene.iterateMaze()) {
				done1();
			}
		}
		
	}, REFRESH_RATE);

	function done1() {
		clearInterval(ptr);

		theScene.clearVisited();

		ptr = setInterval(function() {
			for(let i = 0; i < SPEED; i++) {

				let ret = theScene.iterateSolver();

				if(ret !== true && ret !== false) {
					done2();
					theScene.setSolution(ret);
					theScene.drawSolution();
				}
			}
			
		}, REFRESH_RATE);
	}

	function done2() {
		clearInterval(ptr);

	}
}

main();

