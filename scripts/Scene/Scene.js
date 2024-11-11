import inquirer from 'inquirer';

// 앞으로 만들 모든 씬의 설계도.
export class Scene {
  // privet
  #sceneSettings;

  // 생성자.
  constructor(title) {
    this.#sceneSettings = {
      isScene: false,
      title: title,
      delay: 0,
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

  // 메뉴 실행하기.
  async RunMenu(index) {
    // 인덱스가 타입이 숫자형이 아니라면 바로 false 반환
    if (typeof index !== 'number') {
      return false;
    }
    // 메뉴가 있고 , 인덱스가 메뉴의 길이를 넘지 않는다면.
    if (this.#sceneSettings.menus.length && this.#sceneSettings.menus.length > index) {
      const result  =  await inquirer.prompt([this.#sceneSettings.menus[index]]);
      // 개별로 쓰면 이럴 필요없는데. 여러군데에서 쓰니깐.. 동적으로 키이름 가져오기..
      let nameKey  = Object.keys(result)[0]; 
      return result[nameKey];
    }
    return false;
  }

  // 현재 씬의 실행을 알 수 있는 함수.
  GetisScene() {
    return this.#sceneSettings.isScene;
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
