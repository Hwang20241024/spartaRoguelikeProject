import UtilityManager from './UtilityManager.js';
import EntityManager from './EntityManager.js';
import inquirer from 'inquirer';
import chalk from 'chalk';

export default class BattleManager {
  // 클래스 인스턴스를 저장할 private static 변수
  static #instance = null;

  constructor() {
    if (BattleManager.#instance) {
      throw new Error('Use BattleManager.getInstance() 를 사용하여 인스턴스에 접근하세요.');
    }

    // 메니져 연결
    this.utilityManager = UtilityManager.getInstance();
    this.entityManager = EntityManager.getInstance();

    // 전역으로 사용할 데이터
    this.battlePriority = this.utilityManager.GetPriorityQueue('BattlePriority');
    this.copyPlayers = [];
    this.copyMonsters = [];
    this.isBattle = true;
    this.isSkip = false;
  }

  // 인스턴스를 생성하거나 반환하는 static 메서드
  static getInstance() {
    if (!BattleManager.#instance) {
      BattleManager.#instance = new BattleManager();
    }
    return BattleManager.#instance;
  }

  // 배틀 시작
  async Run(partyNumber, monsterCode) {
    // 배틀 초기 세팅.
    await this.BattleSetting(partyNumber, monsterCode);

    // 메인 루프
    while (this.isBattle) {
      // 행동결정.
      this.decideAction();
      this.setTarget();



      // 이건 테스트로그임 나중에 까먹지 말고 지우자.
      for (let value of this.battlePriority.GetQueue()) {
        console.log(`${value.GetName()}님의 우선순위는 ${value.GetActionPoint()}입니다.`);
        //console.log(`${value.GetName()}님의 행동은 ${value.GetBattleType()}입니다.`);  
        console.log(chalk.green(`${value.GetName()}님은  ${value.GetTarget()}을 바라봅니다..`));       
       
        // if (value.GetAttack()) {
        //   console.log(chalk.red(`${value.GetName()}님의 공격상태입니다..`));
        // } else if (value.GetDefense()) {
        //   console.log(chalk.red(`${value.GetName()}님의 방어상태입니다..`));
        // } else {
        //   console.log(chalk.red(`${value.GetName()}님의 스킬상태입니다..`));
        // }
      }

      await this.test();


      

      // 전투로직

      // 이제 싸우느거 만들자

      // 체력이 0이아니라면 삭제하고 뒤로 추가
      if (this.battlePriority.peek().GetHp() !== 0) {
        // 현재 상태를 뒤로 보내자.
        let temp = this.battlePriority.Dequeue();
        this.manageAction(temp);
        this.battlePriority.Enqueue(temp);
      } else {
        this.battlePriority.Dequeue();
      }
    }

    // 전투가 끝난다면 초기화해주자.
    this.copyPlayers = [];
    this.copyMonsters = [];
    this.isBattle = !this.isBattle;
  }

  // 배틀 초기 세팅.
  async BattleSetting(partyNumber, monsterCode, mosterName) {
    // 엔티티들을 연결하자
    let players = this.entityManager.GetPlayers();
    let monsters = this.entityManager.GetMonsters();


    // 플레이어와 몬스터를 셋팅하자.
    this.entityManager.InitializationPlayers();

    // monsterCode, name, hp, priority, battleType, party
    this.entityManager.InitializeMonsters(2, monsterCode, 'goblin', 10, 0.8, 1, 1);



    // 플레이어와 몬스터를 복사하자. (※얕은복사)
    if (players.Size()) {
      for (let value of players.GetQueue()) {
        this.copyPlayers.push(value);
      }
    }

   

    if (monsters.Size()) {
      for (let value of monsters.GetQueue()) {
        this.copyMonsters.push(value);
      }
    }

    // 파티가 아닌 인원들을 제외하자. (파티가 아닌 인원들은 대기중인것이다.)
    this.copyPlayers = this.copyPlayers.filter((value) => value.GetParty() !== 0);

    // 진짜 전투를 하는 파티를 구한다.
    this.copyPlayers = this.copyPlayers.filter((value) => value.GetParty() === partyNumber);

    
    // 우선순위 큐에 넣자
    this.battlePriority.clear(); // 혹시 모르니깐 한번 초기화.

    for (let value of this.copyPlayers) {
      this.battlePriority.Enqueue(value);
    }

    for (let value of this.copyMonsters) {
      this.battlePriority.Enqueue(value);
    }

    // 행동력에 따라 우선순위가 정해진다.
    this.GeneratePriority();


    // 카피 배열 쇼트
    this.copyPlayers.sort((a, b) => b.GetActionPoint() - a.GetActionPoint());
    this.copyMonsters.sort((a, b) => b.GetActionPoint() - a.GetActionPoint());
  }

