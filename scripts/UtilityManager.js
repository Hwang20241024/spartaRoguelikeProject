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

  // 큐 가져오기.
  GetPriorityQueue(str){
    return this.#PriorityQueue[str];
  }
  // 파일 저장.
  LoadFile() {
    
    return this.saveLoad.readFile();  
  }

  // 파일 저장
  SaveFile(value) {
    this.saveLoad.saveFile(value);
  }

  // 파일 비어있나?
  FileEmpty() {
    return this.saveLoad.isFileEmpty();
  }

  // 파일 내용 지우기
  FileClear() {
    this.saveLoad.clearFile();
  }


  
}

