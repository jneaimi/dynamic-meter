import { definePanel } from '@directus/extensions-sdk';
import PanelComponent from './panel.vue';

export default definePanel({
	id: 'dynamic-meter',
	name: 'Dynamic Meter',
	icon: 'speed',
	description: 'A configurable meter panel that displays comparative data values',
	component: PanelComponent,
	options: [
		{
			field: 'meterMode',
			name: 'Meter Mode',
			type: 'string',
			schema: {
				default_value: 'standard',
			},
			meta: {
				interface: 'select-dropdown',
				options: {
					choices: [
						{ text: 'Standard Mode', value: 'standard' },
						{ text: 'Retention Rate', value: 'retention' },
					],
				},
				width: 'half',
				note: 'Choose between standard comparison or retention rate calculation',
			},
		},
		// Date Range Fields
		{
			field: 'fromDate',
			name: 'From Date',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'half',
				options: {
					placeholder: 'Enter date, {{variable}}, or $NOW',
				},
				conditions: [{
					rule: { meterMode: { _eq: 'retention' }},
					hidden: false,
					required: true
				}, {
					rule: { meterMode: { _neq: 'retention' }},
					hidden: true
				}],
				note: 'Supports: YYYY-MM-DD, global variables ({{variable}}), or $NOW variables ($NOW, $NOW(-1 MONTH))',
			},
		},
		{
			field: 'toDate',
			name: 'To Date',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'half',
				options: {
					placeholder: 'Enter date, {{variable}}, or $NOW',
				},
				conditions: [{
					rule: { meterMode: { _eq: 'retention' }},
					hidden: false,
					required: true
				}, {
					rule: { meterMode: { _neq: 'retention' }},
					hidden: true
				}],
				note: 'Supports: YYYY-MM-DD, global variables ({{variable}}), or $NOW variables ($NOW, $NOW(-1 MONTH))',
			},
		},
		// Customers at Start (S)
		{
			field: 'startCollection',
			name: 'Customers at Start (S)',
			type: 'string',
			meta: {
				interface: 'system-collection',
				width: 'full',
				options: {
					includeSystem: false,
				},
				conditions: [{
					rule: { meterMode: { _eq: 'retention' }},
					hidden: false,
					required: true
				}, {
					rule: { meterMode: { _neq: 'retention' }},
					hidden: true
				}],
				note: 'Collection for counting customers at start (S)',
			},
		},
		{
			field: 'startField',
			name: 'Start Count Field',
			type: 'string',
			meta: {
				interface: 'system-field',
				width: 'half',
				options: {
					collectionField: 'startCollection',
				},
				conditions: [{
					rule: { meterMode: { _eq: 'retention' }},
					hidden: false,
					required: true
				}, {
					rule: { meterMode: { _neq: 'retention' }},
					hidden: true
				}],
				note: 'Field to count for start customers',
			},
		},
		{
			field: 'startFilter',
			name: 'Start Filter',
			type: 'json',
			meta: {
				interface: 'system-filter',
				width: 'full',
				options: {
					collectionField: 'startCollection',
				},
				conditions: [{
					rule: { meterMode: { _eq: 'retention' }},
					hidden: false
				}, {
					rule: { meterMode: { _neq: 'retention' }},
					hidden: true
				}],
				note: 'Optional filter for start customers',
			},
		},
		// Customers at End (E)
		{
			field: 'endCollection',
			name: 'Customers at End (E)',
			type: 'string',
			meta: {
				interface: 'system-collection',
				width: 'full',
				options: {
					includeSystem: false,
				},
				conditions: [{
					rule: { meterMode: { _eq: 'retention' }},
					hidden: false,
					required: true
				}, {
					rule: { meterMode: { _neq: 'retention' }},
					hidden: true
				}],
				note: 'Collection for counting customers at end (E)',
			},
		},
		{
			field: 'endField',
			name: 'End Count Field',
			type: 'string',
			meta: {
				interface: 'system-field',
				width: 'half',
				options: {
					collectionField: 'endCollection',
				},
				conditions: [{
					rule: { meterMode: { _eq: 'retention' }},
					hidden: false,
					required: true
				}, {
					rule: { meterMode: { _neq: 'retention' }},
					hidden: true
				}],
				note: 'Field to count for end customers',
			},
		},
		{
			field: 'endFilter',
			name: 'End Filter',
			type: 'json',
			meta: {
				interface: 'system-filter',
				width: 'full',
				options: {
					collectionField: 'endCollection',
				},
				conditions: [{
					rule: { meterMode: { _eq: 'retention' }},
					hidden: false
				}, {
					rule: { meterMode: { _neq: 'retention' }},
					hidden: true
				}],
				note: 'Optional filter for end customers',
			},
		},
		// Cancelled Customers (N)
		{
			field: 'cancelledCollection',
			name: 'Cancelled Customers (N)',
			type: 'string',
			meta: {
				interface: 'system-collection',
				width: 'full',
				options: {
					includeSystem: false,
				},
				conditions: [{
					rule: { meterMode: { _eq: 'retention' }},
					hidden: false,
					required: true
				}, {
					rule: { meterMode: { _neq: 'retention' }},
					hidden: true
				}],
				note: 'Collection for counting cancelled customers (N)',
			},
		},
		{
			field: 'cancelledField',
			name: 'Cancelled Count Field',
			type: 'string',
			meta: {
				interface: 'system-field',
				width: 'half',
				options: {
					collectionField: 'cancelledCollection',
				},
				conditions: [{
					rule: { meterMode: { _eq: 'retention' }},
					hidden: false,
					required: true
				}, {
					rule: { meterMode: { _neq: 'retention' }},
					hidden: true
				}],
				note: 'Field to count for cancelled customers',
			},
		},
		{
			field: 'cancelledFilter',
			name: 'Cancelled Filter',
			type: 'json',
			meta: {
				interface: 'system-filter',
				width: 'full',
				options: {
					collectionField: 'cancelledCollection',
				},
				conditions: [{
					rule: { meterMode: { _eq: 'retention' }},
					hidden: false
				}, {
					rule: { meterMode: { _neq: 'retention' }},
					hidden: true
				}],
				note: 'Optional filter for cancelled customers',
			},
		},
		// Standard mode fields
		{
			field: 'primaryCollection',
			name: 'Primary Collection',
			type: 'string',
			meta: {
				interface: 'system-collection',
				width: 'half',
				options: {
					includeSystem: false,
					includeSingleton: false,
				},
				conditions: [{
					rule: { meterMode: { _eq: 'standard' }},
					hidden: false,
					required: true
				}, {
					rule: { meterMode: { _neq: 'standard' }},
					hidden: true
				}],
				note: 'Select the collection for Value 1',
			},
		},
		{
			field: 'primaryField',
			name: 'Primary Field',
			type: 'string',
			meta: {
				interface: 'system-field',
				width: 'half',
				options: {
					collectionField: 'primaryCollection',
					typeAllowList: ['integer', 'decimal', 'float', 'bigInteger', 'string', 'text', 'uuid', 'char'],
				},
				conditions: [{
					rule: { meterMode: { _eq: 'standard' }},
					hidden: false
				}, {
					rule: { meterMode: { _neq: 'standard' }},
					hidden: true
				}],
				note: 'Select the field to aggregate',
			},
		},
		{
			field: 'primaryAggregation',
			name: 'Primary Aggregation',
			type: 'string',
			schema: {
				default_value: 'sum',
			},
			meta: {
				interface: 'select-dropdown',
				width: 'half',
				options: {
					choices: [
						{ text: 'Sum', value: 'sum' },
						{ text: 'Average', value: 'avg' },
						{ text: 'Count', value: 'count' },
						{ text: 'Minimum', value: 'min' },
						{ text: 'Maximum', value: 'max' },
					],
				},
				conditions: [{
					rule: { meterMode: { _eq: 'standard' }},
					hidden: false
				}, {
					rule: { meterMode: { _neq: 'standard' }},
					hidden: true
				}],
				note: 'Choose how to aggregate the primary value',
			},
		},
		{
			field: 'primaryFilter',
			name: 'Primary Filter',
			type: 'json',
			meta: {
				interface: 'system-filter',
				options: {
					collectionField: 'primaryCollection',
				},
				width: 'full',
				conditions: [{
					rule: { meterMode: { _eq: 'standard' }},
					hidden: false
				}, {
					rule: { meterMode: { _neq: 'standard' }},
					hidden: true
				}],
				note: 'Optional: Filter the primary collection',
			},
		},
		{
			field: 'secondaryMode',
			name: 'Secondary Value Mode',
			type: 'string',
			schema: {
				default_value: 'manual',
			},
			meta: {
				interface: 'select-dropdown',
				options: {
					choices: [
						{ text: 'Manual Value', value: 'manual' },
						{ text: 'Collection', value: 'collection' },
					],
				},
				width: 'half',
				conditions: [{
					rule: { meterMode: { _eq: 'standard' }},
					hidden: false
				}, {
					rule: { meterMode: { _neq: 'standard' }},
					hidden: true
				}],
			},
		},
		{
			field: 'manualValue',
			name: 'Manual Value',
			type: 'integer',
			schema: {
				default_value: 100,
			},
			meta: {
				interface: 'input',
				width: 'half',
				options: {
					min: 0,
				},
				conditions: [
					{
						rule: {
							_and: [
								{ meterMode: { _eq: 'standard' }},
								{ secondaryMode: { _eq: 'manual' }}
							]
						},
						hidden: false
					},
					{
						rule: {
							_or: [
								{ meterMode: { _neq: 'standard' }},
								{ secondaryMode: { _neq: 'manual' }}
							]
						},
						hidden: true
					}
				],
			},
		},
		{
			field: 'secondaryCollection',
			name: 'Secondary Collection',
			type: 'string',
			meta: {
				interface: 'system-collection',
				width: 'half',
				options: {
					includeSystem: false,
					includeSingleton: false,
				},
				conditions: [
					{
						rule: {
							_and: [
								{ meterMode: { _eq: 'standard' }},
								{ secondaryMode: { _eq: 'collection' }}
							]
						},
						hidden: false
					},
					{
						rule: {
							_or: [
								{ meterMode: { _neq: 'standard' }},
								{ secondaryMode: { _neq: 'collection' }}
							]
						},
						hidden: true
					}
				],
			},
		},
		{
			field: 'secondaryField',
			name: 'Secondary Field',
			type: 'string',
			meta: {
				interface: 'system-field',
				width: 'half',
				options: {
					collectionField: 'secondaryCollection',
					typeAllowList: ['integer', 'decimal', 'float', 'bigInteger', 'string', 'text', 'uuid', 'char'],
				},
				conditions: [
					{
						rule: {
							_and: [
								{ meterMode: { _eq: 'standard' }},
								{ secondaryMode: { _eq: 'collection' }}
							]
						},
						hidden: false
					},
					{
						rule: {
							_or: [
								{ meterMode: { _neq: 'standard' }},
								{ secondaryMode: { _neq: 'collection' }}
							]
						},
						hidden: true
					}
				],
			},
		},
		{
			field: 'secondaryAggregation',
			name: 'Secondary Aggregation',
			type: 'string',
			schema: {
				default_value: 'count',
			},
			meta: {
				interface: 'select-dropdown',
				width: 'half',
				options: {
					choices: [
						{ text: 'Count', value: 'count' },
						{ text: 'Average', value: 'avg' },
						{ text: 'Sum', value: 'sum' },
						{ text: 'Minimum', value: 'min' },
						{ text: 'Maximum', value: 'max' },
					],
				},
				conditions: [
					{
						rule: {
							_and: [
								{ meterMode: { _eq: 'standard' }},
								{ secondaryMode: { _eq: 'collection' }}
							]
						},
						hidden: false
					},
					{
						rule: {
							_or: [
								{ meterMode: { _neq: 'standard' }},
								{ secondaryMode: { _neq: 'collection' }}
							]
						},
						hidden: true
					}
				],
			},
		},
		{
			field: 'secondaryFilter',
			name: 'Secondary Filter',
			type: 'json',
			meta: {
				interface: 'system-filter',
				options: {
					collectionField: 'secondaryCollection',
				},
				width: 'full',
				conditions: [
					{
						rule: {
							_and: [
								{ meterMode: { _eq: 'standard' }},
								{ secondaryMode: { _eq: 'collection' }}
							]
						},
						hidden: false
					},
					{
						rule: {
							_or: [
								{ meterMode: { _neq: 'standard' }},
								{ secondaryMode: { _neq: 'collection' }}
							]
						},
						hidden: true
					}
				],
				note: 'Filter the secondary collection data',
			},
		},
		// Display options (shown for both modes)
		{
			field: 'displayMode',
			name: 'Display Mode',
			type: 'string',
			schema: {
				default_value: 'percentage',
			},
			meta: {
				interface: 'select-dropdown',
				width: 'half',
				options: {
					choices: [
						{ text: 'Percentage', value: 'percentage' },
						{ text: 'Numeric', value: 'numeric' },
					],
				},
				note: 'Choose how to display the values',
			},
		},
		{
			field: 'thresholds',
			name: 'Color Thresholds',
			type: 'json',
			schema: {
				default_value: [
					{ value: 0, color: '#ff4444' },
					{ value: 25, color: '#ffa500' },
					{ value: 50, color: '#ffeb3b' },
					{ value: 75, color: '#90ee90' },
					{ value: 90, color: '#32cd32' },
				],
			},
			meta: {
				interface: 'input-code',
				width: 'full',
				options: {
					language: 'json',
					template: JSON.stringify([
						{ value: 0, color: '#ff4444' },
						{ value: 25, color: '#ffa500' },
						{ value: 50, color: '#ffeb3b' },
						{ value: 75, color: '#90ee90' },
						{ value: 90, color: '#32cd32' },
					], null, 2),
				},
				note: 'Define color thresholds for the meter. Format: [{"value": number, "color": "hex"}]',
			},
		},
	],
	minWidth: 12,
	minHeight: 8,
});
