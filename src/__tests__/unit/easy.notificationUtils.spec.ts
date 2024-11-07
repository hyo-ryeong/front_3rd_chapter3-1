import { Event } from '../../types';
import { createNotificationMessage, getUpcomingEvents } from '../../utils/notificationUtils';

describe('getUpcomingEvents', () => {
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
      date: '2024-11-20',
      startTime: '13:00',
      endTime: '15:00',
      description: '주간 회의',
      location: '판교',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    },
  ];

  it('알림 시간이 정확히 도래한 이벤트를 반환한다', () => {
    const testDate = new Date('2024-11-20 12:59:00');
    const notifiedEvents = ['1'];
    const result = getUpcomingEvents(mockEvents, testDate, notifiedEvents);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('2');
  });

  it('이미 알림이 간 이벤트는 제외한다', () => {
    const testDate = new Date('2024-11-20 12:59:00');
    const notifiedEvents = ['1', '2'];
    const result = getUpcomingEvents(mockEvents, testDate, notifiedEvents);
    expect(result.length).toBe(0);
  });

  it('알림 시간이 아직 도래하지 않은 이벤트는 반환하지 않는다', () => {
    const testDate = new Date('2024-11-10 09:59:00');
    const notifiedEvents = ['1'];
    const result = getUpcomingEvents(mockEvents, testDate, notifiedEvents);
    expect(result.length).toBe(0);
  });

  it('알림 시간이 지난 이벤트는 반환하지 않는다', () => {
    const testDate = new Date('2024-11-20 15:01:00');
    const notifiedEvents = ['1'];
    const result = getUpcomingEvents(mockEvents, testDate, notifiedEvents);
    expect(result.length).toBe(0);
  });
});

describe('createNotificationMessage', () => {
  it('올바른 알림 메시지를 생성해야 한다', () => {
    const testEvent: Event = {
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
    };
    const result = createNotificationMessage(testEvent);
    expect(result).toBe('1분 후 빼빼로데이 일정이 시작됩니다.');
  });
});
