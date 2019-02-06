'use strict';

const cells = {};
let selectedElements = [];

const depth = document.querySelector('.input-depth');
const width = document.querySelector('.input-width');
const table = document.getElementById('table');
const createButton = document.querySelector('.create-button');
const removeButton = document.querySelector('.remove-button');
const showPathButton = document.querySelector('.path-button');
const resetButton = document.querySelector('.reset');
const computedPath = document.querySelector('.path-length');
const selectedCells = document.querySelectorAll('div span');
const [startCell, finishCell] = [...selectedCells];

const selectElement = (event) => {
  if(selectedElements.length < 2) {
    selectedElements.push(event.target.id);
    cells[event.target.id].classList.add('selected');
  } else {
    const item = selectedElements.shift();
    cells[item].classList.remove('selected');
    selectedElements.push(event.target.id);
    cells[event.target.id].classList.add('selected');
  }
  startCell.textContent = selectedElements[0];
  finishCell.textContent = selectedElements[1];
};
// function selectElement() {
//   if(selectedElements.length < 2) {
//     selectedElements.push(this.id);
//     console.log(selectedElements);
//     cells[this.id].classList.add('selected');
//   } else {
//     const item = selectedElements.shift();
//     cells[item].classList.remove('selected');
//     selectedElements.push(this.id);
//     console.log(selectedElements);
//     cells[this.id].classList.add('selected');
//   }
//   startCell.textContent = selectedElements[0];
//   finishCell.textContent = selectedElements[1];
// }

const createRow = (i, width) => {
  const cellNumbers = new Array(+width).fill(0).map((cell, i) => cell + i);
  const tr = document.createElement('tr');
  tr.innerHTML = cellNumbers.map(row => {
    if(rejectedCells.includes(i* 10 +row)) {
      return `<td class="cell rejected-cell" id="${i*10+row}"></td>`;
    } else {
      return `<td class="cell playing-cell" id="${i*10+row}"></td>`;
    }
  }).join('');
  table.appendChild(tr);
  cellNumbers.forEach(col => {
    const id = i * 10 + col;
    if(!rejectedCells.includes(id)) {
      const cell = document.getElementById(id);
      cell.addEventListener('click', selectElement);
      cells[id] = cell;
    }
  })
};

createButton.addEventListener('click', () => {
  for(let i = 0; i < depth.value; i++) createRow(i, width.value);
  createButton.setAttribute('disabled', '');
  removeButton.removeAttribute('disabled');
});
removeButton.addEventListener('click', () => {
  table.innerHTML = '';
  // width.value = '';
  // depth.value = '';
  startCell.textContent = '';
  finishCell.textContent = '';
  removeButton.setAttribute('disabled', '');
  createButton.removeAttribute('disabled');
});
showPathButton.addEventListener('click', () => {
  const graph = new Graph(rejectedCells, depth.value, width.value, ...selectedElements);
  const path = graph.findPath();
  path.pop();
  path.forEach(id => {
  cells[id].classList.add('path');
  computedPath.textContent = `Path Length: ${graph.findPath().length}`;
  })
});
resetButton.addEventListener('click', () => {
  for(let id in cells) {
    cells[id].classList.remove('selected', 'path');
  }
  startCell.textContent = '';
  finishCell.textContent = '';
  computedPath.textContent = '';
  selectedElements = [];
});


