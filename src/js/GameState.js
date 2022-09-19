export default class GameState {
  constructor(isPlayerActive, choosenHero) {
    this.isPlayerActive = isPlayerActive;
    this.choosenHero = choosenHero;
  }

  // eslint-disable-next-line no-unused-vars
  static from(object) {
    if (object == null || typeof object !== 'object') {
      return new GameState(true, null);
    }
    if (object.choosenHero && object.isPlayerActive) {
      return new GameState(object.isPlayerActive, object.choosenHero);
    }
    return new GameState(true, null);
  }
}
// хранить , чей ход в игре
// хранить выделенного игрока
