import GameManager from './scripts/GameManager.js';

// 게임의 모든 메니저를 가지고 있는 게임메니저 초기화.
await GameManager.initialization();

// 게임 시작.
await GameManager.Run();

