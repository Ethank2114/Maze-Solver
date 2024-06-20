let canvas = document.getElementById("canvas");

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
		this.map = [];
		this.tileSize = 20;
	}

	populateMap() {
		let width = this.canvas.width / this.tileSize;
		let height = this.canvas.height / this.tileSize;

		this.map = [];
		for(let i = 0; i < this.width; i++) {
			let temp = [];
			for(let j = 0; j < this.height; j++) {
				temp.push(new Node(i, j));
			}
			this.map.push(temp);
		}
		for(let i = 0; i < this.width; i++) {
			for(let j = 0; j < this.height; j++) {
				if(i !== 0) {
					this.map[i][j].neighbours.push(this.map[i - 1][j]);
				}
				if(j !== 0) {
					this.map[i][j].neighbours.push(this.map[i][j - 1]);
				}
				if(i !== this.width - 1) {
					this.map[i][j].neighbours.push(this.map[i + 1][j]);
				}
				if(j !== this.height - 1) {
					this.map[i][j].neighbours.push(this.map[i][j + 1]);
				}
			}
		}
	}
}

function main() {
	let theScene = new Scene(canvas);

	theScene.populateMap();

}

main();

