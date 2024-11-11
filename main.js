// 최상위 main.js : chalk figlet readline-sync inquirer 라이브러리 추가.


// 이곳엔 스크립트 추가
import { SceneManager } from './scripts/SceneManager.js';
import { UtilityManager } from './scripts/UtilityManager.js';

// 매니저 선언.
let gameScene = new SceneManager();
let utilityManager = new UtilityManager();

// 씬메니저 초기화.
gameScene.InitializationScen();

// 유틸리티 메니져 테스트
utilityManager.GetQueue().Enqueue(111);
console.log(utilityManager.GetQueue().peek());


// 여기에 매인로직
while(gameScene.GetisGame()) {
    // 타이틀씬을 그린다.
    await gameScene.TitleSceneDraw();

}