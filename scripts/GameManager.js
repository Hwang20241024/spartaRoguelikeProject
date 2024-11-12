// 필요한 매니져 연결.
import EntityManager  from './EntityManager.js';
import UtilityManager  from './UtilityManager.js';

// 싱글턴 방식
// private static 변수: 인스턴스를 저장하여 클래스 외부에서 접근 불가.
// private 생성자: 외부에서 new로 인스턴스 생성 제한.
// static getInstance() 메서드: 인스턴스를 반환하고, 없으면 새로 생성.

class GameManager {
  // 클래스 인스턴스를 저장할 private static 변수
  static #instance = null;

  // private 생성자
  constructor() {
    if (GameManager.#instance) {
      throw new Error("Use GameManager.getInstance() 를 사용하여 인스턴스에 접근하세요.");
    }
    // 여기에 필요한 초기화 코드를 작성하세요
    this.gameState = {};
    this.count = 0;
  }

  // 인스턴스를 생성하거나 반환하는 static 메서드
  static getInstance() {
    if (!GameManager.#instance) {
      GameManager.#instance = new GameManager();
    }
    return GameManager.#instance;
  }

  // 여기에 로직을 생성하자. 
  Test(){
    // 테스트용도 지울꺼다.
    this.count++;
    console.log("테스트다.");
    console.log(`${this.count}번 호출되었습니다.`)

    //저장 테스트
    let test = EntityManager.getInstance();
    //await test.InitializationPlayer();
    //await test.testSave();
    test.PlayerLoad();
    
  }
}


export default GameManager;  // 싱글턴 클래스를 export