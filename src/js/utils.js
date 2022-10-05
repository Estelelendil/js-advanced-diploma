/* eslint-disable no-plusplus */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */

/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 *
 * @example
 * ```js
 * calcTileType(0, 8); // 'top-left'
 * calcTileType(1, 8); // 'top'
 * calcTileType(63, 8); // 'bottom-right'
 * calcTileType(7, 7); // 'left'
 * ```
 * */
export function calcTileType(index, boardSize) {
  const arr = [];
  function normalRow(arr, boardSize) {
    arr.push('left');
    for (let i = 0; i < boardSize - 2; i++) {
      arr.push('center');
    }
    arr.push('right');
    return arr;
  }

  function topRow(arr, boardSize) {
    arr.push('top-left');
    for (let i = 0; i < boardSize - 2; i++) {
      arr.push('top');
    }
    arr.push('top-right');
    return arr;
  }

  function bottomRow(arr, boardSize) {
    arr.push('bottom-left');
    for (let i = 0; i < boardSize - 2; i++) {
      arr.push('bottom');
    }
    arr.push('bottom-right');
    return arr;
  }
  topRow(arr, boardSize);
  for (let i = 0; i < boardSize - 2; i++) {
    normalRow(arr, boardSize);
  }
  bottomRow(arr, boardSize);
  return arr[index];
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}
export function randomizer(num) {
  return Math.round(Math.random() * num);
}
export function randomPosition(start) {
  const a = randomizer(1) + start;// либо 6 либо 0
  const b = randomizer(7);
  return 8 * b + a;
}
export function uniqueArr(arr) { // нужно не элементы массива сравнивать,а только их position!
  const result = [];
  let copyItemIndex;
  for (let i = 0; i < arr.length; i++) {
    if (!result.includes(arr[i])) {
      result.push(arr[i]);
      copyItemIndex = i;
    }
  }

  return copyItemIndex;
}

const widht = 8;
const height = 8;
const numberOfCells = widht * height;
export const get1DimCoords = (x, y) => x + y * widht;
export const get2DimCoords = (z) => {
  const y = Math.trunc(z / height);
  const x = z - y * height;

  return [x, y];
};

export const isInsideField = (z) => z >= 0 && z < numberOfCells;

export const generateLegalCells = (position, distance) => {
  const [x, y] = get2DimCoords(position);
  const result = [];

  for (let dx = -distance; dx <= distance; dx++) {
    for (let dy = -distance; dy <= distance; dy++) {
      const newZ = get1DimCoords(x + dx, y + dy);

      if (isInsideField(newZ)) {
        result.push(newZ);
      }
    }
  }

  return result;
};

export function chooseYourSide(obj) {
  if (obj.type === 'bowman' || obj.type === 'swordsman' || obj.type === 'magician') {
    return true;
  }
  return false;
}
export function calcAttack(attacker, target) {
  return Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
}

export function calcDistance(obj1, obj2) {
  const coord1 = get2DimCoords(obj1.position);
  const coord2 = get2DimCoords(obj2.position);
  return Math.sqrt((coord1[0] - coord2[0]) ** 2 + (coord1[1] - coord2[1]) ** 2);
}

export function findNearest(arr) {
  const dist = arr.map((item) => item[1]);
  const findMin = Math.min.apply(null, dist);
  console.log(findMin);
  return arr.find((item) => item[1] === findMin);
}
