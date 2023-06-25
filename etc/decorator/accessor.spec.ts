function Enumerable(enumerable: boolean) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    descriptor.enumerable = enumerable;
  };
}

class Person {
  constructor(private name: string) {}

  @Enumerable(true)
  get getName() {
    return this.name;
  }

  @Enumerable(false)
  set setName(name: string) {
    this.name = name;
  }
}

test('접근자 데코레이터', () => {
  const person = new Person('Kim');
  const obj = {};

  for (const key in person) {
    obj[key] = person[key];
  }

  // setName은 연거형이 아니므로 for in 문법에서 조회되지 않음
  expect(obj).toEqual({ name: 'Kim', getName: 'Kim' });
});
