# Business News Data Source for Grafana

![Dashboard](https://raw.githubusercontent.com/VolkovLabs/volkovlabs-rss-datasource/main/src/img/dashboard.png)

![Grafana](https://img.shields.io/badge/Grafana-10.4-orange)
![CI](https://github.com/volkovlabs/volkovlabs-rss-datasource/workflows/CI/badge.svg)
![E2E](https://github.com/volkovlabs/volkovlabs-rss-datasource/workflows/E2E/badge.svg)
[![codecov](https://codecov.io/gh/VolkovLabs/volkovlabs-rss-datasource/branch/main/graph/badge.svg?token=2W9VR0PG5N)](https://codecov.io/gh/VolkovLabs/volkovlabs-rss-datasource)
[![CodeQL](https://github.com/VolkovLabs/volkovlabs-rss-datasource/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/VolkovLabs/volkovlabs-rss-datasource/actions/workflows/codeql-analysis.yml)

## Introduction

The Business News data source is a plugin for Grafana that retrieves RSS/Atom feeds and allows visualizing them using Dynamic Text and other panels.

[![Business News Data Source for Grafana | News feed tutorial for Grafana Dashboard](https://raw.githubusercontent.com/volkovlabs/volkovlabs-rss-datasource/main/img/video.png)](https://youtu.be/RAxqS2hpWkg)

## Requirements

- Business News Data Source 4.X requires **Grafana 10** or **Grafana 11**.
- Business News Data Source 3.X requires **Grafana 9** or **Grafana 10**.
- Business News Data Source 2.X requires **Grafana 8.5** or **Grafana 9**.
- Business News Data Source 1.X requires **Grafana 8**.

## Getting Started

The Business News data source can be installed from the [Grafana Catalog](https://grafana.com/grafana/plugins/volkovlabs-rss-datasource/) or utilizing the Grafana command line tool.

For the latter, please use the following command.

```bash
grafana-cli plugins install volkovlabs-rss-datasource
```

## Highlights

- Supports RSS 2.0, RSS 1.0 and Atom.
- Works with Dynamic Text visualization panel.
- Returns Channel (Feed) data, Items (Entries) or both as separate data frames.
- Extract and parse as additional fields:
  - Image from Meta.
  - H4 and Image from the Encoded content.
  - Media:Group for YouTube.
- Filter items/entries based on the selected Time Range.
- Allows specifying Query parameters with dashboard variables.

## Documentation

| Section                                                                               | Description                                                  |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| [Dynamic Text](https://volkovlabs.io/plugins/volkovlabs-rss-datasource/text/)         | Demonstrates how to display feed using Dynamic Text panel.   |
| [Provisioning](https://volkovlabs.io/plugins/volkovlabs-rss-datasource/provisioning/) | Demonstrates how to automatically provision the Data Source. |
| [Release Notes](https://volkovlabs.io/plugins/volkovlabs-rss-datasource/release/)     | Stay up to date with the latest features and updates.        |

## Feedback

We're looking forward to hearing from you. You can use different ways to get in touch with us.

- Ask a question, request a new feature, and file a bug with [GitHub issues](https://github.com/volkovlabs/volkovlabs-rss-datasource/issues).
- Subscribe to our [YouTube Channel](https://www.youtube.com/@volkovlabs) and leave your comments.
- Sponsor our open-source plugins for Grafana with [GitHub Sponsor](https://github.com/sponsors/VolkovLabs).
- Support our project by starring the repository.

## License

Apache License Version 2.0, see [LICENSE](https://github.com/volkovlabs/volkovlabs-rss-datasource/blob/main/LICENSE).
