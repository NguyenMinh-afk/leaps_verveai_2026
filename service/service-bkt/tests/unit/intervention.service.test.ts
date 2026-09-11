/**
 * Unit tests for the Intervention Service
 *
 * Tests the service functions with Prisma and logger mocked so they run
 * without a real database connection.
 *
 * Coverage:
 *   - listInterventions pagination
 *   - updateIntervention status transitions
 *   - overrideIntervention requires reason
 *   - resolveIntervention sets timestamp (idempotent)
 *   - 404 for missing intervention
 *   - conflict for invalid status transitions
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ── Env must be set BEFORE any module that calls validateEnv() ──────────────
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.PORT = '3002';
process.env.SERVICE_NAME = 'svc-bkt';
process.env.SERVICE_PORT = '3002';
process.env.LOG_LEVEL = 'error';
process.env.CONSUL_HOST = 'localhost';
process.env.CONSUL_PORT = '8500';

// ── Mock logger BEFORE importing the service ──────────────────────────────────
vi.mock('../../../src/utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    child: vi.fn(() => ({
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      debug: vi.fn(),
    })),
  },
}));

// ── Mock @verveai/common-node — computePagination ─────────────────────────────
vi.mock('@verveai/common-node', () => ({
  computePagination: vi.fn((page: number, pageSize: number, total: number) => {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    return {
      page,
      pageSize,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }),
}));

// ── Mock Prisma ───────────────────────────────────────────────────────────────
const mockInterventionRows = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    student_id: 's1',
    skill_id: 'sk1',
    priority: 80,
    status: 'ACTIVE',
    teacher_id: null,
    notes: null,
    created_at: new Date('2025-01-01T00:00:00Z'),
    resolved_at: null,
    notes_list: [],
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    student_id: 's2',
    skill_id: 'sk2',
    priority: 50,
    status: 'RESOLVED',
    teacher_id: 't1',
    notes: 'Student showed improvement',
    created_at: new Date('2025-01-02T00:00:00Z'),
    resolved_at: new Date('2025-01-10T00:00:00Z'),
    notes_list: [],
  },
];

vi.mock('../../../src/prisma/client.js', () => ({
  prisma: {
    intervention: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
      count: vi.fn(),
    },
    intervention_note: {
      create: vi.fn(),
    },
  },
}));

// ── Import after mocks are set up ─────────────────────────────────────────────
import { prisma } from '../../../src/prisma/client';
import {
  listInterventions,
  getIntervention,
  updateIntervention,
  overrideIntervention,
  addNote,
  resolveIntervention,
} from '../../../src/services/intervention.service';

const prismaMock = prisma as unknown as {
  intervention: {
    findMany: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    count: ReturnType<typeof vi.fn>;
  };
  intervention_note: {
    create: ReturnType<typeof vi.fn>;
  };
};

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('InterventionService — listInterventions', () => {
  it('returns paginated results', async () => {
    vi.mocked(prismaMock.intervention.findMany).mockResolvedValue(mockInterventionRows);
    vi.mocked(prismaMock.intervention.count).mockResolvedValue(2);

    const result = await listInterventions({
      page: 1,
      pageSize: 20,
    });

    expect(result.data).toHaveLength(2);
    expect(result.data[0]!.id).toBe('11111111-1111-1111-1111-111111111111');
    expect(result.data[1]!.status).toBe('RESOLVED');
    expect(prismaMock.intervention.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.intervention.count).toHaveBeenCalledTimes(1);
  });

  it('filters by status', async () => {
    vi.mocked(prismaMock.intervention.findMany).mockResolvedValue([mockInterventionRows[0]!]);
    vi.mocked(prismaMock.intervention.count).mockResolvedValue(1);

    await listInterventions({ status: 'ACTIVE', page: 1, pageSize: 20 });

    expect(prismaMock.intervention.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ status: 'ACTIVE' }) })
    );
  });

  it('filters by priority range', async () => {
    vi.mocked(prismaMock.intervention.findMany).mockResolvedValue([mockInterventionRows[0]!]);
    vi.mocked(prismaMock.intervention.count).mockResolvedValue(1);

    await listInterventions({
      minPriority: 70,
      maxPriority: 100,
      page: 1,
      pageSize: 20,
    });

    expect(prismaMock.intervention.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          priority: { gte: 70, lte: 100 },
        }),
      })
    );
  });

  it('filters by studentId', async () => {
    vi.mocked(prismaMock.intervention.findMany).mockResolvedValue([mockInterventionRows[0]!]);
    vi.mocked(prismaMock.intervention.count).mockResolvedValue(1);

    await listInterventions({ studentId: 's1', page: 1, pageSize: 20 });

    expect(prismaMock.intervention.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ student_id: 's1' }) })
    );
  });

  it('passes skip/take for pagination', async () => {
    vi.mocked(prismaMock.intervention.findMany).mockResolvedValue([]);
    vi.mocked(prismaMock.intervention.count).mockResolvedValue(50);

    await listInterventions({ page: 3, pageSize: 10 });

    expect(prismaMock.intervention.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 20, take: 10 })
    );
  });
});

describe('InterventionService — getIntervention', () => {
  it('returns the intervention with notes', async () => {
    vi.mocked(prismaMock.intervention.findUnique).mockResolvedValue(mockInterventionRows[1]!);

    const result = await getIntervention('22222222-2222-2222-2222-222222222222');

    expect(result.id).toBe('22222222-2222-2222-2222-222222222222');
    expect(result.status).toBe('RESOLVED');
    expect(result.resolvedAt).toBeInstanceOf(Date);
  });

  it('throws NotFoundError for unknown id', async () => {
    vi.mocked(prismaMock.intervention.findUnique).mockResolvedValue(null);

    await expect(
      getIntervention('99999999-9999-9999-9999-999999999999')
    ).rejects.toThrow('Intervention 99999999-9999-9999-9999-999999999999 not found');
  });

  it('throws ValidationError for invalid UUID', async () => {
    await expect(getIntervention('not-a-uuid')).rejects.toThrow();
  });
});

describe('InterventionService — updateIntervention', () => {
  it('updates priority', async () => {
    const updated = { ...mockInterventionRows[0]!, priority: 90 };
    vi.mocked(prismaMock.intervention.findUnique).mockResolvedValue(mockInterventionRows[0]!);
    vi.mocked(prismaMock.intervention.update).mockResolvedValue(updated);

    const result = await updateIntervention(
      '11111111-1111-1111-1111-111111111111',
      { priority: 90 }
    );

    expect(result.priority).toBe(90);
  });

  it('sets resolvedAt when status becomes RESOLVED', async () => {
    const updated = { ...mockInterventionRows[0]!, status: 'RESOLVED', resolved_at: new Date() };
    vi.mocked(prismaMock.intervention.findUnique).mockResolvedValue(mockInterventionRows[0]!);
    vi.mocked(prismaMock.intervention.update).mockResolvedValue(updated);

    const result = await updateIntervention(
      '11111111-1111-1111-1111-111111111111',
      { status: 'RESOLVED' }
    );

    expect(result.status).toBe('RESOLVED');
    expect(result.resolvedAt).toBeInstanceOf(Date);
  });

  it('throws ConflictError for invalid status transition (RESOLVED → ACTIVE)', async () => {
    vi.mocked(prismaMock.intervention.findUnique).mockResolvedValue(mockInterventionRows[1]!); // RESOLVED

    await expect(
      updateIntervention('22222222-2222-2222-2222-222222222222', { status: 'ACTIVE' })
    ).rejects.toThrow('Cannot transition intervention');
  });

  it('throws NotFoundError for unknown id', async () => {
    vi.mocked(prismaMock.intervention.findUnique).mockResolvedValue(null);

    await expect(
      updateIntervention('99999999-9999-9999-9999-999999999999', { priority: 50 })
    ).rejects.toThrow('not found');
  });
});

describe('InterventionService — overrideIntervention (FR-17)', () => {
  const teacherId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

  it('records reason and creates audit note', async () => {
    const existing = mockInterventionRows[0]!;
    const updated = {
      ...existing,
      status: 'CANCELLED' as const,
      teacher_id: teacherId,
      notes: 'Student transferred to another school',
      resolved_at: new Date(),
      notes_list: [
        {
          id: 'note-1',
          intervention_id: existing.id,
          teacher_id: teacherId,
          content: '[OVERRIDE → CANCELLED] Student transferred to another school',
          created_at: new Date(),
        },
      ],
    };

    vi.mocked(prismaMock.intervention.findUnique).mockResolvedValue(existing);
    vi.mocked(prismaMock.intervention.update).mockResolvedValue(updated);
    vi.mocked(prismaMock.intervention_note.create).mockResolvedValue(updated.notes_list[0]!);

    const result = await overrideIntervention(
      existing.id,
      teacherId,
      'Student transferred to another school',
      'CANCELLED'
    );

    expect(result.status).toBe('CANCELLED');
    expect(result.teacherId).toBe(teacherId);
    expect(prismaMock.intervention_note.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        intervention_id: existing.id,
        teacher_id: teacherId,
        content: expect.stringContaining('[OVERRIDE → CANCELLED]'),
      }),
    });
  });

  it('throws ValidationError if reason is shorter than 10 characters', async () => {
    vi.mocked(prismaMock.intervention.findUnique).mockResolvedValue(mockInterventionRows[0]!);

    await expect(
      overrideIntervention(
        mockInterventionRows[0]!.id,
        teacherId,
        'short',
        'CANCELLED'
      )
    ).rejects.toThrow();
  });

  it('throws ConflictError for invalid transition in override', async () => {
    vi.mocked(prismaMock.intervention.findUnique).mockResolvedValue(mockInterventionRows[1]!); // RESOLVED

    await expect(
      overrideIntervention(
        '22222222-2222-2222-2222-222222222222',
        teacherId,
        'This is a valid override reason string',
        'ACTIVE'
      )
    ).rejects.toThrow('Cannot override');
  });
});

describe('InterventionService — addNote', () => {
  const teacherId = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

  it('creates a note record', async () => {
    const noteRow = {
      id: 'note-id-1',
      intervention_id: '11111111-1111-1111-1111-111111111111',
      teacher_id: teacherId,
      content: 'Student attended extra tutoring session',
      created_at: new Date(),
    };

    vi.mocked(prismaMock.intervention.findUnique).mockResolvedValue(mockInterventionRows[0]!);
    vi.mocked(prismaMock.intervention_note.create).mockResolvedValue(noteRow);

    const result = await addNote(
      '11111111-1111-1111-1111-111111111111',
      teacherId,
      'Student attended extra tutoring session'
    );

    expect(result.content).toBe('Student attended extra tutoring session');
    expect(result.teacherId).toBe(teacherId);
  });

  it('throws NotFoundError if intervention does not exist', async () => {
    vi.mocked(prismaMock.intervention.findUnique).mockResolvedValue(null);

    await expect(
      addNote('99999999-9999-9999-9999-999999999999', teacherId, 'Note content')
    ).rejects.toThrow('not found');
  });

  it('throws ValidationError for empty note content', async () => {
    vi.mocked(prismaMock.intervention.findUnique).mockResolvedValue(mockInterventionRows[0]!);

    await expect(
      addNote(mockInterventionRows[0]!.id, teacherId, '')
    ).rejects.toThrow();
  });
});

describe('InterventionService — resolveIntervention', () => {
  it('sets status to RESOLVED and stamps resolvedAt', async () => {
    const updated = {
      ...mockInterventionRows[0]!,
      status: 'RESOLVED' as const,
      resolved_at: new Date(),
      notes_list: [],
    };
    vi.mocked(prismaMock.intervention.findUnique).mockResolvedValue(mockInterventionRows[0]!);
    vi.mocked(prismaMock.intervention.update).mockResolvedValue(updated);

    const result = await resolveIntervention('11111111-1111-1111-1111-111111111111');

    expect(result.status).toBe('RESOLVED');
    expect(result.resolvedAt).toBeInstanceOf(Date);
    expect(prismaMock.intervention.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: 'RESOLVED',
          resolved_at: expect.any(Date),
        }),
      })
    );
  });

  it('is idempotent: re-resolving an already resolved intervention returns current state', async () => {
    vi.mocked(prismaMock.intervention.findUnique).mockResolvedValue(mockInterventionRows[1]!);

    const result = await resolveIntervention('22222222-2222-2222-2222-222222222222');

    // No update call should be made
    expect(prismaMock.intervention.update).not.toHaveBeenCalled();
    expect(result.status).toBe('RESOLVED');
  });

  it('throws NotFoundError for unknown id', async () => {
    vi.mocked(prismaMock.intervention.findUnique).mockResolvedValue(null);

    await expect(
      resolveIntervention('99999999-9999-9999-9999-999999999999')
    ).rejects.toThrow('not found');
  });
});
