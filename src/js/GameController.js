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

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.state = null;
    this.arrPositions = arrPositions;
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);// сделать потом привязку по уровням
    this.gamePlay.redrawPositions(arrPositions);// count=0 для хороших ребят и 6 для плохих
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
    let flag = false;

    arrPositions.find((item) => {
      if (item.position === index && (item.character.type === 'bowman' || item.character.type === 'swordsman' || item.character.type === 'magician')) {
        if (this.state.position) {
          this.gamePlay.deselectCell(this.state.position);// снимаем выделеннного ранее персонажа,если таковой есть
        }
        this.gamePlay.selectCell(index);// устанавливаем нового
        this.state.position = index;// записываем в state
        this.state.choosenHero = item.character;
        this.stateService.save(this.state); // сохраняем
        flag = true;
        return flag;
      }
      return null;
    });
    if (!flag) {
      return this.gamePlay.constructor.showError('в данной клетке нет доступного персонажа');
    }
    return null;
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
    const message = `\u{1F396}${maybeCharacter.level} \u{2694}${maybeCharacter.attack} \u{1F6E1}${maybeCharacter.defence} \u{2764}${maybeCharacter.health}`;
    this.gamePlay.showCellTooltip(message, index);
    // TODO: почему не высвечивается курсор на атаку
    // как чистить стор

    // arrPositions.find((item) => {
    //   if (item.position === index && (item.character.type === 'bowman' || item.character.type === 'swordsman' || item.character.type === 'magician')) {
    //     this.gamePlay.setCursor(cursors.pointer);// проверка на курсор смену персонажа
    //   }
    //   if (legalCellMovies.includes(index)) {
    //     this.gamePlay.setCursor(cursors.pointer);
    //   }
    //   if (legalCellAttack.includes(index)) {
    //     if (item.position === index && (item.character.type === 'daemon' || item.character.type === 'vampire' || item.character.type === 'undead')) {
    //       console.log(item.character.type);// на атаку
    //       this.gamePlay.setCursor(cursors.crosshair);
    //     }
    //     console.log(legalCellMovies);
    //   }

    //   if (legalCellMovies.includes(index)) { // просто на клетку для перемещения и это правило перебивает все остальные
    //     this.gamePlay.setCursor(cursors.pointer);
    //   } else { this.gamePlay.setCursor(cursors.notallowed); }
    //   return null;
    // });
  }

  onCellLeave(index) {
    arrPositions.map((item) => {
      if (item.num === index) {
        this.gamePlay.showCellTooltip(index);
      } return index;
    });
  }
  // TODO: react to mouse leave
}
