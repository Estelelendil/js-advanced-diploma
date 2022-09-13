import Character from '../Character';

class Undead extends Character {
  constructor(level, health) {
    super(health);
    this.type = 'undead';
    this.attack = 40;
    this.defence = 10;
    this.level = level;
  }
}
export default Undead;
