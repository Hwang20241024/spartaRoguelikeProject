# spartaRoguelikeProject
1. 매니저를 모듈화 시켰습니다. (최종 연결은 main.js)
    - 모든 매니저는 하위 파일을 가지고 잇습니다.
    - 그곳에는 부모가될 class나 , static class를 가지고 있습니다.
2. 모든 정보를 보유하고 핵심 처리를 통합하는 역활의 매니저를 만들어야한다.
    - static 클래스로 설계하려고 했지만. 유지보수로 고려해서 다른방법을 생각해야함.
    - 가장 적합한 방법은 싱글턴 이다.
    - 싱글턴 : 단 하나의 인스턴스만 존재하도록 보장하는 것, 자주 사용하는 리소스를 하나의 인스턴스에서 관리한다.
3. 세이브로드 구현 완료
4. 저장 포맷 내일 수정하자.