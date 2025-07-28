<template>
  <BaseTemplate :data="data">
    <div id="pdf-content" style="background: white; width: 794px; min-height: 1123px; padding: 20px 30px; margin: 0 auto; box-sizing: border-box; position: relative; overflow: hidden;">
      <!-- Header Section -->
      <div class="flex justify-between items-start mb-12">
        <div class="w-1/2">
          <h1 class="text-2xl font-bold text-gray-800 mb-2">{{ yourCompany.name }}</h1>
          <p class="text-gray-600 text-sm">{{ yourCompany.address }}</p>
          <p class="text-gray-600 text-sm">{{ yourCompany.phone }}</p>
          <p class="text-gray-600 text-sm">{{ yourCompany.email }}</p>
        </div>
        <div class="text-right">
          <h2 class="text-3xl font-bold text-gray-800 mb-2">INVOICE</h2>
          <div class="space-y-1">
            <p class="text-gray-700"><span class="font-medium">#{{ invoice.number || '0001' }}</span></p>
            <p class="text-gray-600 text-sm">Date: {{ formatDate(invoice.date) || '2023-01-01' }}</p>
            <p class="text-gray-600 text-sm">Due: {{ formatDate(invoice.paymentDate) || '2023-01-15' }}</p>
          </div>
        </div>
      </div>

      <!-- Billing & Shipping Info -->
      <div class="flex justify-between mb-12">
        <div class="w-1/2 pr-6">
          <h3 class="text-base font-semibold text-gray-700 mb-3 pb-1 border-b border-gray-200">Bill To:</h3>
          <p class="font-medium text-gray-800">{{ billTo.name || 'Client Name' }}</p>
          <p class="text-gray-600 text-sm">{{ billTo.address || '123 Client St, City' }}</p>
          <p v-if="billTo.phone" class="text-gray-600 text-sm">{{ billTo.phone }}</p>
          <p v-if="billTo.email" class="text-gray-600 text-sm">{{ billTo.email }}</p>
        </div>
        <div class="w-1/2 pl-6">
          <h3 class="text-base font-semibold text-gray-700 mb-3 pb-1 border-b border-gray-200">Ship To:</h3>
          <p class="font-medium text-gray-800">{{ shipTo.name || billTo.name || 'Client Name' }}</p>
          <p class="text-gray-600 text-sm">{{ shipTo.address || billTo.address || '123 Shipping St, City' }}</p>
          <p v-if="shipTo.phone || billTo.phone" class="text-gray-600 text-sm">{{ shipTo.phone || billTo.phone }}</p>
        </div>
      </div>

      <!-- Items Table -->
      <div class="mb-10">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-800 text-white">
              <th class="p-3 text-left font-medium text-sm">ITEM</th>
              <th class="p-3 text-right font-medium text-sm w-24">QTY</th>
              <th class="p-3 text-right font-medium text-sm w-32">PRICE</th>
              <th class="p-3 text-right font-medium text-sm w-32">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="index" :class="{ 'bg-gray-50': index % 2 === 1 }">
              <td class="p-4 border-b border-gray-200">
                <div class="font-medium text-gray-800">{{ item.name || 'Service' }}</div>
                <div v-if="item.description" class="text-sm text-gray-500 mt-1">{{ item.description }}</div>
              </td>
              <td class="p-4 text-right border-b border-gray-200 text-gray-700">{{ item.quantity || 1 }}</td>
              <td class="p-4 text-right border-b border-gray-200 text-gray-700">{{ formatCurrency(item.price || 0, selectedCurrency) }}</td>
              <td class="p-4 text-right border-b border-gray-200 font-medium text-gray-800">{{ formatCurrency((item.quantity || 0) * (item.price || 0), selectedCurrency) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Totals -->
      <div class="flex justify-end">
        <div class="w-80" style="margin-bottom: 0;">
          <div class="flex justify-between py-1">
            <span class="text-gray-600">Subtotal:</span>
            <span class="text-gray-800">{{ formatCurrency(subTotal || 0, selectedCurrency) }}</span>
          </div>
          <div v-if="taxPercentage > 0" class="flex justify-between py-1">
            <span class="text-gray-600">Tax ({{ taxPercentage }}%):</span>
            <span class="text-gray-800">{{ formatCurrency(taxAmount || 0, selectedCurrency) }}</span>
          </div>
          <div class="flex justify-between py-2 border-t-2 border-b-2 border-gray-800 font-bold text-lg" style="margin-bottom: 0;">
            <span class="text-gray-800">Total Due:</span>
            <span class="text-gray-900">{{ formatCurrency(grandTotal || 0, selectedCurrency) }}</span>
          </div>
        </div>
      </div>

      <!-- Notes and Footer Container -->
      <div class="mt-8" style="page-break-inside: avoid;">
        <!-- Notes -->
        <div v-if="notes" class="mb-4">
          <h3 class="text-base font-semibold text-gray-700 mb-1">Notes</h3>
          <p class="text-gray-600 whitespace-pre-line text-sm">{{ notes }}</p>
        </div>
        
        <!-- Footer -->
        <div class="mt-12 pt-4 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p class="font-medium">Thank you for your business!</p>
          <p class="mt-1">{{ yourCompany.name }} | {{ yourCompany.phone || '' }} | {{ yourCompany.email || '' }}</p>
        </div>
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
    formatCurrency,
    formatDate(date) {
      if (!date) return '';
      // If it's a Date object or can be converted to one
      const d = new Date(date);
      // Check if date is valid
      if (isNaN(d.getTime())) return date; // Return as is if invalid date
      // Format as YYYY-MM-DD
      return d.toISOString().split('T')[0];
    }
  }
};
</script>
