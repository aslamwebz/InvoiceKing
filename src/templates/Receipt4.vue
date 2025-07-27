<template>
  <div class="p-4 font-mono text-sm">
    <h2 class="text-center font-bold">{{ yourCompany.name || 'Your Business' }}</h2>
    <p class="text-center">{{ yourCompany.address || '123 Business St' }}</p>
    <p class="text-center">Phone: {{ yourCompany.phone || '(123) 456-7890' }}</p>
    <p v-if="yourCompany.gst" class="text-center">GST: {{ yourCompany.gst.toUpperCase() }}</p>
    
    <hr class="my-2 border-dashed border-gray-500" />
    
    <div class="mb-2">
      <p>Invoice: {{ invoice.number || '0000' }}</p>
      <p>Date: {{ formatDate(invoice.date) }} {{ currentTime }}</p>
      <p>Cashier: {{ cashier || 'Staff' }}</p>
      <p>Customer: {{ billTo.name || 'Walk-in Customer' }}</p>
      <p v-if="billTo.phone">Phone: {{ billTo.phone }}</p>
    </div>
    
    <hr class="my-1 border-dashed border-gray-500" />
    
    <div class="mb-2">
      <div class="flex justify-between font-bold border-b border-dashed border-gray-500 pb-1 mb-1">
        <span class="w-6">QTY</span>
        <span class="flex-1">ITEM</span>
        <span class="w-20 text-right">AMOUNT</span>
      </div>
      
      <div v-for="(item, index) in items" :key="index" class="mb-1">
        <div class="flex justify-between">
          <span class="w-6">{{ item.quantity || 1 }}x</span>
          <span class="flex-1">{{ item.name }}</span>
          <span class="w-20 text-right">{{ formatCurrency(item.total, selectedCurrency) }}</span>
        </div>
        <div v-if="item.description" class="text-xs pl-7 text-gray-600">{{ item.description }}</div>
      </div>
    </div>
    
    <hr class="my-1 border-dashed border-gray-500" />
    
    <div class="text-right mb-2">
      <div class="flex justify-between">
        <span>Subtotal:</span>
        <span class="w-20 text-right">{{ formatCurrency(subTotal, selectedCurrency) }}</span>
      </div>
      <div v-if="taxPercentage > 0" class="flex justify-between">
        <span>Tax ({{ taxPercentage }}%):</span>
        <span class="w-20 text-right">{{ formatCurrency(taxAmount, selectedCurrency) }}</span>
      </div>
      <div class="flex justify-between font-bold border-t border-dashed border-gray-500 mt-1 pt-1">
        <span>TOTAL:</span>
        <span class="w-20 text-right">{{ formatCurrency(total, selectedCurrency) }}</span>
      </div>
      
      <div v-if="paymentMethod || amountPaid || change" class="mt-2 pt-1 border-t border-dashed border-gray-500">
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
    </div>
    
    <hr class="my-1 border-dashed border-gray-500" />
    
    <div v-if="notes" class="text-center text-xs mb-2">
      <p class="font-semibold">Note:</p>
      <p class="whitespace-pre-line">{{ notes }}</p>
    </div>
    
    <div class="text-center text-xs">
      <p>Thank you for shopping with us!</p>
      <p v-if="yourCompany.returnPolicy" class="mt-1">{{ yourCompany.returnPolicy }}</p>
      <p class="mt-1">{{ yourCompany.website || 'www.yourbusiness.com' }}</p>
    </div>
    
    <div v-if="footer" class="mt-2 pt-2 border-t border-dashed border-gray-500 text-center text-xs">
      <p class="whitespace-pre-line">{{ footer }}</p>
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns';
import { formatCurrency } from '../utils/formatCurrency';
import { calculateSubTotal, calculateTaxAmount, calculateGrandTotal } from '../utils/invoiceCalculations';

export default {
  name: 'Receipt4',
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
        cashier: '',
        paymentMethod: 'CASH',
        amountPaid: 0,
        change: 0,
        selectedCurrency: 'USD'
      })
    }
  },
  data() {
    return {
      currentTime: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
      })
    };
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
        return format(new Date(date), 'dd/MM/yyyy');
      } catch (e) {
        return date;
      }
    }
  }
};
</script>
