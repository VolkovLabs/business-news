import { SelectableValue } from '@grafana/data';
import { Query } from '../types';

/**
 * Query Type Values
 */
export enum FeedTypeValue {
  CHANNEL = 'channel',
  ITEMS = 'items',
  ALL = 'all',
}

/**
 * Defaults for Query
 */
export const defaultQuery: Partial<Query> = {
  feedType: FeedTypeValue.ALL,
};

/**
 * Query Type
 *
 * @type {SelectableValue[]}
 */
export const FeedType: SelectableValue[] = [
  {
    label: 'Channel & Items',
    description: 'Returns channel data and items',
    value: FeedTypeValue.ALL,
  },
  {
    label: 'Channel',
    description: 'Returns channel data only',
    value: FeedTypeValue.CHANNEL,
  },
  {
    label: 'Items',
    description: 'Returns items only',
    value: FeedTypeValue.ITEMS,
  },
];
