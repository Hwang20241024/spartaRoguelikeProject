import Entity from './Entity.js';

export default class Player extends Entity {
  constructor(entitytype, name, hp, priority, battleType, party) {
    super(entitytype, name, hp, priority, battleType, party);
    this.test = 0;
  }

  testLog() {
    console.log(`${this.GetName()} 님이 등장하였습니다.`);
  }
}