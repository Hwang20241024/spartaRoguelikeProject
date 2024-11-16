import ansis from 'ansis';
import figlet from 'figlet';
import readlineSync from 'readline-sync';
import inquirer from 'inquirer';

import chalk from 'chalk';
import Table from 'cli-table3';

import cliSpinners from 'cli-spinners';

import readline from 'readline';
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

//  CommonJS 모듈을 ES 모듈 방식으로 import하려고 시도해서 생긴문제
import enquirer from 'enquirer'; // 기본 import
const { prompt } = enquirer; // prompt를 가져오기

export default class CanvasManager {
  static #instance = null;

  constructor() {
    if (CanvasManager.#instance) {
      throw new Error('Use CanvasManager.getInstance() 를 사용하여 인스턴스에 접근하세요.');
    }
  }

  // 인스턴스를 생성하거나 반환하는 static 메서드
  static getInstance() {
    if (!CanvasManager.#instance) {
      CanvasManager.#instance = new CanvasManager();
    }
    return CanvasManager.#instance;
  }

  /**
   * 문자열에 딜레이, 색상, 배경 색상 및 스타일을 적용하는 함수
   *
   * @param {string} str - 스타일을 적용할 문자열
   * @param {number} delayTime - 딜레이 시간. 밀리초 단위로 입력됩니다.
   * @param {Object} options - 색상, 배경 색상 및 스타일 옵션을 포함하는 객체
   * @param {string} options.color - 텍스트 색상 (선택 가능 색상: 'red', 'green', 'blue', 'yellow', 'magenta', 'cyan', 'white', 'black')
   * @param {string} options.bgColor - 배경 색상 (선택 가능 배경색: 'bgRed', 'bgGreen', 'bgBlue', 'bgYellow', 'bgMagenta', 'bgCyan', 'bgWhite', 'bgBlack')
   * @param {string} options.style - 텍스트 스타일 (선택 가능 스타일: 'bold', 'italic', 'underline', 'inverse', 'strikethrough')
   * @returns {string} - 적용된 스타일을 포함한 문자열
   */
  static async text_Maker(str, delayTime, { color = 'white', bgColor = 'bgBlack', style = 'normal' }, outputType = true, isReturn = false) {
    const colorTextMap = {
      red: ansis.red,
      green: ansis.green,
      blue: ansis.blue,
      yellow: ansis.yellow,
      magenta: ansis.magenta,
      cyan: ansis.cyan,
      white: ansis.white,
      black: ansis.black,
    };

    const bgColorTextMap = {
      bgRed: ansis.bgRed,
      bgGreen: ansis.bgGreen,
      bgBlue: ansis.bgBlue,
      bgYellow: ansis.bgYellow,
      bgMagenta: ansis.bgMagenta,
      bgCyan: ansis.bgCyan,
      bgWhite: ansis.bgWhite,
      bgBlack: ansis.bgBlack,
    };

    const styleTextMap = {
      bold: ansis.bold,
      italic: ansis.italic,
      underline: ansis.underline,
      inverse: ansis.inverse,
      strikethrough: ansis.strikethrough,
    };

    await this.delay(delayTime);
    // 컬러와 스타일 로직
    let result = str;
    if (colorTextMap[color]) {
      result = colorTextMap[color](str);
    }

    if (bgColorTextMap[bgColor]) {
      result = bgColorTextMap[bgColor](result);
    }

    if (styleTextMap[style]) {
      result = styleTextMap[style](result);
    }

    // 리턴
    if (isReturn) {
      return result;
    }

    // 출력
    if (outputType) {
      console.log(result);
      return result;
    } else {
      process.stdout.write(result);
    }

    // 리턴

    // 이거는 처음알았다 ()() 묶으면 알아서 함수 처리한다는걸.
    // 이런걸 함수 조합? 이라고 불리는거같다. 이걸 진작에 알았으면 더편헀을텐데.
    // 마지막에 안게 후회된다.
    // return (colorTextMap[color] ? colorTextMap[color] : ansis.white)(str);
  }

