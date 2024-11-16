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
    this.isDamages = 3;
  }

  // 인스턴스를 생성하거나 반환하는 static 메서드
  static getInstance() {
    if (!BattleManager.#instance) {
      BattleManager.#instance = new BattleManager();
    }
    return BattleManager.#instance;
  }

  // 배틀 시작
  async Run(partyNumber, monsterCode, mosterName) {
    // 1. 배틀 초기 세팅.
    await this.BattleSetting(partyNumber, monsterCode, mosterName);

    // 2. 메인 루프
    while (this.isBattle) {
      // 로직을 다시 보자
      this.decideAction(); // 1. 현재 행동을 정하자.
      this.setTarget(); // 3. 타겟을 정하자.

      if (!this.battlePriority.peek().GetIsDead()) {
        console.log(
          chalk.red(
            `${this.battlePriority.peek().GetName()}님의 차례 (타겟: ${this.battlePriority.peek().GetTarget()} ) `,
          ),
        );
        
      }
      // 2 - 4. 순위와 행동과 타겟을 결정했으면 이제 전투 시작.
      this.startAction();

      if (!this.battlePriority.peek().GetIsDead()) {
        console.log(
          chalk.green(`${this.battlePriority.GetQueue()[0].GetName()}님이 차례는 끝났습니다..`),
        );
      }

      this.clearTarget(); // 2. 타겟을 클리어 하자.
      // 2 - 5. 우선 순위 변경
      this.removePriority();

      // 이건 테스트로그임 나중에 까먹지 말고 지우자.
      // if (this.battlePriority.Size() !== 0) {
      //   console.log(chalk.red(`현재 남아있는 엔티티는 ${this.battlePriority.Size()} 입니다.`));
      //   console.log(chalk.red(`플레이어 : ${this.copyPlayers.length} 생존`));
      //   console.log(chalk.red(`몬스터 : ${this.copyMonsters.length} 생존`));
      // }

      // 둘중 한쪽이 전멸하면 ..
      if (this.copyPlayers.length === 0 || this.copyMonsters.length === 0) {
        this.isBattle = !this.isBattle;
      }
      this.test2();
      await this.test();
    }

    console.log(chalk.red(`게임이 끝났습니다.`));
    await this.test();

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
    //this.entityManager.InitializationPlayers();

    // monsterCode, name, hp, priority, battleType, party // 렌덤으로 돌리는거 만들어야함.
    this.entityManager.InitializeMonsters(monsterCode, mosterName, 5, 0.8, 3, 1);
    

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

      let SaveQueue = this.battlePriority.GetQueue();
      SaveQueue.sort((a, b) => b.GetActionPoint() - a.GetActionPoint());

      // 복사한 큐를 다시 넣자.
      this.battlePriority.clear();
      this.battlePriority.SrestorationQueue(SaveQueue);
    }
  }

  // 엔티티의 행동결정.
  decideAction() {
    if (this.battlePriority.Size() !== 0) {
      let actionWeights = { attack: 0, defend: 0, skill: 0 };

      for (let value of this.battlePriority.GetQueue()) {
        // 뭐라도 한개라도 있음 넘어가요~
        if (value.GetAttack() || value.GetDefense() || value.GetSkill() || value.GetIsDead()) {
          continue;
        }

        // 스킬은 최후 순위라 확률 0으로 만듬.
        switch (value.GetBattleType()) {
          case 1: //  'attack'
            actionWeights.attack = 0.1; // 0.7
            actionWeights.defend = 0.1; // 0.2
            actionWeights.skill = 0.9;  // 0.1
            break;
          case 2: //  'defend'
            actionWeights.attack = 0.2; // 0.2
            actionWeights.defend = 0.2; // 0.7
            actionWeights.skill = 0.8;  // 0.1
            break;
          case 3: // 'skill'
            actionWeights.attack = 0.1; // 0.2
            actionWeights.defend = 0.1; // 0.2
            actionWeights.skill = 0.8; // 0.6
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
    // 1. 우선순위 큐를 한바퀴 돌린다.
    for (let value of this.battlePriority.GetQueue()) {
      // 본인이 죽으면 넘기자.
      if (value.GetIsDead()) {
        continue;
      }

      // 2. 엔티티가 플레이어 일 때.
      if (this.copyMonsters.length > 0 && value.GetEntitytype() === 1) {
        // 2 - 1. 만약에 타겟이 지정되어졌다면.
        if (!value.GetTarget()) {
          // 2 - 1 - 1. 타겟을 지정해준다.
          value.SetTarget(this.copyMonsters[0].GetName());
        }
        // 2 - 2. 순차적으로 밀어 넣는다.
        this.copyMonsters.push(this.copyMonsters.shift());
      }
      // 3. 엔티티가 몬스터 일 때.
      if (this.copyPlayers.length !== 0 && value.GetEntitytype() === 2) {
        // 3 - 1. 만약에 타겟이 지정되어졌다면.
        if (!value.GetTarget()) {
          // 3 - 1 - 1. 타겟을 지정해준다.
          value.SetTarget(this.copyPlayers[0].GetName());
        }
        // 3 - 2. 순차적으로 밀어 넣는다.
        this.copyPlayers.push(this.copyPlayers.shift());
      }
    }
  }

  // 엔티티의 타겟헤제.
  clearTarget() {
    // 로직 요약.
    // #0. 현제 베틀메니저 로직상 우선순위 큐 순서대로 진행된다.
    // #1. 우선순위상 1등이 보고 있는 타겟 삭제.
    // #2. 만약에 우선순위에 있는 다른 엔티티가 해당 타겟을 바라보고 있다면 삭제.
    // #3. 카피한 몬스터와 플레이어 카피 배열에서 해당 이름을 가지고 있는 배열 삭제.

    // 조건문에 노랑줄 떳다. 이유는 간결하게 하라고 알아보니위에처럼 ? 하는 방법이있다.
    // null 또는 undefined일 경우 undefined를 반환한다고 한다..
    // (그냥 있다길레 써밨다. 근데 굳이? 라는 느낌이 더든다.)

    // 0. 타겟 지웠는지 판단하는 변수
    let isClearTarget = false;

    // 1. 현재 우선순위 복사.
    let capybattlePriority = this.battlePriority.GetQueue();

    // 2. 타겟이름 가져오기
    let targetName = capybattlePriority[0].GetTarget();

    if (targetName !== '') {
      // 여기수정 하자..
      // 3. 타겟 찾기.
      let temp = capybattlePriority.find((item) => item.GetName() === targetName);

      // 이건테스트
      if(temp === null || temp === undefined){
        // 느낌상 네임은 가지고 있는데 이미 타겟이없다면? 거기서 에러인거같은데
        return null;
      }

      // 4. 타겟이 죽었다면 타겟ㅇ르 지운다.
      if (temp.GetIsDead()) {
        capybattlePriority[0].SetTarget('');
        isClearTarget = true;
      }
    }

    // 5. 현재 본인의 타입에 따라 카피 배열삭제.
    if (isClearTarget) {
      if (capybattlePriority[0].GetEntitytype() === 1) {
        this.copyMonsters = this.copyMonsters.filter((item) => item.GetName() !== targetName);
      } else if (capybattlePriority[0].GetEntitytype() === 2) {
        this.copyPlayers = this.copyPlayers.filter((item) => item.GetName() !== targetName);
      }
    }
  }

  // 우선순위 삭제.
  removePriority() {
    if (this.battlePriority.Size() !== 0) {
      // 체력이 0이아니라면 삭제하고 뒤로 추가
      if (!this.battlePriority.peek().GetIsDead()) {
        // 현재 상태를 뒤로 보내자.
        let temp = this.battlePriority.Dequeue();
        // 여기는 다시 보자.반드시!!!
        this.manageAction(temp);
        //
        this.battlePriority.Enqueue(temp);
      } else {
        this.battlePriority.Dequeue();
      }
    }

    // 여기 수정하자.
  }

  // 엔티티의 엑션 시작.
  startAction() {
   

    // 우선순위 복사.
    let capybattlePriority = this.battlePriority.GetQueue();
    let currentEntity = this.battlePriority.peek();

    // 타겟 연결..
    let targetName = currentEntity.GetTarget();
    let target = capybattlePriority.find((item) => item.GetName() === targetName);

    // 일단 내가 죽으면 안됨...
    if (currentEntity.GetIsDead()){
      console.clear();
      return null;
    }

    // 혹시모르니깐 
    if(target === null || target === undefined){
      console.clear();
      console.log("뭔가 문제 생김");
      return null;
    }

    // 본인의 상태 선택.
    if (currentEntity.GetAttack()) {
      console.log(`${currentEntity.GetName()}님이 공격을 준비합니다.`);
      if (!target.GetIsDead()) {
        //상대방이 방어중이라면.
        if (target.GetDefense()) {
          console.log(`${targetName}님이 방어를 준비합니다.`);
          console.log(`${currentEntity.GetName()}님이 ${targetName}을 공격합니다.`);
          console.log(`${targetName}님이 ${currentEntity.GetName()}의 공격을 막았습니다.`);
          target.SetDefense(); // 타겟 방어 해제.
          currentEntity.SetAttack(); // 본인 공격 헤제.
        } else {
          // 10을 준건 테스트 때문이다.
          target.SetHp(target.GetHp() - this.isDamages);
          currentEntity.SetAttack(); // 본인 공격 헤제.
          console.log(`${currentEntity.GetName()}님이 ${targetName}을 공격합니다.`);
          console.log(`${currentEntity.GetName()}님이 공격에 성공습니다.`);
          console.log(`${targetName}님은 데미지를 받았습니다. (남은체력 : ${target.GetHp()}).`);
        }

        // 타겟의 체력이 0이 되었다면..?
        if (target.GetHp() <= 0) {
          target.SetIsDead();
          console.log(`${targetName}님이 죽었습니다.. (남은체력 : ${target.GetHp()}).`);
          console.log(`${target.GetIsDead()}).`);
        }
      } else {
        console.log(`${targetName}님이 남은 체력 (남은체력 : ${target.GetHp()}).`);
        console.log(`${targetName}님이 이미 죽었습니다.`);
        console.log(`${currentEntity.GetName()}님은 공격을 하지못했습니다.`);
        currentEntity.SetAttack();
      }
    } else if (currentEntity.GetDefense()) {
      console.log(`${currentEntity.GetName()}님이 방어를 준비합니다.`);

      if (target.GetIsDead()) {
        console.log(`${targetName}님이 이미 죽었습니다.`);
        console.log(`${currentEntity.GetName()}님은 방어를 하지못했습니다.`);
        currentEntity.SetDefense();
      }
    } else if (currentEntity.GetSkill()) {
      this.skillSatting(currentEntity.GetBattleType(), currentEntity, target);
    }
  }

  // 스킬 세팅.
  skillSatting(type, currentEntity, target) {
    let temp = Math.floor(Math.random() * 2) + 1;

    if (type !== 3) {
      if (temp === 1) {
        console.log(`${currentEntity.GetName()}님이 더블 어택을 사용합니다.`);

        if (!target.GetIsDead()) {
          // 더블 어택 //
          if (target.GetDefense()) {
            console.log(`${target.GetName()}님이 방어를 준비합니다.`);
            console.log(`${currentEntity.GetName()}님이 ${target.GetName()}을 공격합니다.`);
            console.log(`${target.GetName()}님이 ${currentEntity.GetName()}의 공격을 막았습니다.`);
            target.SetDefense(); // 타겟 방어 해제.

            console.log(`${currentEntity.GetName()}님이 ${target.GetName()}을 공격합니다.`);
            console.log(`${currentEntity.GetName()}님이 공격에 성공습니다.`);
            target.SetHp(target.GetHp() - this.isDamages);
            console.log(
              `${target.GetName()}님은 데미지를 받았습니다. (남은체력 : ${target.GetHp()}).`,
            );
            currentEntity.SetSkill(); // 본인 공격 헤제.
          } else {
            console.log(`${currentEntity.GetName()}님이 ${target.GetName()}을 공격합니다.`);
            console.log(`${currentEntity.GetName()}님이 공격에 성공습니다.`);
            target.SetHp(target.GetHp() - this.isDamages);
            console.log(
              `${target.GetName()}님은 데미지를 받았습니다. (남은체력 : ${target.GetHp()}).`,
            );

            console.log(`${currentEntity.GetName()}님이 ${target.GetName()}을 공격합니다.`);
            console.log(`${currentEntity.GetName()}님이 공격에 성공습니다.`);
            target.SetHp(target.GetHp() - this.isDamages);
            console.log(
              `${target.GetName()}님은 데미지를 받았습니다. (남은체력 : ${target.GetHp()}).`,
            );
            currentEntity.SetSkill(); // 본인 공격 헤제.
          }

          // 타겟의 체력이 0이 되었다면..?
          if (target.GetHp() <= 0) {
            target.SetIsDead();
            console.log(`${target.GetName()}님이 죽었습니다.. (남은체력 : ${target.GetHp()}).`);
          }
        } else {
          console.log(`${target.GetName()}님이 이미 죽었습니다.`);
          console.log(`${currentEntity.GetName()}님은 스킬을 사용하지 못했습니다.`);
          currentEntity.SetSkill(); // 본인 공격 헤제.
        }
      } else {
        // 파워 어택 //
        console.log(`${currentEntity.GetName()}님이 파워 어택을 사용합니다.`);
        console.log(`${currentEntity.GetName()}님이 강력한 일격을 준비합니다..`);

        if (!target.GetIsDead()) {
          if (target.GetDefense()) {
            console.log(`${target.GetName()}님이 방어를 준비합니다.`);
            console.log(`${currentEntity.GetName()}님이 ${target.GetName()}을 공격합니다.`);
            console.log(`${target.GetName()}님이 ${currentEntity.GetName()}의 공격을 막았습니다.`);
            target.SetDefense(); // 타겟 방어 해제.
            currentEntity.SetSkill(); // 본인 공격 헤제.
          } else {
            console.log(`${currentEntity.GetName()}님이 ${target.GetName()}을 공격합니다.`);
            console.log(`${currentEntity.GetName()}님이 공격에 성공습니다.`);
            target.SetHp(-target.GetHp());
            console.log(`${target.GetName()}님은 즉사 했습니다. (남은체력 : ${target.GetHp()}).`);

            // 타겟의 체력이 0이 되었다면..?
            if (target.GetHp() <= 0) {
              target.SetIsDead();
              console.log(`${target.GetName()}님이 죽었습니다.. (남은체력 : ${target.GetHp()}).`);
            }
          }
        } else {
          console.log(`${target.GetName()}님이 이미 죽었습니다.`);
          console.log(`${currentEntity.GetName()}님은 스킬을 사용하지 못했습니다.`);
          currentEntity.SetSkill(); // 본인 공격 헤제.
        }
      }
    } else {
      while (true) {
        // 배열의 길이가 없다면 리턴하자 
        if(this.copyMonsters.length <= 0 || this.copyPlayers.length <= 0){
          return null;
        }


        let teamTargetIndex = Math.floor(Math.random() * this.copyMonsters.length);


        if(currentEntity.GetEntitytype() === 1){

          // 코드 수정해야함.
          if(this.copyPlayers[teamTargetIndex].GetName() === currentEntity.GetName()) {
            if(this.copyPlayers.length === 1) {
              break;
            }
          }

          
          if (this.copyPlayers[teamTargetIndex].GetName() !== currentEntity.GetName()) {
            console.log(`${currentEntity.GetName()}님이 힐을 사용을 준비합니다...`);
  
            if (!this.copyPlayers[teamTargetIndex].GetIsDead()) {
              this.copyPlayers[teamTargetIndex].SetHp(this.copyPlayers[teamTargetIndex].GetHp() + 1);
              
              console.log(
                `${currentEntity.GetName()}님이 ${this.copyPlayers[teamTargetIndex].GetName()}에게 힐을 사용하였습니다. `,
              );
              console.log(
                `${this.copyPlayers[teamTargetIndex].GetName()}} 회복 하였습니다.(남은체력 : ${this.copyPlayers[teamTargetIndex].GetHp()})`,
              );
              currentEntity.SetSkill(); // 본인 공격 헤제.
            } else {
              console.log(`${this.copyPlayers[teamTargetIndex].GetName()}님이 이미 죽었습니다.`);
              console.log(`${currentEntity.GetName()}님은 스킬을 사용하지 못했습니다.`);
              currentEntity.SetSkill(); // 본인 공격 헤제.
            }
            break;
          }
          // 남은놈이 자기밖에 없는데 본인 은 안되서..
        } else if (currentEntity.GetEntitytype() === 2) {

          // 코드 수정해야함.
          if(this.copyMonsters[teamTargetIndex].GetName() === currentEntity.GetName()) {
            if(this.copyMonsters.length === 1) {
              break;
            }
          }

          if (this.copyMonsters[teamTargetIndex].GetName() !== currentEntity.GetName()) {
            console.log(`${currentEntity.GetName()}님이 힐을 사용을 준비합니다...`);
  
            if (!this.copyMonsters[teamTargetIndex].GetIsDead()) {
              this.copyMonsters[teamTargetIndex].SetHp(this.copyMonsters[teamTargetIndex].GetHp() + 1);
              
              console.log(
                `${currentEntity.GetName()}님이 ${this.copyMonsters[teamTargetIndex].GetName()}에게 힐을 사용하였습니다. `,
              );
              console.log(
                `${this.copyMonsters[teamTargetIndex].GetName()}} 회복 하였습니다.(남은체력 : ${this.copyMonsters[teamTargetIndex].GetHp()})`,
              );
              currentEntity.SetSkill(); // 본인 공격 헤제.
            } else {
              console.log(`${this.copyMonsters[teamTargetIndex].GetName()}님이 이미 죽었습니다.`);
              console.log(`${currentEntity.GetName()}님은 스킬을 사용하지 못했습니다.`);
              currentEntity.SetSkill(); // 본인 공격 헤제.
            }
            break;
          }
        }
      }
    }
  }

  async test() {
    const answers = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'colors',
        message: '',
        choices: ['Red'],
        default: ['Blue', 'Green'], // 기본 선택값
      },
    ]);
    console.clear();
  }

  test2() {
    // 현재 모든 상태 로그로 찍자
    let str = '플레이어 :';

    for (let value of this.copyPlayers) {
      str += '[' + value.GetName() + ']';
    }

    console.log(chalk.blue(str + '(사이즈 : ' + this.copyPlayers.length + ' )'));

    str = '몬스터   :';

    for (let value of this.copyMonsters) {
      str += '[' + value.GetName() + ']';
    }

    console.log(chalk.blue(str + '(사이즈 : ' + this.copyMonsters.length + ' )'));

    str = '우선순위 :';

    for (let value of this.battlePriority.GetQueue()) {
      str += '[' + value.GetName() + ']';
    }

    console.log(chalk.blue(str + '(사이즈 : ' + this.battlePriority.Size() + ' )'));
  }
}
