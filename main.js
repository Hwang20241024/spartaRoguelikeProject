import SceneManager   from './scripts/SceneManager.js';       
import UtilityManager from './scripts/UtilityManager.js';   
import GameManager    from './scripts/GameManager.js';
import EntityManager  from './scripts/EntityManager.js';
import BattleManager  from './scripts/BattleManager.js';
import CanvasManager  from './scripts/CanvasManager.js';

// 나중에 햇갈리지 않게 매니져들 싹다 선언하자.
let gameManager = GameManager.getInstance(); // 게임 매니저

SceneManager.getInstance();   // 씬메니저
UtilityManager.getInstance(); // 유틸리티 매니저
EntityManager.getInstance();  // 엔티티 매니저
BattleManager.getInstance();  // 배틀 매니저
CanvasManager.getInstance();  // 캔버스 매니저


gameManager.GameInitialization();

await gameManager.Run();

// 씬메니저 초기화.
//

// 테스트용도.~ 담피하고 싱글턴으로 바꾸자 씬매니저도 
//gameManager.Test();

// CanvasManager.text_Maker("테스트", 100, {color : "blue", style : "bold"});
// CanvasManager.text_Maker("테스트", 100, {color : "red"});
// CanvasManager.text_Maker("", 100, {color : "blue"});


// await CanvasManager.ascllArt_Maker("Dungeon Manager", 100, {color : "red", style : "bold"});
// await CanvasManager.ascllArt_Maker("Management", 100, {color : "red"});
// await CanvasManager.ascllArt_Maker("test", 100, {color : "blue"});
// CanvasManager.text_Maker("테스트", 100, {color : "red"});
//CanvasManager.DeleteText();
//await CanvasManager.text_Maker("---------------------------------------------", 0, {color : "green", style : "bold"});
//await CanvasManager.text_Maker("          Dungeon Manager Program", 0, {color : "blue", style : "bold"});
//await CanvasManager.text_Maker("---------------------------------------------", 0, {color : "green", style : "bold"});
// await CanvasManager.typeWithDelay("System Initialization... Please Stand By.", 10, {color : "green", style : "bold"});
// await CanvasManager.typeWithDelay("System Initialization... Please Stand By.", 10, {color : "green", style : "bold"});
// await CanvasManager.typeWithDelay("Authenticating User... Access Pending.", 10, {color : "green", style : "bold"});
// await CanvasManager.typeWithDelay("Synchronizing Data... Please Wait.", 10, {color : "green", style : "bold"});
// await CanvasManager.typeWithDelay("Running Diagnostics... System Check Complete.", 10, {color : "green", style : "bold"});
// await CanvasManager.typeWithDelay("Verifying User Credentials... Authentication Successful.", 10, {color : "green", style : "bold"});
// await CanvasManager.typeWithDelay("Data Sync in Progress... 45% Complete..", 10, {color : "green", style : "bold"});
// await CanvasManager.typeWithDelay("Initializing Core Modules... All Systems Operational.", 10, {color : "green", style : "bold"});
// await CanvasManager.typeWithDelay("Loading Dungeon Assets... Data Synchronization in Progress.", 10, {color : "green", style : "bold"});
// await CanvasManager.typeWithDelay("User Access Granted... Syncing Game Data.", 10, {color : "green", style : "bold"});
// await CanvasManager.typeWithDelay("System Boot Complete... Preparing Dungeon Network.", 10, {color : "green", style : "bold"});
//await CanvasManager.tableInputPrompt ();
// await CanvasManager.selectOption();
//await CanvasManager.askCheckbox();
// await CanvasManager.promptForKeyPress();
//await CanvasManager.TestAin("로딩중입니다", "로딩이 완료 되었습니다.", 2000, {color : "green", style : "bold"});
//await CanvasManager.TestAin("로딩중입니다", "로딩이 완료 되었습니다.", 2000, {color : "green", style : "bold"});
//await CanvasManager.promptForKeyPress({color : "blue", style : "bold"});