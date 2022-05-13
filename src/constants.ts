import { SelectableValue } from '@grafana/data';

/**
 * Datasource test status
 */
export enum DataSourceTestStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}

/**
 * Query Type Values
 */
export enum FeedTypeValue {
  CHANNEL = 'channel',
  ITEMS = 'items',
  ALL = 'all',
}

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

/**
 * Meta Properties
 */
export enum MetaProperties {
  OG_IMAGE = 'og:image',
}

/**
 * Item Keys
 */
export enum ItemKey {
  AUTHOR = 'author',
  CONTENT = 'content',
  CONTENT_ENCODED = 'content:encoded',
  CONTENT_H4 = 'content:h4',
  CONTENT_IMG = 'content:img',
  CONTENT_IMG_SRC = 'content:img-src',
  GUID = 'guid',
  LINK = 'link',
  MEDIA_THUMBNAIL = 'media:thumbnail',
  META = 'meta',
  PUB_DATE = 'pubDate',
  SUMMARY = 'summary',
}

/**
 * Parse as Array
 */
export const alwaysArray = ['feed.entry', 'rdf:RDF.item', 'rss.channel.item'];
