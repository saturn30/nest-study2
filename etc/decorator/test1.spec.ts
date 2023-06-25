// 인자를 사용하지 않아도 삭제하면 데코레이터가 실행 안됨.
function deco(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  // 해당 콘솔은 초기화 시점에 한번만 실행되는듯 하다.
  // 해당 데코레이터를 적용한 함수를 여러번실행한다고 해서 '데코레이터 실행 1' 콘솔이 여러번 나오지 않음.
  // console.log('데코레이터 실행 1');
}

function decoWithParams(value: string) {
  // console.log('데코레이터 실행 2');
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    // console.log(value);
  };
}

class TestClass {
  @deco
  test() {
    // console.log('함수 호출');
  }

  @decoWithParams('value 인자 전달')
  test2() {
    // console.log('testWithParams 함수 호출');
  }

  test3() {
    // console.log('데코레이터 설정 안함');
  }
}

describe('데코레이터 테스트', () => {
  let testClass: TestClass;

  beforeEach(() => {
    // testClass = new TestClass();
  });

  test('test 함수 호출시 ', () => {
    // testClass.test();
    // testClass.test2();
    // testClass.test2();
  });
  test('test 함수 호출시 ', () => {
    // testClass.test();
    // testClass.test2();
    // testClass.test2();
  });
});
