// 모든 엔티티의 원형이 될 클래스이다.
export default class Entity {
  #Information;
  #CombatStats;

  constructor(name, hp, alive, priority) {
    this.#Information = {
      name: name,
      hp: hp,
      actionPoints: 0,
      isAttack: false,
      isDefense: false,
      isSkill: false,
      isDead: alive,
      priority: priority,
    };

    this.#CombatStats = {
      battleType: 0, // 0 : 없음, 1 : 공격형, 2 : 방어형, 3 : 서포터형.
      // 필요하면 더추가하자.
    };
    // 행동력과 타입 선택.
    this.#ActionPointSetting();
    this.#TypeSetting();
  }

  #ActionPointSetting() {
    this.#Information.actionPoints = Math.floor(Math.random() * 100) + 1;
  }

  #TypeSetting() {
    this.#CombatStats.battleType = Math.floor(Math.random() * 3) + 1;
  }

  // 모든 정보를 내보낸다
  GetInformation(){
    return this.#Information;
  }

  GetCombatStats(){
    return this.#CombatStats;
  }

  // 불러온 정보 적용.
  SetEntity(value01, value02) {
    this.#Information = value01;
    this.#CombatStats = value02;
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
    this.#Information.hp += value;
  }

  // 현재 공격 정보를 가져온다.
  GetAttack() {
    return this.#Information.isAttack;
  }

  // 현재 공격 정보를 수정한다.
  SetAttack() {
    this.#Information.isAttack = !Information.isAttack;
  }

  // 현재 방어 정보를 가져온다.
  GetDefense() {
    return this.#Information.isDefense;
  }

  // 현재 방어 정보를 수정한다.
  SetDefense() {
    this.#Information.isDefense = !Information.isDefense;
  }

  // 현재 스킬 사용 여부를 가져온다.
  GetSkill() {
    return this.#Information.isSkill;
  }

  // 현재 스킬 사용 여부를 수정한다.
  SetSkill() {
    this.#Information.isSkill = !Information.isSkill;
  }

  // 현재 생존 여부를 가져온다.
  GetIsDead() {
    return this.#Information.isDead;
  }

  // 현재 생존 사용 여부를 수정한다.
  SetIsDead() {
    this.#Information.isDead = !Information.isDead;
  }

  // 현재 본인의 가중치를 가져온다.
  GetPriority() {
    return this.#Information.priority;
  }

  // 현재 본인의 전투 타입을 가져온다.
  GetBattleType() {
    return this.#CombatStats.battleType;
  }

}
