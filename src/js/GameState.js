export default class GameState {
  constructor(isPlayerActive, choosenHero, position) {
    this.isPlayerActive = isPlayerActive;
    this.position = position;
    this.choosenHero = choosenHero;
  }

  // eslint-disable-next-line no-unused-vars
  static from(object) {
    if (object == null || typeof object !== 'object') {
      return new GameState(true, null, null);
    }
    if (object.choosenHero && object.isPlayerActive && object.position) {
      return new GameState(object.isPlayerActive, object.choosenHero, object.position);
    }
    return new GameState(true, null, null);
  }
}
// хранить , чей ход в игре
// хранить выделенного персонажа
// хранить позицию выбранного персонажа
