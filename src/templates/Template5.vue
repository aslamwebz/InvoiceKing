<template>
  <BaseTemplate :data="data">
    <div class="bg-white max-w-4xl mx-auto flex flex-col h-full overflow-hidden">
      <div class="p-8">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-4xl font-bold text-green-600">Invoice</h1>
          </div>
          <div class="text-right">
            <h2 class="text-xl font-bold">
              {{ yourCompany.name || "Company Name" }}
            </h2>
            <p class="text-gray-600">{{ yourCompany.address }}</p>
            <p class="text-gray-600">{{ yourCompany.phone }}</p>
            <p class="text-gray-600">{{ yourCompany.email }}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-8 my-8">
          <div>
            <div class="bg-green-50 p-4 rounded-lg border border-green-100">
              <h3 class="text-lg font-semibold text-green-700 mb-2">Bill To:</h3>
              <p class="font-medium">{{ billTo.name }}</p>
              <p class="text-gray-700">{{ billTo.address }}</p>
              <p class="text-gray-700">{{ billTo.phone }}</p>
              <p class="text-gray-700">{{ billTo.email }}</p>
            </div>
          </div>
          <div class="text-right">
            <div class="bg-green-50 p-4 rounded-lg border border-green-100 inline-block float-right">
              <p class="text-gray-700"><span class="font-semibold">Invoice #:</span> {{ invoice.number || 'N/A' }}</p>
              <p class="text-gray-700"><span class="font-semibold">Date:</span> {{ formatDate(invoice.date) }}</p>
              <p class="text-gray-700"><span class="font-semibold">Due Date:</span> {{ formatDate(invoice.paymentDate) }}</p>
              <p class="text-gray-700"><span class="font-semibold">Status:</span> <span class="text-green-600 font-medium">Unpaid</span></p>
            </div>
          </div>
        </div>

        <div class="mb-8">
          <table class="min-w-full border-collapse">
            <thead>
              <tr class="bg-green-600 text-white">
                <th class="p-3 text-left">Item</th>
                <th class="p-3 text-center">Quantity</th>
                <th class="p-3 text-right">Rate</th>
                <th class="p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(item, index) in items" 
                :key="index"
                class="border-b hover:bg-green-50"
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
            <div class="flex justify-between py-3 mt-2 border-t-2 border-green-600 font-bold">
              <span class="text-lg">Total:</span>
              <span class="text-lg">{{ formatCurrency(grandTotal, selectedCurrency) }}</span>
            </div>
          </div>
        </div>

        <div v-if="shipTo.name" class="mt-8 pt-4 border-t">
          <h3 class="text-lg font-semibold text-green-700 mb-2">Shipping Information</h3>
          <p class="font-medium">{{ shipTo.name }}</p>
          <p class="text-gray-700">{{ shipTo.address }}</p>
          <p class="text-gray-700">{{ shipTo.phone }}</p>
        </div>

        <div v-if="notes" class="mt-8 pt-4 border-t">
          <h3 class="text-lg font-semibold text-green-700 mb-2">Notes</h3>
          <p class="text-gray-700 whitespace-pre-line">{{ notes }}</p>
        </div>
      </div>

      <div class="mt-auto bg-green-800 text-white p-4 text-center text-sm">
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
  name: 'Template5',
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
