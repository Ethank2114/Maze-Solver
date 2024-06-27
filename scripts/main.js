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

	static iterate() {
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
	}
}

class Scene {
	constructor(canvas) {
		this.canvas = canvas;
		this.context = canvas.getContext("2d");
		this.map = null;
		this.tileSize = 1;
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
		this.mazeAlgorithm.current = this.map[0][0];
		this.mazeAlgorithm.current.visited = true;
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
	}, 0.01);

}

main();

