<template>
  <BaseTemplate :data="data">
    <div class="bg-gray-100 w-full h-full flex flex-col" style="margin: 0; padding: 16px">
      <div class="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 class="text-lg font-semibold mb-2">Billed to</h3>
          <p class="font-bold">{{ billTo.name }}</p>
          <p>{{ billTo.address }}</p>
          <p>{{ billTo.phone }}</p>
        </div>
        <div class="text-right">
          <h3 class="text-lg font-semibold mb-2">Shipped to</h3>
          <p class="font-bold">{{ shipTo.name }}</p>
          <p>{{ shipTo.address }}</p>
          <p>{{ shipTo.phone }}</p>
        </div>
      </div>

      <div class="mb-8">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h1 class="text-2xl font-bold">INVOICE</h1>
            <p class="text-gray-600">#{{ invoice.number }}</p>
          </div>
          <div class="text-right">
            <p><span class="font-semibold">Date:</span> {{ formatDate(invoice.date) }}</p>
            <p><span class="font-semibold">Due Date:</span> {{ formatDate(invoice.paymentDate) }}</p>
          </div>
        </div>
      </div>

      <div class="mb-8">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-200">
              <th class="p-3 text-left">Item</th>
              <th class="p-3 text-right">Qty</th>
              <th class="p-3 text-right">Price</th>
              <th class="p-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(item, index) in items" 
              :key="index"
              class="border-b hover:bg-gray-50"
            >
              <td class="p-3">
                <div class="font-medium">{{ item.name }}</div>
                <div class="text-sm text-gray-600">{{ item.description }}</div>
              </td>
              <td class="p-3 text-right">{{ item.quantity }}</td>
              <td class="p-3 text-right">{{ formatCurrency(item.price, selectedCurrency) }}</td>
              <td class="p-3 text-right font-medium">
                {{ formatCurrency(item.total, selectedCurrency) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-auto">
        <div class="flex justify-end mb-4">
          <div class="w-64">
            <div class="flex justify-between py-2 border-b">
              <span>Subtotal:</span>
              <span>{{ formatCurrency(subTotal, selectedCurrency) }}</span>
            </div>
            <div v-if="taxPercentage > 0" class="flex justify-between py-2 border-b">
              <span>Tax ({{ taxPercentage }}%):</span>
              <span>{{ formatCurrency(taxAmount, selectedCurrency) }}</span>
            </div>
            <div class="flex justify-between py-2 font-bold">
              <span>TOTAL</span>
              <span>{{ formatCurrency(grandTotal, selectedCurrency) }}</span>
            </div>
          </div>
        </div>

        <div v-if="notes" class="mt-8 pt-4 border-t">
          <h3 class="font-semibold mb-2">Notes</h3>
          <p class="text-gray-700 whitespace-pre-line">{{ notes }}</p>
        </div>

        <div class="mt-8 pt-4 border-t text-center text-sm text-gray-500">
          <p>Thank you for your business!</p>
          <p class="mt-1">
            {{ yourCompany.name }} | {{ yourCompany.phone }} | {{ yourCompany.email }}
          </p>
        </div>
      </div>
    </div>
  </BaseTemplate>
</template>

<script>
import BaseTemplate from './BaseTemplate.vue';
import { formatCurrency } from '../utils/formatCurrency';

export default {
  name: 'Template8',
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
