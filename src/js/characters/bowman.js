import Character from '../Character';

class Bowman extends Character {
  constructor(level, health) {
    super(health);
    this.type = 'bowman';
    this.attack = 25;
    this.defence = 25;
    this.level = level;
    this.distanseMovie = 2;
    this.distanseAttack = 2;
  }
}
export default Bowman;
