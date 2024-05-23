import { createDataFrame, DataFrame, DataSourceInstanceSettings, FieldType, TimeRange } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import { XMLParser } from 'fast-xml-parser';
import { lastValueFrom } from 'rxjs';

import { ALWAYS_ARRAY, FeedTypeValue, ItemKey, MetaProperties } from '../constants';
import { DataItem, DataSourceOptions, FeedItems, Query } from '../types';
import { createUniqueKeyObject, isDateBetweenRange, setItem } from '../utils';

/**
 * API
 */
export class Api {
  /**
   * Constructor
   */
  constructor(public instanceSettings: DataSourceInstanceSettings<DataSourceOptions>) {}

  /**
   * Get RSS feed
   *
   * @async
   * @param {Query} query Query
   * @param {TimeRange} range Time Range
   * @param {Record<string, any>} params URL parameters
   * @returns {Promise<DataFrame[]>} Feed
   */
  async getFeed(
    query: Query,
    range: TimeRange | null = null,
    params: Record<string, unknown> | undefined = undefined
  ): Promise<DataFrame[]> {
    if (!params) {
      params = {};
    }

    /**
     * Extract parameters
     */
    const queryParams = this.instanceSettings.jsonData.feed?.split(/[\?\&]/);
    if (queryParams?.length) {
      queryParams.forEach((param) => {
        const paramSplit = param.split('=');
        if (params && paramSplit.length > 1) {
          params[paramSplit[0]] = paramSplit[1];
        }
      });
    }

    /**
     * Fetch Feed
     */
    const response = await lastValueFrom(
      getBackendSrv().fetch({
        method: 'GET',
        headers: {
          accept: 'application/rss+xml, application/atom+xml',
        },
        url: `${this.instanceSettings.url}/feed`,
        params,
      })
    );

    /**
     * Nothing returned
     */
    if (!response || !response.data) {
      return [];
    }

    /**
     * Parse XML
     */
    const parser = new XMLParser({
      ignoreAttributes: false,
      isArray: (name, jpath) => {
        return ALWAYS_ARRAY.indexOf(jpath) !== -1 ? true : false;
      },
    });
    const data = parser.parse(response.data as string | Buffer);

    /**
     * RSS 1.0 (RDF) support
     */
    if (data['rdf:RDF'] && !data.rss) {
      data.rss = data['rdf:RDF'];
      data.rss.channel.item = data.rss.item;
    }

    /**
     * RSS 2.0 with Channel data
     */
    if (data.rss && data.rss.channel) {
      /**
       * Channel Data
       */
      const channel = data.rss.channel;
      const channelFrame = createDataFrame({
        name: 'channel',
        refId: query.refId,
        fields: [
          { name: 'title', values: [channel.title], type: FieldType.string },
          { name: 'description', values: [channel.description], type: FieldType.string },
          { name: 'generator', values: [channel.generator], type: FieldType.string },
          { name: 'lastBuildDate', values: [channel.lastBuildDate], type: FieldType.string },
          { name: 'link', values: [channel.link], type: FieldType.string },
          { name: 'webMaster', values: [channel.webMaster], type: FieldType.string },
          { name: 'ttl', values: [channel.ttl], type: FieldType.number },
          { name: 'imageUrl', values: [channel.image?.url], type: FieldType.string },
          { name: 'imageTitle', values: [channel.image?.title], type: FieldType.string },
          { name: 'imageLink', values: [channel.image?.link], type: FieldType.string },
        ],
      });

      /**
       * If items not found, return Channel
       */
      if (!channel.item || query.feedType === FeedTypeValue.CHANNEL) {
        return [channelFrame];
      }

      /**
       * Configure Items
       * Take all the unique keys in all items
       */
      const items: FeedItems = createUniqueKeyObject(channel.item);

      /**
       * Find all items
       */
      channel.item.forEach((item: DataItem) => {
        /**
         * Filter by specified Date field
         */
        if (query.dateField && range && !isDateBetweenRange(item[query.dateField] as string, range)) {
          return;
        }

        Object.keys(items).forEach((key: string) => {
          let currentKey = key;
          let value = item[key];

          /**
           * If Item doesn`t contain key set key with null value to avoid mixed up
           */
          if (!value) {
            setItem(items, currentKey, null);
          } else {
            /**
             * Parse Meta
             */
            if (key === ItemKey.META && (value as Record<string, string>)['@_property'] === MetaProperties.OG_IMAGE) {
              currentKey = MetaProperties.OG_IMAGE;
              value = (value as Record<string, string>)['@_content'];
            }

            /**
             * Parse Guid
             */
            if (key === ItemKey.GUID && (value as Record<string, string>)['#text']) {
              value = (value as Record<string, string>)['#text'];
            }

            /**
             * Parse Encoded content for H4 and first Image
             */
            if (key === ItemKey.CONTENT_ENCODED) {
              const h4 = value.toString().match(/<h4>(.*?)<\/h4>/);
              const figure = value.toString().match(/<figure>(.*?)<\/figure>/);

              setItem(items, ItemKey.CONTENT_H4, h4?.length ? h4[1] : '');

              /**
               * Extract image and source
               */
              if (figure?.length) {
                setItem(items, ItemKey.CONTENT_IMG, figure[1]);
                const img = figure[1].match(/<img.+src\=(?:\"|\')(.+?)(?:\"|\')(?:.+?)\>/);
                setItem(items, ItemKey.CONTENT_IMG_SRC, img?.length ? img[1] : '');
              }
            }
            setItem(items, currentKey, value as string);
          }
        });
      });

      /**
       * Create Items frame
       */
      const itemsFrame = createDataFrame({
        name: 'items',
        refId: query.refId,
        fields: Object.keys(items).map((key) => {
          const item = items[key];
          const type = FieldType.string;

          return { name: key, values: item, type };
        }),
      });

      /**
       * Return Items only
       */
      if (query.feedType === FeedTypeValue.ITEMS) {
        return [itemsFrame];
      }

      /**
       * Return Channel & Items
       */
      return [channelFrame, itemsFrame];
    }

    /**
     * Is it Atom?
     */
    if (!data.feed) {
      return [];
    }

    /**
     * Channel Data
     */
    const feed = data.feed;
    const channelFrame = createDataFrame({
      name: 'channel',
      refId: query.refId,
      fields: [
        { name: 'author', values: [feed.author?.name], type: FieldType.string },
        { name: 'id', values: [feed.id], type: FieldType.string },
        { name: 'title', values: [feed.title], type: FieldType.string },
        { name: 'updated', values: [feed.updated], type: FieldType.string },
      ],
    });

    /**
     * If enties not found, return Channel
     */
    if (!feed.entry || query.feedType === FeedTypeValue.CHANNEL) {
      return [channelFrame];
    }

    /**
     * Configure entries
     * Take all the unique keys in all entries
     */
    const entries: FeedItems = createUniqueKeyObject(feed.entry);

    /**
     * Find all entries
     */
    feed.entry.forEach((entry: DataItem) => {
      /**
       * Filter by specified Date field
       */
      if (query.dateField && range && !isDateBetweenRange(entry[query.dateField] as string, range)) {
        return;
      }

      Object.keys(entries).forEach((key: string) => {
        let value = entry[key];

        /**
         * If Entry doesn`t contain key set key with null value to avoid mixed up
         */
        if (!value) {
          setItem(entries, key, null);
        } else {
          /**
           * Link
           */
          if (key === ItemKey.LINK && (value as Record<string, string>)['@_href']) {
            value = (value as Record<string, string>)['@_href'];
          }

          /**
           * Content
           */
          if (key === ItemKey.CONTENT && (value as Record<string, string>)['#text']) {
            value = (value as Record<string, string>)['#text'];
          }

          /**
           * Summary
           */
          if (key === ItemKey.SUMMARY && (value as Record<string, string>)['#text']) {
            value = (value as Record<string, string>)['#text'];
          }

          /**
           * Author
           */
          if (key === ItemKey.AUTHOR && (value as Record<string, string>)['name']) {
            value = (value as Record<string, string>)['name'];
          }

          /**
           * Thumbnail
           */
          if (key === ItemKey.MEDIA_THUMBNAIL && (value as Record<string, string>)['@_url']) {
            value = (value as Record<string, string>)['@_url'];
          }

          /**
           * Media Group
           */
          if (key === ItemKey.MEDIA_GROUP) {
            const mediaGroup: Record<string, unknown> = value as Record<string, unknown>;

            /**
             * Thumbnail URL
             */
            if (
              mediaGroup[ItemKey.MEDIA_THUMBNAIL] &&
              (mediaGroup[ItemKey.MEDIA_THUMBNAIL] as Record<string, unknown>)['@_url']
            ) {
              setItem(
                entries,
                `${ItemKey.MEDIA_GROUP}:${ItemKey.MEDIA_THUMBNAIL}:url`,
                (mediaGroup[ItemKey.MEDIA_THUMBNAIL] as Record<string, unknown>)['@_url'] as string
              );
            }

            /**
             * Content URL
             */
            if (
              mediaGroup[ItemKey.MEDIA_CONTENT] &&
              (mediaGroup[ItemKey.MEDIA_CONTENT] as Record<string, unknown>)['@_url']
            ) {
              setItem(
                entries,
                `${ItemKey.MEDIA_GROUP}:${ItemKey.MEDIA_CONTENT}:url`,
                (mediaGroup[ItemKey.MEDIA_CONTENT] as Record<string, unknown>)['@_url'] as string
              );
            }

            /**
             * Description
             */
            if (mediaGroup[ItemKey.MEDIA_DESCRIPTION]) {
              setItem(
                entries,
                `${ItemKey.MEDIA_GROUP}:${ItemKey.MEDIA_DESCRIPTION}`,
                mediaGroup[ItemKey.MEDIA_DESCRIPTION] as string
              );
            }
          }

          setItem(entries, key, value as string);
        }
      });
    });

    /**
     * Create Items frame
     */
    const itemsFrame = createDataFrame({
      name: 'items',
      refId: query.refId,
      fields: Object.keys(entries).map((key) => {
        const item = entries[key];
        return { name: key, values: item, type: FieldType.string };
      }),
    });

    /**
     * Return Items only
     */
    if (query.feedType === FeedTypeValue.ITEMS) {
      return [itemsFrame];
    }

    /**
     * Return Channel & Items
     */
    return [channelFrame, itemsFrame];
  }
}
