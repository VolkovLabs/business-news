# RSS datasource plugin for Grafana

![Dashboard](https://raw.githubusercontent.com/VolkovLabs/volkovlabs-rss-datasource/main/src/img/dashboard.png)

[![Grafana 8](https://img.shields.io/badge/Grafana-8-orange)](https://www.grafana.com)
![CI](https://github.com/volkovlabs/volkovlabs-rss-datasource/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/VolkovLabs/volkovlabs-rss-datasource/branch/main/graph/badge.svg?token=2W9VR0PG5N)](https://codecov.io/gh/VolkovLabs/volkovlabs-rss-datasource)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/VolkovLabs/volkovlabs-rss-datasource.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/VolkovLabs/volkovlabs-rss-datasource/context:javascript)

## Introduction

The RSS Datasource plugin for Grafana.

### Requirements

Grafana 8.0 is required.

## Getting Started

1. Install packages

```bash
yarn install
```

2. Build the plugin

```bash
yarn build
```

3. Sign the plugins

```
export GRAFANA_API_KEY=erXXXX==
yarn sign
```

4. Start Docker container

```bash
yarn run start
```

## Features

- Supports RSS 2.0.
- Returns Channel data, Items or both as separate data frames.
- Extract Image from Meta.
- Extract H4 and Image from Encoded content.
- Works great with Dynamic Text panel bu Marcus Olsson (marcusolsson-dynamictext-panel)

## Feedback

We love to hear from users, developers, and the whole community interested in this plugin. These are various ways to get in touch with us:

- Ask a question, request a new feature, and file a bug with [GitHub issues](https://github.com/volkovlabs/volkovlabs-rss-datasource/issues/new/choose).
- Star the repository to show your support.

## Contributing

- Fork the repository.
- Find an issue to work on and submit a pull request.
- Could not find an issue? Look for documentation, bugs, typos, and missing features.

## License

- Apache License Version 2.0, see [LICENSE](https://github.com/volkovlabs/volkovlabs-rss-datasource/blob/main/LICENSE).
