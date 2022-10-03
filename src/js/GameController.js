/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
import Bowman from './characters/bowman';
import Daemon from './characters/daemon';
import Magician from './characters/magician';
import Swordsman from './characters/swordman';
import Undead from './characters/undead';
import Vampire from './characters/vampire';
import cursors from './cursors';
import GameState from './GameState';
import { generateTeam } from './generators';
import PositionedCharacter from './PositionedCharacter';
import Team from './Team';
import themes from './themes';
import {
  calcAttack,
  chooseYourSide,
  generateLegalCells, randomizer, randomPosition, uniqueArr,
} from './utils';

const goodPlayerTypes = [Magician, Swordsman, Bowman]; // доступные классы игрока
const badPlayerTypes = [Daemon, Undead, Vampire];

const goodTeam = new Team(generateTeam(goodPlayerTypes, 10, 5));// массив объектов персонажей
const badTeam = new Team(generateTeam(badPlayerTypes, 10, 5));

function teamGeneratorPosition(arr, count) { // count=0 для хороших ребят и 6 для плохих
  const newArr = arr.map((item) => {
    const num = randomPosition(count);
    return new PositionedCharacter(item, num);// TODO:как-то проверять, что позиции не совпадают
  });
  //   if(uniqueArr(newArr)){
  //     let x=uniqueArr(newArr)
  // newArr[x].
  //   }
  return newArr;
}
const goodTeamPosition = teamGeneratorPosition(goodTeam.characters, 0);
const badTeamPosition = teamGeneratorPosition(badTeam.characters, 6);
const arrPositions = [...goodTeamPosition, ...badTeamPosition];
console.log(arrPositions);
function isDead(index) {
  if (this.arrPositions[index].character.health <= 0) { // если здоровье меньше нуля, выпиливаем перса
    console.log('УБИТ?');
    console.log(this.arrPositions[index]);
    this.arrPositions.splice([index], 1);
  }
}
export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.state = null;
    this.arrPositions = arrPositions;
    this.arrIndexGood = this.arrPositions.map((item, index) => {
      if (chooseYourSide(item.character)) {
        return index;
      }
      return null;
    });
    this.arrIndexBad = this.arrPositions.map((item, index) => {
      if (!chooseYourSide(item.character)) {
        return index;
      }
      return null;
    });
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);// сделать потом привязку по уровням
    this.gamePlay.redrawPositions(this.arrPositions);// count=0 для хороших ребят и 6 для плохих
    this.gamePlay.addCellEnterListener((index) => this.onCellEnter(index));
    this.gamePlay.addCellLeaveListener((index) => this.onCellLeave(index));
    this.gamePlay.addCellClickListener((index) => this.onCellClick(index));
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService

    const stage = this.stateService.load();
    console.log(stage);
    this.stateService.clean();
    this.state = new GameState(true, null, null);
    // this.state = GameState.from(stage);
    this.state.position = null;
    // загружать новое состояние из this. stateService
    // с помощью объекта класса GameState нужно вытаскивать конкретные данные
  }

  onCellClick(index) {
    console.log(index);
    const maybeCharacter = this.arrPositions.find((item) => item.position === index)?.character;
    const targetIndexInArr = this.arrPositions.findIndex((item) => item.position === index);// индекс в массиве перса по которому тапнули
    const choosenIndexInArr = this.arrPositions.findIndex((item) => item.position === this.state.position);// находим и возвращаем индекс в массиве с позициями выбранного перса

    if (!this.state.choosenHero && chooseYourSide(maybeCharacter)) { // eсли не выбран персонаж и клинкули по хорошему
      this.gamePlay.selectCell(index);// выделяем его
      this.state.position = index;// записываем в state
      this.state.choosenHero = maybeCharacter;
    }
    // если персонаж выбран
    const legalCellMovies = generateLegalCells(this.state.position, this.state.choosenHero.distanseMovie);
    const legalCellAttack = generateLegalCells(this.state.position, this.state.choosenHero.distanseAttack);

    if (maybeCharacter && chooseYourSide(maybeCharacter)) { // если тапнули по персу и перс хороший
      this.gamePlay.deselectCell(this.state.position);// снимаем текущие выделение
      this.gamePlay.selectCell(index);// устанавливаем нового
      this.state.position = index;
      this.state.choosenHero = maybeCharacter; // сохраняем нового выделенного в стор
    }
    if (maybeCharacter && !chooseYourSide(maybeCharacter)) { // если тапнули по персу и перс плохой
      if (legalCellAttack.includes(index)) {
        // начнется битва!!
        // у нас есть выбранный перс из store и атакованный из maybeCharacter
        const attack = calcAttack(this.state.choosenHero, maybeCharacter);
        console.log('ATTACK', attack);
        const damage = this.gamePlay.showDamage(index, attack);
        console.log('DAMAGE', damage);
        // maybeCharacter.health -= attack;
        console.log('TARGET', targetIndexInArr);
        this.arrPositions[targetIndexInArr].character.health -= attack;
        isDead(targetIndexInArr);
        // if (this.arrPositions[targetIndexInArr].character.health <= 0) { // если здоровье меньше нуля, выпиливаем перса
        //   console.log('УБИТ?');
        //   console.log(this.arrPositions[targetIndexInArr]);
        //   this.arrPositions.splice([targetIndexInArr], 1);
        // }
        this.gamePlay.redrawPositions(this.arrPositions);
      }
    }
    if (!maybeCharacter && legalCellMovies.includes(index)) { // но на клетке нет персонажа никакого и мы можем ходить на клетку
      this.arrPositions[choosenIndexInArr].position = index;// меняем позицию персонажа. теоретически он в этот момент должен переместитьсчя
      console.log(this.arrPositions);
      this.gamePlay.deselectCell(this.state.position);// снимаем выделение со стартовой точки
      this.state.position = index;

      this.gamePlay.selectCell(index);// устанавливаем выделение в новой точке
      this.gamePlay.redrawPositions(this.arrPositions);// перерендериваем страницу с новыми позициями
    }
  }

  onCellEnter(index) {
    const legalCellMovies = generateLegalCells(this.state.position, this.state.choosenHero.distanseMovie);
    const legalCellAttack = generateLegalCells(this.state.position, this.state.choosenHero.distanseAttack);

    this.gamePlay.setCursor(cursors.notallowed);

    const maybeCharacter = this.arrPositions.find((item) => item.position === index)?.character;// проверяем наводим ли мы на перса, сохраняем перса, на которого навели или ничего

    if (this.state.choosenHero) { // если есть выделенный персонаж
      if (!maybeCharacter) { // если нет, то проверяем возможность перехода
        if (legalCellMovies.includes(index)) {
          this.gamePlay.setCursor(cursors.pointer);
        }
      } else if (chooseYourSide(maybeCharacter)) { // смотрим хороший или плохой
        this.gamePlay.setCursor(cursors.pointer);// если хороший то всегда можем выбрать
      } else if (legalCellAttack.includes(index)) { // если плохой, то можем ли атаковать
        this.gamePlay.setCursor(cursors.crosshair);
      }
    }
    // если выделенного персонажа в сторе нет
    const targetIndexInArr = this.arrPositions.findIndex((item) => item.position === index);// индекс в массиве перса по которому тапнули
    const message = `\u{1F396}${this.arrPositions[targetIndexInArr].character.level} \u{2694}${this.arrPositions[targetIndexInArr].character.attack} \u{1F6E1}${this.arrPositions[targetIndexInArr].character.defence} \u{2764}${this.arrPositions[targetIndexInArr].character.health}`;
    this.gamePlay.showCellTooltip(message, index);
    // TODO: почему не высвечивается курсор на атаку
    // как чистить стор
  }

  onCellLeave(index) {
    arrPositions.map((item) => {
      if (item.num === index) {
        this.gamePlay.showCellTooltip(index);
      } return index;
    });
  }

  // TODO: react to mouse leave
  computerStep() {
    let randomIndex = randomizer(this.arrIndexBad.length);// выбираем рандомного перса из плохих
    if (this.arrPositions[randomIndex].character.active) {
      const choose = this.arrPositions[randomIndex];
      this.gamePlay.selectCell(arrPositions[choose].position);// подсвечиваем его
      const legalCellAttack = generateLegalCells(choose.position, choose.character.distanseAttack);

      this.arrPositions.map((item, index) => {
        if (legalCellAttack.includes(item.position) && chooseYourSide(item.character)) { //  проверить есть ли в этом радиусе хорошие персонажи
          const attack = calcAttack(choose.character, item.character);
          const damage = this.gamePlay.showDamage(item.position, attack);
          item.character.health -= attack;
          isDead(index);
          this.gamePlay.deselectCell(arrPositions[choose].position);
        }
        this.arrIndexBad.splice([randomIndex], 1);// наверное, лучше сделать цикл, в котором мы будем крутиться, пока длина не станет 0
        return null;
      });
      return null;
    }
    if (this.arrIndexBad.length === 0) {
      alert('этот тур завершен');
      return null;
    }
    randomIndex = randomizer(this.arrIndexBad.length);
    return null;
  }
}
