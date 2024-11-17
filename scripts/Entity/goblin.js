import Entity from './Entity.js';

export default class Goblin extends Entity {
  constructor(entitytype, name, hp, priority, battleType, party, isDead) {
    super(entitytype, name, hp, priority, battleType, party, isDead);
    this.test = 0;
  }

  testLog() {
    console.log(`${this.GetName()} 님이 등장하였습니다.`);
  }
}
