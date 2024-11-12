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
    // 여기에 필요한 초기화 코드를 작성하세요
    this.moster = [];
    this.utilityManager = UtilityManager.getInstance();

    this.priorityQueue = this.utilityManager.GetPriorityQueue('BattlePriority');
    this.monsterList = this.utilityManager.GetPriorityQueue('Monster');
    this.playerList = this.utilityManager.GetPriorityQueue('Player');
    this.monsterParty = this.utilityManager.GetPriorityQueue('MonsterParty');
    this.playerParty = this.utilityManager.GetPriorityQueue('PlayerParty');
  }

  // 인스턴스를 생성하거나 반환하는 static 메서드
  static getInstance() {
    if (!EntityManager.#instance) {
      EntityManager.#instance = new EntityManager();
    }
    return EntityManager.#instance;
  }

  // 플레이어 초기화
  InitializationPlayer() {
    // 최초 실행이면 (세이브파일이 비어있다면.)
    if (!this.utilityManager.FileEmpty()) {
      // 디폴트 직원 추가.
      this.playerList.Enqueue(new Entity.Player('player', 7, true, 0.4));
      this.playerList.Enqueue(new Entity.Player('player', 4, true, 0.5));
      this.playerList.Enqueue(new Entity.Player('player', 3, true, 0.9));
      this.playerList.Enqueue(new Entity.Player('player', 9, true, 0.3));
      this.playerList.Enqueue(new Entity.Player('player', 8, true, 0.2));

      // 파티추가 (1개만)
      this.playerParty.Enqueue(this.playerList);

      // 테스트다
    } else {
      // 이건테스트다.
      return null;
    }
  }
  // 플레이어저장.
  PlayerSave() {
    // 데이터를 임시로 담는용도
    let allPlayerData = [];

    // 결국 뭐냐 -> 파티들의 정보 -> 파티원들 -> 저장 
    if (this.playerParty.Size()) {
      for (let i = 0; i < this.playerParty.Size(); i++) {
        let arr = this.playerParty.Dequeue();
        
        for(let value of arr.GetQueue()) {
          // 기본정보저장.
          allPlayerData.push(value.GetInformation());
          // 전투정보저장
          allPlayerData.push(value.GetCombatStats());
        }
      }
    }
    this.utilityManager.SaveFile(allPlayerData);
  }
  // 플레이어 정보 불러오기.
  PlayerLoad() {
    // 내일 하자.
    //

  }

  // 몬스터 생성.
  SpawnMonster(monsterCode, name, hp, alive, priority, value) {
    switch (monsterCode) {
      case 1:
        for (let i = 0; i < value; i++) {
          this.priorityQueue.Enqueue(new Entity.Goblin(name, hp, alive, priority));
        }
        break;
      case 2:
        return true;
      default:
        return null;
    }
  }

  // 몬스터 삭제.
  DespawnMonster() {
    this.priorityQueue.clear();
  }

  // 플레이어 생성 01.
}

export default EntityManager; // 싱글턴 클래스를 export
