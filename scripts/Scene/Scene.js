import inquirer from 'inquirer';
import CanvasManager  from '../CanvasManager.js';

// 앞으로 만들 모든 씬의 설계도.
export class Scene {
  // privet
  #sceneSettings;

  // 생성자.
  constructor(title) {
    this.#sceneSettings = {
      isScene: false,
      title: title,
      loadingSpeed: 0,
      textSpeed: 0,
      menus: [],
    };

  }

  // 메뉴 만들기
  MenuMake(name, message, choices) {
    // 매게변수의 타입이 다르다면 바로 false 반환.
    if (typeof name !== 'string' || typeof message !== 'string' || !Array.isArray(choices)) {
      return null;
    }

    // 매뉴 생성.
    let menu = {
      type: 'list',
      name: name,
      message: message,
      choices: choices,
      initial: 0,
      loop: false,
    };
    // 메뉴 삽입.
    this.#sceneSettings.menus.push(menu);
  }


  // 현재 씬의 실행을 알 수 있는 함수.
  GetisScene() {
    return this.#sceneSettings.isScene;
  }

  // 씬의 메뉴를 가져오는 함수.
  GetSceneMenu(){
    return this.#sceneSettings.menus;
  }

  // 텍스트 스피드
  GetTextSpeed(){
    return this.#sceneSettings.textSpeed;
  }

  SetTextSpeed(value) {
    this.#sceneSettings.textSpeed = value;
  }

  // 로딩 스피드
  GetLoadingSpeed(){
    return this.#sceneSettings.loadingSpeed;
  }
  
  SetLoadingSpeed(value) {
    this.#sceneSettings.loadingSpeed = value;
  }

  // 씬의 실행을 수정하는 함수.
  SetisScene(value) {
    // 예외처리 : 벨류가 boolean이 아니라면 false를 리턴한다.
    if (typeof value === 'boolean') {
      this.#sceneSettings.isScene = value;
      return true;
    }

    return false;
  }

  // 씬의 이름을 알 수 있는 함수.
  GetSceneTitle() {
    return this.#sceneSettings.title;
  }
}
