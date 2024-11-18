import UtilityManager from './UtilityManager.js';
import EntityManager from './EntityManager.js';


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
    this.isDamages = 5;

    this.battleLog = [];
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
    // 0. 전투 기록할 변수
    this.battleLog = []; // 시작전에 초기화.

    // 1. 배틀 초기 세팅.
    await this.BattleSetting(partyNumber, monsterCode, mosterName);

    // 2. 메인 루프
    while (this.isBattle) {
      // 로직을 다시 보자
      this.decideAction(); //  현재 행동을 정하자.
      this.setTarget();    //  타겟을 정하자.

      // 행동 시작 알림.
      if (!this.battlePriority.peek().GetIsDead()) {
        let str = '';

        for (let value of this.battlePriority.GetQueue()) {
          str += '[' + value.GetName() + ']';
        }
        this.Log(str);
        this.Log(`[${this.battlePriority.peek().GetName()}] 행동을 시작합니다.`);
      }

      // 전투시작.
      this.startAction();

      // 행동 종료 알림.
      if (!this.battlePriority.peek().GetIsDead()) {
        this.Log(`[${this.battlePriority.peek().GetName()}] 행동을 종료합니다.`);
        this.Log(`@@@@@@`);
      }

      // 타겟 지우기 
      this.clearTarget(); 
      // 우선 순위 변경.
      this.removePriority();

      // 둘중 한쪽이 전멸하면 ..
      if (this.copyPlayers.length === 0 || this.copyMonsters.length === 0) {
        this.isBattle = !this.isBattle;
      }
    }

    this.Log(`[${partyNumber}파티 전투 종료.]`);

    if (this.copyPlayers.length === 0) {
      this.Log(`[${partyNumber}파티 패배.]`);
    } else {
      this.Log(`[${partyNumber}파티 승리.]`);
    }

    // 전투가 끝난다면 초기화해주자.
    this.copyPlayers = [];
    this.copyMonsters = [];
    this.isBattle = !this.isBattle;

    // 전투 데이터를 리턴.
    return this.battleLog;
  }

  // 배틀 초기 세팅.
  async BattleSetting(partyNumber, monsterCode, mosterName) {
    // 엔티티들을 연결하자
    let players = this.entityManager.GetPlayers();
    let monsters = this.entityManager.GetMonsters();

    this.entityManager.InitializeMonsters(monsterCode, mosterName, 5, 0.8, 3, 1, false);

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

    // 파티가 아닌 인원들을 제외하자.
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
  async GeneratePriority() {
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
  async decideAction() {
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
            actionWeights.skill = 0.8; // 0.1
            break;
          case 2: //  'defend'
            actionWeights.attack = 0.1; // 0.2
            actionWeights.defend = 0.2; // 0.7
            actionWeights.skill = 0.7; // 0.1
            break;
          case 3: // 'skill'
            actionWeights.attack = 0.1; // 0.2
            actionWeights.defend = 0.2; // 0.2
            actionWeights.skill = 0.6; // 0.6
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
  async manageAction(value) {
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
  async setTarget() {
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
  async clearTarget() {
    // 로직 요약.
    // #0. 현제 베틀메니저 로직상 우선순위 큐 순서대로 진행된다.
    // #1. 우선순위상 1등이 보고 있는 타겟 삭제.
    // #2. 만약에 우선순위에 있는 다른 엔티티가 해당 타겟을 바라보고 있다면 삭제.
    // #3. 카피한 몬스터와 플레이어 카피 배열에서 해당 이름을 가지고 있는 배열 삭제.

    // 0. 타겟 지웠는지 판단하는 변수
    let isClearTarget = false;

    // 1. 현재 우선순위 복사.
    let capybattlePriority = this.battlePriority.GetQueue();

    // 2. 타겟이름 가져오기
    let targetName = capybattlePriority[0].GetTarget();

    if (targetName !== '') {
      // 3. 타겟 찾기.
      let temp = capybattlePriority.find((item) => item.GetName() === targetName);

      
      if (temp === null || temp === undefined) {
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
  async removePriority() {
    if (this.battlePriority.Size() !== 0) {
      // 체력이 0이아니라면 삭제하고 뒤로 추가
      if (!this.battlePriority.peek().GetIsDead()) {
        // 현재 상태를 뒤로 보내자.
        let temp = this.battlePriority.Dequeue();
        this.manageAction(temp);

        this.battlePriority.Enqueue(temp);
      } else {
        this.battlePriority.Dequeue();
      }
    }

    // 여기 수정하자.
  }

  // 엔티티의 엑션 시작.
  async startAction() {
    // 우선순위 복사.
    let capybattlePriority = this.battlePriority.GetQueue();
    let currentEntity = this.battlePriority.peek();

    // 타겟 연결..
    let targetName = currentEntity.GetTarget();
    let target = capybattlePriority.find((item) => item.GetName() === targetName);

    // 일단 내가 죽으면 안됨...
    if (currentEntity.GetIsDead()) {
      console.clear();
      return null;
    }

    // 혹시 모르니깐
    if (target === null || target === undefined) {
      console.clear();
      return null;
    }

    // 본인의 상태 선택.
    if (currentEntity.GetAttack()) {
      this.Log(`${currentEntity.GetName()}님이 공격을 준비합니다.`);
      if (!target.GetIsDead()) {
        //상대방이 방어중이라면.
        if (target.GetDefense()) {
          this.Log(`${targetName}님이 방어를 준비합니다.`);
          this.Log(`${currentEntity.GetName()}님이 ${targetName}을 공격합니다.`);
          this.Log(`${targetName}님이 ${currentEntity.GetName()}의 공격을 막았습니다.`);
          target.SetDefense(); // 타겟 방어 해제.
          currentEntity.SetAttack(); // 본인 공격 헤제.
        } else {
          // 10을 준건 테스트 때문이다.
          target.SetHp(target.GetHp() - this.isDamages);
          currentEntity.SetAttack(); // 본인 공격 헤제.
          this.Log(`${currentEntity.GetName()}님이 ${targetName}을 공격합니다.`);
          this.Log(`${currentEntity.GetName()}님이 공격에 성공습니다.`);
          this.Log(`${targetName}님은 데미지를 받았습니다. (남은체력 : ${Math.max(0, target.GetHp())}).`);
        }

        // 타겟의 체력이 0이 되었다면..?
        if (target.GetHp() <= 0) {
          target.SetIsDead();
          this.Log(`${targetName}님이 죽었습니다. (남은체력 : ${Math.max(0, target.GetHp())}).`);
        }
      } else {
        this.Log(`${targetName}님이 이미 죽었습니다..`);
        this.Log(`${currentEntity.GetName()}님은 공격을 하지못했습니다.`);

        currentEntity.SetAttack();
      }
    } else if (currentEntity.GetDefense()) {
      this.Log(`${currentEntity.GetName()}님이 방어를 준비합니다.`);

      if (target.GetIsDead()) {
        this.Log(`${targetName}님이 이미 죽었습니다.`);
        this.Log(`${currentEntity.GetName()}님은 방어를 하지못했습니다.`);
        currentEntity.SetDefense();
      }
    } else if (currentEntity.GetSkill()) {
      this.skillSatting(currentEntity.GetBattleType(), currentEntity, target);
    }
  }

  // 스킬 세팅.
  async skillSatting(type, currentEntity, target) {
    let temp = Math.floor(Math.random() * 2) + 1;

    if (type !== 3) {
      if (temp === 1) {
        this.Log(`${currentEntity.GetName()}님이 더블 어택을 사용합니다.`);

        if (!target.GetIsDead()) {
          // 더블 어택 //
          if (target.GetDefense()) {
            this.Log(`${target.GetName()}님이 방어를 준비합니다.`);
            this.Log(`${currentEntity.GetName()}님이 ${target.GetName()}을 공격합니다.`);
            this.Log(`${target.GetName()}님이 ${currentEntity.GetName()}의 공격을 막았습니다.`);

            target.SetDefense(); // 타겟 방어 해제.

            this.Log(`${currentEntity.GetName()}님이 ${target.GetName()}을 공격합니다.`);
            this.Log(`${currentEntity.GetName()}님이 공격에 성공습니다.`);

            target.SetHp(target.GetHp() - this.isDamages);

            this.Log(`${target.GetName()}님은 데미지를 받았습니다. (남은체력 : ${Math.max(0, target.GetHp())}).`);

            currentEntity.SetSkill(); // 본인 공격 헤제.
          } else {
            this.Log(`${currentEntity.GetName()}님이 ${target.GetName()}을 공격합니다.`);
            this.Log(`${currentEntity.GetName()}님이 공격에 성공습니다.`);

            target.SetHp(target.GetHp() - this.isDamages);

            this.Log(`${target.GetName()}님은 데미지를 받았습니다. (남은체력 : ${Math.max(0, target.GetHp())}).`);

            this.Log(`${currentEntity.GetName()}님이 ${target.GetName()}을 공격합니다.`);
            this.Log(`${currentEntity.GetName()}님이 공격에 성공습니다.`);

            target.SetHp(target.GetHp() - this.isDamages);

            this.Log(`${target.GetName()}님은 데미지를 받았습니다. (남은체력 : ${Math.max(0, target.GetHp())}).`);

            currentEntity.SetSkill(); // 본인 공격 헤제.
          }

          // 타겟의 체력이 0이 되었다면..?
          if (target.GetHp() <= 0) {
            target.SetIsDead();
            this.Log(`${target.GetName()}님이 죽었습니다.. (남은체력 : ${Math.max(0, target.GetHp())}).`);
          }
        } else {
          this.Log(`${target.GetName()}님이 이미 죽었습니다.`);
          this.Log(`${currentEntity.GetName()}님은 스킬을 사용하지 못했습니다.`);

          currentEntity.SetSkill(); // 본인 공격 헤제.
        }
      } else {
        // 파워 어택 //
        this.Log(`${currentEntity.GetName()}님이 파워 어택을 사용합니다.`);
        this.Log(`${currentEntity.GetName()}님이 강력한 일격을 준비합니다..`);

        if (!target.GetIsDead()) {
          if (target.GetDefense()) {
            this.Log(`${target.GetName()}님이 방어를 준비합니다.`);
            this.Log(`${currentEntity.GetName()}님이 ${target.GetName()}을 공격합니다.`);
            this.Log(`${target.GetName()}님이 ${currentEntity.GetName()}의 공격을 막았습니다.`);

            target.SetDefense(); // 타겟 방어 해제.
            currentEntity.SetSkill(); // 본인 공격 헤제.
          } else {
            this.Log(`${currentEntity.GetName()}님이 ${target.GetName()}을 공격합니다.`);
            this.Log(`${currentEntity.GetName()}님이 공격에 성공습니다.`);

            target.SetHp(-target.GetHp());

            this.Log(`${target.GetName()}님은 즉사 했습니다. (남은체력 : ${Math.max(0, target.GetHp())}).`);

            // 타겟의 체력이 0이 되었다면..?
            if (target.GetHp() <= 0) {
              target.SetIsDead();
            }
          }
        } else {
          this.Log(`${target.GetName()}님이 이미 죽었습니다.`);
          this.Log(`${currentEntity.GetName()}님은 스킬을 사용하지 못했습니다.`);

          currentEntity.SetSkill(); // 본인 공격 헤제.
        }
      }
    } else {
      while (true) {
        // 배열의 길이가 없다면 리턴하자
        if (this.copyMonsters.length <= 0 && this.copyPlayers.length <= 0) {
          return null;
        }
        ///
        let teamTargetIndex01 = Math.floor(Math.random() * this.copyPlayers.length);
        let teamTargetIndex02 = Math.floor(Math.random() * this.copyMonsters.length);

        if (currentEntity.GetEntitytype() === 1) {

          

          // 코드 수정해야함.
          if (this.copyPlayers[teamTargetIndex01].GetName() === currentEntity.GetName()) {
            if (this.copyPlayers.length === 1) {
              break;
            }
          }

          if (this.copyPlayers[teamTargetIndex01].GetName() !== currentEntity.GetName()) {
            this.Log(`${currentEntity.GetName()}님이 힐을 사용을 준비합니다...`);

            if (!this.copyPlayers[teamTargetIndex01].GetIsDead()) {
              this.copyPlayers[teamTargetIndex01].SetHp(this.copyPlayers[teamTargetIndex01].GetHp() + 1);

              this.Log(`${currentEntity.GetName()}님이 ${this.copyPlayers[teamTargetIndex01].GetName()}에게 힐을 사용하였습니다. `);
              this.Log(`${this.copyPlayers[teamTargetIndex01].GetName()}} 회복 하였습니다.(남은체력 : ${this.copyPlayers[teamTargetIndex01].GetHp()})`);

              currentEntity.SetSkill(); // 본인 공격 헤제.
            } else {
              this.Log(`${this.copyPlayers[teamTargetIndex01].GetName()}님이 이미 죽었습니다.`);
              this.Log(`${currentEntity.GetName()}님은 스킬을 사용하지 못했습니다.`);

              currentEntity.SetSkill(); // 본인 공격 헤제.
            }
            break;
          }
          // 남은놈이 자기밖에 없는데 본인 은 안되서..
        } else if (currentEntity.GetEntitytype() === 2) {
          // 코드 수정해야함.
          if (this.copyMonsters[teamTargetIndex02].GetName() === currentEntity.GetName()) {
            if (this.copyMonsters.length === 1) {
              break;
            }
          }

          if (this.copyMonsters[teamTargetIndex02].GetName() !== currentEntity.GetName()) {
            this.Log(`${currentEntity.GetName()}님이 힐을 사용을 준비합니다...`);
            // console.log(`${currentEntity.GetName()}님이 힐을 사용을 준비합니다...`);

            if (!this.copyMonsters[teamTargetIndex02].GetIsDead()) {
              this.copyMonsters[teamTargetIndex02].SetHp(this.copyMonsters[teamTargetIndex02].GetHp() + 1);

              this.Log(`${currentEntity.GetName()}님이 ${this.copyMonsters[teamTargetIndex02].GetName()}에게 힐을 사용하였습니다. `);
              this.Log(`${this.copyMonsters[teamTargetIndex02].GetName()}} 회복 하였습니다.(남은체력 : ${this.copyMonsters[teamTargetIndex02].GetHp()})`);

              currentEntity.SetSkill(); // 본인 공격 헤제.
            } else {
              this.Log(`${this.copyMonsters[teamTargetIndex02].GetName()}님이 이미 죽었습니다.`);
              this.Log(`${currentEntity.GetName()}님은 스킬을 사용하지 못했습니다.`);

              
              currentEntity.SetSkill(); // 본인 공격 헤제.
            }
            break;
          }
        }
      }
    }
  }

  // 로그기억용.
  async Log(str) {
    this.battleLog.push(str);
  }
}
