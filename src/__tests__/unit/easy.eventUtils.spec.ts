import { Event } from '../../types';
import { getFilteredEvents } from '../../utils/eventUtils';

describe('getFilteredEvents', () => {
  const mockEvents: Event[] = [
    {
      id: '1',
      title: '빼빼로데이',
      date: '2024-11-11',
      startTime: '10:00',
      endTime: '11:00',
      description: '빼빼로 전해주기',
      location: '집 근처',
      category: '개인',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    },
    {
      id: '2',
      title: '업무 회의',
      date: '2024-07-02',
      startTime: '13:00',
      endTime: '15:00',
      description: '주간 회의',
      location: '판교',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    },
  ];

  it("검색어 '업무 회의'에 맞는 이벤트만 반환한다", () => {
    const result = getFilteredEvents(mockEvents, '업무 회의', new Date('2024-07-01'), 'month');
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('2');
  });

  it('주간 뷰에서 2024-07-01 주의 이벤트만 반환한다', () => {
    const result = getFilteredEvents(mockEvents, '', new Date('2024-07-01'), 'week');
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('2');
  });

  it('월간 뷰에서 2024년 7월의 모든 이벤트를 반환한다', () => {
    const result = getFilteredEvents(mockEvents, '', new Date('2024-07-01'), 'month');
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('2');
  });

  it("검색어 '업무'와 주간 뷰 필터링을 동시에 적용한다", () => {
    const result = getFilteredEvents(mockEvents, '업무', new Date('2024-07-01'), 'week');
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('2');
  });

  it('검색어가 없을 때 모든 이벤트를 반환한다', () => {
    const result = getFilteredEvents(mockEvents, '', new Date('2024-11-01'), 'month');
    expect(result.length).toBe(1);
  });

  it('검색어가 대소문자를 구분하지 않고 작동한다', () => {
    const result = getFilteredEvents(mockEvents, '업무 회의', new Date('2024-07-01'), 'month');
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('2');
  });

  it('월의 경계에 있는 이벤트를 올바르게 필터링한다', () => {
    const result = getFilteredEvents(mockEvents, '', new Date('2024-11-01'), 'month');
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('1');
  });

  it('빈 이벤트 리스트에 대해 빈 배열을 반환한다', () => {
    const result = getFilteredEvents([], '', new Date('2024-11-01'), 'month');
    expect(result.length).toBe(0);
  });
});
