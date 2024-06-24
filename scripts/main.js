function drawRect({context, x, y, width, height, color="white"}) {
	context.fillStyle = color;
	context.fillRect(x, y, width, height);
}

function randInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

class MazeAlgorithm {
	constructor(map, startNode) {
		this.map = map;
		this.startNode = startNode;
	}

	step() {

	}

}

class Backtracking extends MazeAlgorithm {
	constructor(map, startNode) {
		super(map, startNode);
	}
}

class Node {
	constructor(x, y) {
		this.neighbours = [];
		this.x = x;
		this.y = y;
	}
}

class Scene {
	constructor(canvas) {
		this.canvas = canvas;
		this.context = canvas.getContext("2d");
		this.map = null;
		this.tileSize = 20;
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
				let rand = randInt(0, 3);
				if(i !== 0 && rand == 0) {
					this.map[i][j].neighbours.push(this.map[i - 1][j]);
				}
				if(j !== 0 && rand == 1) {
					this.map[i][j].neighbours.push(this.map[i][j - 1]);
				}
				if(i !== width - 1 && rand == 2) {
					this.map[i][j].neighbours.push(this.map[i + 1][j]);
				}
				if(j !== height - 1 && rand == 3) {
					this.map[i][j].neighbours.push(this.map[i][j + 1]);
				}
			}
		}
	}

	drawMap() {
		for(let row of this.map) {
			for(let node of row) {
				drawRect({
					context: this.context, 
					x: (2 * node.x + 1) * this.tileSize, 
					y: (2 * node.y + 1) * this.tileSize, 
					width: this.tileSize, 
					height: this.tileSize
				});
				for(let neighbour of node.neighbours) {;

					

					drawRect({
						context: this.context, 
						x: (node.x + neighbour.x + 1) * this.tileSize, 
						y: (node.y + neighbour.y + 1) * this.tileSize, 
						width: this.tileSize, 
						height: this.tileSize
					});
				}
			}
		}
	}
}

function main() {
	let canvas = document.getElementById("canvas");
	let theScene = new Scene(canvas);

	theScene.populateMap();

	console.log(theScene.map);

	theScene.drawMap();

}

main();

