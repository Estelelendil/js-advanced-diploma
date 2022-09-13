import Character from '../Character';

class Magician extends Character {
  constructor(level, health) {
    super(health);
    this.type = 'magician';
    this.attack = 10;
    this.defence = 40;
    this.level = level;
  }
}
export default Magician;
