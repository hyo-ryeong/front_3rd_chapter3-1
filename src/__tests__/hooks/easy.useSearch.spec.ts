import { act, renderHook } from '@testing-library/react';

import { useSearch } from '../../hooks/useSearch.ts';
import { Event } from '../../types.ts';

const mockEvents: Event[] = [
  {
    id: '1',
    title: '빼빼로데이',
    date: '2024-11-11',
    startTime: '10:00',
    endTime: '11:00',
    description: '빼뺴로 전해주기',
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

it('검색어가 비어있을 때 모든 이벤트를 반환해야 한다', () => {
  const testDate = new Date('2024-11-01');
  const testView = 'month';
  const { result } = renderHook(() => useSearch(mockEvents, testDate, testView));
  expect(result.current.filteredEvents.length).toBe(2);
});

it('검색어에 맞는 이벤트만 필터링해야 한다', () => {
  const testDate = new Date('2024-11-01');
  const testView = 'month';
  const { result } = renderHook(() => useSearch(mockEvents, testDate, testView));
  act(() => {
    result.current.setSearchTerm('회의');
  });
  expect(result.current.filteredEvents.length).toBe(1);
});

it('검색어가 제목, 설명, 위치 중 하나라도 일치하면 해당 이벤트를 반환해야 한다', () => {
  const testDate = new Date('2024-11-01');
  const testView = 'month';
  const { result } = renderHook(() => useSearch(mockEvents, testDate, testView));
  act(() => {
    result.current.setSearchTerm('빼빼로');
  });
  expect(result.current.filteredEvents.length).toBe(1);
});

it('현재 뷰(주간/월간)에 해당하는 이벤트만 반환해야 한다', () => {
  const testDate = new Date('2024-11-01');
  const testView = 'week';
  const { result } = renderHook(() => useSearch(mockEvents, testDate, testView));
  expect(result.current.filteredEvents.length).toBe(0);
});

it('검색어를 "회의"에서 "점심"으로 변경하면 필터링된 결과가 즉시 업데이트되어야 한다', () => {
  const testDate = new Date('2024-11-01');
  const testView = 'month';
  const { result } = renderHook(() => useSearch(mockEvents, testDate, testView));
  act(() => {
    result.current.setSearchTerm('회의');
  });
  result.current.filteredEvents.forEach((event) => {
    expect(event.title).toMatch(/회의/i);
  });
  act(() => {
    result.current.setSearchTerm('점심');
  });

  expect(result.current.filteredEvents.length).toBe(0);
});
