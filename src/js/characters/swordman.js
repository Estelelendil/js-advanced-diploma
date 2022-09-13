import Character from '../Character';

class Swordsman extends Character {
  constructor(level, health) {
    super(health);
    this.type = 'swordsman';
    this.attack = 40;
    this.defence = 10;
    this.level = level;
  }
}
export default Swordsman;
