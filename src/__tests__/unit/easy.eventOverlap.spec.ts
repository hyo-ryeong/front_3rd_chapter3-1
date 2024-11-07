import { Event } from '../../types';
import {
  convertEventToDateRange,
  findOverlappingEvents,
  isOverlapping,
  parseDateTime,
} from '../../utils/eventOverlap';

describe('parseDateTime', () => {
  it('2024-07-01 14:30을 정확한 Date 객체로 변환한다', () => {
    const testDate = '2024-07-01';
    const testTime = '14:30';
    const result = parseDateTime(testDate, testTime);
    expect(result).toEqual(new Date('2024-07-01 14:30'));
  });

  it('잘못된 날짜 형식에 대해 Invalid Date를 반환한다', () => {
    const testDate = '2024-00-00';
    const testTime = '10:00';
    const result = parseDateTime(testDate, testTime);
    expect(result instanceof Date).toBe(true);
    expect(isNaN(result.getTime())).toBe(true);
  });

  it('잘못된 시간 형식에 대해 Invalid Date를 반환한다', () => {
    const testDate = '2024-11-11';
    const testTime = '99:99';
    const result = parseDateTime(testDate, testTime);
    expect(result instanceof Date).toBe(true);
    expect(isNaN(result.getTime())).toBe(true);
  });

  it('날짜 문자열이 비어있을 때 Invalid Date를 반환한다', () => {
    const testDate = '';
    const testTime = '10:00';
    const result = parseDateTime(testDate, testTime);
    expect(result instanceof Date).toBe(true);
    expect(isNaN(result.getTime())).toBe(true);
  });
});

describe('convertEventToDateRange', () => {
  it('일반적인 이벤트를 올바른 시작 및 종료 시간을 가진 객체로 변환한다', () => {
    const testDate = '2024-11-11';
    const testStartTime = '10:00';
    const testEndTime = '12:00';
    const testEvent: Event = {
      date: testDate,
      startTime: testStartTime,
      endTime: testEndTime,
      id: '1',
      title: '빼빼로데이',
      category: '개인',
      description: '빼빼로 건네주기',
      notificationTime: 1,
      repeat: { type: 'none', interval: 0 },
      location: '너네 집앞',
    };
    const result = convertEventToDateRange(testEvent);
    expect(result.start).toEqual(new Date('2024-11-11 10:00'));
    expect(result.end).toEqual(new Date('2024-11-11 12:00'));
  });

  it('잘못된 날짜 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const testDate = '2024-99-99';
    const testStartTime = '10:00';
    const testEndTime = '12:00';
    const testEvent: Event = {
      date: testDate,
      startTime: testStartTime,
      endTime: testEndTime,
      id: '1',
      title: '빼빼로데이',
      category: '개인',
      description: '빼빼로 건네주기',
      notificationTime: 1,
      repeat: { type: 'none', interval: 0 },
      location: '너네 집앞',
    };
    const result = convertEventToDateRange(testEvent);
    expect(result.start instanceof Date).toBe(true);
    expect(isNaN(result.start.getTime())).toBe(true);
    expect(result.end instanceof Date).toBe(true);
    expect(isNaN(result.end.getTime())).toBe(true);
  });

  it('잘못된 시간 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const testDate = '2024-11-11';
    const testStartTime = '99:99';
    const testEndTime = '00:99';
    const testEvent: Event = {
      date: testDate,
      startTime: testStartTime,
      endTime: testEndTime,
      id: '1',
      title: '빼빼로데이',
      category: '개인',
      description: '빼빼로 건네주기',
      notificationTime: 1,
      repeat: { type: 'none', interval: 0 },
      location: '너네 집앞',
    };
    const result = convertEventToDateRange(testEvent);
    expect(result.start instanceof Date).toBe(true);
    expect(isNaN(result.start.getTime())).toBe(true);
    expect(result.end instanceof Date).toBe(true);
    expect(isNaN(result.end.getTime())).toBe(true);
  });
});

describe('isOverlapping', () => {
  const testDate1 = '2024-11-11';
  const testStartTime1 = '10:00';
  const testEndTime1 = '12:00';
  const testEvent1: Event = {
    date: testDate1,
    startTime: testStartTime1,
    endTime: testEndTime1,
    id: '1',
    title: '빼빼로데이',
    category: '개인',
    description: '빼빼로 건네주기',
    notificationTime: 1,
    repeat: { type: 'none', interval: 0 },
    location: '너네 집앞',
  };
  it('두 이벤트가 겹치는 경우 true를 반환한다', () => {
    const testStartTime2 = '10:00';
    const testEndTime2 = '12:00';
    const testEvent2: Event = {
      date: testDate1,
      startTime: testStartTime2,
      endTime: testEndTime2,
      id: '1',
      title: '빼빼로데이',
      category: '개인',
      description: '빼빼로 건네주기',
      notificationTime: 1,
      repeat: { type: 'none', interval: 0 },
      location: '너네 집앞',
    };
    const result = isOverlapping(testEvent1, testEvent2);
    expect(result).toBe(true);
  });

  it('두 이벤트가 겹치지 않는 경우 false를 반환한다', () => {
    const testStartTime2 = '15:00';
    const testEndTime2 = '18:30';
    const testEvent2: Event = {
      date: testDate1,
      startTime: testStartTime2,
      endTime: testEndTime2,
      id: '1',
      title: '빼빼로데이',
      category: '개인',
      description: '빼빼로 건네주기',
      notificationTime: 1,
      repeat: { type: 'none', interval: 0 },
      location: '너네 집앞',
    };
    const result = isOverlapping(testEvent1, testEvent2);
    expect(result).toBe(false);
  });
});

describe('findOverlappingEvents', () => {
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
  it('새 이벤트와 겹치는 모든 이벤트를 반환한다', () => {
    const newEvent: Event = {
      id: '3',
      title: '업무 회의',
      date: '2024-07-02',
      startTime: '13:00',
      endTime: '15:00',
      description: '주간 회의',
      location: '판교',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    };
    const result = findOverlappingEvents(newEvent, mockEvents);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('2');
  });

  it('겹치는 이벤트가 없으면 빈 배열을 반환한다', () => {
    const newEvent: Event = {
      id: '4',
      title: '크리스마스',
      date: '2024-12-25',
      startTime: '00:00',
      endTime: '23:00',
      description: '누가 뒷통수 때려서 재워주세요',
      location: '내 집',
      category: '개인',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    };
    const result = findOverlappingEvents(newEvent, mockEvents);
    expect(result.length).toBe(0);
  });
});
