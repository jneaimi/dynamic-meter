# Directus Dynamic Meter Panel

A customizable meter/gauge panel extension for Directus dashboards that displays comparative data values with dynamic thresholds. The panel supports both standard comparison mode and retention rate calculations.

## Features

- **Two Operating Modes:**
  - Standard Mode: Compare values from collections or manual input
  - Retention Rate Mode: Calculate and display customer retention metrics

- **Flexible Data Sources:**
  - Collection-based data aggregation
  - Support for manual value input
  - Multiple aggregation methods (Sum, Average, Count, Min, Max)
  - Advanced filtering options

- **Dynamic Display Options:**
  - Percentage or numeric value display
  - Customizable color thresholds
  - Responsive design
  - Dynamic date variables support ($NOW, global variables)

## Installation

1. Install the extension:
```
npm install directus-extension-dynamic-meter
npm run build

```

2. Move the built extension to your Directus extensions folder:
`mv dist extensions/panels/dynamic-meter`



## Configuration

### Standard Mode Options

- Primary Collection & Field selection
- Aggregation method (Sum, Average, Count, Min, Max)
- Secondary value from either manual input or another collection
- Custom filters for data refinement

### Retention Rate Mode Options

- Date range selection (From Date, To Date)
- Customer tracking across three metrics:
  - Customers at Start (S)
  - Customers at End (E)
  - Cancelled Customers (N)
- Collection and field mapping for each metric
- Optional filters for each customer group

### Display Configuration

- Choose between percentage or numeric display
- Customize color thresholds with JSON configuration:


## Requirements

- Directus version ^10.10.0
- Node.js version that supports your Directus installation

## Development

1. Clone the repository:
`npm install`
2. Install dependencies:
`npm run dev`


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)