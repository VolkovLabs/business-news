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
  META = 'meta',
  PUB_DATE = 'pubDate',
  SUMMARY = 'summary',
  MEDIA_GROUP = 'media:group',
  MEDIA_THUMBNAIL = 'media:thumbnail',
  MEDIA_CONTENT = 'media:content',
  MEDIA_DESCRIPTION = 'media:description',
}

/**
 * Parse as Array
 */
export const alwaysArray = ['feed.entry', 'rdf:RDF.item', 'rss.channel.item'];
