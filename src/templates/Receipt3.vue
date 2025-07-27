<template>
  <BaseTemplate2 
    :width="'80mm'"
    :height="'auto'"
    :class="'p-2'"
    :data="data"
    :is-print="isPrint"
  >
    <div class="text-center mb-3">
      <h2 class="text-xl font-bold text-blue-600">{{ yourCompany.name || 'Your Business' }}</h2>
      <p class="text-xs text-gray-600">{{ yourCompany.slogan || 'Quality Products & Services' }}</p>
    </div>

    <div class="text-center text-xs mb-3">
      <p>{{ yourCompany.address || '123 Business St' }}</p>
      <p>{{ yourCompany.phone || 'Phone: (123) 456-7890' }}</p>
      <p>{{ yourCompany.email || 'email@yourbusiness.com' }}</p>
      <p v-if="yourCompany.website">{{ yourCompany.website }}</p>
    </div>

    <div class="border-t-2 border-b-2 border-blue-300 py-2 my-2 text-center">
      <p class="text-sm font-bold">RECEIPT</p>
      <p class="text-xs">#{{ invoice.number || '0000' }} | {{ formatDate(invoice.date) }}</p>
      <p class="text-xs">Cashier: {{ cashier || 'Staff' }}</p>
    </div>

    <div class="mb-3">
      <div class="flex justify-between text-xs font-semibold border-b border-gray-300 pb-1 mb-1">
        <span class="w-6/12">ITEM</span>
        <span class="w-2/12 text-right">QTY</span>
        <span class="w-4/12 text-right">AMOUNT</span>
      </div>
      
      <div v-for="(item, index) in items" :key="index" class="mb-1">
        <div class="flex justify-between text-xs">
          <span class="w-6/12 font-medium">{{ item.name }}</span>
          <span class="w-2/12 text-right">{{ item.quantity }}</span>
          <span class="w-4/12 text-right">{{ formatCurrency(item.total, selectedCurrency) }}</span>
        </div>
        <div v-if="item.description" class="text-2xs text-gray-600 pl-1">{{ item.description }}</div>
      </div>
    </div>

    <div class="border-t border-dashed border-gray-400 pt-2 text-xs">
      <div class="flex justify-between py-1">
        <span>Subtotal:</span>
        <span>{{ formatCurrency(subTotal, selectedCurrency) }}</span>
      </div>
      <div v-if="taxPercentage > 0" class="flex justify-between py-1">
        <span>Tax ({{ taxPercentage }}%):</span>
        <span>{{ formatCurrency(taxAmount, selectedCurrency) }}</span>
      </div>
      <div class="flex justify-between py-1 font-bold border-t border-gray-300 mt-1">
        <span>TOTAL</span>
        <span>{{ formatCurrency(total, selectedCurrency) }}</span>
      </div>
    </div>

    <div v-if="paymentMethod || amountPaid || change" class="mt-2 text-xs border-t border-dashed border-gray-300 pt-2">
      <div v-if="paymentMethod" class="flex justify-between">
        <span>Payment Method:</span>
        <span class="font-medium">{{ paymentMethod }}</span>
      </div>
      <div v-if="amountPaid" class="flex justify-between">
        <span>Amount Paid:</span>
        <span>{{ formatCurrency(amountPaid, selectedCurrency) }}</span>
      </div>
      <div v-if="change" class="flex justify-between">
        <span>Change:</span>
        <span>{{ formatCurrency(change, selectedCurrency) }}</span>
      </div>
    </div>

    <div v-if="notes" class="mt-3 pt-2 border-t border-dashed border-gray-300 text-center text-xs">
      <p class="font-semibold mb-1">Note:</p>
      <p class="whitespace-pre-line">{{ notes }}</p>
    </div>

    <div v-if="footer" class="mt-3 pt-2 border-t border-dashed border-gray-300 text-center text-2xs text-gray-600">
      <p class="whitespace-pre-line">{{ footer }}</p>
    </div>

    <div class="mt-4 text-center text-2xs text-gray-600">
      <p>Thank you for your business!</p>
      <p class="mt-1">Please retain this receipt for your records</p>
      <p v-if="yourCompany.returnPolicy" class="mt-1">{{ yourCompany.returnPolicy }}</p>
    </div>
  </BaseTemplate2>
</template>

<script>
import BaseTemplate2 from './BaseTemplate2.vue';
import { formatCurrency } from '../utils/formatCurrency';
import { format } from 'date-fns';
import { calculateSubTotal, calculateTaxAmount, calculateGrandTotal } from '../utils/invoiceCalculations';

export default {
  name: 'Receipt3',
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
        paymentMethod: 'CASH',
        amountPaid: 0,
        change: 0,
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
    paymentMethod() { return this.data.paymentMethod || 'CASH'; },
    amountPaid() { return this.data.amountPaid || 0; },
    change() { return this.data.change || 0; },
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
