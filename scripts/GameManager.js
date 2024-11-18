// 필요한 폴더 연결.
import { Entity } from './Entity/index.js';

// 필요한 매니져 연결.
import SceneManager from './SceneManager.js';
import UtilityManager from './UtilityManager.js';
import EntityManager from './EntityManager.js';
import BattleManager from './BattleManager.js';
import CanvasManager from './CanvasManager.js';

// 싱글턴 방식
// private static 변수: 인스턴스를 저장하여 클래스 외부에서 접근 불가.
// private 생성자: 외부에서 new로 인스턴스 생성 제한.
// static getInstance() 메서드: 인스턴스를 반환하고, 없으면 새로 생성.

export default class GameManager {
  // 클래스 인스턴스를 저장할 private static 변수
  static #instance = null;

  // 모든 매니저 참조
  static sceneManager;
  static utilityManager;
  static entityManager;
  static battleManager;
  static canvasManager;

  // 저장관련 변수
  static savedata = [];

  // 게임로직의 변수 모움집!
  static gameState = {
    turnCount: 1, // 턴 카운터
    debtDeadline: 50, // 빛 데드라인
    interestDate: 5, // 이자 내야하는날.
    debt: 200000000, // 현재 가진 빛
    interest: 20000000, // 이자
    currentFunds: 10000000, // 현재가진 머니
    treatmentCost: 1000000, // 기본치료비
    employeeCost:1000000 ,  // 직원채용 코스트
    revenue: 2000000, // 기본 수입
  };

  // private 생성자
  constructor() {
    if (GameManager.#instance) {
      throw new Error('Use GameManager.getInstance() 를 사용하여 인스턴스에 접근하세요.');
    }
    GameManager.sceneManager = SceneManager.getInstance(); // 씬메니저
    GameManager.utilityManager = UtilityManager.getInstance(); // 유틸리티 매니저
    GameManager.entityManager = EntityManager.getInstance(); // 엔티티 매니저
    GameManager.battleManager = BattleManager.getInstance(); // 배틀 매니저
    GameManager.canvasManager = CanvasManager.getInstance(); // 캔버스 매니저
  }

  // 인스턴스를 생성하거나 반환하는 static 메서드
  static getInstance() {
    if (!GameManager.#instance) {
      throw new Error('GameManager 인스턴스를 먼저 초기화해야 합니다.');
    }
    return GameManager.#instance;
  }

  // 게임매니저 초기화
  static async initialization() {
    if (!GameManager.#instance) {
      GameManager.#instance = new GameManager();

      // 씬 매니저 - 모든 씬 초기화.
      GameManager.sceneManager.InitializationScen();

      // 게임 정보 불러오자.
      GameManager.loadGame();
    }
  }

  // 씬 실행.
  static async Run() {
    while (GameManager.sceneManager.GetisGame()) {
      await GameManager.sceneManager.Run();
    }
  }

  // 게임매니저 변수 내보내기.
  static GetGameState() {
    return GameManager.gameState;
  }

  // 현재 가진 돈 수정
  static SetCurrentFunds(value) {
    GameManager.gameState.currentFunds = value;
  }

  // 턴 수정
  static SetTurnCount(value) {
    GameManager.gameState.turnCount = value;
  }

   // 빚
   static SetDebt(value) {
    GameManager.gameState.debt = value;
  }

  // 세이브 파일을 로드하자.
  static loadGame() {
    // 파일이 비어있다면 높은 확률로 최초 실행 일 것이다.
    if (GameManager.utilityManager.FileEmpty()) {
      // 디폴트 직원을 추가하자.
      let savePlayer = GameManager.entityManager.GetPlayers();
      savePlayer.Enqueue(new Entity.Player(1, '1번직원', 10, 0.8, 2, 0, false));
      savePlayer.Enqueue(new Entity.Player(1, '2번직원', 10, 0.8, 2, 0, false));
      savePlayer.Enqueue(new Entity.Player(1, '3번직원', 10, 0.8, 2, 0, false));
      savePlayer.Enqueue(new Entity.Player(1, '4번직원', 10, 0.8, 2, 0, false));
      savePlayer.Enqueue(new Entity.Player(1, '5번직원', 10, 0.8, 2, 0, false));

      // 저장.
      GameManager.saveGame();

      // 저장 하고 지우자
      GameManager.savedata = [];
    } else {
      GameManager.savedata = GameManager.utilityManager.LoadFile();
      let savePlayer = GameManager.entityManager.GetPlayers();

      // 양식이 달라.
      for (let i = 0; i < GameManager.savedata.length; i++) {
        if (i === 0) {
          GameManager.gameState.turnCount = GameManager.savedata[i].turnCount;
          GameManager.gameState.debt = GameManager.savedata[i].debt;
          GameManager.gameState.currentFunds = GameManager.savedata[i].currentFunds;
        } else {
          // 양식이 맞는지 확인
          if (typeof GameManager.savedata[i].name !== 'string' || typeof GameManager.savedata[i].hp !== 'number' || typeof GameManager.savedata[i].priority !== 'number' || typeof GameManager.savedata[i].battleType !== 'number' || typeof GameManager.savedata[i].party !== 'number' || typeof GameManager.savedata[i].isDead !== 'boolean') {
            continue;
          }
          // 삽입
          savePlayer.Enqueue(new Entity.Player(GameManager.savedata[i].entitytype, GameManager.savedata[i].name, GameManager.savedata[i].hp, GameManager.savedata[i].priority, GameManager.savedata[i].battleType, GameManager.savedata[i].party, GameManager.savedata[i].isDead));
        }
      }

      // 불러오고 지우자
      GameManager.savedata = [];
    }
  }

  // 세이브 파일 저장하자.
  static saveGame() {
    let result = {
      turnCount: GameManager.gameState.turnCount,
      debt: GameManager.gameState.debt,
      currentFunds: GameManager.gameState.currentFunds,
    };

    GameManager.savedata.push(result);

    let savePlayer = GameManager.entityManager.GetPlayers();

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
          isDead: players[i].GetIsDead(),
        };
        // 임시로 배열에 추가한다.
        GameManager.savedata.push(result);
      }
    }

    // 한번에 저장
    GameManager.utilityManager.SaveFile(GameManager.savedata);

    // 저장 하고 지우자
    GameManager.savedata = [];
  }

}
