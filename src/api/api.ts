import { XMLParser } from 'fast-xml-parser';
import { lastValueFrom } from 'rxjs';
import { DataSourceInstanceSettings, FieldType, MutableDataFrame, TimeRange } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import { alwaysArray, FeedTypeValue, ItemKey, MetaProperties } from '../constants';
import { DataSourceOptions, Query } from '../types';
import { isDateBetweenRange, setItem } from '../utils';

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
   * @returns {Promise<MutableDataFrame[]>} Feed
   */
  async getFeed(
    query: Query,
    range: TimeRange | null = null,
    params: Record<string, any> | undefined = undefined
  ): Promise<MutableDataFrame[]> {
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
          Accept: 'application/rss+xml;charset=UTF-8',
        },
        url: `${this.instanceSettings.url}/feed`,
        params,
      })
    );

    /**
     * Nothing returned
     */
    if (!response || !response.data) {
      console.error('Feed data is not found');
      return [];
    }

    /**
     * Parse XML
     */
    const parser = new XMLParser({
      ignoreAttributes: false,
      isArray: (name, jpath, isLeafNode, isAttribute) => {
        return alwaysArray.indexOf(jpath) !== -1 ? true : false;
      },
    });
    const data = parser.parse(response.data as any);

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
        /**
         * Filter by specified Date field
         */
        if (query.dateField && range && !isDateBetweenRange(item[query.dateField], range)) {
          return;
        }

        Object.keys(item).forEach((key: string) => {
          let value = item[key];

          /**
           * Parse Meta
           */
          if (key === ItemKey.META && value['@_property'] === MetaProperties.OG_IMAGE) {
            key = MetaProperties.OG_IMAGE;
            value = value['@_content'];
          }

          /**
           * Parse Guid
           */
          if (key === ItemKey.GUID && value['#text']) {
            value = value['#text'];
          }

          /**
           * Parse Encoded content for H4 and first Image
           */
          if (key === ItemKey.CONTENT_ENCODED) {
            const h4 = value.match(/<h4>(.*?)<\/h4>/);
            const figure = value.match(/<figure>(.*?)<\/figure>/);

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
     * Find all entries
     */
    const entries: { [id: string]: string[] } = {};
    feed.entry.forEach((entry: any) => {
      /**
       * Filter by specified Date field
       */
      if (query.dateField && range && !isDateBetweenRange(entry[query.dateField], range)) {
        return;
      }

      Object.keys(entry).forEach((key: string) => {
        let value = entry[key];

        /**
         * Link
         */
        if (key === ItemKey.LINK && value['@_href']) {
          value = value['@_href'];
        }

        /**
         * Content
         */
        if (key === ItemKey.CONTENT && value['#text']) {
          value = value['#text'];
        }

        /**
         * Summary
         */
        if (key === ItemKey.SUMMARY && value['#text']) {
          value = value['#text'];
        }

        /**
         * Author
         */
        if (key === ItemKey.AUTHOR && value['name']) {
          value = value['name'];
        }

        /**
         * Thumbnail
         */
        if (key === ItemKey.MEDIA_THUMBNAIL && value['@_url']) {
          value = value['@_url'];
        }

        /**
         * Media Group
         */
        if (key === ItemKey.MEDIA_GROUP) {
          /**
           * Thumbnail URL
           */
          if (value[ItemKey.MEDIA_THUMBNAIL] && value[ItemKey.MEDIA_THUMBNAIL]['@_url']) {
            setItem(
              entries,
              `${ItemKey.MEDIA_GROUP}:${ItemKey.MEDIA_THUMBNAIL}:url`,
              value[ItemKey.MEDIA_THUMBNAIL]['@_url']
            );
          }

          /**
           * Content URL
           */
          if (value[ItemKey.MEDIA_CONTENT] && value[ItemKey.MEDIA_CONTENT]['@_url']) {
            setItem(
              entries,
              `${ItemKey.MEDIA_GROUP}:${ItemKey.MEDIA_CONTENT}:url`,
              value[ItemKey.MEDIA_CONTENT]['@_url']
            );
          }

          /**
           * Description
           */
          if (value[ItemKey.MEDIA_DESCRIPTION]) {
            setItem(entries, `${ItemKey.MEDIA_GROUP}:${ItemKey.MEDIA_DESCRIPTION}`, value[ItemKey.MEDIA_DESCRIPTION]);
          }
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
