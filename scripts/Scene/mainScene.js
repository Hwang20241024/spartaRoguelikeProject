import { Scene } from './scene.js';
import { SubScene } from './SubScene/index.js'; 
import { CanvasManager } from '../CanvasManager.js';

export class MainScene extends Scene {
  // 생성자
  constructor(name) {
    super(name);
    this.isMainScene = false;
    this.WorkOrder = new SubScene.DungeonWorkOrder("DungeonWorkOrder");
    this.StaffManager = new SubScene.DungeonStaffManager("DungeonStaffManager");
    this.Recruitment = new SubScene.DungeonRecruitment("DungeonRecruitment");
    this.forcedRepayment = new SubScene.ForcedRepaymentScene("ForcedRepaymentScene");
  }

  async Draw(){
    console.clear();
    console.log(`+----------------------+`);
    console.log(`|      대충  메인      |`);
    console.log(`+----------------------+`);
    console.log(`|      작업 지시       |`);
    console.log(`|      직원 관리       |`);
    console.log(`|      직원 채용       |`);
    console.log(`|      퇴근 하기       |`);
    console.log(`+----------------------+`);
  }

  async Run(){
    // 이거 테스트다 지워야한다.
    let count = 0;
    // 루프 시작.
    while(this.GetisScene()){

      // 테스트니깐 잊지말고 지우자
      count++;

      // 메인 로직
      await this.Draw();
      let menuValue = await this.RunMenu(0);

      // 선택지 조건
      if (typeof menuValue === 'number' && menuValue === 1) {
        this.WorkOrder.SetisScene(true);
        await this.WorkOrder.Run();
      } else if (typeof menuValue === 'number' && menuValue === 2) {
        this.StaffManager.SetisScene(true);
        await this.StaffManager.Run();
      } else if (typeof menuValue === 'number' && menuValue === 3) {
        this.Recruitment.SetisScene(true);
        await this.Recruitment.Run();
      } else if (typeof menuValue === 'number' && menuValue === 4) {
        this.SetisScene(false);
      } 

      // 테스트니깐 잊지 말고 수정하자
      if(count === 3) {
        this.forcedRepayment.SetisScene(true);
        await this.forcedRepayment.Run();
        if(this.forcedRepayment.GetisPriceToPay()){
          this.SetisScene(false);
        } else {
          count = 0;
        }
      }
      
    }
  }

  // 타이틀 세팅.
  Setting () {
    // 서브 씬 수정하자..
    this.WorkOrder.Setting();         // 작업지시 Scene
    this.StaffManager.Setting();      // 직원관리 Scene
    this.Recruitment.Setting();       // 직원채용 Scene
    this.forcedRepayment.Setting();   // 이자상환 Scene

    // 메뉴 세팅.
    let name = "TitleScene";
    let message = "당신의 행동을 선택하세요.";
    let choices = [
      { name: '작업지시', value: 1 },
      { name: '직원관리', value: 2 },
      { name: '직원채용', value: 3 },
      { name: '퇴근하기', value: 4 }
  ];
    this.MenuMake(name, message, choices);
  }
}
