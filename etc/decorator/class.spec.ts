function reportableClassDecorator<T extends { new (...args: any[]): any }>(
  constructor: T,
) {
  return class extends constructor {
    reportingURL = 'http://www.example.com';
  };
}

@reportableClassDecorator
class BugReport {
  type = 'report';
  title: string;

  constructor(t: string) {
    this.title = t;
  }
}

test('클래스 데코레이터 테스트', () => {
  const bug = new BugReport('Needs dark mode');

  // 타입까진 바꿔주지 못하는듯
  expect((bug as any).reportingURL).toBe('http://www.example.com');
});
