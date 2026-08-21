import type { UsersDto, UserSummaryDto } from '../dto';
import { describe, expect, it } from 'vitest';
import { toUsers } from '../mapper';

function userSummaryDto(overrides: Partial<UserSummaryDto> = {}): UserSummaryDto {
  return {
    id: '2459-4102-3156',
    name: 'くぴゃ',
    avatarUrl: null,
    comment: '',
    rank: 1,
    popnClass: 17800,
    bestLevels: [
      { kind: 'clear', maxLevel: 50 },
      { kind: 'full-combo', maxLevel: 49 },
      { kind: 'perfect', maxLevel: null },
    ],
    updatedAt: '2026-08-18T00:00:00.000Z',
    ...overrides,
  };
}

function usersDto(items: UserSummaryDto[]): UsersDto {
  return {
    items,
    totalItems: items.length,
    totalPages: 1,
    hasPrev: false,
    hasNext: false,
  };
}

describe('toUsers', () => {
  it('maps a summary to its domain shape, preserving null clear milestones', () => {
    const users = toUsers(usersDto([userSummaryDto()]));

    expect(users.items[0]).toEqual({
      poptomoId: '2459-4102-3156',
      name: 'くぴゃ',
      avatarUrl: null,
      comment: '',
      rank: 1,
      popnClass: 178,
      bestLevels: { 'clear': 50, 'full-combo': 49, 'perfect': null },
      updatedAt: new Date('2026-08-18T00:00:00.000Z'),
    });
  });

  it('carries page metadata through unchanged', () => {
    const dto = usersDto([userSummaryDto()]);
    const users = toUsers({ ...dto, totalItems: 248, totalPages: 13, hasNext: true });

    expect(users.totalItems).toBe(248);
    expect(users.totalPages).toBe(13);
    expect(users.hasNext).toBe(true);
  });

  it('throws when a clear milestone is missing from the response', () => {
    const dto = usersDto([userSummaryDto({
      bestLevels: [
        { kind: 'clear', maxLevel: 50 },
        { kind: 'full-combo', maxLevel: 49 },
      ],
    })]);

    expect(() => toUsers(dto)).toThrow(/perfect/);
  });
});