  // 우선순위 설정.
  GeneratePriority() {
    // 우선순위 사이즈가 0이 아닐경우.
    if (this.battlePriority.Size() !== 0) {
      for (let value of this.battlePriority.GetQueue()) {
        let priorityWeight = value.GetPriority();
        let temp = 0;
        // 만약에 0.8이면 80프로 확률로 첫번쨰 확률에 들어간다.
        if (Math.random() < priorityWeight) {
          temp = Math.floor(Math.random() * 50) + 1;
          
        } else {
          temp = Math.floor(Math.random() * (100 - 50)) + 50;
          
        }
        value.ActionPointSetting(temp);     
      }
      // 복사(옅은) 해서 정렬 시키자 원인을 모르겠다. 
      // 정렬 다되는데 마지막요소만 정렬안됨.
      // 아예 안될꺼면 안되버리지 마지막요소가 그런건지.. 
      // 애러도 아니여서 다른 함수들 제대로 동작안하서 거기도 애러 없어서..
      // 내일 보고 기억해두자 "인스턴스를 담은 배열은 그냥 복사해서 정렬을 하든 뭘하자"
      let SaveQueue = this.battlePriority.GetQueue();
      SaveQueue.sort((a, b) => b.GetActionPoint() - a.GetActionPoint());  
      
      // for(let i of SaveQueue){
      //   console.log(chalk.red(`${i.GetName()}님의 우선순위는 ${i.GetActionPoint()}입니다.`));
      // }
      // console.log(`-----------------------------------------`)

      // 복사한 큐를 다시 넣자.
      this.battlePriority.clear();
      this.battlePriority.SrestorationQueue(SaveQueue);

      // for(let i of this.battlePriority.GetQueue()){
      //   console.log(chalk.red(`${i.GetName()}님의 우선순위는 ${i.GetActionPoint()}입니다.`));
      // }
      // console.log(`-----------------------------------------`)
    }
  }

  // 엔티티의 행동결정.
  decideAction() {
    if (this.battlePriority.Size() !== 0) {
      let actionWeights = { attack: 0, defend: 0, skill: 0 };

      for (let value of this.battlePriority.GetQueue()) {
        // 뭐라도 한개라도 있음 넘어가요~
        if (value.GetAttack() || value.GetDefense() || value.GetSkill()) {
          continue;
        }

        // 스킬은 최후 순위라 확률 0으로 만듬.
        switch (value.GetBattleType()) {
          case 1: //  'attack'
            actionWeights.attack = 0.7;
            actionWeights.defend = 0.3;
            actionWeights.skill = 0.0;
            break;
          case 2: //  'defend'
            actionWeights.attack = 0.3;
            actionWeights.defend = 0.7;
            actionWeights.skill = 0.0;
            break;
          case 3: // 'skill'
            actionWeights.attack = 0.5; // 0.2
            actionWeights.defend = 0.5; // 0.2
            actionWeights.skill = 0.0; // 0.6
            break;
        }

        // 가중치이다. 0.7은 70프로 0.2는 20프로  0.1은 10프로 합쳐서 100으로 해야한다
        // 그이상하면 안된다 왜냐면 어차피 랜덤함수는 0 ~ 1 이여서 의미없음 ㅋㅋ!
        const random = Math.random();
        if (random < actionWeights.attack) {
          // 공격 선택
          value.SetAttack();
        } else if (random < actionWeights.attack + actionWeights.defend) {
          // 방어 선택
          value.SetDefense();
        } else {
          // 스킬 선택
          value.SetSkill();
        }
      }
    }
  }

  // 엔티티의 행동삭제
  manageAction(value) {
    if (value.GetAttack()) {
      value.SetAttack();
    } else if (value.GetDefense()) {
      value.SetDefense();
    } else if (value.GetSkill()) {
      value.SetSkill();
    }
    return value;
  }

  // 엔티티의 타겟설정.
  setTarget() {
    /// 문제 생기면 물어보자.
    for(let value of this.battlePriority.GetQueue()){
      // 엔티티타입이 플레이어일 경우.
      if(this.copyMonsters.length > 0 && value.GetEntitytype() === 1){
        value.SetTarget(this.copyMonsters[0].GetName());
        this.copyMonsters.push(this.copyMonsters.shift());
        // 엔티티타입이 몬스터일 경우.
      } else if (this.copyPlayers.length !== 0 && value.GetEntitytype() === 2) {
        value.SetTarget(this.copyPlayers[0].GetName());
        this.copyPlayers.push(this.copyPlayers.shift());
      } 
    }
  }

  // 엔티티의 타겟헤제.
  clearTarget() {

  }

  async test() {
    

    const answers = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'colors',
        message: '',
        choices: ['Red', 'Blue', 'Green', 'Yellow', 'Purple'],
        default: ['Blue', 'Green'], // 기본 선택값
      },
    ]);
  }
}
