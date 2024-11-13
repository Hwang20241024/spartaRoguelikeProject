import {Utils} from './Utils/index.js';

// 여긴 여러 유틸리티를 관리하는 매니저다.
export default class UtilityManager {
  // 클래스 인스턴스를 저장할 private static 변수
  static #instance = null;
  #PriorityQueue;

  // private 생성자
  constructor() {
    if (UtilityManager.#instance) {
      throw new Error("Use UtilityManager.getInstance() 를 사용하여 인스턴스에 접근하세요.");
    }

    // 우선순위 큐. (우선순위 사용할 곳있다면 계속추가.)
    this.#PriorityQueue = {
      "BattlePriority" : new Utils.Queue(),
      "Monster" : new Utils.Queue(),
      "Player" : new Utils.Queue(),
    }

    // FileIO
    this.saveLoad = new Utils.FileIO('../../savefile.json');
  }

  // 인스턴스를 생성하거나 반환하는 static 메서드
  static getInstance() {
    if (!UtilityManager.#instance) {
      UtilityManager.#instance = new UtilityManager();
    }
    return UtilityManager.#instance;
  }

  // 우선순위 큐를 가져온다.
  GetPriorityQueue(str){
    return this.#PriorityQueue[str];
  }

  LoadFile() {
    // 파일을 불러오자 어차피 새로만들어~ .    
    return this.saveLoad.readFile();  
  }

  SaveFile(value) {
    this.saveLoad.saveFile(value);
  }

  FileEmpty() {
    // 파일은 있는데 비어있냐?
    return this.saveLoad.isFileEmpty();
  }


  
}

