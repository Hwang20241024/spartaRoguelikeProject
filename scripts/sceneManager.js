// Scene 폴더에있는 모든 js 파일 임포트.(실패.)
//import * as Scenes from './Scene';  // 

// 해결방법 모든 임포트 정보를 가지고 있는 index생성.
import { Scenes } from './Scene/index.js'; 


// 씬들을 관리한 메니저다.
export class SceneManager {
  // privet
  #sceneManagerSettings;

  // 생성자.
  constructor() {
    this.#sceneManagerSettings = {
      isGame : true,
      titleScene : new Scenes.TitleScene("TitleScene")
    }
  }

  // 초기화.
  InitializationScen(){
    // 설정이다.
    this.#sceneManagerSettings.titleScene.SettingTitleScene();
    this.#sceneManagerSettings.titleScene.SetisScene(true);
  }

  // Scen 출력
  async TitleSceneDraw () {
    
    // 타이틀씬 그리는 로직. (타이틀씬이 참일 경우.)
    while(this.#sceneManagerSettings.titleScene.GetisScene())
    {
      await this.#sceneManagerSettings.titleScene.Draw();
      let test = await this.#sceneManagerSettings.titleScene.RunMenu(0);

      // 게임종료를 눌렀을 경우.
      if(typeof test === 'number' && test === 2){
        this.#sceneManagerSettings.titleScene.SetisScene(false);

      // 이부분은 테스트니깐 지울꺼임. 
      this.#sceneManagerSettings.isGame = false;  
      }
    }
  }


  // Game 진행중인지 확인.
  GetisGame(){
    return this.#sceneManagerSettings.isGame;
  } 


}

