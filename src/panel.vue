<template>
  <div class="panel">
    <div class="gauge-container">
      <div class="gauge">
        <!-- Static background -->
        <div class="gauge-background">
          <div class="gradient-arc"></div>
        </div>
        <!-- Needle -->
        <div class="needle" :style="{ transform: `rotate(${needleRotation}deg)` }"></div>
        <!-- Values display -->
        <div class="values-display">
          <div class="main-value">{{ displayValue }}</div>
          <div class="sub-values">
            {{ formattedValue1 }} / {{ formattedValue2 }}
          </div>
        </div>
      </div>
    </div>
    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useApi } from '@directus/extensions-sdk';

const props = defineProps({
  meterMode: {
    type: String,
    default: 'standard'
  },
  // Retention mode props
  fromDate: {
    type: [String, Date],
    default: ''
  },
  toDate: {
    type: [String, Date],
    default: ''
  },
  startCollection: {
    type: String,
    default: ''
  },
  startField: {
    type: String,
    default: ''
  },
  startFilter: {
    type: Object,
    default: () => ({})
  },
  endCollection: {
    type: String,
    default: ''
  },
  endField: {
    type: String,
    default: ''
  },
  endFilter: {
    type: Object,
    default: () => ({})
  },
  cancelledCollection: {
    type: String,
    default: ''
  },
  cancelledField: {
    type: String,
    default: ''
  },
  cancelledFilter: {
    type: Object,
    default: () => ({})
  },
  // Standard mode props
  primaryCollection: {
    type: String,
    required: true,
  },
  primaryField: {
    type: String,
    required: true,
  },
  primaryAggregation: {
    type: String,
    default: 'sum',
  },
  primaryFilter: {
    type: Object,
    default: () => ({}),
  },
  secondaryMode: {
    type: String,
    default: 'manual',
  },
  manualValue: {
    type: Number,
    default: 100,
  },
  secondaryCollection: {
    type: String,
    default: '',
  },
  secondaryField: {
    type: String,
    default: '',
  },
  secondaryAggregation: {
    type: String,
    default: 'count',
  },
  secondaryFilter: {
    type: Object,
    default: () => ({}),
  },
  displayType: {
    type: String,
    default: 'percentage',
  },
});

const api = useApi();
const value1 = ref(0);
const value2 = ref(0);
const customersAtStart = ref(0);  // S
const customersAtEnd = ref(0);    // E
const cancelledCustomers = ref(0); // N
const error = ref(null);
const loading = ref(false);

// Calculate percentage based on mode
const percentage = computed(() => {
  if (props.meterMode === 'retention') {
    return retentionRate.value;
  } else {
    if (value2.value === 0) return 0;
    return Math.min(100, (value1.value / value2.value) * 100);
  }
});

const needleRotation = computed(() => {
  // Convert percentage to degrees (-90 to 90 range)
  // -90 is the starting position (pointing left)
  return -90 + (percentage.value * 180 / 100);
});

// Computed property for retention rate
const retentionRate = computed(() => {
  if (customersAtStart.value <= 0) {
    error.value = 'No customers found at start date';
    return 0;
  }
  
  // Retention Rate = ((E−N) / S)×100
  return ((customersAtEnd.value - cancelledCustomers.value) / customersAtStart.value) * 100;
});

// Format display values based on mode
const displayValue = computed(() => {
  if (props.meterMode === 'retention') {
    if (customersAtStart.value <= 0) {
      return 'No customers at start';
    }
    const retained = Math.max(0, customersAtEnd.value - cancelledCustomers.value);
    const percent = Math.round(retentionRate.value);
    return `${retained}/${customersAtStart.value} (${percent}%)`;
  } else {
    return props.displayType === 'percentage' ? `${Math.round(percentage.value)}%` : `${formatNumber(value1.value)} / ${formatNumber(value2.value)}`;
  }
});

const formattedValue1 = computed(() => {
  if (props.meterMode === 'retention') {
    return `${formatNumber(customersAtEnd.value - cancelledCustomers.value)} retained`;
  }
  return formatNumber(value1.value);
});

const formattedValue2 = computed(() => {
  if (props.meterMode === 'retention') {
    return `of ${formatNumber(customersAtStart.value)} initial`;
  }
  return formatNumber(value2.value);
});

const formatNumber = (value) => {
  return new Intl.NumberFormat().format(value);
};

