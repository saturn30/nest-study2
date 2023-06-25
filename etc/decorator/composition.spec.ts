const log = [];

function first() {
  log.push('first() : factory eveluated');

  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    log.push('first() : called');
  };
}

function second() {
  log.push('second() : factory eveluated');

  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    log.push('second() : called');
  };
}

class ExampleClass {
  @first()
  @second()
  method() {
    log.push('method is called');
  }
}

test('합성 테스트', () => {
  const exampleClass = new ExampleClass();
  exampleClass.method();

  expect(log).toEqual([
    'first() : factory eveluated',
    'second() : factory eveluated',
    'second() : called',
    'first() : called',
    'method is called',
  ]);
});
