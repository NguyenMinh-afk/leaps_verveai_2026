/**
 * VERVEAI — Skills + Content Items API surface (through Gateway → svc-bkt / svc-content).
 */

import { api } from './apiClient';

export interface Skill {
  id: string;
  code: string;
  name: string;
  difficulty: number;
  description: string | null;
  prereqSkills: string[];
}

export type ContentType = 'QUESTION' | 'EXPLANATION' | 'EXAMPLE' | 'EXERCISE';
export type ContentStatus = 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'ARCHIVED';

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  body: string;
  difficulty: number;
  status: ContentStatus;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListContentParams {
  type?: ContentType;
  status?: ContentStatus;
}

export async function listSkills(): Promise<Skill[]> {
  return api.get<Skill[]>('/api/bkt/skills');
}

export async function getSkill(id: string): Promise<Skill> {
  return api.get<Skill>(`/api/bkt/skills/${encodeURIComponent(id)}`);
}

export async function getSkillTree(): Promise<Skill[]> {
  return api.get<Skill[]>('/api/bkt/skills/tree');
}

export async function listContent(params: ListContentParams = {}): Promise<ContentItem[]> {
  const search = new URLSearchParams();
  if (params.type) search.set('type', params.type);
  if (params.status) search.set('status', params.status);
  const query = search.toString();
  const path = query ? `/api/content/content?${query}` : '/api/content/content';
  return api.get<ContentItem[]>(path);
}

export async function getContentItem(id: string): Promise<ContentItem> {
  return api.get<ContentItem>(`/api/content/content/${encodeURIComponent(id)}`);
}
