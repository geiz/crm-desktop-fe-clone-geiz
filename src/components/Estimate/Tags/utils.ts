import { BaseItem } from 'types/common';

export const formatTags = (tags: BaseItem[]) => tags.map(tag => ({ label: tag.name, value: tag.id }));