  /**
   * 딜레이를 주는 함수
   *
   * @param {number} delayTime - 딜레이 시간. 밀리초 단위로 입력됩니다.
   * @returns {Promise} - 딜레이가 완료된 후 resolve되는 Promise를 반환합니다.
   *
   * @example
   * delay(1000).then(() => {
   *    console.log('1초 후 실행');
   * });
   *
   * delay(1000);
   */
  static delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // 삭제
  static deleteText() {
    console.clear();
  }

  // 로딩
  static async loadingText(stratText, endText, delayTime, options = { color: 'white', bgColor: 'bgBlack', style: 'normal' }) {
    const spinner = cliSpinners.simpleDotsScrolling; // 스피너 스타일 선택

    let i = 0;
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        let str = `\r${stratText}${spinner.frames[i]}`;
        this.text_Maker(str, 0, { color: 'red', style: 'bold' }, false);
        i = (i + 1) % spinner.frames.length;
      }, spinner.interval);

      setTimeout(() => {
        clearInterval(interval);
        process.stdout.write('\u001b[2K'); // 현재줄 지우기
        resolve(this.text_Maker(`\r${endText}`, 0, options)); // 완료되면 Promise resolve
      }, delayTime);
    });
  }

  // 아무키나 눌러주세요.!!
  static async promptForKeyPress(options = { color: 'white', bgColor: 'bgBlack', style: 'normal' }) {
    // 미리 출력할 텍스트 생성
    const promptMessage = this.text_Maker('Press any key to continue...', 0, options, true, true);
    const validateMessage = this.text_Maker('Please press any key to continue.', 0, options, true, true);

    await inquirer.prompt([
      {
        type: 'input',
        name: 'pressAnyKey',
        message: promptMessage,
        validate: (input) => input.length === 0 || validateMessage,
      },
    ]);
  }

  // 표 만들기
  /**
   * @param {string[]} headers - 테이블 헤더 배열.
   * @param {Array[]} rows - 테이블에 추가될 행 데이터 배열.
   * @param {number[]} colWidths - 각 열의 폭 설정 배열.
   */
  static async tableInputPrompt({ headers, rows, colWidths, colAligns}) {
    // 잘못된 값이 들어오면 그냥 그리지 말자.
    if (!Array.isArray(headers) || !Array.isArray(rows) || !Array.isArray(colWidths)) {
      return null;
    }

    // 이제 표를 그리자.
    const table = new Table({
      head: headers,
      colWidths: colWidths,
      colAligns: colAligns,
    });

    rows.forEach((row) => {
      if (Array.isArray(row)) {
        table.push(row);
      }
    });
    this.text_Maker(table.toString(),0,{ color: 'green', style: 'bold' });
    // console.log(table.toString());
  }

  // 선택 트리.
  static async selectOption(arr, index) {
    // 매게변수가 타입이 다르면 null 리턴하자
    if (!Array.isArray(arr) || typeof index !== 'number') {
      return null;
    }

    if (arr.length && arr.length > index) {
      const result = await inquirer.prompt([arr[index]]);

      // 개별로 쓰면 이럴 필요없는데. 여러군데에서 쓰니깐.. 동적으로 키이름 가져오기..
      let nameKey = Object.keys(result)[0];
      return result[nameKey];
    }
  }

  // 체크박스
  static async askCheckbox(values) {
    const responses = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'options',
        message: 'Choose options:',
        choices: values,
      },
    ]);

    return responses.options;
  }

  // 타자느낌나는 출력
  static async typeWithDelay(text, delayTime, options = { color: 'white', bgColor: 'bgBlack', style: 'normal' }, isNewLine = true) {
    for (const char of text) {
      await this.text_Maker(char, delayTime, options, false);
    }
    if (isNewLine) {
      console.log();
    }
  }

  // 텍스트를 아스키 코드로 변환.
  static async ascllArt_Maker(text, delayTime, options = { color: 'white', bgColor: 'bgBlack', style: 'normal' }) {
    // figlet 비동기 작업을 Promise로 래핑
    return new Promise((resolve, reject) => {
      figlet(text, (err, data) => {
        if (err) {
          reject(err); // 에러 발생 시 reject
        } else {
          resolve(this.text_Maker(data, delayTime, options)); // 정상적으로 처리되면 데이터 반환
        }
      });
    });
  }
}