// Helper function to format date for API
const formatDateForApi = (date) => {
  if (!date) return null;
  if (date instanceof Date) {
    return date.toISOString().split('T')[0];
  }
  if (typeof date === 'string') {
    // Handle Directus global variables
    if (date.startsWith('{{') && date.endsWith('}}')) {
      // Return as is - Directus will handle the variable substitution
      return date;
    }
    // Handle $NOW variables
    if (date.startsWith('$NOW')) {
      const now = new Date();
      if (date === '$NOW') {
        return now.toISOString().split('T')[0];
      }
      // Handle $NOW(-X MONTH)
      const match = date.match(/\$NOW\((-?\d+)\s+MONTH\)/);
      if (match) {
        const months = parseInt(match[1]);
        now.setMonth(now.getMonth() + months);
        return now.toISOString().split('T')[0];
      }
    }
    // Try to parse the date string
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate.toISOString().split('T')[0];
    }
  }
  return null;
};

// Computed properties for formatted dates
const formattedFromDate = computed(() => formatDateForApi(props.fromDate));
const formattedToDate = computed(() => formatDateForApi(props.toDate));

// Fetch functions
const fetchValue1 = async () => {
  loading.value = true;
  try {
    const params = {
      filter: props.primaryFilter,
      aggregate: {
        [props.primaryAggregation]: [props.primaryField]
      }
    };

    console.log('Primary request params:', params); // Debug log

    const response = await api.get(`/items/${props.primaryCollection}`, {
      params: params
    });

    console.log('Primary response:', response.data); // Debug log

    const rawValue = response.data.data[0]?.[props.primaryAggregation]?.[props.primaryField];
    const numValue = Number(rawValue);
    value1.value = isNaN(numValue) ? 0 : numValue;
    error.value = null;
  } catch (err) {
    console.error('Error fetching value 1:', err);
    error.value = 'Error fetching primary value';
    value1.value = 0;
  }
  loading.value = false;
};

const fetchValue2 = async () => {
  if (props.secondaryMode === 'manual') {
    value2.value = props.manualValue;
    return;
  }

  loading.value = true;
  try {
    const params = {
      filter: props.secondaryFilter,
      aggregate: {
        [props.secondaryAggregation]: [props.secondaryField]
      }
    };

    console.log('Secondary request params:', params); // Debug log

    const response = await api.get(`/items/${props.secondaryCollection}`, {
      params: params
    });

    console.log('Secondary response:', response.data); // Debug log

    const rawValue = response.data.data[0]?.[props.secondaryAggregation]?.[props.secondaryField];
    const numValue = Number(rawValue);
    value2.value = isNaN(numValue) ? props.manualValue : numValue;
    error.value = null;
  } catch (err) {
    console.error('Error fetching value 2:', err);
    error.value = 'Error fetching secondary value';
    value2.value = props.manualValue;
  }
  loading.value = false;
};

// Fetch retention data
const fetchRetentionData = async () => {
  // Reset error state
  error.value = null;
  
  // Validate required fields
  if (!props.startCollection || !props.startField) {
    error.value = 'Please configure Start Collection and Field';
    return;
  }
  if (!props.endCollection || !props.endField) {
    error.value = 'Please configure End Collection and Field';
    return;
  }
  if (!props.cancelledCollection || !props.cancelledField) {
    error.value = 'Please configure Cancelled Collection and Field';
    return;
  }

  const fromDate = formattedFromDate.value;
  const toDate = formattedToDate.value;
  
  if (!fromDate || !toDate) {
    error.value = 'Please select both From Date and To Date';
    return;
  }

  loading.value = true;
  try {
    // 1. Fetch Customers at Start (S)
    const startResponse = await api.get(`/items/${props.startCollection}`, {
      params: {
        filter: props.startFilter || {},
        aggregate: {
          count: [props.startField],
        },
      },
    }).catch(err => {
      console.error('Error fetching start customers:', err.response?.data || err);
      throw new Error(`Failed to fetch customers at start: ${err.message}`);
    });

    // 2. Fetch Customers at End (E)
    const endResponse = await api.get(`/items/${props.endCollection}`, {
      params: {
        filter: props.endFilter || {},
        aggregate: {
          count: [props.endField],
        },
      },
    }).catch(err => {
      console.error('Error fetching end customers:', err.response?.data || err);
      throw new Error(`Failed to fetch customers at end: ${err.message}`);
    });

    // 3. Fetch Cancelled Customers (N)
    const cancelledResponse = await api.get(`/items/${props.cancelledCollection}`, {
      params: {
        filter: props.cancelledFilter || {},
        aggregate: {
          count: [props.cancelledField],
        },
      },
    }).catch(err => {
      console.error('Error fetching cancelled customers:', err.response?.data || err);
      throw new Error(`Failed to fetch cancelled customers: ${err.message}`);
    });

    // Extract counts from responses
    const startCount = Number(startResponse.data.data[0]?.count?.[props.startField]) || 0;
    const endCount = Number(endResponse.data.data[0]?.count?.[props.endField]) || 0;
    const cancelledCount = Number(cancelledResponse.data.data[0]?.count?.[props.cancelledField]) || 0;

    // Log raw values for debugging
    console.log('Raw counts:', {
      startCount,
      endCount,
      cancelledCount,
      startField: props.startField,
      endField: props.endField,
      cancelledField: props.cancelledField,
      dateRange: {
        from: fromDate,
        to: toDate
      }
    });

    if (startCount <= 0) {
      error.value = 'No customers found at start date. Please check your filters.';
      customersAtStart.value = 0;
      customersAtEnd.value = 0;
      cancelledCustomers.value = 0;
      return;
    }

    // Update the values
    customersAtStart.value = startCount;
    customersAtEnd.value = endCount;
    cancelledCustomers.value = cancelledCount;

    // Log the final values for debugging
    console.log('Final Values:', {
      customersAtStart: customersAtStart.value,
      customersAtEnd: customersAtEnd.value,
      cancelledCustomers: cancelledCustomers.value,
      retentionRate: retentionRate.value
    });

  } catch (err) {
    console.error('Error in retention calculation:', err);
    error.value = err.message || 'Error fetching retention data';
    customersAtStart.value = 0;
    customersAtEnd.value = 0;
    cancelledCustomers.value = 0;
  }
  loading.value = false;
};

