import { Scene } from '../scene.js';

// 직원 관리 씬
export class DungeonStaffManager extends Scene {
  // 생성자
  constructor(name) {
    super(name);
  }

  async Draw() {
    console.clear();
    console.log(`+----------------------+`);
    console.log(`|      직원  관리      |`);
    console.log(`+----------------------+`);
    console.log(`|      파티 구성       |`);
    console.log(`|      뒤로 가기       |`);
    console.log(`+----------------------+`);
  }

  async Run() {
    // Scene는 개별적으로 돌아간다.
    // 루프 시작.
    while (this.GetisScene()) {
      await this.Draw();

      let menuValue = await this.RunMenu(0);

      if (typeof menuValue === 'number' && menuValue === 2) {
        this.SetisScene(false);
      }
    }
  }

  Setting() {
    // 메뉴 세팅.
    let name = 'WorkOrderScene';
    let message = '당신의 행동을 선택하세요.';
    let choices = [
      { name: '파티구성', value: 1 },
      { name: '뒤로가기', value: 2 },
    ];
    this.MenuMake(name, message, choices);
  }
}
