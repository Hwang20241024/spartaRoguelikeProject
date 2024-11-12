import { Scene } from './scene.js';
import { CanvasManager } from '../CanvasManager.js';
export class GameOverScene extends Scene {
  // 생성자
  constructor(name) {
    super(name);
  }

  async Draw() {
    console.clear();
    await CanvasManager.ascllArt_Maker("Game over");
    
  }

  async Run() {
    // Scene는 개별적으로 돌아간다.
    // 루프 시작.
    while (this.GetisScene()) {
      // 메인 로직
      await this.Draw();
      let menuValue = await this.RunMenu(0);

      // 선택지 조건
      if (typeof menuValue === 'number' && menuValue === 1) {
        this.SetisScene(false);
      } else if (typeof menuValue === 'number' && menuValue === 2) {
        process.exit(0);
      }
    }
  }

  Setting() {
    // 메뉴 세팅.
    let name = 'WorkOrderScene';
    let message = '당신의 행동을 선택하세요.';
    let choices = [
      { name: '새로시작', value: 1 },
      { name: '게임종료', value: 2 },
    ];
    this.MenuMake(name, message, choices);
  }
}
