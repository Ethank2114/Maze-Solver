function drawRect({context, x, y, width, height, color="white"}) {
	context.fillStyle = color;
	context.fillRect(x, y, width, height);
}

function randInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randElement(list) {
	return list[Math.floor(Math.random()*list.length)];
}

function remove(item, list) {
	let index = list.indexOf(item);
	list.slice(index, 1);
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
}

class MazeAlgorithm {
	constructor(map, startNode) {
		this.map = map;
		this.startNode = startNode;
	}

}

class Backtracking extends MazeAlgorithm {
	static map;
	static currentNode;

	static stack = new Stack();
	constructor(map, startNode) {
		super(map, startNode);
	}

	static iterate() {

		let nextNode = randElement(this.currentNode.neighbours);
		this.currentNode.visited = true;

		console.dir(nextNode)

		// if node is unvisited
		if(!nextNode.visited) {
			for(let node of this.currentNode.neighbours) {
				if(!node.visited) {
					this.stack.push(node);
				}
			}

			remove(nextNode, this.currentNode.neighbours);
			remove(this.currentNode, nextNode.neighbours);

			this.currentNode.edges.push(nextNode);
			nextNode.edges.push(this.currentNode);

			this.currentNode = nextNode;

		// node is visited
		} else {
			this.currentNode = this.stack.pop();
		}

		if(this.currentNode === undefined) {
			return false;
		}

		console.log(this.currentNode.neighbours);
		console.log(nextNode);
	}
}

class Node {
	constructor(x, y) {
		this.neighbours = [];
		this.x = x;
		this.y = y;
		this.visited = false;
		this.edges = [];
	}
}

class Scene {
	constructor(canvas) {
		this.canvas = canvas;
		this.context = canvas.getContext("2d");
		this.map = null;
		this.tileSize = 20;
		this.mazeAlgorithm = null;

		this.populateMap();
	}

	populateMap() {
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
		this.mazeAlgorithm.currentNode = this.map[0][0];
	}

	iterate() {
		this.mazeAlgorithm.iterate();
	}
}

function main() {
	let canvas = document.getElementById("canvas");
	let theScene = new Scene(canvas);

	console.log(theScene.map);

	theScene.setAlgorithm(Backtracking);

	setInterval(function() {
		theScene.iterate();
		theScene.drawMap();
	}, 1000);

}

main();

