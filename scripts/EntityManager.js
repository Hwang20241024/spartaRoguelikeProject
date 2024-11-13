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
    this.monsterLimit = 5;
    this.utilityManager = UtilityManager.getInstance();

    // 우선순위는 배틀씬에서 바꾸자.
    //this.priorityQueue = this.utilityManager.GetPriorityQueue('BattlePriority');

    this.monsterList = this.utilityManager.GetPriorityQueue('Monster');
    this.playerList = this.utilityManager.GetPriorityQueue('Player');

    let a = 0;
  }

  // 인스턴스를 생성하거나 반환하는 static 메서드
  static getInstance() {
    if (!EntityManager.#instance) {
      EntityManager.#instance = new EntityManager();
    }
    return EntityManager.#instance;
  }

  // 플레이어 초기화
  InitializationPlayers() {
    // 최초 실행이면 (세이브파일이 비어있다면.)
    if (this.utilityManager.FileEmpty()) {
      // 디폴트 직원 추가.
      this.playerList.Enqueue(new Entity.Player(1, '1번직원', 10, 0.8, 2, 1));
      this.playerList.Enqueue(new Entity.Player(1, '2번직원', 10, 0.8, 2, 1));
      this.playerList.Enqueue(new Entity.Player(1, '3번직원', 10, 0.8, 1, 1));
      this.playerList.Enqueue(new Entity.Player(1, '4번직원', 10, 0.8, 3, 1));
      this.playerList.Enqueue(new Entity.Player(1, '5번직원', 10, 0.8, 3, 1));
      // 테스트다
    } else {
      this.PlayerLoad();
    }
  }

  // 몬스터 초기화.
  InitializeMonsters(entitytype, monsterCode, name, hp, priority, battleType, party, value = this.monsterLimit) {
    switch (monsterCode) {
      case 1:
        for (let i = 0; i < value; i++) {
          this.monsterList.Enqueue(new Entity.Goblin(entitytype ,`${name}${i+1}`, hp, priority, battleType, party));
        }
        break;
      case 2:
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
    let a = 0;
    return this.playerList;
  }

  // 몬스터 리스트 가져오기
  GetMonsters() {
    return this.monsterList;
  }



  // 플레이어저장.
  PlayerSave() {
    // 데이터를 임시로 담는용도
    let allPlayerData = [];

    // 플레이리스트가 길이가 0이 아니라면
    if (this.playerList.Size()) {
      let arrSize = this.playerList.Size();
      for (let i = 0; i < arrSize; i++) {
        // 직원의 클래스를 받아오자.
        let player = this.playerList.Dequeue();
        // 직원의 중요한(?) 부분을 해체하자.
        let result = {
          entitytype: player.GetEntitytype(),
          name: player.GetName(),
          hp: player.GetHp(),
          priority: player.GetPriority(),
          battleType: player.GetBattleType(),
          party: player.GetParty(),
        };
        // 임시로 배열에 추가한다.
        allPlayerData.push(result);
      }
    }
    // 한번에 저장하자.
    this.utilityManager.SaveFile(allPlayerData);
  }

  // 플레이어 정보 불러오기.
  PlayerLoad() {
    // 내일 하자.
    let playerList = this.utilityManager.LoadFile();

    if (this.isValidPlayerData(playerList)) {
      // 직원들을 리스트에 추가.
      for (let value of playerList) {
        this.playerList.Enqueue(
          new Entity.Player(value.entitytype, value.name, value.hp, value.priority, value.battleType, value.party)
        );
      }
    } else {
      return null;
    }
  }

  // 세이브 파일 양식 확인.
  isValidPlayerData(playerList) {
    // 단 하나라도 틀린다면 세이브파일에 문제가 있느거다.
    for(let player of playerList){
      if(typeof player.name !== 'string' ||
        typeof player.hp !== 'number' ||
        typeof player.priority !== 'number' ||
        typeof player.battleType !== 'number' ||
        typeof player.party !== 'number') {
          return false;
        }
    }

    // 여기까지 오면 이상없는거다.
    return true;
  }

}

export default EntityManager; // 싱글턴 클래스를 export
