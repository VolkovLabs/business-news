import { Observable } from 'rxjs';
import { FeedTypeValue } from '../constants';
import { Api } from './api';

/**
 * Response
 *
 * @param response
 */
const getResponse = (response: any) =>
  new Observable((subscriber) => {
    subscriber.next(response);
    subscriber.complete();
  });

/**
 * Fetch request Mock
 */
const fetchRequestMock = jest.fn().mockImplementation(() =>
  getResponse({
    status: 200,
    statusText: 'OK',
    ok: true,
    data:
      '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Grafana Labs Blog on Grafana Labs</title><link>https://grafana.com/blog/</link><description>Recent content in Grafana Labs Blog on Grafana Labs</description><generator>Hugo -- gohugo.io</generator><language>en-us</language><atom:link href="/blog/index.xml" rel="self" type="application/rss+xml"/><item><title>How product teams can manage their performance using Grafana, Prometheus, and Oracle metrics</title><meta property="og:image" content="https://grafana.com/static/assets/img/blog/obscondelldashboard.jpg"/><link>https://grafana.com/blog/2021/12/23/how-product-teams-can-manage-their-performance-using-grafana-prometheus-and-oracle-metrics/?utm_source=grafana_news&amp;utm_medium=rss</link><pubDate>Thu, 23 Dec 2021 00:00:00 +0000</pubDate><guid>https://grafana.com/blog/2021/12/23/how-product-teams-can-manage-their-performance-using-grafana-prometheus-and-oracle-metrics/?utm_source=grafana_news&amp;utm_medium=rss&amp;src=in-prod&amp;plcmt=rss</guid><description>Ever known a project manager who thinks a task takes minutes when it really takes hours? One company has developed a helpful monitoring tool that not only helps project managers make more realistic estimates, but also helps product teams save time, increase efficiency, and improve their overall performance.\nAt ObservabilityCON 2020, Walter Ritzel Paixão Côrtes, a product designer at Dell, gave a presentation about a data-driven solution his team developed called Product Team Observability.</description></item><item><title>Grafana EMEA meetup recap: shift left observability, AI and load testing, monitoring plants, and more</title><meta property="og:image" content="https://grafana.com/static/assets/img/blog/grafana-emea_meetup_december21_recap.png"/><link>https://grafana.com/blog/2021/12/22/grafana-emea-meetup-recap-shift-left-observability-ai-and-load-testing-monitoring-plants-and-more/?utm_source=grafana_news&amp;utm_medium=rss</link><pubDate>Wed, 22 Dec 2021 17:00:00 +0000</pubDate><guid>https://grafana.com/blog/2021/12/22/grafana-emea-meetup-recap-shift-left-observability-ai-and-load-testing-monitoring-plants-and-more/?utm_source=grafana_news&amp;utm_medium=rss&amp;src=in-prod&amp;plcmt=rss</guid><description>On Dec. 8, we gathered the Grafana EMEA community for another dynamic meetup. Experts from the Grafana Labs and k6 teams alongside observability pros from different organizations covered topics ranging from shift left observability practices to monitoring your green thumb at home with Grafana. In case you missed the virtual get together, here&amp;rsquo;s a recap of each talk along with the session videos.\nPlanting the seed of observability  First up was Giordano Ricci, Grafana Labs Software Engineer.</description></item><item><title>How Grafana powers the dynamic visualizations of IoT data for AWS IoT TwinMaker</title><meta property="og:image" content="https://grafana.com/static/assets/img/blog/aws-twinmaker-alarm-dashboard.png"/><link>https://grafana.com/blog/2021/12/21/how-grafana-powers-the-dynamic-visualizations-of-iot-data-for-aws-iot-twinmaker/?utm_source=grafana_news&amp;utm_medium=rss</link><pubDate>Tue, 21 Dec 2021 00:00:00 +0000</pubDate><guid>https://grafana.com/blog/2021/12/21/how-grafana-powers-the-dynamic-visualizations-of-iot-data-for-aws-iot-twinmaker/?utm_source=grafana_news&amp;utm_medium=rss&amp;src=in-prod&amp;plcmt=rss</guid><description>At re:Invent this year, AWS announced its new digital twin service, AWS IoT TwinMaker (in preview), which allows users to create digital twins of real-world systems like buildings, factories, industrial equipment, and production lines.\nUsing a digital twin to monitor and improve operations for a physical system requires ingesting data from IoT sensors, process instruments, cameras, and enterprise systems, and curating and associating data from these disparate sources. And that’s where Grafana comes in.</description></item><item><title>Monitor all your Redshift clusters in Grafana with the new Amazon Redshift data source plugin</title><meta property="og:image" content="https://grafana.com/static/assets/img/blog/aws-redshift-default-dashboard.png"/><link>https://grafana.com/blog/2021/12/20/monitor-all-your-redshift-clusters-in-grafana-with-the-new-amazon-redshift-data-source-plugin/?utm_source=grafana_news&amp;utm_medium=rss</link><pubDate>Mon, 20 Dec 2021 10:52:00 +0000</pubDate><guid>https://grafana.com/blog/2021/12/20/monitor-all-your-redshift-clusters-in-grafana-with-the-new-amazon-redshift-data-source-plugin/?utm_source=grafana_news&amp;utm_medium=rss&amp;src=in-prod&amp;plcmt=rss</guid><description>This blog post was co-authored by Grafana Labs Software Engineer Andres Martinez, who works on the cloud data sources team, and Robbie Rolin, a Software Development Engineer on the Amazon Managed Grafana team.\nIn collaboration with the AWS team, we have recently released the new Redshift data source plugin for Grafana.\nAmazon Redshift is the fastest and most widely used cloud data warehouse. It uses SQL to analyze structured and semi-structured data across data warehouses, operational databases, and data lakes by using AWS-designed hardware and machine learning.</description></item><item><title>The values behind scaling cloud native security at Grafana Labs</title><meta property="og:image" content="https://grafana.com/static/assets/img/blog/grafana-security-user.png"/><link>https://grafana.com/blog/2021/12/20/the-values-behind-scaling-cloud-native-security-at-grafana-labs/?utm_source=grafana_news&amp;utm_medium=rss</link><pubDate>Mon, 20 Dec 2021 00:00:00 +0000</pubDate><guid>https://grafana.com/blog/2021/12/20/the-values-behind-scaling-cloud-native-security-at-grafana-labs/?utm_source=grafana_news&amp;utm_medium=rss&amp;src=in-prod&amp;plcmt=rss</guid><description>On Nov. 8, I started as the new Chief Information and Security Officer at Grafana Labs. In my first five weeks, I’ve met about 100 really amazing people; learned and absorbed early lessons about our workplace culture; kicked off working groups for our 2022 initiatives (bug bounty FTW); and contributed to tackling our first-ever 0day. Amid all of that, I&amp;rsquo;ve also been doing a lot of thinking. I’m a big believer in understanding the &amp;ldquo;why&amp;rdquo; behind a situation before the what or the how.</description></item><item><title>Monitoring remote user workstations with Prometheus, Ansible, and Grafana Cloud</title><meta property="og:image" content="https://grafana.com/static/assets/img/blog/ocroluscard.png"/><link>https://grafana.com/blog/2021/12/17/monitoring-remote-user-workstations-with-prometheus-ansible-and-grafana-cloud/?utm_source=grafana_news&amp;utm_medium=rss</link><pubDate>Fri, 17 Dec 2021 15:00:00 +0000</pubDate><guid>https://grafana.com/blog/2021/12/17/monitoring-remote-user-workstations-with-prometheus-ansible-and-grafana-cloud/?utm_source=grafana_news&amp;utm_medium=rss&amp;src=in-prod&amp;plcmt=rss</guid><description>Monitoring is usually associated with servers and applications, but the fintech automation platform Ocrolus recently needed to set up monitoring for a different purpose: to gain meaningful data and insights about nearly 1,000 remote user workstations.\nDuring a presentation at ObservabilityCON 2021, Ocrolus\' tech ops manager Travis Johnson walked through how his company made it happen while reusing as much existing industry tooling and knowledge as possible — specifically Grafana Cloud and Prometheus.</description></item><item><title>Introducing the Sentry data source plugin for Grafana</title><meta property="og:image" content="https://grafana.com/static/assets/img/blog/sentry-plugin-dashboard.png"/><link>https://grafana.com/blog/2021/12/16/introducing-the-sentry-data-source-plugin-for-grafana/?utm_source=grafana_news&amp;utm_medium=rss</link><pubDate>Thu, 16 Dec 2021 00:00:00 +0000</pubDate><guid>https://grafana.com/blog/2021/12/16/introducing-the-sentry-data-source-plugin-for-grafana/?utm_source=grafana_news&amp;utm_medium=rss&amp;src=in-prod&amp;plcmt=rss</guid><description>We’re thrilled to announce the addition of the Sentry data source plugin to Grafana. Grafana Labs worked in partnership with Sentry, the code observability platform, to help development teams see the issues that matter and solve them faster — across their entire tech stack — so they can remove silos and ship with confidence.\nWhat is Sentry? Sentry is a code observability platform. With prioritized views, real-time alerting, and deep issue context, Sentry gives developers code-level visibility into their application so they can see crashes, slowdowns, and errors that matter; solve them faster with actionable details; and learn from historical trends to optimize code health over time.</description></item><item><title>Identify operational issues quickly by using Grafana and Amazon CloudWatch Metrics Insights</title><meta property="og:image" content="https://grafana.com/static/assets/img/blog/grafana-metrics-insights-instances-by-cpu-masked.png"/><link>https://grafana.com/blog/2021/12/15/identify-operational-issues-quickly-by-using-grafana-and-amazon-cloudwatch-metrics-insights/?utm_source=grafana_news&amp;utm_medium=rss</link><pubDate>Wed, 15 Dec 2021 00:00:00 +0000</pubDate><guid>https://grafana.com/blog/2021/12/15/identify-operational-issues-quickly-by-using-grafana-and-amazon-cloudwatch-metrics-insights/?utm_source=grafana_news&amp;utm_medium=rss&amp;src=in-prod&amp;plcmt=rss</guid><description>This blog post was co-written by Grafana Labs Software Engineer Erik Sundell, who mainly focuses on integrations between Grafana and cloud services, and Omur Kirikci, a Senior Product Manager for Amazon CloudWatch responsible for the Metrics domain. Kirikci is passionate about creating new products and strives for success by ensuring customer satisfaction. Outside of work, he enjoys being outdoors and hiking, spending time with his family, tasting different cuisines, and watching soccer with friends.</description></item><item><title>Grafana Labs core products not impacted by Log4j CVE-2021-44228 and related vulnerabilities</title><meta property="og:image" content="https://grafana.com/static/assets/img/blog/grafana-security-fix.png"/><link>https://grafana.com/blog/2021/12/14/grafana-labs-core-products-not-impacted-by-log4j-cve-2021-44228-and-related-vulnerabilities/?utm_source=grafana_news&amp;utm_medium=rss</link><pubDate>Tue, 14 Dec 2021 00:00:00 +0000</pubDate><guid>https://grafana.com/blog/2021/12/14/grafana-labs-core-products-not-impacted-by-log4j-cve-2021-44228-and-related-vulnerabilities/?utm_source=grafana_news&amp;utm_medium=rss&amp;src=in-prod&amp;plcmt=rss</guid><description>Note: We are receiving questions around CVE-2021-45046. This CVE is a follow-up exploit to CVE-2021-44228. As such, the statements below also apply for CVE-2021-45046.\nLike many of our peers, we have spent the last few days responding to the Log4j RCE vulnerability, CVE-2021-44228, and the related CVEs that were discovered following disclosure of 44228. We are fortunate in our case that we chose not to use Java as a core part of our stack and have minimal dependencies on services and applications that make use of it.</description></item><item><title>Query and analyze Amazon S3 data with the new Amazon Athena plugin for Grafana</title><meta property="og:image" content="https://grafana.com/static/assets/img/blog/grafana-athena-edit-panel.png"/><link>https://grafana.com/blog/2021/12/13/query-and-analyze-amazon-s3-data-with-the-new-amazon-athena-plugin-for-grafana/?utm_source=grafana_news&amp;utm_medium=rss</link><pubDate>Mon, 13 Dec 2021 00:00:00 +0000</pubDate><guid>https://grafana.com/blog/2021/12/13/query-and-analyze-amazon-s3-data-with-the-new-amazon-athena-plugin-for-grafana/?utm_source=grafana_news&amp;utm_medium=rss&amp;src=in-prod&amp;plcmt=rss</guid><description>This blog post was co-authored by Sarah Zinger, Software Engineer in R&amp;amp;D at Grafana who works as part of the cloud data sources squad that builds open source data source plugins to connect Grafana with major cloud providers, and Robbie Rolins, a Software Development Engineer on the Amazon Managed Grafana team.\nIn collaboration with the AWS team, we have recently released the new Athena data source plugin for Grafana.</description></item></channel></rss>',
    headers: {},
    url: 'http://localhost:3000/api/datasources/proxy/3/feed',
    type: 'basic',
    redirected: false,
    config: {
      method: 'GET',
      url: 'api/datasources/proxy/3/feed',
      showSuccessAlert: true,
      showErrorAlert: true,
      retry: 0,
      headers: {
        'X-Grafana-Org-Id': 1,
      },
      hideFromInspector: false,
    },
  })
);

/**
 * Mock @grafana/runtime
 */
jest.mock('@grafana/runtime', () => ({
  getBackendSrv: () => ({
    fetch: fetchRequestMock,
  }),
}));

/**
 * API
 */
describe('Api', () => {
  const instanceSettings: any = {};

  /**
   * Api
   */
  const api = new Api(instanceSettings);

  /**
   * getFeed
   */
  describe('getFeed', () => {
    it('Should make getFeed request', async () => {
      const result = await api.getFeed({ refId: 'A', feedType: FeedTypeValue.ALL });
      expect(result?.length).toEqual(2);
    });
  });
});
