import { XMLParser } from 'fast-xml-parser';
import { lastValueFrom } from 'rxjs';
import { DataSourceInstanceSettings, FieldType, MutableDataFrame } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import { FeedTypeValue, ItemKeys, MetaProperties } from '../constants';
import { DataSourceOptions, Query } from '../types';
import { setItem } from '../utils';

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
   * @param {RedisEnterpriseQuery} query Query
   * @returns {Promise<Cluster>} Cluster info
   */
  async getFeed(query: Query): Promise<MutableDataFrame[]> {
    /**
     * Fetch Feed
     */
    const response = await lastValueFrom(
      getBackendSrv().fetch({
        method: 'GET',
        url: `${this.instanceSettings.url}/feed`,
      })
    );

    /**
     * Nothing returned
     */
    if (!response || !response.data) {
      console.error('RSS data is not found');
      return [];
    }

    /**
     * Parse XML
     */
    const parser = new XMLParser({ ignoreAttributes: false });
    const data = parser.parse(response.data as any);

    /**
     * RSS 2.0 with Channel data
     */
    if (data.rss && data.rss.channel) {
      /**
       * Channel Data
       */
      const channel = data.rss.channel;
      const channelFrame = new MutableDataFrame({
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
       * Find all items
       */
      const items: { [id: string]: string[] } = {};
      channel.item.forEach((item: any) => {
        Object.keys(item).forEach((key: string) => {
          let value = item[key];

          /**
           * Parse Meta
           */
          if (key === ItemKeys.META && value['@_property'] === MetaProperties.OG_IMAGE) {
            key = MetaProperties.OG_IMAGE;
            value = value['@_content'];
          }

          /**
           * Parse Guid
           */
          if (key === ItemKeys.GUID && value['#text']) {
            value = value['#text'];
          }

          /**
           * Parse Encoded content for H4 and first Image
           */
          if (key === ItemKeys.CONTENT_ENCODED) {
            const h4 = value.match(/<h4>(.*?)<\/h4>/);
            const figure = value.match(/<figure>(.*?)<\/figure>/);

            setItem(items, ItemKeys.CONTENT_H4, h4?.length ? h4[1] : '');

            /**
             * Extract image and source
             */
            if (figure?.length) {
              setItem(items, ItemKeys.CONTENT_IMG, figure[1]);
              const img = figure[1].match(/<img.+src\=(?:\"|\')(.+?)(?:\"|\')(?:.+?)\>/);
              setItem(items, ItemKeys.CONTENT_IMG_SRC, img?.length ? img[1] : '');
            }
          }

          setItem(items, key, value);
        });
      });

      /**
       * Create Items frame
       */
      const itemsFrame = new MutableDataFrame({
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
    const channelFrame = new MutableDataFrame({
      name: 'channel',
      refId: query.refId,
      fields: [
        { name: 'author', values: [feed.author.name], type: FieldType.string },
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
     * Find all entries
     */
    const entries: { [id: string]: string[] } = {};
    feed.entry.forEach((entry: any) => {
      Object.keys(entry).forEach((key: string) => {
        let value = entry[key];

        /**
         * Parse Link
         */
        if (key === ItemKeys.LINK && value['@_href']) {
          value = value['@_href'];
        }

        /**
         * Parse Content
         */
        if (key === ItemKeys.CONTENT && value['#text']) {
          value = value['#text'];
        }

        setItem(entries, key, value);
      });
    });

    /**
     * Create Items frame
     */
    const itemsFrame = new MutableDataFrame({
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
