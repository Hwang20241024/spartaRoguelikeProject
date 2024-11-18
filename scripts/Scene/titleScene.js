import { Scene } from './scene.js';
import CanvasManager from '../CanvasManager.js';

export class TitleScene extends Scene {
  // 생성자
  constructor(name) {
    super(name);
    this.isTitleScene = true;

    // 여기서만 쓰는 변수
    this.SetLoadingSpeed(1000);
    this.SetTextSpeed(10);
  }

  // 그리기
  async Draw() {
    let loadingSpeed = this.GetLoadingSpeed();
    let textSpeed = this.GetTextSpeed();

    // 뭔가 옛날 컴퓨터 접속하는 느낌..?
    CanvasManager.deleteText();
    CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
    CanvasManager.text_Maker('          Dungeon Manager Program', 0, { color: 'blue', style: 'bold' });
    CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
    CanvasManager.text_Maker('--------------[SYSTEM MESSAGE]---------------', 0, { color: 'green', style: 'bold' });
    await CanvasManager.loadingText('시스템을 초기화중입니다', '시스템을 초기화중입니다. [완료]', loadingSpeed, { color: 'green', style: 'bold' });
    await CanvasManager.loadingText('던전 매니저 프로그램을 로드 중입니다', '던전 매니저 프로그램을 로드 중입니다. [완료]', loadingSpeed, { color: 'green', style: 'bold' });
    await CanvasManager.loadingText('기본 설정 파일을 불러오고 있습니다', '기본 설정 파일을 불러오고 있습니다. [완료]', loadingSpeed, { color: 'green', style: 'bold' });
    await CanvasManager.loadingText('사용자를 확인하고 있습니다', '사용자를 확인하고 있습니다. [완료]', loadingSpeed, { color: 'green', style: 'bold' });
    await CanvasManager.loadingText('관리자 권한 인증 중', '접속 중: ADMIN [확인됨]', loadingSpeed, { color: 'green', style: 'bold' });
    await CanvasManager.loadingText('환경 설정 파일을 불러오고 있습니다', '환경 설정 파일을 불러오고 있습니다. [완료]', loadingSpeed, { color: 'green', style: 'bold' });
    await CanvasManager.loadingText('네트워크 연결 확인 중', '네트워크 연결 확인 중. [완료]', loadingSpeed, { color: 'green', style: 'bold' });
    await CanvasManager.loadingText('시간 동기화 중', '시간 동기화 중. [완료]', loadingSpeed, { color: 'green', style: 'bold' });
    await CanvasManager.loadingText('몬스터 데이터베이스를 로드 중입니다', '몬스터 데이터베이스를 로드 중입니다. [완료]', loadingSpeed, { color: 'green', style: 'bold' });
    await CanvasManager.loadingText('파티 구성 데이터를 불러오고 있습니다', '파티 구성 데이터를 불러오고 있습니다. [완료]', loadingSpeed, { color: 'green', style: 'bold' });
    await CanvasManager.loadingText('직원 관리 모듈을 초기화 중입니다', '직원 관리 모듈을 초기화 중입니다. [완료]', loadingSpeed, { color: 'green', style: 'bold' });
    await CanvasManager.loadingText('모든 시스템이 오류를 검사합니다', '모든 시스템이 정상적으로 작동 중입니다. [완료]', loadingSpeed, { color: 'green', style: 'bold' });
    await CanvasManager.loadingText('던전 매니저 프로그램이 시작되었습니다', '던전 매니저 프로그램이 시작되었습니다.', loadingSpeed, { color: 'green', style: 'bold' });
    await CanvasManager.promptForKeyPress();
    CanvasManager.deleteText();

    // 타이틀 씬 부분이다.
    CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
    CanvasManager.text_Maker('          Dungeon Manager Program', 0, { color: 'blue', style: 'bold' });
    CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
    CanvasManager.text_Maker('--------------[SYSTEM MESSAGE]---------------', 0, { color: 'green', style: 'bold' });
    await CanvasManager.typeWithDelay(`관리자님, 던전 매니저 프로그램에 오신 것을 환영합니다.`, textSpeed, { color: 'green', style: 'bold' });
    console.log();
    await CanvasManager.typeWithDelay(`저는 관리자님의 던전 관리 시스템입니다.`, textSpeed, { color: 'green', style: 'bold' });
    await CanvasManager.typeWithDelay(`던전 경영을 위한 모든 작업을 지원합니다.`, textSpeed, { color: 'green', style: 'bold' });
    console.log();
    await CanvasManager.typeWithDelay(`시스템이 관리자님의 지시를 대기 중입니다.`, textSpeed, { color: 'green', style: 'bold' });
    await CanvasManager.typeWithDelay(`하지만, 관리자님, 회사에 현재 `, textSpeed, { color: 'green', style: 'bold' }, false);
    await CanvasManager.typeWithDelay(`빚`, textSpeed, { color: 'red', style: 'bold' }, false);
    await CanvasManager.typeWithDelay(`이 있습니다.`, textSpeed, { color: 'green', style: 'bold' });
    await CanvasManager.typeWithDelay(`30일 내에 갚지 않으면 시스템에 의해 `, textSpeed, { color: 'green', style: 'bold' }, false);
    await CanvasManager.typeWithDelay(`처분`, textSpeed, { color: 'red', style: 'bold' }, false);
    await CanvasManager.typeWithDelay(`됩니다.`, textSpeed, { color: 'green', style: 'bold' });
    console.log();
    await CanvasManager.typeWithDelay(`이자는 매 5일마다 갚아야 합니다.`, textSpeed, { color: 'green', style: 'bold' });
    await CanvasManager.typeWithDelay(`이자를 미납하면 `, textSpeed, { color: 'green', style: 'bold' }, false);
    await CanvasManager.typeWithDelay(`처분`, textSpeed, { color: 'red', style: 'bold' }, false);
    await CanvasManager.typeWithDelay(`됩니다.`, textSpeed, { color: 'green', style: 'bold' });
    console.log();
    await CanvasManager.typeWithDelay(`[시스템 경고: 이자 미납 시 처벌 예정]`, textSpeed, { color: 'red', style: 'bold' });
    await CanvasManager.typeWithDelay(`던전 매니저 프로그램을 실행하시겠습니까?`, textSpeed, { color: 'green', style: 'bold' });
    CanvasManager.text_Maker('---------------------------------------------', 0, { color: 'green', style: 'bold' });
    await CanvasManager.delay(200);
  }

  // 시작.
  async Run() {
    while (this.GetisScene()) {
      // 그리다.
      await this.Draw();

      // 선택지
      let menuValue = await CanvasManager.selectOption(this.GetSceneMenu(), 0);

      // 게임시작.
      if (typeof menuValue === 'number' && menuValue === 1) {
        this.SetisScene(false);
      } else {
        process.exit(0);
      }
    }
  }

  // 타이틀 세팅.
  Setting() {
    // 메뉴 세팅.
    let name = 'TitleScene';
    let message = '당신의 행동을 선택하세요.';
    let choices = [
      { name: '게임시작', value: 1 },
      { name: '게임종료', value: 2 },
    ];

    this.MenuMake(name, message, choices);
  }
}
