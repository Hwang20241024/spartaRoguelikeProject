import Entity from './Entity.js';

export default class Goblin extends Entity {
  constructor(name, hp, alive, priority) {
    super(name, hp, alive, priority);
    this.test = 0;
  }

  testLog() {
    console.log(`${this.GetName()} 님이 등장하였습니다.`);
  }
}
