
import type { Category, RawCategory, ChecklistItem, IconName } from './types';
import { ICON_MAP, ShieldIcon } from './components/icons';

// Takes raw, serializable category data and "hydrates" it for the audit application.
export const processRawCategories = (rawCategories: RawCategory[]): Category[] => {
  return rawCategories.map(rawCategory => {
    const itemsWithState: ChecklistItem[] = rawCategory.items.map((item, index) => ({
      ...item,
      id: item.id || `${rawCategory.id}-${index}`, // Ensure ID exists
      // Default audit status if not present (e.g., from checklist.json or older state)
      status: item.status || 'Not Audited',
      evidence: item.evidence || '',
    }));

    const notApplicableCount = itemsWithState.filter(item => item.status === 'Not Applicable').length;

    return {
      ...rawCategory,
      icon: ICON_MAP[rawCategory.iconName as IconName] || ShieldIcon,
      items: itemsWithState,
      conformant: itemsWithState.filter(item => item.status === 'Conformant').length,
      nonConformant: itemsWithState.filter(item => item.status === 'Non-Conformant').length,
      total: itemsWithState.length,
      totalAuditable: itemsWithState.length - notApplicableCount,
    };
  });
};

// Takes the full application state and "sanitizes" it for JSON storage,
// preserving the crucial audit status and evidence fields.
export const sanitizeCategoriesForStorage = (categories: Category[]): RawCategory[] => {
  return categories.map(({ icon, conformant, nonConformant, total, totalAuditable, ...rest }) => ({
    ...rest,
    // Preserve the full item, including its 'status' and 'evidence' state, for persistence.
    items: rest.items
  }));
};
