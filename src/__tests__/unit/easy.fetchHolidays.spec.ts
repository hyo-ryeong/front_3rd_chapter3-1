import { fetchHolidays } from '../../apis/fetchHolidays';

describe('fetchHolidays', () => {
  it('특정 월의 공휴일 데이터를 정확히 반환해야 한다', () => {
    const targetDate = new Date(2024, 0);
    const holidays = fetchHolidays(targetDate);
    expect(holidays).toHaveProperty('2024-01-01');
  });

  it('공휴일이 없는 달은 빈 객체를 반환해야 한다', () => {
    const targetDate = new Date(2024, 10);
    const holidays = fetchHolidays(targetDate);
    expect(Object.keys(holidays).length).toBe(0);
  });

  it('공휴일이 여러 개인 달의 모든 공휴일을 반환해야 한다', () => {
    const targetDate = new Date(2024, 8);
    const holidays = fetchHolidays(targetDate);
    expect(holidays).toMatchObject({
      '2024-09-16': expect.any(String),
      '2024-09-17': expect.any(String),
      '2024-09-18': expect.any(String),
    });
  });
});
