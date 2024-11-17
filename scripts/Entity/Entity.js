// 모든 엔티티의 원형이 될 클래스이다.
export default class Entity {
  #Information;
  #CombatStats;

  constructor(entitytype, name, hp, priority, battleType, party, isDead) {
    this.#Information = {
      entitytype: entitytype, // 타입 플레이어냐 몬스터냐 (디폴트: 0)
      name: name, // 이름
      hp: hp, // 체력
      actionPoints: 0, // 우선순위
      isAttack: false, // 공격 하고 있는가?
      isDefense: false, // 방어 하고 있는가?
      isSkill: false, // 스킬 사용 하고 있는가?
      isDead: isDead, // 죽었는가?
      priority: priority, // 가중치.
      party: party, // 파티에 속해있는가 (디폴트 : 0 // 파티없음)
      target: '', // 전투중에 누굴 지목하였는가.
    };

    // 겟셋 만들어야함.

    this.#CombatStats = {
      battleType: battleType, // 0 : 없음, 1 : 공격형, 2 : 방어형, 3 : 서포터형.
      // 필요하면 더추가하자.
    };
  }

  // 모든 정보를 내보낸다  (안쓰면 삭제 예정)
  GetInformation() {
    return this.#Information;
  }

  GetCombatStats() {
    return this.#CombatStats;
  }

  // 불러온 정보 적용. (안쓰면 삭제 예정)
  SetEntity(value01, value02) {
    this.#Information = value01;
    this.#CombatStats = value02;
  }

  // 활동력 세팅한다.
  ActionPointSetting(value) {
    this.#Information.actionPoints = value;
  }

  // 활동력을 가져온다.
  GetActionPoint() {
    return this.#Information.actionPoints;
  }

  // 엔티티의 타입을 가져온다.
  GetEntitytype() {
    return this.#Information.entitytype;
  }

  // 현재이름을 가져온다.
  GetName() {
    return this.#Information.name;
  }

  // 현재 Hp를 가져온다.
  GetHp() {
    return this.#Information.hp;
  }

  // 현재 Hp를 수정한다.
  SetHp(value) {
    this.#Information.hp = value;
  }

  // 현재 공격 정보를 가져온다.
  GetAttack() {
    return this.#Information.isAttack;
  }

  // 현재 공격 정보를 수정한다.
  SetAttack() {
    this.#Information.isAttack = !this.#Information.isAttack;
  }

  // 현재 방어 정보를 가져온다.
  GetDefense() {
    return this.#Information.isDefense;
  }

  // 현재 방어 정보를 수정한다.
  SetDefense() {
    this.#Information.isDefense = !this.#Information.isDefense;
  }

  // 현재 스킬 사용 여부를 가져온다.
  GetSkill() {
    return this.#Information.isSkill;
  }

  // 현재 스킬 사용 여부를 수정한다.
  SetSkill() {
    this.#Information.isSkill = !this.#Information.isSkill;
  }

  // 현재 생존 여부를 가져온다.
  GetIsDead() {
    return this.#Information.isDead;
  }

  // 현재 생존 사용 여부를 수정한다.
  SetIsDead() {
    this.#Information.isDead = !this.#Information.isDead;
  }

  // 현재 본인의 가중치를 가져온다.
  GetPriority() {
    return this.#Information.priority;
  }

  // 현재 본인의 전투 타입을 가져온다.
  GetBattleType() {
    return this.#CombatStats.battleType;
  }

  // 현재 파티 정보를 가져온다.
  GetParty() {
    return this.#Information.party;
  }

  // 현재 파티 정보를 수정한다.
  SetParty(value) {
    this.#Information.party = value;
  }

  // 현재 누구를 지목했는지 정보를 가져온다.
  GetTarget() {
    return this.#Information.target;
  }

  // 현재 누구를 지목할지 수정한다.
  SetTarget(value) {
    this.#Information.target = value;
  }
}
