<template>
  <BaseTemplate :data="data">
    <div id="pdf-content" class="bg-white p-12 max-w-4xl mx-auto" style="width: 794px; min-height: 1123px; box-sizing: border-box;">
      <!-- Header Section -->
      <div class="flex justify-between items-start mb-10 pb-6 border-b-2 border-cyan-700">
        <div>
          <h1 class="text-2xl font-bold text-cyan-700 mb-1">
            {{ yourCompany.name || 'Your Company Name' }}
          </h1>
          <p class="text-gray-600 text-sm">{{ yourCompany.address || '123 Business St, City' }}</p>
          <p class="text-gray-600 text-sm">{{ yourCompany.phone || '+1 (123) 456-7890' }}</p>
        </div>
        <div class="text-right">
          <h2 class="text-2xl font-bold text-cyan-700 mb-2">TAX INVOICE</h2>
          <div class="space-y-1">
            <p class="text-gray-700"><span class="font-medium">#{{ invoice.number || '0001' }}</span></p>
            <p class="text-gray-600 text-sm">Date: {{ formatDate(invoice.date) || '2023-01-01' }}</p>
            <p class="text-gray-600 text-sm">Due: {{ formatDate(invoice.paymentDate) || '2023-01-15' }}</p>
          </div>
        </div>
      </div>

      <!-- Billing & Shipping Info -->
      <div class="grid grid-cols-2 gap-8 mb-10">
        <div>
          <h3 class="text-base font-semibold text-cyan-700 mb-3 pb-1 border-b border-cyan-100">Bill To:</h3>
          <p class="font-medium text-gray-800">{{ billTo.name || 'Client Name' }}</p>
          <p class="text-gray-600 text-sm">{{ billTo.address || '123 Client St, City' }}</p>
          <p class="text-gray-600 text-sm">{{ billTo.phone || '+1 (123) 456-7890' }}</p>
          <p class="text-gray-600 text-sm">{{ billTo.email || 'client@example.com' }}</p>
        </div>
        <div>
          <h3 class="text-base font-semibold text-cyan-700 mb-3 pb-1 border-b border-cyan-100">Ship To:</h3>
          <p class="font-medium text-gray-800">{{ shipTo.name || 'Client Name' }}</p>
          <p class="text-gray-600 text-sm">{{ shipTo.address || '123 Shipping St, City' }}</p>
          <p class="text-gray-600 text-sm">{{ shipTo.phone || '+1 (123) 456-7890' }}</p>
        </div>
      </div>

      <!-- Items Table -->
      <div class="mb-10">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="bg-cyan-700 text-white">
                <th class="p-3 text-left font-medium text-sm">DESCRIPTION</th>
                <th class="p-3 text-right font-medium text-sm w-20">QTY</th>
                <th class="p-3 text-right font-medium text-sm w-32">RATE</th>
                <th class="p-3 text-right font-medium text-sm w-32">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items" :key="index" class="border-b border-gray-100 hover:bg-cyan-50">
                <td class="p-4">
                  <div class="font-medium text-gray-800">{{ item.name || 'Service' }}</div>
                  <div v-if="item.description" class="text-sm text-gray-500 mt-1">{{ item.description }}</div>
                </td>
                <td class="p-4 text-right text-gray-700">{{ item.quantity || 1 }}</td>
                <td class="p-4 text-right text-gray-700">{{ formatCurrency(item.price || 0, selectedCurrency) }}</td>
                <td class="p-4 text-right font-medium text-gray-800">{{ formatCurrency((item.quantity || 0) * (item.price || 0), selectedCurrency) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Totals -->
      <div class="flex justify-end mb-10">
        <div class="w-80">
          <div class="flex justify-between py-2">
            <span class="text-gray-600">Subtotal:</span>
            <span class="text-gray-800">{{ formatCurrency(subTotal || 0, selectedCurrency) }}</span>
          </div>
          <div v-if="taxPercentage > 0" class="flex justify-between py-2">
            <span class="text-gray-600">Tax ({{ taxPercentage }}%):</span>
            <span class="text-gray-800">{{ formatCurrency(taxAmount || 0, selectedCurrency) }}</span>
          </div>
          <div class="flex justify-between py-3 mt-2 border-t-2 border-b-2 border-cyan-700 font-bold">
            <span class="text-lg text-cyan-700">Total Due:</span>
            <span class="text-lg text-cyan-700">{{ formatCurrency(grandTotal || 0, selectedCurrency) }}</span>
          </div>
        </div>
      </div>

      <!-- Notes -->
      <div v-if="notes" class="mt-10 pt-6 border-t border-gray-200">
        <h3 class="text-base font-semibold text-cyan-700 mb-3">Notes</h3>
        <p class="text-gray-600 whitespace-pre-line text-sm">{{ notes }}</p>
      </div>
      
      <!-- Footer -->
      <div class="mt-16 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
        <p>Thank you for your business!</p>
        <p class="mt-1">{{ yourCompany.name || 'Your Company' }} | {{ yourCompany.phone || '' }} | {{ yourCompany.email || '' }}</p>
      </div>
    </div>
  </BaseTemplate>
</template>

<script>
import BaseTemplate from './BaseTemplate.vue';
import { formatCurrency } from '../utils/formatCurrency';

export default {
  name: 'Template2',
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
      const d = new Date(date);
      if (isNaN(d.getTime())) return date;
      return d.toISOString().split('T')[0];
    }
  }
};
</script>
