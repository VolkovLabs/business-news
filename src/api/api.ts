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
  async getFeed(query: Query): Promise<MutableDataFrame[] | undefined> {
    /**
     * Fetch Feed
     */
    const feed = await lastValueFrom(
      getBackendSrv().fetch({
        method: 'GET',
        url: `${this.instanceSettings.url}/feed`,
        showSuccessAlert: true,
        showErrorAlert: true,
      })
    );

    /**
     * Nothing returned
     */
    if (!feed || !feed.data) {
      console.error('RSS data is not found');
      return;
    }

    /**
     * Parse XML
     */
    const parser = new XMLParser({ ignoreAttributes: false });
    const data = parser.parse(feed.data as any);

    console.log(data);

    /**
     * Check the Channel data
     */
    if (!data.rss || !data.rss.channel) {
      console.error('RSS Channel is not found');
      return;
    }

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
         * Parse Encoded content for H4 and first Image
         */
        if (key === ItemKeys.CONTENT_ENCODED) {
          const h4 = value.match(/<h4>(.*?)<\/h4>/);
          const figure = value.match(/<figure>(.*?)<\/figure>/);

          setItem(items, ItemKeys.CONTENT_H4, h4?.length ? h4[1] : '');
          setItem(items, ItemKeys.CONTENT_IMG, figure?.length ? figure[1] : '');
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
