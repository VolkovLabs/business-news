import { dateTime } from '@grafana/data';
import { DataSourceTestStatus, FeedTypeValue } from '../constants';
import { DataSource } from './datasource';

/**
 * Frames
 */
let frames = [
  {
    fields: [
      {
        name: 'title',
        type: 'string',
        config: {},
        values: ['Volkov Labs - Medium'],
      },
      {
        name: 'description',
        type: 'string',
        config: {},
        values: [
          'An agency specializing in custom plugin development for Grafana and founded by long-time Grafana contributor Mikhail Volkov - Medium',
        ],
      },
      {
        name: 'generator',
        type: 'string',
        config: {},
        values: ['Medium'],
      },
      {
        name: 'lastBuildDate',
        type: 'string',
        config: {},
        values: ['Sun, 26 Dec 2021 23:29:37 GMT'],
      },
      {
        name: 'link',
        type: 'string',
        config: {},
        values: ['https://volkovlabs.com?source=rss----97b04264832a---4'],
      },
      {
        name: 'webMaster',
        type: 'string',
        config: {},
        values: ['yourfriends@medium.com'],
      },
      {
        name: 'ttl',
        type: 'number',
        config: {},
        values: [null],
      },
      {
        name: 'imageUrl',
        type: 'string',
        config: {},
        values: ['https://cdn-images-1.medium.com/proxy/1*TGH72Nnw24QL3iV9IOm4VA.png'],
      },
      {
        name: 'imageTitle',
        type: 'string',
        config: {},
        values: ['Volkov Labs - Medium'],
      },
      {
        name: 'imageLink',
        type: 'string',
        config: {},
        values: ['https://volkovlabs.com?source=rss----97b04264832a---4'],
      },
    ],
    refId: 'A',
    name: 'channel',
  },
  {
    fields: [
      {
        name: 'title',
        type: 'string',
        config: {},
        values: ['Using Grafana to display Large PDF documents? We’ve got you covered'],
      },
      {
        name: 'link',
        type: 'string',
        config: {},
        values: [
          'https://volkovlabs.com/using-grafana-to-display-large-pdf-documents-weve-got-you-covered-4e654e8d4bce?source=rss----97b04264832a---4',
        ],
      },
      {
        name: 'guid',
        type: 'string',
        config: {},
        values: [
          {
            '#text': 'https://medium.com/p/4e654e8d4bce',
            '@_isPermaLink': 'false',
          },
        ],
      },
      {
        name: 'category',
        type: 'string',
        config: {},
        values: [['pdf', 'observability', 'volkovlabs', 'grafana-plugin', 'grafana']],
      },
      {
        name: 'dc:creator',
        type: 'string',
        config: {},
        values: ['Mikhail Volkov'],
      },
      {
        name: 'pubDate',
        type: 'string',
        config: {},
        values: ['Fri, 17 Dec 2021 15:39:33 GMT'],
      },
      {
        name: 'atom:updated',
        type: 'string',
        config: {},
        values: ['2021-12-17T15:39:33.433Z'],
      },
      {
        name: 'content:h4',
        type: 'string',
        config: {},
        values: [
          'We discussed the benefits of using Docker containers and initial Provisioning in the recent article on creating our panel plugin template for Grafana. While working on the current feature request for the Base64 image/PDF panel, this technique helped us quickly deliver solutions and improve the long-term support for the panel.',
        ],
      },
      {
        name: 'content:img',
        type: 'string',
        config: {},
        values: ['<img alt="" src="https://cdn-images-1.medium.com/max/1024/0*ZhXFfccuxa1PugIM" />'],
      },
      {
        name: 'content:encoded',
        type: 'string',
        config: {},
        values: [''],
      },
    ],
    refId: 'A',
    name: 'items',
  },
];

/**
 * Api
 */
const apiMock = {
  getFeed: jest.fn().mockImplementation(() => Promise.resolve(frames)),
};

jest.mock('../api/api', () => ({
  Api: jest.fn().mockImplementation(() => apiMock),
}));

/**
 * Data Source
 */
describe('DataSource', () => {
  const instanceSettings: any = {};
  const dataSource = new DataSource(instanceSettings);

  /**
   * Time Range
   */
  const range = {
    from: dateTime(),
    to: dateTime(),
    raw: {
      from: dateTime(),
      to: dateTime(),
    },
  };

  /**
   * Query
   */
  describe('Query', () => {
    it('Should return correct data for MUTABLE frame', async () => {
      const targets = [{ refId: 'A', feedType: FeedTypeValue.ALL }];

      const response = (await dataSource.query({ targets, range } as any)) as any;
      const frames = response.data;
      expect(frames.length).toEqual(2);
      expect(frames[0].fields.length).toEqual(10);
    });
  });

  /**
   * Health Check
   */
  describe('testDatasource', () => {
    it('Should handle Success state', async () => {
      const result = await dataSource.testDatasource();
      expect(result).toEqual({
        status: DataSourceTestStatus.SUCCESS,
        message: `Connected...`,
      });
    });

    it('Should handle Error state', async () => {
      frames = [];

      const result = await dataSource.testDatasource();
      expect(result).toEqual({
        status: DataSourceTestStatus.ERROR,
        message: `Error. Can't connect.`,
      });
    });
  });
});
