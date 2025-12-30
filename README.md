# ngx-apextree

Angular wrapper for [ApexTree](https://github.com/apexcharts/apextree) - a JavaScript library for creating organizational and hierarchical charts.

## Project Structure

```
ngx-apextree/
├── projects/
│   ├── ngx-apextree/    # Angular library
│   └── demo/            # Demo application
├── dist/                # Build output
└── ...
```

## Development

### Prerequisites

- Node.js 18+
- npm 9+

### Install dependencies

```bash
npm install
```

### Build the library

```bash
npm run build:lib
```

### Run the demo

```bash
npm start
```

This will build the library and start the demo app.

### Build for production

```bash
npm run build:lib:prod
```

## Publishing

The publishable library is located in `dist/ngx-apextree` after building.

```bash
cd dist/ngx-apextree
npm publish
```

## Documentation

See the [library README](./projects/ngx-apextree/README.md) for usage documentation.

## License

See [LICENSE](./LICENSE) for details.
