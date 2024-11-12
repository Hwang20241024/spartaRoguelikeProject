import fs from 'fs';      // 파일 시스템 모듈
import path from 'path';  // 경로 관련 모듈

import { fileURLToPath } from 'url'; // 


export default class FileIO {
  constructor(fileName) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    this.filePath = path.join(__dirname, fileName); // 파일 경로 설정
  }

  // 파일이 존재하는지 확인
  isFileExists() {
    return fs.existsSync(this.filePath);  
  }

  // 파일이 비어있는지 확인.
  isFileEmpty() {
    if (this.isFileExists()) {
      const data = fs.readFileSync(this.filePath, 'utf8');
      return data.trim().length === 0;  // 빈 파일이면 true 반환
    }
    return true;  // 위에 조건에 맞지 않으면 파일이 없는거다.
  }

  // 파일을 생성하는 매서드
  createEmptyFile() {
    fs.writeFileSync(this.filePath, JSON.stringify({}, null, 2), 'utf8');
  }


  // 파일이 존재한다면 가져오자.!
  readFile() {
    if(this.isFileExists()){
      // 예외처리는 예제에서 꼭 사용하라길레 넣었다.
      try{
        const data = fs.readFileSync(this.filePath, 'utf8');
        return JSON.parse(data);  // JSON 파싱 후 반환
      } catch (err) {
        console.error('파일 읽기 오류:', err);
        return null;
      }
    } else {
      // 없으면 빈파일을 만들자 어차피 게임 시작할때 한번만 실해된다.
      this.createEmptyFile();
      return {};
    }
  }

  // 파일에 데이터를 저장하기
  saveFile(data) {
    try {
      const jsonData = JSON.stringify(data, null, 2);  // 데이터 JSON 형식으로 변환
      fs.writeFileSync(this.filePath, jsonData, 'utf8');  // 파일에 저장
    } catch (err) {
      console.error('파일 저장 오류:', err);
    }
  }
}
