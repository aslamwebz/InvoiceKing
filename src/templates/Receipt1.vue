<template>
  <BaseTemplate2 
    :width="'80mm'"
    :height="'auto'"
    :class="'p-2'"
    :data="data"
    :is-print="isPrint"
  >
    <div class="text-center mb-2">
      <h2 class="text-xl font-bold">{{ yourCompany.name || 'Your Business' }}</h2>
      <p class="text-sm">{{ yourCompany.address || '123 Business St' }}</p>
      <p class="text-sm">{{ yourCompany.phone || '(123) 456-7890' }}</p>
      <p class="text-sm">{{ yourCompany.email || 'contact@yourbusiness.com' }}</p>
    </div>

    <div class="border-t border-b border-dashed border-gray-400 py-2 my-2 text-center">
      <p class="text-sm">RECEIPT #{{ invoice.number || '0000' }}</p>
      <p class="text-xs">{{ formatDate(invoice.date) }}</p>
      <p class="text-xs">Cashier: {{ cashier || 'Staff' }}</p>
    </div>

    <div class="mb-2">
      <div class="flex justify-between text-sm border-b border-dashed border-gray-300 py-1">
        <span class="font-semibold">Item</span>
        <div class="flex">
          <span class="w-16 text-right">Qty</span>
          <span class="w-20 text-right">Price</span>
          <span class="w-20 text-right">Total</span>
        </div>
      </div>
      
      <div v-for="(item, index) in items" :key="index" class="py-1 text-sm border-b border-dashed border-gray-200">
        <div class="font-medium">{{ item.name }}</div>
        <div class="flex justify-between pl-2">
          <span class="text-xs text-gray-600">{{ item.description }}</span>
          <div class="flex">
            <span class="w-16 text-right">{{ item.quantity }}</span>
            <span class="w-20 text-right">{{ formatCurrency(item.price, selectedCurrency) }}</span>
            <span class="w-20 text-right font-medium">{{ formatCurrency(item.total, selectedCurrency) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-4 text-sm">
      <div class="flex justify-between py-1">
        <span>Subtotal:</span>
        <span>{{ formatCurrency(subTotal, selectedCurrency) }}</span>
      </div>
      <div v-if="taxPercentage > 0" class="flex justify-between py-1">
        <span>Tax ({{ taxPercentage }}%):</span>
        <span>{{ formatCurrency(taxAmount, selectedCurrency) }}</span>
      </div>
      <div class="flex justify-between py-1 font-bold border-t border-gray-300 mt-1">
        <span>TOTAL:</span>
        <span>{{ formatCurrency(total, selectedCurrency) }}</span>
      </div>
    </div>

    <div v-if="notes" class="mt-4 pt-2 border-t border-dashed border-gray-400 text-center text-xs">
      <p class="font-semibold mb-1">Note:</p>
      <p class="whitespace-pre-line">{{ notes }}</p>
    </div>

    <div v-if="footer" class="mt-4 pt-2 border-t border-dashed border-gray-400 text-center text-xs">
      <p class="whitespace-pre-line">{{ footer }}</p>
    </div>

    <div class="mt-4 text-center text-xs">
      <p>Thank you for your business!</p>
      <p class="mt-1">{{ yourCompany.website || 'www.yourbusiness.com' }}</p>
    </div>
  </BaseTemplate2>
</template>

<script>
import BaseTemplate2 from './BaseTemplate2.vue';
import { formatCurrency } from '../utils/formatCurrency';
import { format } from 'date-fns';
import { calculateSubTotal, calculateTaxAmount, calculateGrandTotal } from '../utils/invoiceCalculations';

export default {
  name: 'Receipt1',
  components: {
    BaseTemplate2
  },
  props: {
    data: {
      type: Object,
      required: true,
      default: () => ({
        billTo: {},
        invoice: {},
        yourCompany: {},
        items: [],
        taxPercentage: 0,
        notes: '',
        footer: '',
        selectedCurrency: 'USD'
      })
    },
    isPrint: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    billTo() { return this.data.billTo || {}; },
    invoice() { return this.data.invoice || {}; },
    yourCompany() { return this.data.yourCompany || {}; },
    items() { return this.data.items || []; },
    taxPercentage() { return this.data.taxPercentage || 0; },
    notes() { return this.data.notes || ''; },
    footer() { return this.data.footer || ''; },
    cashier() { return this.data.cashier || ''; },
    selectedCurrency() { return this.data.selectedCurrency || 'USD'; },
    subTotal() { 
      return calculateSubTotal(this.items);
    },
    taxAmount() {
      return calculateTaxAmount(this.subTotal, this.taxPercentage);
    },
    total() {
      return calculateGrandTotal(this.subTotal, this.taxAmount);
    }
  },
  methods: {
    formatCurrency,
    formatDate(date) {
      if (!date) return new Date().toLocaleDateString();
      try {
        return format(new Date(date), 'MMM dd, yyyy hh:mm a');
      } catch (e) {
        return date;
      }
    }
  }
};
</script>
