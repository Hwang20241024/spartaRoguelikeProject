// 필요한 폴더 연결.
import { Entity } from './Entity/index.js';

// 필요한 매니져 연결.
import SceneManager from './SceneManager.js';
import UtilityManager from './UtilityManager.js';
import EntityManager from './EntityManager.js';
import BattleManager from './BattleManager.js';

// 싱글턴 방식
// private static 변수: 인스턴스를 저장하여 클래스 외부에서 접근 불가.
// private 생성자: 외부에서 new로 인스턴스 생성 제한.
// static getInstance() 메서드: 인스턴스를 반환하고, 없으면 새로 생성.

export default class GameManager {
  // 클래스 인스턴스를 저장할 private static 변수
  static #instance = null;

  // private 생성자
  constructor() {
    if (GameManager.#instance) {
      throw new Error('Use GameManager.getInstance() 를 사용하여 인스턴스에 접근하세요.');
    }

    // 저장관련 변수
    this.savedata = [];

    // 모든 메니저 참조
    this.sceneManager = SceneManager.getInstance();
    this.utilityManager = UtilityManager.getInstance();
    this.entityManager = EntityManager.getInstance();
  }

  // 게임로직의 변수 모움집!
  static gameState = {
    turnCount: 0, // 턴 카운터
    debtDeadline: 40, // 빛 데드라인
    interestDate: 5, // 이자 내야하는날.
    debt: 200000000, // 현재 가진 빛
    interest: 0.01, // 이자 1퍼
    currentFunds: 0, // 현재가진 머니
    treatmentCost: 1000000, // 기본치료비
    revenue: 2000000, // 기본 수입
  };

  // 인스턴스를 생성하거나 반환하는 static 메서드
  static getInstance() {
    if (!GameManager.#instance) {
      GameManager.#instance = new GameManager();
    }
    return GameManager.#instance;
  }

  // 매니저 초기화.
  async GameInitialization() {
    // 씬 매니저 - 모든 씬 초기화.
    this.sceneManager.InitializationScen();

    // 엔티티 매니저 - 플레이어생성
    // 플레이어는 파일 입출력이 연관되어있기 때문에 최초 실행할때 적용.
    // 몬스터는 파티가 던전에 입장하면 생성.
    this.loadGame();
  }

  // 씬 실행.
  async Run() {
    while (this.sceneManager.GetisGame()) {
      await this.sceneManager.Run();
    }
  }

  // 게임매니저 변수 내보내기.
  static GetGameState() {
    return GameManager.gameState;
  }

  // 세이브 파일을 로드하자.
  loadGame() {
    // 파일이 비어있다면 높은 확률로 최초 실행 일 것이다.
    if (this.utilityManager.FileEmpty()) {
      // 디폴트 직원을 추가하자.
      let savePlayer = this.entityManager.GetPlayers();
      savePlayer.Enqueue(new Entity.Player(1, '1번직원', 10, 0.8, 2, 0));
      savePlayer.Enqueue(new Entity.Player(1, '2번직원', 10, 0.8, 2, 0));
      savePlayer.Enqueue(new Entity.Player(1, '3번직원', 10, 0.8, 2, 0));
      savePlayer.Enqueue(new Entity.Player(1, '4번직원', 10, 0.8, 2, 0));
      savePlayer.Enqueue(new Entity.Player(1, '5번직원', 10, 0.8, 2, 0));

      // 저장.
      this.saveGame();

      // 저장 하고 지우자
      this.savedata = [];
    } else {
      this.savedata = this.utilityManager.LoadFile();
      let savePlayer = this.entityManager.GetPlayers();

      // 양식이 달라.
      for (let i = 0; i < this.savedata.length; i++) {
        if (i === 0) {
          GameManager.gameState.turnCount = this.savedata[i].turnCount;
          GameManager.gameState.debt = this.savedata[i].debt;
          GameManager.gameState.currentFunds = this.savedata[i].currentFunds;
        } else {
          // 양식이 맞는지 확인
          if (typeof this.savedata[i].name !== 'string' || typeof this.savedata[i].hp !== 'number' || typeof this.savedata[i].priority !== 'number' || typeof this.savedata[i].battleType !== 'number' || typeof this.savedata[i].party !== 'number') {
            continue;
          }
          // 삽입
          savePlayer.Enqueue(new Entity.Player(this.savedata[i].entitytype, this.savedata[i].name, this.savedata[i].hp, this.savedata[i].priority, this.savedata[i].battleType, this.savedata[i].party));
        }
      }

      // 불러오고 지우자
      this.savedata = [];
    }
  }

  // 세이브 파일 저장하자.
  saveGame() {
    // 저장에 사용할 변수

    // 게임 로직의 필수 변수를 저장하자.
    // 턴 , 남은 빚, 현재돈
    let result = {
      turnCount: GameManager.gameState.turnCount,
      debt: GameManager.gameState.debt,
      currentFunds: GameManager.gameState.currentFunds,
    };

    this.savedata.push(result);

    let savePlayer = this.entityManager.GetPlayers();

    if (savePlayer.Size()) {
      let arrSize = savePlayer.Size();
      let players = savePlayer.GetQueue();
      for (let i = 0; i < arrSize; i++) {
        // 직원들의 정보를 파헤치자.
        let result = {
          entitytype: players[i].GetEntitytype(),
          name: players[i].GetName(),
          hp: players[i].GetHp(),
          priority: players[i].GetPriority(),
          battleType: players[i].GetBattleType(),
          party: players[i].GetParty(),
        };
        // 임시로 배열에 추가한다.
        this.savedata.push(result);
      }
    }

    // 한번에 저장
    this.utilityManager.SaveFile(this.savedata);

    // 저장 하고 지우자
    this.savedata = [];
  }

  // 여기에 로직을 생성하자.
  async Test() {
    // 테스트용도 지울꺼다.
    this.count++;
    console.log('테스트다.');
    console.log(`${this.turnCount}번 호출되었습니다.`);

    let battleTest = BattleManager.getInstance();

    // 파티, 몬스터 코드
    await battleTest.Run(1, 1, 'Goblin');
    //await battleTest.Run(1, 2, 'Slime');

    //저장 테스트
    //let test = EntityManager.getInstance();
    //test.InitializationPlayer();
    //test.PlayerSave();
    //test.PlayerLoad();
  }
}
