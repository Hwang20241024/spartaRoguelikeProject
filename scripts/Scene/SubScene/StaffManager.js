import { Scene } from '../scene.js';
import EntityManager from '../../EntityManager.js';
import GameManager from '../../GameManager.js';
import CanvasManager from '../../CanvasManager.js';
import inquirer from 'inquirer';

// 직원 관리 씬
export class StaffManager extends Scene {
  // 생성자
  constructor(name) {
    super(name);

    // 여기서만 쓰는 변수
    this.SetLoadingSpeed(1000);
    this.SetTextSpeed(10);

    this.entityManager = EntityManager.getInstance(); // 엔티티 매니저
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
        await this.Message(3);
      }

      if (typeof menuValue === 'number' && menuValue === 3) {
        await this.SetisScene(false);
      }
    }
  }

  Setting() {
    // 1번 메뉴 세팅.
    let name = 'WorkOrderScene_01';
    let message = '당신의 행동을 선택하세요.';
    let choices = [
      { name: '파티구성', value: 1 },
      { name: '치료하기', value: 2 },
      { name: '뒤로가기', value: 3 },
    ];
    this.MenuMake(name, message, choices);

    // 2번 메뉴 세팅.
    name = 'WorkOrderScene_02';
    message = '파티를 선택해주세요.';
    choices = [
      { name: '1번 파티', value: 1 },
      { name: '2번 파티', value: 2 },
      { name: '3번 파티', value: 3 },
      { name: '뒤로가기', value: 3 },
    ];
    this.MenuMake(name, message, choices);

    // 3번 메뉴 세팅.
    name = 'WorkOrderScene_03';
    message = '당신의 행동을 선택하세요..';
    choices = [
      { name: '직원추가', value: 1 },
      { name: '직원제거', value: 2 },
      { name: '뒤로가기', value: 3 },
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

    if (value != 3) {
      await this.table01();
    }

    CanvasManager.text_Maker('--------------[SYSTEM MESSAGE]---------------', 0, { color: 'green', style: 'bold' });
    await CanvasManager.delay(200);
    switch (value) {
      case 1:
        await CanvasManager.loadingText('시스템 알림', '[시스템 알림] [완료]', loadingSpeed, { color: 'green', style: 'bold' });
        await this.checkPartyStatus(loadingSpeed, textSpeed);
        break;
      case 2:
        await CanvasManager.loadingText('시스템 알림', '[시스템 알림] [완료]', loadingSpeed, { color: 'green', style: 'bold' });
        await this.modifyParty(loadingSpeed, textSpeed);
        break;
      case 3:
        await this.treatEmployee(loadingSpeed, textSpeed);
        break;

      default:
        break;
    }

    CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
    await CanvasManager.delay(200);
  }
  // 0.직원관리.
  async checkPartyStatus(loadingSpeed, textSpeed) {
    let value01 = this.findParty(1);
    let value02 = this.findParty(2);
    let value03 = this.findParty(3);

    if (value01 === 0 && value02 === 0 && value03 === 0) {
      await CanvasManager.typeWithDelay(`관리자님`, textSpeed, { color: 'green', style: 'bold' });
      await CanvasManager.typeWithDelay(`현재 시스템에 등록된 파티가 존재하지 않습니다.`, textSpeed, { color: 'green', style: 'bold' });
      await CanvasManager.typeWithDelay(`즉시 `, textSpeed, { color: 'green', style: 'bold' }, false);
      await CanvasManager.typeWithDelay(`파티 구성`, textSpeed, { color: 'red', style: 'bold' }, false);
      await CanvasManager.typeWithDelay(`을 진행해주시기 바랍니다.`, textSpeed, { color: 'green', style: 'bold' });
    } else {
      await CanvasManager.typeWithDelay(`관리자님`, textSpeed, { color: 'green', style: 'bold' });
      await CanvasManager.typeWithDelay(`현재 던전 운영을 위한 파티가 활성화되었습니다`, textSpeed, { color: 'green', style: 'bold' });
    }

    await CanvasManager.typeWithDelay(`직원 관리 기능을 통해 추가적인 조정을 진행하시고,`, textSpeed, { color: 'red', style: 'bold' });
    await CanvasManager.typeWithDelay(`던전 운영에 필요한 전략을 수립해주시기 바랍니다.`, textSpeed, { color: 'red', style: 'bold' });
    await CanvasManager.delay(200);
  }

  // 1.파티 선택
  async modifyParty(loadingSpeed, textSpeed) {
    let value01 = await this.findParty(1);
    let value02 = await this.findParty(2);
    let value03 = await this.findParty(3);

    if (value01 === 0 && value02 === 0 && value03 === 0) {
      await CanvasManager.typeWithDelay(`관리자님, 현재 시스템에서 파티가 존재하지 않습니다.`, textSpeed, { color: 'green', style: 'bold' });
      await CanvasManager.typeWithDelay(`파티 구성이 필수적입니다. 즉시 파티 구성을 완료해 주세요.`, textSpeed, { color: 'green', style: 'bold' });
      await CanvasManager.typeWithDelay(`파티원 수는 최대 5명으로 권장되며, 최소 1명 이상으로 구성 가능합니다.`, textSpeed, { color: 'green', style: 'bold' });
      await CanvasManager.typeWithDelay(`던전 운영에 차질이 없도록 파티를 구성하십시오.`, textSpeed, { color: 'green', style: 'bold' });
    } else {
      await CanvasManager.typeWithDelay(`관리자님, 현재 시스템에서 던전 파티 구성이 완료되었습니다.`, textSpeed, { color: 'green', style: 'bold' });
      await CanvasManager.typeWithDelay(`파티원 수는 최대 5명으로 권장되며, 그 이하로도 운영이 가능합니다.`, textSpeed, { color: 'green', style: 'bold' });
      await CanvasManager.typeWithDelay(`효율적인 던전 운영을 위해 파티 구성에 유의하십시오.`, textSpeed, { color: 'green', style: 'bold' });
    }
    CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
    await CanvasManager.delay(200);

    let menuValue = await CanvasManager.selectOption(this.GetSceneMenu(), 1);

    if (typeof menuValue === 'number' && menuValue === 1) {
      await this.partySatting(menuValue, loadingSpeed, textSpeed);
      return null;
    }

    if (typeof menuValue === 'number' && menuValue === 2) {
      await this.partySatting(menuValue, loadingSpeed, textSpeed);
      return null;
    }

    if (typeof menuValue === 'number' && menuValue === 3) {
      await this.partySatting(menuValue, loadingSpeed, textSpeed);
      return null;
    }
  }

  // 1-1. 파티 세팅.
  async partySatting(index, loadingSpeed, textSpeed) {
    let isPartySatting = true;

    while (isPartySatting) {
      CanvasManager.deleteText();
      CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
      CanvasManager.text_Maker('          Dungeon Manager Program', 0, { color: 'blue', style: 'bold' });
      CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
      await this.table02(index);
      CanvasManager.text_Maker('--------------[SYSTEM MESSAGE]---------------', 0, { color: 'green', style: 'bold' });
      await CanvasManager.typeWithDelay(`관리자님, `, textSpeed, { color: 'green', style: 'bold' }, false);
      await CanvasManager.typeWithDelay(`[${index} 파티]`, textSpeed, { color: 'red', style: 'bold' }, false);
      await CanvasManager.typeWithDelay(` 입니다.`, textSpeed, { color: 'green', style: 'bold' });
      await CanvasManager.typeWithDelay(`던전 운영을 위한 파티 구성이 필요합니다. `, textSpeed, { color: 'green', style: 'bold' });
      await CanvasManager.typeWithDelay(`직원을 선택해주세요. `, textSpeed, { color: 'green', style: 'bold' });
      await CanvasManager.typeWithDelay(`최대 5명까지 선택할 수 있습니다. `, textSpeed, { color: 'green', style: 'bold' });
      CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
      await CanvasManager.delay(200);

      let menuValue = await CanvasManager.selectOption(this.GetSceneMenu(), 2);

      switch (menuValue) {
        case 1:
          // 직원추가
          await this.addStaff(index, loadingSpeed, textSpeed);
          break;
        case 2:
          // 직원제거
          await this.removeStaff(index, loadingSpeed, textSpeed);
          break;
        case 3:
          // 선택을 너무 많이 한 경우.
          isPartySatting = !isPartySatting;
          break;
      }
    }
  }

  // 1-1-1. 직원 추가
  async addStaff(index, loadingSpeed, textSpeed) {
    let isAddStaff = true;

    while (isAddStaff) {
      CanvasManager.deleteText();
      CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
      CanvasManager.text_Maker('          Dungeon Manager Program', 0, { color: 'blue', style: 'bold' });
      CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
      await this.table02(index);
      CanvasManager.text_Maker('--------------[SYSTEM MESSAGE]---------------', 0, { color: 'green', style: 'bold' });
      await CanvasManager.typeWithDelay(`직원을 추가할 수 있습니다. 최대 허용 인원은 5명입니다. `, textSpeed, { color: 'green', style: 'bold' });
      CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
      await CanvasManager.delay(200);

      // 플레이어 리스트 가져옴.
      isAddStaff = await this.choices(0, index, true);
    }
  }

  // 1-1-2. 직원 제거
  async removeStaff(index, loadingSpeed, textSpeed) {
    let isRemoveStaff = true;

    while (isRemoveStaff) {
      CanvasManager.deleteText();
      CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
      CanvasManager.text_Maker('          Dungeon Manager Program', 0, { color: 'blue', style: 'bold' });
      CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
      await this.table02(index);
      CanvasManager.text_Maker('--------------[SYSTEM MESSAGE]---------------', 0, { color: 'green', style: 'bold' });
      await CanvasManager.typeWithDelay(`직원을 제거할 수 있습니다. 규정에 따라 선택하십시오. `, textSpeed, { color: 'green', style: 'bold' });
      CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
      await CanvasManager.delay(200);

      // 플레이어 리스트 가져옴.
      isRemoveStaff = await this.choices(index, 0, false);
    }
  }

  // 2. 치료 하기.
  async treatEmployee(loadingSpeed, textSpeed) {
    let isTreatEmployee = true;

    while (isTreatEmployee) {
      CanvasManager.deleteText();
      CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
      CanvasManager.text_Maker('          Dungeon Manager Program', 0, { color: 'blue', style: 'bold' });
      CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
      CanvasManager.text_Maker('--------------[SYSTEM MESSAGE]---------------', 0, { color: 'green', style: 'bold' });
      await CanvasManager.delay(200);
      await CanvasManager.loadingText('시스템 알림', '[시스템 알림] [완료]', loadingSpeed, { color: 'green', style: 'bold' });

      // 모든 직원들 정보를 가져오자.
      let players = this.entityManager.GetPlayers().GetQueue();
      let temp01 = players.filter((user) => user.GetIsDead() === true);

      if (temp01.length === 0) {
        await CanvasManager.typeWithDelay(`치료할 직원이 존재하지 않습니다. 치료가 필요한 직원이 있는지 확인하십시오.`, textSpeed, { color: 'green', style: 'bold' });
      } else {
        await CanvasManager.typeWithDelay(`경고: 관리자가 즉시 직원을 치료하지 않을 경우, 해당 직원은 생명에 치명적인 위협을 받게 됩니다.`, textSpeed, { color: 'red', style: 'bold' });
        await CanvasManager.typeWithDelay(`치료를 지연할 경우 직원의 상태는 악화되며, 결국 사망에 이를 수 있습니다.`, textSpeed, { color: 'red', style: 'bold' });
        await CanvasManager.typeWithDelay(`즉각적인 조치를 취하십시오.`, textSpeed, { color: 'red', style: 'bold' });
      }
      CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });

      await CanvasManager.delay(200);

      let temp02 = [];
      for (let value of temp01) {
        temp02.push(value.GetName());
      }
      // 나가기 버튼
      temp02.push('뒤로가기');

      // 매뉴 생성.
      let menu = {
        type: 'list',
        name: 'option',
        message: '직원을 선택하세요.',
        choices: temp02,
        initial: 0,
        loop: false,
      };
      let menuValue = await inquirer.prompt([menu]);

      if (menuValue.option === '뒤로가기') {
        isTreatEmployee = !isTreatEmployee;
      } else {
        let cost = GameManager.GetGameState().treatmentCost;
        let money = GameManager.GetGameState().currentFunds;
        menuValue = temp01.find((user) => user.GetName() === menuValue.option);

        // 치료할 돈이있다면 치료 진행.
        if (money >= cost) {
          // 치료하기
          menuValue.SetIsDead();
          menuValue.SetHp(10);
          await this.completeHealing(menuValue, cost, money, loadingSpeed, textSpeed);
        } else {
          await this.failedHealing(menuValue, cost, money, loadingSpeed, textSpeed);
        }
      }
    }
  }

  // 2-1.치료 완료.
  async completeHealing(value, cost, money, loadingSpeed, textSpeed) {
    CanvasManager.deleteText();
    CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
    CanvasManager.text_Maker('          Dungeon Manager Program', 0, { color: 'blue', style: 'bold' });
    CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
    CanvasManager.text_Maker('--------------[SYSTEM MESSAGE]---------------', 0, { color: 'green', style: 'bold' });
    await CanvasManager.delay(200);
    await CanvasManager.loadingText('시스템 알림', '[시스템 알림] [완료]', loadingSpeed, { color: 'green', style: 'bold' });
    await CanvasManager.typeWithDelay(`${value.GetName()}`, textSpeed, { color: 'blue', style: 'bold' }, false);
    await CanvasManager.typeWithDelay(`님의 치료가 완료 되었습니다.`, textSpeed, { color: 'green', style: 'bold' });
    await CanvasManager.typeWithDelay(`치료 비용으로 `, textSpeed, { color: 'green', style: 'bold' }, false);
    await CanvasManager.typeWithDelay(`${cost}`, textSpeed, { color: 'red', style: 'bold' }, false);
    await CanvasManager.typeWithDelay(`가 소비되었으며, 현재 잔액은 `, textSpeed, { color: 'green', style: 'bold' }, false);
    await CanvasManager.typeWithDelay(`${money - cost}`, textSpeed, { color: 'blue', style: 'bold' }, false);
    await CanvasManager.typeWithDelay(`입니다.`, textSpeed, { color: 'green', style: 'bold' });
    await CanvasManager.typeWithDelay(`경고: 잔여 자금 부족 시 더 이상의 치료가 불가능합니다.`, textSpeed, { color: 'red', style: 'bold' });
    
    CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });

    // 차감.
    GameManager.SetCurrentFunds(money - cost);

    // 세이브.
    GameManager.saveGame();

    await CanvasManager.promptForKeyPress();
  }

  // 2-2. 치료 실패
  async failedHealing(value, cost, money, loadingSpeed, textSpeed) {
    CanvasManager.deleteText();
    CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
    CanvasManager.text_Maker('          Dungeon Manager Program', 0, { color: 'blue', style: 'bold' });
    CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
    CanvasManager.text_Maker('--------------[SYSTEM MESSAGE]---------------', 0, { color: 'green', style: 'bold' });
    await CanvasManager.delay(200);
    await CanvasManager.loadingText('시스템 알림', '[시스템 알림] [완료]', loadingSpeed, { color: 'green', style: 'bold' });
    await CanvasManager.typeWithDelay(`${value.GetName()}`, textSpeed, { color: 'blue', style: 'bold' }, false);
    await CanvasManager.typeWithDelay(`님의 치료가 실패 되었습니다.`, textSpeed, { color: 'green', style: 'bold' });
    await CanvasManager.typeWithDelay(`치료 비용은 `, textSpeed, { color: 'green', style: 'bold' }, false);
    await CanvasManager.typeWithDelay(`${cost}`, textSpeed, { color: 'red', style: 'bold' }, false);
    await CanvasManager.typeWithDelay(`이며,  현재 잔액은 `, textSpeed, { color: 'green', style: 'bold' }, false);
    await CanvasManager.typeWithDelay(`${money}`, textSpeed, { color: 'green', style: 'bold' }, false);
    await CanvasManager.typeWithDelay(`입니다.`, textSpeed, { color: 'blue', style: 'bold' });
    await CanvasManager.typeWithDelay(`경고: 자금 부족으로 치료가 거부되었습니다.`, textSpeed, { color: 'red', style: 'bold' });
    await CanvasManager.delay(200);
    CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
 
    await CanvasManager.promptForKeyPress();
  }

  ////====기타 함수===== ////
  // 선택지
  async choices(index01, index02, ischoces) {
    // 플레이어 리스트 가져옴.
    let players = this.entityManager.GetPlayers().GetQueue();

    // 파티에 가입안되어 있는 리스트 가져옴.
    let temp01 = players.filter((user) => user.GetParty() === index01);
    let temp02 = [];

    let max = players.filter((user) => user.GetParty() === index02);
    
    // 파티원 5명 제한.
    if(!ischoces || (ischoces && max.length !== 5)){
      for (let value of temp01) {
        temp02.push(value.GetName());
      }
    } 

    // 나가기 버튼
    temp02.push('뒤로가기');

    // 매뉴 생성.
    let menu = {
      type: 'list',
      name: 'option',
      message: '직원을 선택하세요.',
      choices: temp02,
      initial: 0,
      loop: false,
    };
    let menuValue = await inquirer.prompt([menu]);

    if (menuValue.option === '뒤로가기') {
      return false;
    } else {
      // 파티원으로 추가..
      menuValue = temp01.find((user) => user.GetName() === menuValue.option);
      menuValue.SetParty(index02);
    }

    // 세이브.
    GameManager.saveGame();

    return true;
  }

  // 파티가 있는지 없는지 확인하자.
  findParty(index) {
    // 플레이어 리스트 가져옴.
    let players = this.entityManager.GetPlayers().GetQueue();

    // 파티에 가입안되어 있는 리스트 가져옴.
    let temp = players.filter((user) => user.GetParty() === index);

    return temp.length;
  }

  // 남은 인원 확인
  getRemainingStaff() {
    let players = this.entityManager.GetPlayers().GetQueue();

    // 파티에 가입안되어 있는 리스트 가져옴.
    let temp01 = players.filter((user) => user.GetParty() === 1);
    let temp02 = players.filter((user) => user.GetParty() === 2);
    let temp03 = players.filter((user) => user.GetParty() === 3);

    return players.length - (temp01.length + temp02.length + temp03.length);
  }

  // 1번 테이블
  async table01() {
    let value01 = this.findParty(1);
    let value02 = this.findParty(2);
    let value03 = this.findParty(3);
    let num = this.getRemainingStaff();

    const headers = ['1파티', '2파티', '3파티', '대기 직원'];
    const rows = [[value01, value02, value03, num]];
    const colWidths = [12, 13, 13, 12];
    const colAligns = ['center', 'center', 'center', 'center'];

    await CanvasManager.tableInputPrompt({ headers, rows, colWidths, colAligns });
  }

  // 2번 테이블
  async table02(index) {
    // 플레이어 리스트 가져옴.
    let players = this.entityManager.GetPlayers().GetQueue();
    players = players.filter((user) => user.GetParty() === index);

    let temp = [];

    for (let value of players) {
      let information = [value.GetName(), value.GetBattleType(), value.GetHp(), value.GetIsDead()];

      temp.push(information);
    }

    const headers = ['이름', '타입', 'HP', '부상'];
    const rows = players !== 0 ? temp : [];
    const colWidths = [12, 13, 13, 12];
    const colAligns = ['center', 'center', 'center', 'center'];

    await CanvasManager.tableInputPrompt({ headers, rows, colWidths, colAligns });
  }

  ////================== ////
}
