import chalk from 'chalk';
import figlet from 'figlet';
import readlineSync from 'readline-sync';
import inquirer from 'inquirer';

export class CanvasManager {
  // 텍스트를 아스키 코드로 변환.
  static async ascllArt_Maker(text) {
    return new Promise(function (resolve) {
      // 여기가 ASCII 아트를 생성하는 부분
      figlet(text, (err, data) => {
        if (err) {
          return;
        }
        console.log(data);
        resolve(); // 성공 시 resolve 호출
      });
    });
  }
}
