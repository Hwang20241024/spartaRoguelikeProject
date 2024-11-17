// Scene 폴더에있는 모든 js 파일 임포트.(실패.)
//import * as Scenes from './Scene';  // 

// 해결방법 모든 임포트 정보를 가지고 있는 index생성.
import { Scenes } from './Scene/index.js'; 

import EntityManager from './EntityManager.js';


// 씬들을 관리한 메니저다.
export default class SceneManager {
  // privet
  static #instance = null; // 싱글턴 전용 필드.
  #sceneManagerSettings;   // 인스턴스 전용 필드.

  // private 생성자
  constructor() {
    if (SceneManager.#instance) {
      throw new Error("Use SceneManager.getInstance() 를 사용하여 인스턴스에 접근하세요.");
    }

    // 여기에 필요한 초기화 코드를 작성하세요
    this.#sceneManagerSettings = {
      isGame : true,
      titleScene : new Scenes.TitleScene("TitleScene"),
      mainScene : new Scenes.MainScene("MainScene"),
      gameOverScene : new Scenes.GameOverScene("GameOverScene"),
    }
  }

  // 인스턴스를 생성하거나 반환하는 static 메서드
  static getInstance() {
    if (!SceneManager.#instance) {
      SceneManager.#instance = new SceneManager();
    }
    return SceneManager.#instance;
  }

  // 초기화.
  InitializationScen(){
    const { titleScene, mainScene, gameOverScene } = this.#sceneManagerSettings;
    
    // 타이틀씬 세팅. (여기서 중요한건 타이틀씬은 무조건 들어가기에 바로 true)
    titleScene.Setting();
    titleScene.SetisScene(true);

    // 메인씬 세팅.
    mainScene.Setting();

    // 게임오버씬 세팅
    gameOverScene.Setting();
  }


  async Run() {
    const { titleScene, mainScene, gameOverScene } = this.#sceneManagerSettings;

    // 타이틀 실행.
    if(titleScene.GetisScene()) {
      await titleScene.Run();
    }

    // 이거 다른 씬있으면 추가해야함.
    if(!titleScene.GetisScene() && !mainScene.GetisScene()) {
      mainScene.SetisScene(true);
    }

    // 메인 실행.
    if(mainScene.GetisScene()){
      await mainScene.Run();
    }

    // 테스트용도 니깐 나중에 지우자.
    if(!titleScene.GetisScene() && !mainScene.GetisScene()) {
      gameOverScene.SetisScene(true);
    }

    if(gameOverScene.GetisScene()){
      await gameOverScene.Run();
    }

    //테스트 용도니깐 지우자
    if(!titleScene.GetisScene() && !mainScene.GetisScene() && !gameOverScene.GetisScene()) {
      titleScene.SetisScene(true);
    }

  }


  // Game 진행중인지 확인.
  GetisGame(){
    return this.#sceneManagerSettings.isGame;
  } 


}

