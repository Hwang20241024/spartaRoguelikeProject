import { Scene } from '../scene.js';
import EntityManager from '../../EntityManager.js';
import GameManager from '../../GameManager.js';
import BattleManager from '../../BattleManager.js';
import CanvasManager from '../../CanvasManager.js';
import inquirer from 'inquirer';

// 작업 지시 씬.
export class TaskManager extends Scene {
  // 생성자
  constructor(name) {
    super(name);

    this.entityManager = EntityManager.getInstance(); // 엔티티 매니저
    this.battleManager = BattleManager.getInstance(); // 엔티티 매니저
    this.tempEmployee = {};

    this.SetLoadingSpeed(1000);
    this.SetTextSpeed(10);
  }

  async Draw() {
    await this.Message(1);
  }

  async Run() {
    // Scene는 개별적으로 돌아간다.
    // 루프 시작.
    while (this.GetisScene()) {
      await this.Draw();

      let menuValue = await CanvasManager.selectOption(this.GetSceneMenu(), 0);
      if (typeof menuValue === 'number' && menuValue === 1) {
        await this.Message(2);
      }

      if (typeof menuValue === 'number' && menuValue === 2) {
        this.SetisScene(false);
      }
    }
  }

  Setting() {
    // 메뉴 세팅 01.
    let name = 'WorkOrderScene01';
    let message = '당신의 행동을 선택하세요.';
    let choices = [
      { name: '던전진입', value: 1 },
      { name: '뒤로가기', value: 2 },
    ];
    this.MenuMake(name, message, choices);

    // 메뉴 세팅 02.
    name = 'WorkOrderScene02';
    message = '당신의 행동을 선택하세요..';
    choices = [
      { name: '결과 보고', value: 1 },
      { name: '결과 스킵', value: 2 },
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
        await this.takeScene01(loadingSpeed, textSpeed);
        break;
      case 2:
        await CanvasManager.loadingText('시스템 알림', '[시스템 알림] [완료]', loadingSpeed, { color: 'green', style: 'bold' });
        await this.takeScene02(loadingSpeed, textSpeed);
        break;
      default:
        break;
    }

    CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
    await CanvasManager.delay(200);
  }

  // 1. 작업지시 첫번째 씬.
  async takeScene01(loadingSpeed, textSpeed) {
    await CanvasManager.typeWithDelay(`관리자님, 즉시 직원들에게 작업 지시를 내려주시기 바랍니다. `, textSpeed, { color: 'green', style: 'bold' });
    await CanvasManager.typeWithDelay(`작업 지시가 없으면 해당 작업은 진행되지 않으며,  `, textSpeed, { color: 'green', style: 'bold' });
    await CanvasManager.typeWithDelay(`시스템의 정상적인 운영에 심각한 영향을 미칠 수 있습니다.`, textSpeed, { color: 'green', style: 'bold' });
    await CanvasManager.typeWithDelay(`신속히 지시를 내리지 않으면, 처벌이 따를 수 있습니다`, textSpeed, { color: 'green', style: 'bold' });
  }

  // 2. 작업지시두번쨰 씬.
  async takeScene02(loadingSpeed, textSpeed) {
    let temp01 = this.findParty(1);
    let temp02 = this.findParty(2);
    let temp03 = this.findParty(3);

    CanvasManager.deleteText();
    CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
    CanvasManager.text_Maker('          Dungeon Manager Program', 0, { color: 'blue', style: 'bold' });
    CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
    CanvasManager.text_Maker('--------------[SYSTEM MESSAGE]---------------', 0, { color: 'green', style: 'bold' });
    await CanvasManager.delay(200);
    await CanvasManager.typeWithDelay(`진원들이 던전에 진입하였습니다.`, textSpeed, { color: 'green', style: 'bold' });
    if(temp01 > 0){
      await CanvasManager.loadingText('1파티 작업중', '[1파티 작업] [완료]', loadingSpeed, { color: 'green', style: 'bold' });
    }
    if(temp02 > 0){
      await CanvasManager.loadingText('2파티 작업중', '[2파티 작업] [완료]', loadingSpeed, { color: 'green', style: 'bold' });
    }
    if(temp03 > 0){
      await CanvasManager.loadingText('3파티 작업중', '[3파티 작업] [완료]', loadingSpeed, { color: 'green', style: 'bold' });
    }
    await CanvasManager.typeWithDelay(`직원들의 금일 성과를 마무리하였습니다. 결과는 곧 확인 가능합니다.`, textSpeed, { color: 'green', style: 'bold' });
    CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
    await CanvasManager.delay(200);
    // 선택지
    let menuValue = await CanvasManager.selectOption(this.GetSceneMenu(), 1);

    if (typeof menuValue === 'number' && menuValue === 1) {
      await this.generateReport(true, loadingSpeed, textSpeed);
    }

    if (typeof menuValue === 'number' && menuValue === 2) {
      await this.generateReport(false, loadingSpeed, textSpeed);
    }
  }

