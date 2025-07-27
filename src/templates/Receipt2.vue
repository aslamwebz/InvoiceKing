<template>
  <BaseTemplate2 
    :width="'80mm'"
    :height="'auto'"
    :class="'p-2'"
    :data="data"
    :is-print="isPrint"
  >
    <div class="text-center mb-3">
      <h2 class="text-xl font-bold">{{ yourCompany.name || 'Your Business' }}</h2>
      <p class="text-xs">{{ yourCompany.address || '123 Business St' }}</p>
      <p class="text-xs">{{ yourCompany.phone || '(123) 456-7890' }}</p>
      <p class="text-xs">{{ yourCompany.email || 'contact@yourbusiness.com' }}</p>
    </div>

    <div class="border-t-2 border-b-2 border-black py-2 my-2 text-center">
      <p class="font-bold">SALES RECEIPT</p>
      <p class="text-sm">#{{ invoice.number || '0000' }} | {{ formatDate(invoice.date) }}</p>
      <p class="text-sm">Cashier: {{ cashier || 'Staff' }}</p>
    </div>

    <div class="mb-3">
      <div class="flex justify-between text-sm font-bold border-b border-black py-1">
        <span>ITEM</span>
        <span>QTY</span>
        <span>PRICE</span>
        <span>TOTAL</span>
      </div>
      
      <div v-for="(item, index) in items" :key="index" class="py-1 text-sm border-b border-gray-200">
        <div class="font-medium">{{ item.name }}</div>
        <div v-if="item.description" class="text-xs text-gray-600 pl-2">{{ item.description }}</div>
        <div class="flex justify-between mt-1">
          <span class="w-1/4"></span>
          <span class="w-1/4 text-right">{{ item.quantity }}</span>
          <span class="w-1/4 text-right">{{ formatCurrency(item.price, selectedCurrency) }}</span>
          <span class="w-1/4 text-right font-bold">{{ formatCurrency(item.total, selectedCurrency) }}</span>
        </div>
      </div>
    </div>

    <div class="border-t-2 border-black pt-2 mt-4">
      <div class="flex justify-between text-sm py-1">
        <span>Subtotal:</span>
        <span>{{ formatCurrency(subTotal, selectedCurrency) }}</span>
      </div>
      <div v-if="taxPercentage > 0" class="flex justify-between text-sm py-1">
        <span>Tax ({{ taxPercentage }}%):</span>
        <span>{{ formatCurrency(taxAmount, selectedCurrency) }}</span>
      </div>
      <div class="flex justify-between text-lg font-bold py-1 border-t border-black mt-2">
        <span>TOTAL</span>
        <span>{{ formatCurrency(total, selectedCurrency) }}</span>
      </div>
    </div>

    <div v-if="paymentMethod" class="mt-2 text-sm">
      <div class="flex justify-between">
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

    <div v-if="notes" class="mt-4 pt-2 border-t border-dashed border-gray-400 text-center text-xs">
      <p class="font-semibold mb-1">Note:</p>
      <p class="whitespace-pre-line">{{ notes }}</p>
    </div>

    <div v-if="footer" class="mt-3 pt-2 border-t border-dashed border-gray-400 text-center text-xs">
      <p class="whitespace-pre-line">{{ footer }}</p>
    </div>

    <div class="mt-4 text-center text-xs">
      <p>Thank you for your business!</p>
      <p class="mt-1">Returns accepted within 14 days with receipt</p>
    </div>
  </BaseTemplate2>
</template>

<script>
import BaseTemplate2 from './BaseTemplate2.vue';
import { formatCurrency } from '../utils/formatCurrency';
import { format } from 'date-fns';
import { calculateSubTotal, calculateTaxAmount, calculateGrandTotal } from '../utils/invoiceCalculations';

export default {
  name: 'Receipt2',
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
        return format(new Date(date), 'MM/dd/yyyy hh:mm a');
      } catch (e) {
        return date;
      }
    }
  }
};
</script>
