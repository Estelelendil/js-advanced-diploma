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
