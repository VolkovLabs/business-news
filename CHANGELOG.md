# Change Log

## 4.0.0 (2024-05-09)

### Breaking changes

- Requires Grafana 10 and Grafana 11

### Features / Enhancements

- Added plugin e2e tests and remove cypress (#68)
- Prepared for Grafana 11 (#71)
- Updated to Grafana 10.4.2 and dependencies (#72)

## 3.1.0 (2024-02-12)

### Features / Enhancements

- Added application type in Headers (#61)
- Updated ESLint configuration and refactoring (#62)
- Updated to Grafana 10.3.1 (#63)

## 3.0.1 (2023-08-02)

### Bugfix

- Removed root URL http://localhost:3000 added during migration to Plugin Tools

## 3.0.0 (2023-07-26)

### Breaking changes

- Requires Grafana 9 and Grafana 10

### Features / Enhancements

- Updated tests with testing-library/react (#50)
- Migrated to Plugin Tools 1.5.2 (#51)
- Updated to Node 18 and npm (#51)
- Updated to Grafana 10.0.0 (#51)
- Added E2E Cypress testing (#52)
- Removed Grafana 8.5 support (#56)
- Updated ESLint configuration (#56)

## 2.4.0 (2023-04-08)

### Features / Enhancements

- Updated to Grafana 9.4.7 (#44)
- Updated CI and Release workflows (#45)
- Updated Documentation, Provisioning (#46)
- Added URL parameters with variables support (#47, #48)

## 2.3.0 (2022-11-16)

### Features / Enhancements

- Updated to Grafana 9.1.4 (#36)
- Added Compatibility Check Workflow (#37)
- Updated CI to Node 16 and Synchronize with Release workflow (#39)
- Updated to Grafana 9.2.2 (#40)
- Updated CI to upload signed artifacts (#41)

## 2.2.0 (2022-08-25)

### Features / Enhancements

- Added YouTube video in README (#32)
- Updated based on 9.1.1 (#35)

## 2.1.0 (2022-06-23)

### Features / Enhancements

- Added YouTube fields parsing and refactoring (#31)

## 2.0.0 (2022-06-17)

### Breaking changes

- Requires Grafana 8.5+ and 9.0+

### Features / Enhancements

- Updated based on 9.0.0 (#30)

## 1.7.0 (2022-05-21)

### Features / Enhancements

- Added Feed URL with query parameters (#28)

## 1.6.2 (2022-05-13)

### Breaking changes

- Requires Grafana 8.3.0 or newer.

## 1.6.1 (2022-05-13)

### Features / Enhancements

- Clarify Breaking change introduced in 1.6.0 (#24)
- Updated API tests and set parsing `rss.channel.item` as array always (#25)
- Improved test coverage (#26)

## 1.6.0 (2022-05-12)

### Breaking changes

- Automatic parsing of `author.name` and `media:thumbnail.url` fields break templates who uses them. To fix it, just replace it with `author` and `media:thumbnail`. Thanks to @vfauth for testing.

### Features / Enhancements

- Updated based on 8.5.2 (#23)

### Bug fixes

- Can't parse GitHub releases feed (#21)

## 1.5.0 (2022-04-25)

### Features / Enhancements

- Added Provisioning instructions to README (#16)
- Added RSS 1.0 support (#19)
- Rebuild based on 8.5.0 (#17, #20)

## 1.4.0 (2022-02-18)

### Features / Enhancements

- Updated using 8.4.0 and use PluginCheck v2 (#13, #14)
- Select items/entries based on the selected Time Range (#3)

## 1.3.1 (2022-02-02)

### Bug fixes

- Google Workspace Atom feed failed #11

## 1.3.0 (2022-01-24)

### Features / Enhancements

- Update README with link to the Grafana Marketplace (#8)
- Rebuild using 8.3.4 (#6)

## 1.2.0 (2022-01-11)

### Features / Enhancements

- Signed as Community datasource plugin (#7).

## 1.1.0 (2021-12-27)

### Features / Enhancements

- Extract <img src="X"> from the <figure> (#5)
- Extract Guid's text from the <guid> (#5)
- Update dashboards layout

## 1.0.0 (2021-12-26)

### Features / Enhancements

- Supports RSS 2.0 and Atom.
- Works great with Dynamic Text panel by Marcus Olsson (marcusolsson-dynamictext-panel).
- Initial release based on the Volkov Labs Abc Data source template.
