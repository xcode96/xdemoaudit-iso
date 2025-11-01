
import React from 'react';
import { ICON_MAP } from './components/icons';

export type IconName = keyof typeof ICON_MAP;

export type AuditStatus = 'Not Audited' | 'Conformant' | 'Non-Conformant' | 'Observation' | 'Not Applicable';

export interface ChecklistItem {
  id: string;
  security: string;
  priority: 'Essential' | 'Optional' | 'Advanced' | 'Basic';
  details: string;
  
  // Audit-specific fields
  status: AuditStatus;
  evidence: string;

  // Optional metadata
  clause?: string;
  scope?: number;
  criticality?: number;
  impact?: number;
  winType?: 'Quick Win' | 'Medium';
  effortTech?: number;
  effortPeople?: number;
  effortWeeks?: string;
  dependencies?: string;
}

// Represents the pure data structure, safe for JSON serialization
// Items from checklist.json won't have status/evidence, but items from localStorage will.
export interface RawCategory {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  iconName: IconName;
  color: string;
  items: (Omit<ChecklistItem, 'status' | 'evidence'> & { status?: AuditStatus, evidence?: string })[];
}


// Represents the hydrated data structure used in the application state
export interface Category extends Omit<RawCategory, 'items'> {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  conformant: number;
  nonConformant: number;
  totalAuditable: number;
  total: number;
  items: ChecklistItem[];
}
