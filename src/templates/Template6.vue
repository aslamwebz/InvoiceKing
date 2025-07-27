<template>
  <BaseTemplate :data="data">
    <div class="bg-white p-8 max-w-4xl mx-auto">
      <div class="flex justify-between items-start mb-8">
        <div>
          <h2 class="text-2xl font-bold" style="color: #14A8DE">
            {{ yourCompany.name || "Company Name" }}
          </h2>
          <p>{{ yourCompany.address || "Company Address" }}</p>
          <p>{{ yourCompany.phone || "Company Phone" }}</p>
        </div>
        <div class="text-right">
          <h1 class="text-3xl font-bold mb-2" style="color: #14A8DE">INVOICE</h1>
          <p class="text-gray-600">#{{ invoice.number || 'INV-0001' }}</p>
          <p class="text-gray-600">Date: {{ formatDate(invoice.date) }}</p>
          <p class="text-gray-600">Due: {{ formatDate(invoice.paymentDate) }}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-8 mb-8">
        <div>
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-2" style="color: #14A8DE">Bill To:</h3>
            <p class="font-medium">{{ billTo.name }}</p>
            <p class="text-gray-700">{{ billTo.address }}</p>
            <p class="text-gray-700">{{ billTo.phone }}</p>
            <p class="text-gray-700">{{ billTo.email }}</p>
          </div>
        </div>
        <div>
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-2" style="color: #14A8DE">Ship To:</h3>
            <p class="font-medium">{{ shipTo.name || 'Same as billing' }}</p>
            <p class="text-gray-700">{{ shipTo.address || '' }}</p>
            <p class="text-gray-700">{{ shipTo.phone || '' }}</p>
          </div>
        </div>
      </div>

      <div class="mb-8">
        <table class="min-w-full border-collapse">
          <thead>
            <tr style="background-color: #14A8DE" class="text-white">
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
              class="border-b hover:bg-blue-50"
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
          <div class="flex justify-between py-3 mt-2 border-t-2 border-b-2" style="border-color: #14A8DE">
            <span class="text-lg font-bold">Total:</span>
            <span class="text-lg font-bold" style="color: #14A8DE">{{ formatCurrency(grandTotal, selectedCurrency) }}</span>
          </div>
        </div>
      </div>

      <div v-if="notes" class="mt-8 pt-4 border-t">
        <h3 class="text-lg font-semibold mb-2" style="color: #14A8DE">Notes</h3>
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
  name: 'Template6',
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
