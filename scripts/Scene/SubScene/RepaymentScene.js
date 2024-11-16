import { Scene } from '../scene.js';

// 특정 턴마다 이자를 내야함.
export class RepaymentScene extends Scene {
  // 생성자
  constructor(name) {
    super(name);
    this.ispriceToPay = false; // 이자가 존재하냐 아니냐
  }

  async Draw() {
    console.clear();
    console.log(`+----------------------+`);
    console.log(`|      이자  상환      |`);
    console.log(`+----------------------+`);
    console.log(`|      이자 내기       |`);
    console.log(`+----------------------+`);
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
        this.ispriceToPay = false;
      } else if (typeof menuValue === 'number' && menuValue === 2) {
        this.SetisScene(false);
        this.ispriceToPay = true;
      }
    }
  }

  Setting() {
    // 메뉴 세팅.
    let name = 'WorkOrderScene';
    let message = '당신의 행동을 선택하세요.';
    let choices = [
      { name: '이자상환', value: 1 },
      { name: '돈이없어요..', value: 2 },
    ];
    this.MenuMake(name, message, choices);
  }

  GetisPriceToPay() {
    return this.ispriceToPay;
  }
}

