// 자료구조 큐
export default class Queue {
  // 자료구조 큐 방식
  constructor() {
    this.arr = [];
  }

  // 가장 먼저 들어온 요소를 리턴시키고 삭제한다.
  Dequeue() {
    if (this.arr.length !== 0) {
      return this.arr.shift();
    }
    return null;
  }

  // 가장 먼저 들어온 요소를 확인.
  peek() {
    if (this.arr.length !== 0) {
      return this.arr[0];
    }
    return null;
  }

  // 요소 추가
  Enqueue(value) {
    this.arr.push(value);
    return true;
  }

  // 큐 전체 사이즈.
  Size() {
    return this.arr.length;
  }

  // 큐 전체 초기화.
  clear(arr) {
    this.arr.length = 0;
  }

  // 큐 전체 요소 확인
  GetQueue() {
    return this.arr;
  }
}
