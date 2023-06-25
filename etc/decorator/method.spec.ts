function HandleError() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const method = descriptor.value;

    descriptor.value = function (...params) {
      try {
        return method(...params);
      } catch (e) {
        return 'error';
      }
    };
  };
}

class Greeter {
  @HandleError()
  hello(isError: boolean) {
    if (!isError) {
      return 'hello';
    }
    throw new Error('dd');
  }
}

test('메서드 데코레이터 테스트', () => {
  const greeter = new Greeter();

  expect(greeter.hello(true)).toBe('error');
  expect(greeter.hello(false)).toBe('hello');
});
