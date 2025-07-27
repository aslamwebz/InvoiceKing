<template>
  <BaseTemplate :data="data">
    <div class="bg-white p-8 max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <div class="text-right">
          <h2 class="text-3xl font-semibold">INVOICE</h2>
        </div>
      </div>

      <div class="flex justify-between mb-12">
        <div>
          <h1 class="text-2xl font-bold">{{ yourCompany.name }}</h1>
          <p>{{ yourCompany.address }}</p>
          <p>{{ yourCompany.phone }}</p>
          <p>{{ yourCompany.email }}</p>
        </div>
        <div class="text-right">
          <h2 class="text-xl font-semibold">INVOICE</h2>
          <p>#{{ invoice.number }}</p>
          <p>Date: {{ invoice.date }}</p>
          <p>Due Date: {{ invoice.paymentDate }}</p>
        </div>
      </div>

      <div class="flex justify-between mb-8">
        <div class="w-1/2">
          <h3 class="text-lg font-semibold mb-2">Bill To:</h3>
          <p>{{ billTo.name }}</p>
          <p>{{ billTo.address }}</p>
          <p>{{ billTo.phone }}</p>
          <p>{{ billTo.email }}</p>
        </div>
        <div class="w-1/2">
          <h3 class="text-lg font-semibold mb-2">Ship To:</h3>
          <p>{{ shipTo.name }}</p>
          <p>{{ shipTo.address }}</p>
          <p>{{ shipTo.phone }}</p>
        </div>
      </div>

      <div class="mb-8">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-100">
              <th class="p-3 text-left">Item</th>
              <th class="p-3 text-right">Quantity</th>
              <th class="p-3 text-right">Price</th>
              <th class="p-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="index" :class="{ 'bg-gray-50': index % 2 === 1 }">
              <td class="p-3 border-t">
                <div class="font-medium">{{ item.name }}</div>
                <div class="text-sm text-gray-600">{{ item.description }}</div>
              </td>
              <td class="p-3 text-right border-t">{{ item.quantity }}</td>
              <td class="p-3 text-right border-t">{{ formatCurrency(item.price, selectedCurrency) }}</td>
              <td class="p-3 text-right border-t">{{ formatCurrency(item.total, selectedCurrency) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex justify-end mb-8">
        <div class="w-64">
          <div class="flex justify-between mb-2">
            <span>Subtotal:</span>
            <span>{{ formatCurrency(subTotal, selectedCurrency) }}</span>
          </div>
          <div v-if="taxPercentage > 0" class="flex justify-between mb-2">
            <span>Tax ({{ taxPercentage }}%):</span>
            <span>{{ formatCurrency(taxAmount, selectedCurrency) }}</span>
          </div>
          <div class="flex justify-between font-bold text-lg border-t pt-2 mt-2">
            <span>Total:</span>
            <span>{{ formatCurrency(grandTotal, selectedCurrency) }}</span>
          </div>
        </div>
      </div>

      <div v-if="notes" class="mt-12 pt-4 border-t">
        <h3 class="text-lg font-semibold mb-2">Notes</h3>
        <p class="whitespace-pre-line">{{ notes }}</p>
      </div>
    </div>
  </BaseTemplate>
</template>

<script>
import BaseTemplate from './BaseTemplate.vue';
import { formatCurrency } from '../utils/formatCurrency';

export default {
  name: 'Template1',
  components: {
    BaseTemplate
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  computed: {
    billTo() { return this.data.billTo || {}; },
    shipTo() { return this.data.shipTo || {}; },
    invoice() { return this.data.invoice || {}; },
    yourCompany() { return this.data.yourCompany || {}; },
    items() { return this.data.items || []; },
    taxPercentage() { return this.data.taxPercentage || 0; },
    taxAmount() { return this.data.taxAmount || 0; },
    subTotal() { return this.data.subTotal || 0; },
    grandTotal() { return this.data.grandTotal || 0; },
    notes() { return this.data.notes || ''; },
    selectedCurrency() { return this.data.selectedCurrency || 'USD'; }
  },
  methods: {
    formatCurrency
  }
};
</script>
