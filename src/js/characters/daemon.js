import Character from '../Character';

class Daemon extends Character {
  constructor(level, health) {
    super(health);
    this.type = 'daemon';
    this.attack = 10;
    this.defence = 40;
    this.level = level;
    this.distanseMovie = 1;
    this.distanseAttack = 4;
    this.active = true;
  }
}
export default Daemon;
