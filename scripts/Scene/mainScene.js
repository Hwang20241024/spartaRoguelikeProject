import { Scene } from './scene.js';
import { SubScene } from './SubScene/index.js';
import CanvasManager from '../CanvasManager.js';
import GameManager from '../GameManager.js';
import EntityManager from '../EntityManager.js';

export class MainScene extends Scene {
  // 생성자
  constructor(name) {
    super(name);
    this.isMainScene = false;
    this.taskManager = new SubScene.TaskManager('TaskManager');
    this.staffManager = new SubScene.StaffManager('StaffManager');
    this.recruitment = new SubScene.RecruitmentManager('RecruitmentManager');
    this.repaymentScene = new SubScene.RepaymentScene('RepaymentScene');

    // 여기서만 쓰는 변수
    this.SetLoadingSpeed(1000);
    this.SetTextSpeed(10);

    this.entityManager = EntityManager.getInstance(); // 엔티티 매니저
  }

  async Draw() {
    await this.Message(1);
  }

  async Run() {
    // 루프 시작.
    while (this.GetisScene()) {
      // 메인 로직
      await this.Draw();
      let menuValue = await CanvasManager.selectOption(this.GetSceneMenu(), 0);

      // 선택지 조건
      if (typeof menuValue === 'number' && menuValue === 1) {
        // 플레이어 리스트 가져옴.
        let players = this.entityManager.GetPlayers();
        let playersSize = players.Size();

        // 파티에 가입안되어 있는 리스트 가져옴.
        let temp = players.GetQueue().filter((user) => user.GetParty() === 0);

        // 파티에 가입안되어 있는 리스트 가져옴.
        if (playersSize === temp.length) {
          await this.Message(2);
        } else {
          this.taskManager.SetisScene(true);
          await this.taskManager.Run();
        }
      } else if (typeof menuValue === 'number' && menuValue === 2) {
        this.staffManager.SetisScene(true);
        await this.staffManager.Run();
      } else if (typeof menuValue === 'number' && menuValue === 3) {
        this.recruitment.SetisScene(true);
        await this.recruitment.Run();
      } else if (typeof menuValue === 'number' && menuValue === 4) {
        this.SetisScene(false);
      }

      // 테스트니깐 잊지 말고 수정하자
      if (GameManager.GetGameState().turnCount % 5 === 0) {
        this.repaymentScene.SetisScene(true);
        await this.repaymentScene.Run();

        if (this.repaymentScene.GetisPriceToPay()) {
          this.SetisScene(false);
        }
      }
    }
  }

  // 타이틀 세팅.
  Setting() {
    // 서브 씬 
    this.taskManager.Setting(); // 작업지시 Scene
    this.staffManager.Setting(); // 직원관리 Scene
    this.recruitment.Setting(); // 직원채용 Scene
    this.repaymentScene.Setting(); // 이자상환 Scene

    // 메뉴 세팅.
    let name = 'TitleScene';
    let message = '당신의 행동을 선택하세요.';
    let choices = [
      { name: '작업지시', value: 1 },
      { name: '직원관리', value: 2 },
      { name: '직원채용', value: 3 },
      { name: '퇴근하기', value: 4 },
    ];
    this.MenuMake(name, message, choices);
  }

  // 테이블
  async table01() {
    let temp = GameManager.GetGameState();

    const headers = ['관리자 ID', '현재가진돈', '남은빚', '남은일수'];
    const rows = [['admin', temp.currentFunds, temp.debt, temp.debtDeadline - temp.turnCount]];
    const colWidths = [12, 13, 13, 12];
    const colAligns = ['center', 'center', 'center', 'center'];
    await CanvasManager.tableInputPrompt({ headers, rows, colWidths, colAligns });
  }

  // 내용
  async Message(value) {
    let loadingSpeed = this.GetLoadingSpeed();
    let textSpeed = this.GetTextSpeed();
    let temp = GameManager.GetGameState();

    CanvasManager.deleteText();
    CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
    CanvasManager.text_Maker('          Dungeon Manager Program', 0, { color: 'blue', style: 'bold' });
    CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
    this.table01();
    CanvasManager.text_Maker('--------------[SYSTEM MESSAGE]---------------', 0, { color: 'green', style: 'bold' });

    switch (value) {
      case 1:
        await CanvasManager.typeWithDelay(`관리자님,`, textSpeed, { color: 'red', style: 'bold' });
        await CanvasManager.typeWithDelay(`오늘도 시스템에 의해 자동화된 던전 관리 프로세스가 시작되었습니다. `, textSpeed, { color: 'green', style: 'bold' });
        await CanvasManager.typeWithDelay(`오늘은 `, textSpeed, { color: 'green', style: 'bold' }, false);
        await CanvasManager.typeWithDelay(`${temp.turnCount}일차`, textSpeed, { color: 'blue', style: 'bold' }, false);
        await CanvasManager.typeWithDelay(`입니다. `, textSpeed, { color: 'green', style: 'bold' }, false);
        await CanvasManager.typeWithDelay(`남은 일수는 ${temp.debtDeadline - temp.turnCount}일`, textSpeed, { color: 'red', style: 'bold' }, false);
        await CanvasManager.typeWithDelay(`입니다. `, textSpeed, { color: 'green', style: 'bold' });
        await CanvasManager.typeWithDelay(`빚을 갚지 않으면 시스템의 규정에 따라 `, textSpeed, { color: 'green', style: 'bold' }, false);
        await CanvasManager.typeWithDelay(`강제종료`, textSpeed, { color: 'red', style: 'bold' }, false);
        await CanvasManager.typeWithDelay(`될 수 있습니다. `, textSpeed, { color: 'green', style: 'bold' });
        await CanvasManager.typeWithDelay(`효율적인 자원 배분과 전략적 운영이 요구됩니다. `, textSpeed, { color: 'green', style: 'bold' });
        await CanvasManager.typeWithDelay(`선택을 통해 던전의 운명을 결정짓고, 필요한 자금을 확보하십시오. `, textSpeed, { color: 'green', style: 'bold' });
        await CanvasManager.typeWithDelay(`빚 청산을 위한 준비를 마쳐야 합니다. `, textSpeed, { color: 'green', style: 'bold' });
        break;
      case 2:
        await CanvasManager.loadingText('시스템 알림', '[시스템 알림] [완료]', loadingSpeed, { color: 'green', style: 'bold' });
        await CanvasManager.typeWithDelay(`관리자님, 현재 파티가 존재하지 않습니다.`, textSpeed, { color: 'green', style: 'bold' });
        await CanvasManager.typeWithDelay(`직원 관리 모듈에 접속하여 즉시 파티를 구성하십시오.`, textSpeed, { color: 'green', style: 'bold' });
        console.log();
        await CanvasManager.typeWithDelay(`경고: 파티가 없는 상태에서는 던전 관리가 불가능합니다.`, textSpeed, { color: 'red', style: 'bold' });
        await CanvasManager.typeWithDelay(`규정에 따라 계속 방치할 경우 시스템 이상이 발생할 수 있습니다.`, textSpeed, { color: 'red', style: 'bold' });
        console.log();
        await CanvasManager.typeWithDelay(`필요한 작업을 즉시 수행하시기 바랍니다.`, textSpeed, { color: 'green', style: 'bold' });
        await CanvasManager.typeWithDelay(`- 시스템 관리 모듈`, textSpeed, { color: 'green', style: 'bold' });
        await CanvasManager.promptForKeyPress();
        CanvasManager.deleteText();
        break;
      case 3:
        break;

      default:
        break;
    }

    CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
    await CanvasManager.delay(200);
  }
}
