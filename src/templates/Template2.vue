<template>
  <BaseTemplate :data="data">
    <div class="bg-white p-8 max-w-4xl mx-auto">
      <div class="flex justify-between mb-4 border-b-2 pb-4">
        <div>
          <h1 class="text-2xl font-bold text-cyan-700">
            {{ yourCompany.name }}
          </h1>
          <p>{{ yourCompany.address }}</p>
          <p>{{ yourCompany.phone }}</p>
        </div>
        <div class="text-right">
          <h2 class="text-xl font-semibold text-cyan-700">Tax invoice</h2>
          <p class="text-sm text-gray-500">#{{ invoice.number }}</p>
          <p class="text-sm text-gray-500">Date: {{ invoice.date }}</p>
          <p class="text-sm text-gray-500">Due: {{ invoice.paymentDate }}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 class="text-lg font-semibold text-cyan-700 mb-2">Bill To:</h3>
          <p class="font-medium">{{ billTo.name }}</p>
          <p class="text-gray-700">{{ billTo.address }}</p>
          <p class="text-gray-700">{{ billTo.phone }}</p>
          <p class="text-gray-700">{{ billTo.email }}</p>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-cyan-700 mb-2">Ship To:</h3>
          <p class="font-medium">{{ shipTo.name }}</p>
          <p class="text-gray-700">{{ shipTo.address }}</p>
          <p class="text-gray-700">{{ shipTo.phone }}</p>
        </div>
      </div>

      <div class="mb-8">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="bg-cyan-700 text-white">
                <th class="p-3 text-left">Description</th>
                <th class="p-3 text-right">Qty</th>
                <th class="p-3 text-right">Rate</th>
                <th class="p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items" :key="index" class="border-b">
                <td class="p-3">
                  <div class="font-medium">{{ item.name }}</div>
                  <div class="text-sm text-gray-600">{{ item.description }}</div>
                </td>
                <td class="p-3 text-right">{{ item.quantity }}</td>
                <td class="p-3 text-right">{{ formatCurrency(item.price, selectedCurrency) }}</td>
                <td class="p-3 text-right">{{ formatCurrency(item.total, selectedCurrency) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="flex justify-end">
        <div class="w-80">
          <div class="flex justify-between py-2">
            <span class="font-medium">Subtotal:</span>
            <span>{{ formatCurrency(subTotal, selectedCurrency) }}</span>
          </div>
          <div v-if="taxPercentage > 0" class="flex justify-between py-2">
            <span class="font-medium">Tax ({{ taxPercentage }}%):</span>
            <span>{{ formatCurrency(taxAmount, selectedCurrency) }}</span>
          </div>
          <div class="flex justify-between py-3 mt-2 border-t-2 border-b-2 border-cyan-700 font-bold">
            <span class="text-lg">Total Due:</span>
            <span class="text-lg">{{ formatCurrency(grandTotal, selectedCurrency) }}</span>
          </div>
        </div>
      </div>

      <div v-if="notes" class="mt-8 pt-4 border-t">
        <h3 class="text-lg font-semibold text-cyan-700 mb-2">Notes</h3>
        <p class="text-gray-700 whitespace-pre-line">{{ notes }}</p>
      </div>

      <div class="mt-12 pt-4 border-t text-center text-sm text-gray-500">
        <p>Thank you for your business!</p>
        <p class="mt-1">{{ yourCompany.name }} | {yourCompany.phone} | {yourCompany.email}</p>
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
    formatCurrency
  }
};
</script>