// Initialize data on component mount
onMounted(() => {
  if (props.meterMode === 'standard') {
    fetchValue1();
    if (props.secondaryMode === 'collection') {
      fetchValue2();
    } else {
      value2.value = props.manualValue;
    }
  } else {
    fetchRetentionData();
  }
});

// Watch for changes that affect the primary value
watch([
  () => props.primaryCollection,
  () => props.primaryField,
  () => props.primaryFilter,
  () => props.primaryAggregation
], () => {
  if (props.meterMode === 'standard') {
    fetchValue1();
  }
}, { deep: true });

// Watch for changes that affect the secondary value
watch([
  () => props.secondaryMode,
  () => props.secondaryCollection,
  () => props.secondaryField,
  () => props.secondaryFilter,
  () => props.secondaryAggregation,
  () => props.manualValue
], () => {
  if (props.meterMode === 'standard') {
    if (props.secondaryMode === 'collection') {
      fetchValue2();
    } else {
      value2.value = props.manualValue;
    }
  }
}, { deep: true });

// Watch for mode changes
watch(() => props.meterMode, (newMode) => {
  if (newMode === 'standard') {
    fetchValue1();
    if (props.secondaryMode === 'collection') {
      fetchValue2();
    } else {
      value2.value = props.manualValue;
    }
  } else {
    fetchRetentionData();
  }
});

// Watch for retention mode specific changes
watch([
  () => props.fromDate,
  () => props.toDate,
  () => props.startCollection,
  () => props.startField,
  () => props.startFilter,
  () => props.endCollection,
  () => props.endField,
  () => props.endFilter,
  () => props.cancelledCollection,
  () => props.cancelledField,
  () => props.cancelledFilter,
], () => {
  if (props.meterMode === 'retention') {
    fetchRetentionData();
  }
}, { deep: true });
</script>

<style scoped>
.panel {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.gauge-container {
  position: relative;
  width: 300px;
  height: 170px;
  margin: 0 auto;
}

.gauge {
  position: relative;
  width: 100%;
  height: 100%;
}

.gauge-background {
  position: absolute;
  width: 100%;
  height: 150px;
  border-radius: 150px 150px 0 0;
  background: white;
  overflow: hidden;
}

.gradient-arc {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 150px 150px 0 0;
  background: conic-gradient(
    from 180deg at 50% 100%,
    #f44336 0%,    /* Red */
    #FF9800 20%,   /* Orange */
    #FFEB3B 40%,   /* Yellow */
    #CDDC39 60%,   /* Lime */
    #8BC34A 80%,   /* Light Green */
    #4CAF50 100%   /* Green */
  );
}

.gauge-background::before {
  content: '';
  position: absolute;
  width: calc(100% - 20px);
  height: calc(100% - 10px);
  top: 5px;
  left: 10px;
  border-radius: 140px 140px 0 0;
  background: white;
  z-index: 1;
}

.needle {
  position: absolute;
  bottom: 20px;
  left: 50%;
  width: 4px;
  height: 130px;
  background: #2c3e50;
  transform-origin: bottom center;
  transition: transform 0.5s ease-out;
  z-index: 2;
}

.needle::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 20px;
  background: #2c3e50;
  border-radius: 50%;
  border: 4px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.values-display {
  position: absolute;
  width: 100%;
  bottom: -40px;
  left: 0;
  text-align: center;
}

.main-value {
  font-size: 24px;
  font-weight: bold;
  color: var(--foreground-normal);
  margin-bottom: 4px;
}

.sub-values {
  font-size: 14px;
  color: var(--foreground-subdued);
}

.error-message {
  color: var(--danger);
  margin-top: 16px;
  text-align: center;
}
</style>