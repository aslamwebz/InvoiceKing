<template>
  <BaseTemplate :data="data">
    <div class="bg-blue-500 text-white p-12">
      <div class="flex justify-between items-start mb-8">
        <div>
          <div class="text-white inline-block">
            <h1 class="text-2xl font-bold" id="company-name">
              {{ yourCompany?.name || "Your Company Name" }}
            </h1>
          </div>
          <p class="mt-2">
            {{ yourCompany?.address || "Your Company Address" }}
          </p>
          <p>{{ yourCompany?.phone || "Your Company Phone" }}</p>
        </div>
        <div>
          <h2 class="text-xl font-semibold mb-2">BILLED TO</h2>
          <p>{{ billTo.name }}</p>
          <p>{{ billTo.address }}</p>
          <p>{{ billTo.phone }}</p>
        </div>
      </div>
      <div class="flex justify-between mb-8">
        <div>
          <h2 class="text-xl font-semibold mb-2">SHIP TO</h2>
          <p>{{ shipTo.name }}</p>
          <p>{{ shipTo.address }}</p>
          <p>{{ shipTo.phone }}</p>
        </div>
        <div class="text-right">
          <p>Invoice #: {{ invoice.number }}</p>
          <p>Invoice Date: {{ formatDate(invoice.date) }}</p>
          <p>Due Date: {{ formatDate(invoice.paymentDate) }}</p>
          <p>Due Amount: {{ formatCurrency(grandTotal, selectedCurrency) }}</p>
        </div>
      </div>
    </div>
    <div class="rounded-lg border border-blue-500 -mt-[42px] w-[92%] mx-auto">
      <div id="item-data" class="w-full mb-8">
        <div class="bg-blue-200 flex rounded-t">
          <div class="p-2 w-12"></div>
          <div class="p-2 flex-grow text-left">
            ITEM NAME/ITEM DESCRIPTION
          </div>
          <div class="p-2 flex-1 text-right">QTY.</div>
          <div class="p-2 flex-1 text-right">AMOUNT</div>
        </div>
        <div v-for="(item, index) in items" :key="index" class="flex border-t border-b">
          <div class="p-2 w-12 text-left">
            {{ String(index + 1).padStart(2, "0") }}
          </div>
          <div class="p-2 flex-1">
            <p class="font-semibold">{{ item.name }}</p>
            <p class="text-sm text-gray-600">{{ item.description }}</p>
          </div>
          <div class="p-2 w-24 text-right">{{ item.quantity }}</div>
          <div class="p-2 flex-1 text-right">
            {{ formatCurrency(item.total, selectedCurrency) }}
          </div>
        </div>
      </div>
      <div class="flex justify-between">
        <div class="w-2/3 p-4">
          <h3 class="text-lg font-semibold">Notes</h3>
          <p class="text-sm text-gray-600">{{ notes }}</p>
        </div>
        <div class="w-1/3">
          <div class="flex justify-between mb-2 p-2">
            <span>Sub Total:</span>
            <span>{{ formatCurrency(subTotal, selectedCurrency) }}</span>
          </div>
          <div v-if="taxPercentage > 0" class="flex justify-between mb-2 p-2">
            <span>Tax ({{ taxPercentage }}%):</span>
            <span>{{ formatCurrency(taxAmount, selectedCurrency) }}</span>
          </div>
          <div class="flex justify-between font-bold bg-blue-500 text-white p-2 mt-4">
            <span class="text-left">Total</span>
            <span>{{ formatCurrency(grandTotal, selectedCurrency) }}</span>
          </div>
        </div>
      </div>
    </div>
  </BaseTemplate>
</template>

<script>
import BaseTemplate from './BaseTemplate.vue';
import { formatCurrency } from '../utils/formatCurrency';

export default {
  name: 'Template3',
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
    // Destructure data properties for easier access in template
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
