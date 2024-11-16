import { Scene } from '../scene.js';
import EntityManager from '../../EntityManager.js';
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
        //this.SetisScene(false);
      }

      if (typeof menuValue === 'number' && menuValue === 3) {
        this.SetisScene(false);
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
    await this.table01();
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
        break;

      default:
        break;
    }

    CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
    await CanvasManager.delay(200);
  }

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

  // 파티세팅.
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

  // 직원 추가
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
      isAddStaff = await this.choices(0, index);
    }
  }
  // 직원 제거
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
      isRemoveStaff = await this.choices(index, 0);
    }
  }

  // 선택지
  async choices(index01, index02) {
    // 플레이어 리스트 가져옴.
    let players = this.entityManager.GetPlayers().GetQueue();

    // 파티에 가입안되어 있는 리스트 가져옴.
    let temp01 = players.filter((user) => user.GetParty() === index01);
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
      return false;
    } else {
      // 파티원으로 추가..
      menuValue = temp01.find((user) => user.GetName() === menuValue.option);
      menuValue.SetParty(index02);
    }

    return true;
  }
  
}
