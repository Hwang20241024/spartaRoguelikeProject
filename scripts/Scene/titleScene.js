import { Scene } from './scene.js';
import { CanvasManager } from '../CanvasManager.js';

export class TitleScene extends Scene {
  // 생성자
  constructor(name) {
    super(name);
    this.isTitleScene = true;
  }

  async Draw(){
    console.log(`${this.GetSceneTitle()} 입니다.`);
    console.log(`+----------------------+`);
    console.log(`|      대충 타이틀     |`);
    console.log(`+----------------------+`);
    console.log(`|      게임 시작       |`);
    console.log(`|      게임 종료       |`);
    console.log(`+----------------------+`);
  }

  // 타이틀 세팅.
  SettingTitleScene () {
    // 메뉴 세팅.
    let name = "TitleScene";
    let message = "당신의 행동을 선택하세요.";
    let choices = [
      { name: '게임시작', value: 1 },
      { name: '게임종료', value: 2 },
  ];
    this.MenuMake(name, message, choices);
  }

  // 타이틀 상태.
  GetisTitleScene() {
    return this.isTitleScene;
  }

  SetisTitleScene(value) {
    if (typeof value === 'boolean'){
      this.isTitleScene = value;
      return true;
    }
    return null;
  }

}
