import Character from '../Character';

class Vampire extends Character {
  constructor(level, health) {
    super(health);
    this.type = 'vampire';
    this.attack = 25;
    this.defence = 25;
    this.level = level;
    this.distanseMovie = 2;
    this.distanseAttack = 2;
    this.active = true;
  }
}
export default Vampire;
