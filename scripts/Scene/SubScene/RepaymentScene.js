import { Scene } from '../scene.js';
import CanvasManager from '../../CanvasManager.js';
import GameManager from '../../GameManager.js';
import UtilityManager from '../../UtilityManager.js';

// 특정 턴마다 이자를 내야함.
export class RepaymentScene extends Scene {
  // 생성자
  constructor(name) {
    super(name);
    this.ispriceToPay = false; // 이자가 존재하냐 아니냐

    // 텍스트 속도.
    this.SetLoadingSpeed(1000);
    this.SetTextSpeed(10);

    this.utilityManager = UtilityManager.getInstance();
  }

  async Draw() {
    await this.Message(1);
  }

  async Run() {
    let loadingSpeed = this.GetLoadingSpeed();
    let textSpeed = this.GetTextSpeed();

    // 루프 시작.
    while (this.GetisScene()) {
      // 메인 로직
      await this.Draw();
      let menuValue = await CanvasManager.selectOption(this.GetSceneMenu(), 0);

      // 선택지 조건
      if (typeof menuValue === 'number' && menuValue === 1) {
        this.SetisScene(false);
        await this.completeInterestPayment(loadingSpeed, textSpeed);
        this.ispriceToPay = false;
      } else if (typeof menuValue === 'number' && menuValue === 2) {
        this.SetisScene(false);
        await this.failInterestPayment(loadingSpeed, textSpeed);
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

  async Message(value) {
    let loadingSpeed = this.GetLoadingSpeed();
    let textSpeed = this.GetTextSpeed();

    CanvasManager.deleteText();
    CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
    CanvasManager.text_Maker('          Dungeon Manager Program', 0, { color: 'blue', style: 'bold' });
    CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
    CanvasManager.text_Maker('--------------[SYSTEM MESSAGE]---------------', 0, { color: 'green', style: 'bold' });
    await CanvasManager.delay(200);

    switch (value) {
      case 1:
        await CanvasManager.loadingText('시스템 알림', '[시스템 알림] [완료]', loadingSpeed, { color: 'green', style: 'bold' });
        await this.repayInterest(loadingSpeed, textSpeed);
        break;
      case 2:
        await CanvasManager.loadingText('시스템 알림', '[시스템 알림] [완료]', loadingSpeed, { color: 'green', style: 'bold' });
        break;
      default:
        break;
    }

    CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
    await CanvasManager.delay(200);
  }

  // 1. 이자 상환.
  async repayInterest(loadingSpeed, textSpeed) {
    let debt = GameManager.GetGameState().debt;
    let interest = GameManager.GetGameState().interest;
    let currentFunds = GameManager.GetGameState().currentFunds;

    await CanvasManager.typeWithDelay(`부분 상환 기한이 도래하였습니다.`, textSpeed, { color: 'red', style: 'bold' });
    await CanvasManager.typeWithDelay(`관리자님, `, textSpeed, { color: 'green', style: 'bold' }, false);
    await CanvasManager.typeWithDelay(`[상환 금액] `, textSpeed, { color: 'red', style: 'bold' }, false);
    await CanvasManager.typeWithDelay(`의 부분 상환을 `, textSpeed, { color: 'green', style: 'bold' }, false);
    await CanvasManager.typeWithDelay(`즉시`, textSpeed, { color: 'red', style: 'bold' }, false);
    await CanvasManager.typeWithDelay(` 요구합니다.`, textSpeed, { color: 'green', style: 'bold' });
    await CanvasManager.typeWithDelay(`지금 바로 상환하지 않으면 `, textSpeed, { color: 'green', style: 'bold' }, false);
    await CanvasManager.typeWithDelay(`프로토콜에 따라 즉시 처분됩니다.`, textSpeed, { color: 'red', style: 'bold' });

    await CanvasManager.typeWithDelay(`상환 금액: ${debt}`, textSpeed, { color: 'green', style: 'bold' });
    await CanvasManager.typeWithDelay(`부분 금액: ${interest}`, textSpeed, { color: 'green', style: 'bold' });
    await CanvasManager.typeWithDelay(`현재 잔액: ${currentFunds}`, textSpeed, { color: 'green', style: 'bold' });

    await CanvasManager.typeWithDelay(`관리자님의 결정을 기다립니다.`, textSpeed, { color: 'green', style: 'bold' });
    await CanvasManager.typeWithDelay(`더 이상의 지연은 용납되지 않습니다. `, textSpeed, { color: 'red', style: 'bold' });
  }
  async completeInterestPayment(loadingSpeed, textSpeed) {
    let debt = GameManager.GetGameState().debt;
    let interest = GameManager.GetGameState().interest;
    let currentFunds = GameManager.GetGameState().currentFunds;

    let temp = currentFunds - interest;

    if(GameManager.GetGameState().turnCount === 50 && currentFunds < debt) {
      // 턴을 모두 사용했는가.
      await this.failInterestPayment(loadingSpeed, textSpeed);
      return null;
    }

    CanvasManager.deleteText();
    CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
    CanvasManager.text_Maker('          Dungeon Manager Program', 0, { color: 'blue', style: 'bold' });
    CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
    CanvasManager.text_Maker('--------------[SYSTEM MESSAGE]---------------', 0, { color: 'green', style: 'bold' });
    await CanvasManager.delay(200);

    if (temp >= 0) {
      await CanvasManager.loadingText('시스템 알림', '[시스템 알림] [완료]', loadingSpeed, { color: 'green', style: 'bold' });
      await CanvasManager.typeWithDelay(`부분 상환이 완료되었습니다.`, textSpeed, { color: 'red', style: 'bold' });
      await CanvasManager.typeWithDelay(`관리자님의 주도하에, 현재 부채는 정상적으로 처리되었습니다.`, textSpeed, { color: 'red', style: 'bold' });
      await CanvasManager.typeWithDelay(`시스템은 계속해서 정상 작동합니다.`, textSpeed, { color: 'red', style: 'bold' });
      GameManager.SetCurrentFunds(temp);
      GameManager.SetDebt(debt-interest);

      // 빚 상환 완료 했는가.?
      if(GameManager.GetGameState().debt <= 0) {
        await this.setTleDebt(loadingSpeed, textSpeed);
      }

      console.log(GameManager.GetGameState().debt);
      await CanvasManager.promptForKeyPress();

      // 게임 세이브
      GameManager.saveGame();
    } else {
      await this.failInterestPayment(loadingSpeed, textSpeed);
    }

    CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
    await CanvasManager.delay(200);

    await CanvasManager.promptForKeyPress();
  }
  // 부분상환 실패.
  async failInterestPayment(loadingSpeed, textSpeed) {
    CanvasManager.deleteText();
    CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
    CanvasManager.text_Maker('          Dungeon Manager Program', 0, { color: 'blue', style: 'bold' });
    CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
    CanvasManager.text_Maker('--------------[SYSTEM MESSAGE]---------------', 0, { color: 'green', style: 'bold' });
    await CanvasManager.delay(200);
    await CanvasManager.loadingText('시스템 알림', '[시스템 알림] [완료]', loadingSpeed, { color: 'green', style: 'bold' });
    await CanvasManager.typeWithDelay(`부분 상환에 실패했습니다. `, textSpeed, { color: 'red', style: 'bold' });
    await CanvasManager.typeWithDelay(`해당 관리자와 직원은 프로토콜에 따라 즉시 처분됩니다 `, textSpeed, { color: 'red', style: 'bold' });
    await CanvasManager.typeWithDelay(`시스템을 종료합니다. `, textSpeed, { color: 'red', style: 'bold' });
    CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
    await CanvasManager.delay(200);

    await CanvasManager.promptForKeyPress();
    this.utilityManager.FileClear();
    this.ispriceToPay = false;
    process.exit();
  }

  // 대금 상환 완료
  async setTleDebt (loadingSpeed, textSpeed) {
    CanvasManager.deleteText();
    CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
    CanvasManager.text_Maker('          Dungeon Manager Program', 0, { color: 'blue', style: 'bold' });
    CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
    CanvasManager.text_Maker('--------------[SYSTEM MESSAGE]---------------', 0, { color: 'green', style: 'bold' });
    await CanvasManager.loadingText('시스템 알림', '[시스템 알림] [완료]', loadingSpeed, { color: 'green', style: 'bold' });
    await CanvasManager.typeWithDelay(`모든 부채를 상환했습니다. `, textSpeed, { color: 'red', style: 'bold' });
    await CanvasManager.typeWithDelay(`시스템 종료 프로토콜을 실행합니다..`, textSpeed, { color: 'red', style: 'bold' });
    await CanvasManager.typeWithDelay(`데이터 정리 중...`, textSpeed, { color: 'red', style: 'bold' });
    await CanvasManager.typeWithDelay(`메모리 해제 중...`, textSpeed, { color: 'red', style: 'bold' });
    await CanvasManager.typeWithDelay(`연결 종료 준비 중...`, textSpeed, { color: 'red', style: 'bold' });
    await CanvasManager.typeWithDelay(`프로그램이 안전하게 종료됩니다.`, textSpeed, { color: 'red', style: 'bold' });
    await CanvasManager.typeWithDelay(`더 이상 부채는 존재하지 않습니다.`, textSpeed, { color: 'red', style: 'bold' });
    CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
    await CanvasManager.promptForKeyPress();
    this.utilityManager.FileClear();
    this.ispriceToPay = false;
    process.exit();

  }

  GetisPriceToPay() {
    return this.ispriceToPay;
  }
}
