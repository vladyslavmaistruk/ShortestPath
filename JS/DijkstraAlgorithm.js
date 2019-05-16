'use strict';

const rejectedCells = [0,10,15,17,22,23,24,25,27,37,44,54,56,57,58,60,61,62,64];

 class Nodes {
  constructor() {
    this.nodes = [];
  }
  add(key, priority) {
    this.nodes.push({key: key, priority: priority});
    this.sortNodes();
  }
  replace(key, priority) {
    this.nodes.forEach(elem => {
      if(elem.key === key) elem.priority = priority;
    });
    this.sortNodes();
  }
  remove() {
    return this.nodes.shift().key;
  }
  sortNodes() {
    this.nodes.sort((a, b) => a.priority - b.priority);
  }
}

 class Graph {
  constructor(rejectedCells, depth, width, startNode, finishNode) {
    this.rejectedCells = rejectedCells;
    this.depth = depth;
    this.width = width;
    this.startNode = parseInt(startNode);
    this.finishNode = parseInt(finishNode);
    }
  fillData() {
    const vertices = [];
    for (let i = 0; i < this.depth; i++) {
      for (let j = 0; j < this.width; j++) {
        vertices.push(i * 10 + j);
      }
    }
    return vertices;
  }
  defineAdjacentVertices() {
    return this.fillData().reduce(( adjacentVertices, currentVertex) => {
      const verticesArray = [];
      if(currentVertex === 0) {
        verticesArray.push(currentVertex + 10);
        verticesArray.push(currentVertex + 1);
      }
      else if (currentVertex === this.width - 1) {
        verticesArray.push(currentVertex + 10);
        verticesArray.push(currentVertex - 1);
      }
      else if (currentVertex === (this.depth - 1)*10) {
        verticesArray.push(currentVertex - 10);
        verticesArray.push(currentVertex + 1);
      }
      else if (currentVertex === ((this.depth - 1)*10)+(this.width - 1)) {
        verticesArray.push(currentVertex - 10);
        verticesArray.push(currentVertex - 1);
      }
      else if (currentVertex > this.width && currentVertex % 10 === 0 &&
        currentVertex < (this.depth - 1)*10) {
        verticesArray.push(currentVertex - 10);
        verticesArray.push(currentVertex + 10);
        verticesArray.push(currentVertex + 1);
      }
      else if (currentVertex < this.width -1 && currentVertex !== 0){
        verticesArray.push(currentVertex - 1);
        verticesArray.push(currentVertex + 10);
        verticesArray.push(currentVertex + 1);
      }
      else if (currentVertex % 10 === this.width -1
        && currentVertex < (this.depth - 1) * 10 + this.width -1){
        verticesArray.push(currentVertex - 1);
        verticesArray.push(currentVertex + 10);
        verticesArray.push(currentVertex - 10);
      }
      else if (currentVertex > (this.depth -1)* 10 && currentVertex < (this.depth -1)* 10 + this.width -1){
        verticesArray.push(currentVertex - 1);
        verticesArray.push(currentVertex + 1);
        verticesArray.push(currentVertex - 10);
      }
      else {
        verticesArray.push(currentVertex - 1);
        verticesArray.push(currentVertex + 1);
        verticesArray.push(currentVertex - 10);
        verticesArray.push(currentVertex + 10);
      }
      adjacentVertices.push({node: currentVertex, adjacentNodes: verticesArray});
      return adjacentVertices;
    }, [])
  }
  filterVertices() {
    return this.defineAdjacentVertices().filter((elem) => !this.rejectedCells.includes(elem.node))
    .reduce((nodes, currentNode) => {
      nodes.push({node: currentNode.node,
        adjacentNodes: currentNode.adjacentNodes.filter((cell) => !this.rejectedCells.includes(cell))});
      return nodes;
    }, []);
  }
  shortestWay(finishNode) {
    const INFINITY = 1/0;
    const visitedNodes = [];
    const distances = [];
    const nodes = new Nodes();
    let smallest;
    let weight = 0;
    
    this.filterVertices().forEach((elem) => {
      if(elem.node === this.startNode) {
        distances.push({node: elem.node, distance: 0});
        nodes.add(elem.node, 0);
      } else {
        distances.push({node: elem.node, distance: INFINITY});
        nodes.add(elem.node, INFINITY);
      }
    });
    visitedNodes.push(this.startNode);
  
    while (nodes.nodes.length) {
      smallest = nodes.remove();
      weight = distances.find(vertex => vertex.node === smallest).distance + 1;
      this.filterVertices().find(vertex => vertex.node === smallest).adjacentNodes
      .forEach((adjacentNode) => {
        if(!visitedNodes.includes(adjacentNode)) {
          nodes.replace(adjacentNode, weight);
          distances.find(vertex => vertex.node === adjacentNode).distance = weight;
          visitedNodes.push(adjacentNode);
        }
      });
    }
    if (finishNode) {
      return distances.find(vertex => vertex.node === finishNode);
    } else {
      return distances;
    }
  }
  findPath() {
    const path =[];
    const distances = this.shortestWay();
    const adjacentVertices = this.filterVertices();
    const distance = distances.find(vertex => vertex.node === this.finishNode).distance;
    let previousNode = this.finishNode;
  
    path.push(this.finishNode);
  
    for(let i = 1; i < distance; i++) {
      distances.forEach(vertex => {
        if(vertex.distance === distance - i && adjacentVertices.find(cell => cell.node === previousNode).adjacentNodes
          .includes(vertex.node)) {
          path.push(vertex.node);
          previousNode = vertex.node;
        }
      });
    }
    return path.reverse();
  }
}


