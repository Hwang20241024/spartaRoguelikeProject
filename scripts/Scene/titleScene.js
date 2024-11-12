import { Scene } from './scene.js';
import { CanvasManager } from '../CanvasManager.js';

export class TitleScene extends Scene {
  // 생성자
  constructor(name) {
    super(name);
    this.isTitleScene = true;
  }

  async Draw(){
    console.clear();
    console.log(`+----------------------+`);
    console.log(`|      대충 타이틀     |`);
    console.log(`+----------------------+`);
    console.log(`|      게임 시작       |`);
    console.log(`|      게임 종료       |`);
    console.log(`+----------------------+`);
  }

  async Run(){
    // Scene는 개별적으로 돌아간다.
    while(this.GetisScene()){
      await this.Draw(); 
      let menuValue = await this.RunMenu(0);

      // 게임시작.
      if(typeof menuValue === 'number' && menuValue === 1) {
        this.SetisScene(false);
      } else {
        process.exit(0);
      }
      
    }
  }

  // 타이틀 세팅.
  Setting() {
    // 메뉴 세팅.
    let name = "TitleScene";
    let message = "당신의 행동을 선택하세요.";
    let choices = [
      { name: '게임시작', value: 1 },
      { name: '게임종료', value: 2 },
  ];
    this.MenuMake(name, message, choices);
  }

}
