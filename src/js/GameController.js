/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
import Bowman from './characters/bowman';
import Daemon from './characters/daemon';
import Magician from './characters/magician';
import Swordsman from './characters/swordman';
import Undead from './characters/undead';
import Vampire from './characters/vampire';
import { generateTeam } from './generators';
import PositionedCharacter from './PositionedCharacter';
import Team from './Team';
import themes from './themes';
import { randomizer, randomPosition, uniqueArr } from './utils';

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
  }

  init() {
    // this.gamePlay.addEventListener(){

    // }
    this.gamePlay.drawUi(themes.prairie);// сделать потом привязку по уровням
    this.gamePlay.redrawPositions(arrPositions);// count=0 для хороших ребят и 6 для плохих
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }
}
