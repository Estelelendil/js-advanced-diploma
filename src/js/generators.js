/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  while (true) {
    const randomFerst = Math.round(Math.random() * (allowedTypes.length - 1));
    let randomSecond = Math.round(Math.random() * maxLevel);// как сделать чтоб не округлял до нуля
    if (randomSecond === 0) {
      randomSecond = Math.round(Math.random(maxLevel));
    }
    const Char = allowedTypes[randomFerst];
    yield new Char(randomSecond);
  }
  // TODO: write logic here
  // должен быть дурацкий счетчик с next(
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей. Количество персонажей в команде - characterCount
 * */
export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // debugger;
  const playerGenerator = characterGenerator(allowedTypes, maxLevel);
  const team = [];
  for (let i = 0; i < characterCount; i++) {
    team.push(playerGenerator.next().value);// почему-то возвращается только первый объект
  }
  return team;
  // TODO: write logic here
}
