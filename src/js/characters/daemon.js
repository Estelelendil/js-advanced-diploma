import Character from '../Character';

class Daemon extends Character {
  constructor(level, health) {
    super(health);
    this.type = 'daemon';
    this.attack = 10;
    this.defence = 40;
    this.level = level;
  }
}
export default Daemon;
