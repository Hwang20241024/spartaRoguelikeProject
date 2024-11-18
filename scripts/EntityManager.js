import { Entity } from './Entity/index.js';
import UtilityManager from './UtilityManager.js';

class EntityManager {
  // 클래스 인스턴스를 저장할 private static 변수
  static #instance = null;

  // private 생성자
  constructor() {
    if (EntityManager.#instance) {
      throw new Error('Use EntityManager.getInstance() 를 사용하여 인스턴스에 접근하세요.');
    }

    this.moster = [];
    this.monsterLimit = 5;
    this.utilityManager = UtilityManager.getInstance();

    this.monsterList = this.utilityManager.GetPriorityQueue('Monster');
    this.playerList = this.utilityManager.GetPriorityQueue('Player');
  }

  // 인스턴스를 생성하거나 반환하는 static 메서드
  static getInstance() {
    if (!EntityManager.#instance) {
      EntityManager.#instance = new EntityManager();
    }
    return EntityManager.#instance;
  }
  
  // 몬스터 초기화.
  InitializeMonsters(monsterCode, name, hp, priority, battleType, party, isDead, value = this.monsterLimit) {
    this.monsterList.clear();
    
    switch (monsterCode) {
      case 1:
        for (let i = 0; i < value; i++) {
          this.monsterList.Enqueue(new Entity.Goblin(2 ,`${name}${i+1}`, hp, priority, battleType, party, isDead));
        }
        break;
      case 2:
        for (let i = 0; i < value; i++) {
          this.monsterList.Enqueue(new Entity.Slime(2 ,`${name}${i+1}`, hp, priority, battleType, party, isDead));
        }
        return true;
      default:
        return null;
    }
  }

  // 플레이어 삭제
  ClearPlayers() {
    this.playerList.clear();
  }

  // 몬스터 삭제.
  ClearMonsters() {
    this.monsterList.clear();
  }

  // 플레이어 리스트 가져오기
  GetPlayers() {
    return this.playerList;
  }

  // 몬스터 리스트 가져오기
  GetMonsters() {
    return this.monsterList;
  }

}

export default EntityManager; // 싱글턴 클래스를 export
