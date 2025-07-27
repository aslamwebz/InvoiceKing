<template>
  <BaseTemplate :data="data">
    <div class="bg-white p-8 max-w-4xl mx-auto">
      <div class="flex justify-between items-start mb-8">
        <div>
          <h1 class="text-3xl font-bold text-orange-600 mb-2">Invoice</h1>
          <h2 class="text-xl font-bold">
            {{ yourCompany.name || "Your Company Name" }}
          </h2>
          <p>{{ yourCompany.address || "Company Address" }}</p>
          <p>{{ yourCompany.phone || "Company Phone" }}</p>
        </div>
        <div class="text-right">
          <div class="bg-orange-100 p-4 rounded-lg inline-block">
            <p class="font-semibold">Invoice #{{ invoice.number || 'INV-0000' }}</p>
            <p>Date: {{ formatDate(invoice.date) }}</p>
            <p>Due Date: {{ formatDate(invoice.paymentDate) }}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 class="text-lg font-semibold mb-2 text-orange-600">Bill To:</h3>
          <p class="font-medium">{{ billTo.name }}</p>
          <p class="text-gray-700">{{ billTo.address }}</p>
          <p class="text-gray-700">{{ billTo.phone }}</p>
          <p class="text-gray-700">{{ billTo.email }}</p>
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-2 text-orange-600">Ship To:</h3>
          <p class="font-medium">{{ shipTo.name || 'Same as billing' }}</p>
          <p class="text-gray-700">{{ shipTo.address || '' }}</p>
          <p class="text-gray-700">{{ shipTo.phone || '' }}</p>
        </div>
      </div>

      <div class="mb-8">
        <table class="min-w-full border-collapse">
          <thead>
            <tr class="bg-orange-600 text-white">
              <th class="p-3 text-left">Item</th>
              <th class="p-3 text-center">Qty</th>
              <th class="p-3 text-right">Rate</th>
              <th class="p-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(item, index) in items" 
              :key="index"
              class="border-b hover:bg-orange-50"
            >
              <td class="p-3">
                <div class="font-medium">{{ item.name }}</div>
                <div class="text-sm text-gray-600">{{ item.description }}</div>
              </td>
              <td class="p-3 text-center">{{ item.quantity }}</td>
              <td class="p-3 text-right">{{ formatCurrency(item.price, selectedCurrency) }}</td>
              <td class="p-3 text-right font-medium">{{ formatCurrency(item.total, selectedCurrency) }}</td>
            </tr>
          </tbody>
        </table>
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
          <div class="flex justify-between py-3 mt-2 border-t-2 border-b-2 border-orange-600 font-bold">
            <span class="text-lg">Total:</span>
            <span class="text-lg">{{ formatCurrency(grandTotal, selectedCurrency) }}</span>
          </div>
        </div>
      </div>

      <div v-if="notes" class="mt-8 pt-4 border-t">
        <h3 class="text-lg font-semibold text-orange-600 mb-2">Notes</h3>
        <p class="text-gray-700 whitespace-pre-line">{{ notes }}</p>
      </div>

      <div class="mt-12 pt-4 border-t text-center text-sm text-gray-500">
        <p>Thank you for your business!</p>
        <p class="mt-1">
          {{ yourCompany.name }} | {{ yourCompany.phone }} | {{ yourCompany.email }}
        </p>
      </div>
    </div>
  </BaseTemplate>
</template>

<script>
import BaseTemplate from './BaseTemplate.vue';
import { formatCurrency } from '../utils/formatCurrency';
import { format } from 'date-fns';

export default {
  name: 'Template9',
  components: {
    BaseTemplate
  },
  props: {
    data: {
      type: Object,
      required: true,
      default: () => ({
        billTo: {},
        shipTo: {},
        invoice: {},
        yourCompany: {},
        items: [],
        taxPercentage: 0,
        taxAmount: 0,
        subTotal: 0,
        grandTotal: 0,
        notes: '',
        selectedCurrency: 'USD'
      })
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
      if (!date) return 'N/A';
      try {
        return format(new Date(date), 'MMM dd, yyyy');
      } catch (e) {
        return date;
      }
    }
  }
};
</script>