  // 2-1. 결과 보고
  async generateReport(isReport, loadingSpeed, textSpeed) {
    CanvasManager.deleteText();
    let sectionText = [
      '---------------------------------------------',
      '          Dungeon Manager Program',
      '---------------------------------------------',
      '--------------[SYSTEM MESSAGE]---------------'
    ];
    sectionText.forEach(text => {
      CanvasManager.text_Maker(text, 0, { color: 'green', style: 'bold' });
    });
    await CanvasManager.delay(200);

    // 파티가 존재 하는지 확인.
    let temp01 = this.findParty(1);
    let temp02 = this.findParty(2);
    let temp03 = this.findParty(3);
    let report = [];
  
    if (temp01 > 0) {
      report.push(await this.battleManager.Run(1, 1, 'Goblin'));
    } 
    if (temp02 > 0) {
      report.push(await this.battleManager.Run(2, 1, 'Goblin'));
    } 
    if (temp03 > 0) {
      report.push(await this.battleManager.Run(3, 1, 'Goblin'));
    }

    if (isReport) {
      for (let value01 of report) {
        // 공통된 텍스트 한번만 출력
        CanvasManager.deleteText();
        
        // 텍스트 출력
        sectionText.forEach(text => {
          CanvasManager.text_Maker(text, 0, { color: 'green', style: 'bold' });
        });
        await CanvasManager.delay(100);
      
        // 값에 따라 다르게 처리
        for (let value02 of value01) {
          if (value02 === "@@@@@@") {
            // 사용자 입력을 기다림
            await CanvasManager.promptForKeyPress();
            // 텍스트를 다시 지우고 출력
            CanvasManager.deleteText();
            sectionText.forEach(text => {
              CanvasManager.text_Maker(text, 0, { color: 'green', style: 'bold' });
            });
            await CanvasManager.delay(100);
          } else {
            CanvasManager.text_Maker(value02, 100, { color: "green", style: "bold" });
            await CanvasManager.delay(100);
          }
        }
      
        await CanvasManager.promptForKeyPress();  // 마지막 입력 기다림
        CanvasManager.deleteText();
      }
      
      
    } else {
      CanvasManager.deleteText();
      sectionText.forEach(text => {
        CanvasManager.text_Maker(text, 0, { color: 'green', style: 'bold' });
      });
      await CanvasManager.delay(200);

      for (let value01 of report) {
        let str = value01[value01.length - 1];
        await CanvasManager.typeWithDelay(str, textSpeed, { color: 'green', style: 'bold' });
      }
      
      await CanvasManager.delay(200);
    }

    await CanvasManager.promptForKeyPress();
    await this.reportSettlement(loadingSpeed, textSpeed);


  }

  // 2-2. 파티가 있는지 없는지 확인
  findParty(index) {
    // 플레이어 리스트 가져옴.
    let players = this.entityManager.GetPlayers().GetQueue();

    // 파티에 가입안되어 있는 리스트 가져옴.
    let temp = players.filter((user) => user.GetParty() === index);

    return temp.length;
  }

  // 3. 결과 정산.
  async reportSettlement(loadingSpeed, textSpeed) {
    CanvasManager.deleteText();
    CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
    CanvasManager.text_Maker('          Dungeon Manager Program', 0, { color: 'blue', style: 'bold' });
    CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
    CanvasManager.text_Maker('--------------[SYSTEM MESSAGE]---------------', 0, { color: 'green', style: 'bold' });
    await CanvasManager.loadingText('시스템 알림', '[시스템 알림] [완료]', loadingSpeed, { color: 'green', style: 'bold' });
    await CanvasManager.typeWithDelay(`정산 처리 중입니다.`, textSpeed, { color: 'green', style: 'bold' });
    // 1. 엔티티 정보 가져온다. 
    let players = this.entityManager.GetPlayers().GetQueue();
    let monsters = this.entityManager.GetMonsters().GetQueue();

    let temp01 = players.filter((user) => user.GetIsDead() === true);
    let temp02 = monsters.filter((user) => user.GetIsDead() === true);

    // 몬스터 처리
    if(temp02.length !== 0) {
      for(let value of temp02){
        let num1 = GameManager.GetGameState().currentFunds;
        let num2 = GameManager.GetGameState().revenue;
        await CanvasManager.typeWithDelay(`${value.GetName()}님이 죽었습니다. (${num2}을 획득.)`, textSpeed, { color: 'green', style: 'bold' });
        GameManager.SetCurrentFunds(num1 + num2);
      }
    }

    // 플레이어 처리 
    if(temp01.length !== 0) {
      for(let value of temp01){
        if(value.GetParty !== 0){
          await CanvasManager.typeWithDelay(`${value.GetName()}님이 부상을 당했습니다.`, textSpeed, { color: 'green', style: 'bold' });
          value.SetParty(0);
        } else {
          // 기존에 부상 당했던 직원이라면 
          let randomNum = Math.floor(Math.random() * 5) + 1;
          if(randomNum === 3) {
            // 몬스터리스트에서 삭제.
            await CanvasManager.typeWithDelay(`${value.GetName()}님이 부상으로 인한 해고처리 되었습니다.`, textSpeed, { color: 'green', style: 'bold' });
            let dismissal = players.filter((user) => user.GetName() !== value.GetName());
            this.entityManager.GetPlayers().SrestorationQueue(dismissal);
          }
        }
      }
    }
    // 카운터 증가 
    GameManager.SetTurnCount(GameManager.GetGameState().turnCount + 1);

    // 게임 저장
    GameManager.saveGame();

    // 작업지시 종료
    this.SetisScene(false);

    await CanvasManager.typeWithDelay(`정산이 완료되었습니다. 모든 결과는 기록되었습니다.`, textSpeed, { color: 'green', style: 'bold' });
    CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
    await CanvasManager.promptForKeyPress();
  }
}


