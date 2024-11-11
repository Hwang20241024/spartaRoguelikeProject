import { Utils } from './Utils/index.js';

// 여긴 여러 유틸리티를 관리하는 매니저다.
export class UtilityManager {
  constructor() {
    this.queue = new Utils.Queue();
  }

  GetQueue() {
    return this.queue;
  }
}
