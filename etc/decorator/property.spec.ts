function format(formatString: string) {
  return function (target: any, propertyKey: string): any {
    let value = target[propertyKey];
    function getter() {
      return `${formatString} ${value}`;
    }
    function setter(newVal: string) {
      value = newVal;
    }

    return {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    };
  };
}

class Hello {
  @format('Hello')
  greeting: string;
}

test('속성 데코레이터', () => {
  const h = new Hello();
  h.greeting = 'World';

  expect(h.greeting).toBe('Hello World');
});
