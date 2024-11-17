import { Scene } from '../scene.js';
// 필요한 폴더 연결.
import { Entity } from '../../Entity/index.js';

import EntityManager from '../../EntityManager.js';
import GameManager from '../../GameManager.js';
import CanvasManager from '../../CanvasManager.js';


// 직원 채용씬.
export class RecruitmentManager extends Scene {
  // 생성자
  constructor(name) {
    super(name);

    // 텍스트 속도.
    this.SetLoadingSpeed(1000);
    this.SetTextSpeed(10);

    this.entityManager = EntityManager.getInstance(); // 엔티티 매니저
    this.tempEmployee = {};
  }

  async Draw() {
    await this.Message(1);
  }

  async Run() {
    let loadingSpeed = this.GetLoadingSpeed();
    let textSpeed = this.GetTextSpeed();

    // Scene는 개별적으로 돌아간다.
    // 루프 시작.
    while (this.GetisScene()) {
      await this.Draw();

      let menuValue = await CanvasManager.selectOption(this.GetSceneMenu(), 0);

      if (typeof menuValue === 'number' && menuValue === 1) {
        await this.hireEmployeeSuccessfully(loadingSpeed, textSpeed);
      }
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
      { name: '채용하기', value: 1 },
      { name: '뒤로가기', value: 2 },
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
        await this.hireEmployee(loadingSpeed, textSpeed);
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

  // 1. 직원채용
  async hireEmployee(loadingSpeed, textSpeed) {
    this.tempEmployee = await this.createEmployee();
    let employeeCost = GameManager.GetGameState().employeeCost;

    await CanvasManager.typeWithDelay(`관리자님`, textSpeed, { color: 'green', style: 'bold' });
    await CanvasManager.typeWithDelay(`직원 채용 절차를 시작합니다. `, textSpeed, { color: 'green', style: 'bold' });
    await CanvasManager.loadingText('지원자의 데이터베이스를 검색 중', '[지원자의 데이터베이스를 검색] [완료]', loadingSpeed, { color: 'green', style: 'bold' });
    await CanvasManager.loadingText('적합한 인원을 추출합니다', '[적합한 인원 추출] [완료]', loadingSpeed, { color: 'green', style: 'bold' });
    await CanvasManager.loadingText('직원 채용이 진행 중입니다', '[직원 채용 준비] [완료]', loadingSpeed, { color: 'green', style: 'bold' });
    await CanvasManager.loadingText('예상 비용을 계산합니다', '[예상 비용 계산] [완료]', loadingSpeed, { color: 'green', style: 'bold' });
    await CanvasManager.loadingText('자금 상태를 확인 중', '[자금 상태 확인] [완료]', loadingSpeed, { color: 'green', style: 'bold' });
    await CanvasManager.typeWithDelay(`채용 조건에 부합하지 않을 경우 절차가 즉시 종료됩니다.`, textSpeed, { color: 'red', style: 'bold' });
    CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
    await CanvasManager.typeWithDelay(`이름: [${this.tempEmployee.name}], 직무: [${this.tempEmployee.battleType}], 채용 비용: [${employeeCost}]`, textSpeed, { color: 'green', style: 'bold' });
    CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
    await CanvasManager.delay(200);
  }

  // 1-1. 직원생성.
  async createEmployee() {
    // 직원 정보부터 만들자.
    let result = {
      entitytype: 1,
      name: '',
      hp: 10,
      priority: 0,
      battleType: 0,
      party: 0,
      isDead: false,
    };

    // 1.플레이어 이름을 정하자.
    let savePlayer = GameManager.entityManager.GetPlayers().GetQueue();
    let maxNumber = 0;

    // 1-1. 문자열에서 숫자를 추출 하자.
    for (let value of savePlayer) {
      // 반환값이 숫자 "배열"
      let numbers = value.GetName().match(/\d+/g);

      // 가장 큰수를 넣자.
      for (let num of numbers) {
        maxNumber = Math.max(maxNumber, parseInt(num));
      }
    }

    // 1-2. 정한 이름을 추가하자.
    result.name = maxNumber + 1 + '번직원';

    // 2. 가중치를 정하자.
    let randomValue = Math.random();
    result.priority = Math.round(randomValue * 10) / 10;

    // 3. 배틀 타입을 정하자.
    result.battleType = Math.floor(Math.random() * 3) + 1;

    return result;
    // let savePlayer = GameManager.entityManager.GetPlayers();
    // savePlayer.Enqueue(new Entity.Player(1, '1번직원', 10, 0.8, 2, 0, false));
  }

  // 1-2. 채용성공.
  async hireEmployeeSuccessfully(loadingSpeed, textSpeed) {
    let currentFunds = GameManager.GetGameState().currentFunds;
    let employeeCost = GameManager.GetGameState().employeeCost;

    let num = currentFunds - employeeCost;

    CanvasManager.deleteText();
    CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
    CanvasManager.text_Maker('          Dungeon Manager Program', 0, { color: 'blue', style: 'bold' });
    CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
    CanvasManager.text_Maker('--------------[SYSTEM MESSAGE]---------------', 0, { color: 'green', style: 'bold' });
    await CanvasManager.delay(200);
    await CanvasManager.loadingText('시스템 알림', '[시스템 알림] [완료]', loadingSpeed, { color: 'green', style: 'bold' });
    if (num >= 0) {
      await CanvasManager.typeWithDelay(`채용이 완료되었습니다.`, textSpeed, { color: 'green', style: 'bold' });
      await CanvasManager.typeWithDelay(`이름: [${this.tempEmployee.name}], 직무: [${this.tempEmployee.battleType}], 잔여 자금: [${num}]`, textSpeed, { color: 'green', style: 'bold' });

      // 추가하자.
      let savePlayer = GameManager.entityManager.GetPlayers();
      savePlayer.Enqueue(new Entity.Player(this.tempEmployee.entitytype, this.tempEmployee.name, this.tempEmployee.hp, this.tempEmployee.priority, this.tempEmployee.battleType, this.tempEmployee.party, this.tempEmployee.isDead));
      
      // 보유금액 차감
      GameManager.SetCurrentFunds(num);

      // 저장.
      GameManager.saveGame();
    } else {
      await CanvasManager.typeWithDelay(`채용 실패. 자금 부족 또는 조건 미충족. 시스템이 절차를 종료합니다.`, textSpeed, { color: 'green', style: 'bold' });
    }

    CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });

    

    await CanvasManager.promptForKeyPress();
    CanvasManager.deleteText();
  }
}
