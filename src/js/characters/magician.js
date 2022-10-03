import Character from '../Character';

class Magician extends Character {
  constructor(level, health) {
    super(health);
    this.type = 'magician';
    this.attack = 10;
    this.defence = 40;
    this.level = level;
    this.distanseMovie = 1;
    this.distanseAttack = 4;
    this.active = true;
  }
}
export default Magician;
