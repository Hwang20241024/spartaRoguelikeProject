import SceneManager  from './scripts/SceneManager.js';       
import UtilityManager  from './scripts/UtilityManager.js';   
import GameManager  from './scripts/GameManager.js';
import EntityManager  from './scripts/EntityManager.js';
import BattleManager  from './scripts/BattleManager.js';

// 나중에 햇갈리지 않게 매니져들 싹다 선언하자.
let sceneManager =SceneManager.getInstance();
let utilityManager = UtilityManager.getInstance();
let gameManager = GameManager.getInstance();
let entityManager = EntityManager.getInstance();
let battleManager = BattleManager.getInstance();

// 씬메니저 초기화.
sceneManager.InitializationScen();

// 테스트용도.~ 담피하고 싱글턴으로 바꾸자 씬매니저도 
gameManager.Test();


//PlayerLoad
// 불러오기~
//utilityManager.LoadFile();

// 게임 로직.
// while(sceneManager.GetisGame()) {
//     // 타이틀씬을 그린다.
//     await sceneManager.Run();

// }