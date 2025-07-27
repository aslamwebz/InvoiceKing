<template>
  <div id="app-container" class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
    <!-- App Header -->
    <header class="text-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Bill Generator</h1>
        <!-- Tabs -->
        <div class="flex justify-center mb-8">
          <div class="inline-flex rounded-md shadow-sm">
            <button 
              @click="activeTab = 'invoice'"
              :class="{
                'bg-indigo-600 text-white': activeTab === 'invoice',
                'bg-white text-gray-700 hover:bg-gray-50': activeTab !== 'invoice'
              }"
              class="px-4 py-2 text-sm font-medium rounded-l-md border border-gray-300 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              Invoice
            </button>
            <button 
              @click="activeTab = 'receipt'"
              :class="{
                'bg-indigo-600 text-white': activeTab === 'receipt',
                'bg-white text-gray-700 hover:bg-gray-50': activeTab !== 'receipt'
              }"
              class="px-4 py-2 text-sm font-medium rounded-r-md border-t border-b border-r border-gray-300 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              Receipt
            </button>
          </div>
        </div>
    </header>

    <main class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Side: Invoice Form -->
        <div class="lg:col-span-2 bg-white p-6 sm:p-8 rounded-xl shadow-lg">
            
            <!-- Currency Selector -->
            <div class="mb-6">
                <label for="currency" class="block text-sm font-medium text-gray-700">Select Currency</label>
                <select id="currency" v-model="invoice.currency" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="JPY">JPY (¥)</option>
                </select>
            </div>

            <!-- Billing and Shipping Details -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Bill To Section -->
                <div>
                    <h2 class="text-lg font-semibold text-gray-800 mb-2">Bill To</h2>
                    <input type="text" v-model="invoice.billTo.name" placeholder="Client Name" class="w-full p-2 border rounded-md mb-2 focus:ring-1 focus:ring-indigo-500">
                    <input type="email" v-model="invoice.billTo.email" placeholder="Email Address" class="w-full p-2 border rounded-md mb-2 focus:ring-1 focus:ring-indigo-500">
                    <textarea v-model="invoice.billTo.address" placeholder="Client Address" rows="3" class="w-full p-2 border rounded-md focus:ring-1 focus:ring-indigo-500"></textarea>
                </div>
                <!-- Ship To Section -->
                <div>
                    <div class="flex justify-between items-center mb-2">
                        <h2 class="text-lg font-semibold text-gray-800">Ship To</h2>
                         <button @click="copyBillingAddress" class="text-sm font-medium text-indigo-600 hover:text-indigo-800">Same as Bill To</button>
                    </div>
                    <input type="text" v-model="invoice.shipTo.name" placeholder="Client Name" class="w-full p-2 border rounded-md mb-2 focus:ring-1 focus:ring-indigo-500">
                    <input type="email" v-model="invoice.shipTo.email" placeholder="Email Address" class="w-full p-2 border rounded-md mb-2 focus:ring-1 focus:ring-indigo-500">
                    <textarea v-model="invoice.shipTo.address" placeholder="Shipping Address" rows="3" class="w-full p-2 border rounded-md focus:ring-1 focus:ring-indigo-500"></textarea>
                </div>
            </div>

            <hr class="my-8 border-gray-200">

            <!-- Company and Invoice Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <!-- Your Company Section -->
                 <div>
                    <h2 class="text-lg font-semibold text-gray-800 mb-2">Your Company</h2>
                    <input type="text" v-model="invoice.company.name" placeholder="Your Company Name" class="w-full p-2 border rounded-md mb-2 focus:ring-1 focus:ring-indigo-500">
                     <input type="email" v-model="invoice.company.email" placeholder="Your Email" class="w-full p-2 border rounded-md mb-2 focus:ring-1 focus:ring-indigo-500">
                    <textarea v-model="invoice.company.address" placeholder="Your Company Address" rows="3" class="w-full p-2 border rounded-md focus:ring-1 focus:ring-indigo-500"></textarea>
                </div>
                <!-- Invoice Information Section -->
                <div>
                    <h2 class="text-lg font-semibold text-gray-800 mb-2">Invoice Information</h2>
                    <input type="text" v-model="invoice.invoiceNumber" placeholder="Invoice Number" class="w-full p-2 border rounded-md mb-2 focus:ring-1 focus:ring-indigo-500">
                    <input type="date" v-model="invoice.invoiceDate" title="Invoice Date" class="w-full p-2 border rounded-md mb-2 focus:ring-1 focus:ring-indigo-500">
                    <input type="date" v-model="invoice.dueDate" title="Due Date" class="w-full p-2 border rounded-md focus:ring-1 focus:ring-indigo-500">
                </div>
            </div>

            <hr class="my-8 border-gray-200">

            <!-- Invoice Item Details -->
            <div>
                <h2 class="text-lg font-semibold text-gray-800 mb-4">Item Details</h2>
                <!-- Headers for the items table -->
                <div class="hidden sm:grid grid-cols-12 gap-2 mb-2 text-sm font-medium text-gray-500">
                    <div class="col-span-5">Description</div>
                    <div class="col-span-2">Quantity</div>
                    <div class="col-span-2">Price</div>
                    <div class="col-span-2 text-right">Total</div>
                    <div class="col-span-1"></div>
                </div>
                <!-- Loop through each item -->
                <div v-for="(item, index) in invoice.items" :key="index" class="grid grid-cols-12 gap-2 mb-3 items-center">
                    <input type="text" v-model="item.description" placeholder="Item Description" class="col-span-12 sm:col-span-5 p-2 border rounded-md focus:ring-1 focus:ring-indigo-500">
                    <input type="number" v-model.number="item.quantity" placeholder="Qty" min="0" class="col-span-4 sm:col-span-2 p-2 border rounded-md focus:ring-1 focus:ring-indigo-500">
                    <input type="number" v-model.number="item.price" placeholder="Price" min="0" step="0.01" class="col-span-4 sm:col-span-2 p-2 border rounded-md focus:ring-1 focus:ring-indigo-500">
                    <div class="col-span-3 sm:col-span-2 text-right text-gray-700 font-medium pr-2">{{ formatCurrency(item.quantity * item.price) }}</div>
                    <button @click="removeItem(index)" class="col-span-1 text-red-500 hover:text-red-700 text-2xl font-bold flex items-center justify-center">&times;</button>
                </div>
                <button @click="addItem" class="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">Add another product</button>
            </div>

             <hr class="my-8 border-gray-200">

             <!-- Totals Section -->
            <div class="flex justify-end">
                <div class="w-full md:w-6/12 lg:w-5/12">
                    <h2 class="text-lg font-semibold text-gray-800 mb-4">Totals</h2>
                    <div class="space-y-3">
                         <div class="flex justify-between">
                            <span class="text-gray-600">Sub Total</span>
                            <span class="font-medium text-gray-800">{{ formatCurrency(subtotal) }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">Tax (%)</span>
                            <input type="number" v-model.number="invoice.taxRate" placeholder="Tax %" min="0" class="w-24 p-1 border rounded-md text-right focus:ring-1 focus:ring-indigo-500">
                        </div>
                         <div class="flex justify-between">
                            <span class="text-gray-600">Tax Amount</span>
                            <span class="font-medium text-gray-800">{{ formatCurrency(taxAmount) }}</span>
                        </div>
                        <div class="flex justify-between border-t-2 border-gray-200 pt-3 mt-3">
                            <span class="font-bold text-gray-800 text-lg">Grand Total</span>
                            <span class="font-bold text-gray-800 text-lg">{{ formatCurrency(grandTotal) }}</span>
                        </div>
                    </div>
                </div>
            </div>

             <hr class="my-8 border-gray-200">

            <!-- Notes Section -->
            <div>
                <h2 class="text-lg font-semibold text-gray-800 mb-2">Notes</h2>
                <textarea v-model="invoice.notes" placeholder="Thank you for your business." rows="3" class="w-full p-2 border rounded-md focus:ring-1 focus:ring-indigo-500"></textarea>
            </div>
        </div>

        <!-- Right Side: Template Gallery -->
        <div class="lg:col-span-1">
            <div class="bg-white p-6 rounded-xl shadow-lg sticky top-8">
                <h2 class="text-xl font-bold text-gray-800 mb-4">{{ activeTab === 'invoice' ? 'Invoice' : 'Receipt' }} Templates</h2>
                <div class="grid grid-cols-2 gap-4">
                    <!-- Template Thumbnails -->
                    <div v-for="template in (activeTab === 'invoice' ? [1, 2, 3, 4, 5] : [6, 7, 8, 9])" 
                         :key="template" 
                         @click="openTemplatePreview(template)"
                         class="border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                         :class="{ 'ring-2 ring-indigo-500': selectedTemplate === template }">
                        <div class="h-32 bg-gray-100 flex items-center justify-center">
                            <span class="text-gray-400">{{ activeTab === 'invoice' ? 'Invoice' : 'Receipt' }} {{ activeTab === 'invoice' ? template : template - 5 }}</span>
                        </div>
                        <div class="p-2 text-center">
                            <h3 class="font-medium text-sm">{{ getTemplateName(template) }}</h3>
                        </div>
                    </div>
                </div>
                
                <!-- Download PDF Button -->
                <button @click="downloadPDF" 
                        class="mt-8 w-full px-4 py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PDF
                </button>
            </div>
            
            <!-- Template Preview Modal -->
            <div v-if="showPreviewModal" 
                 class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" 
                 @click.self="closePreview">
                <div class="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                    <div class="flex justify-between items-center p-4 border-b">
                        <h3 class="text-lg font-semibold">Preview: {{ getTemplateName(selectedPreviewTemplate) }}</h3>
                        <button @click="closePreview" class="text-gray-500 hover:text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div class="p-6 overflow-y-auto flex-1">
                        <div id="pdf-content" class="bg-white p-4 rounded-lg border border-gray-200">
                            <component :is="getTemplateComponent(selectedPreviewTemplate)" :data="previewData" />
                        </div>
                    </div>
                    <div class="p-4 border-t flex justify-end space-x-3">
                        <button @click="closePreview" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                            Close
                        </button>
                        <button @click="selectTemplate(selectedPreviewTemplate)" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                            Use This Template
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, defineAsyncComponent, onMounted } from 'vue';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Import all template components
const Template1 = defineAsyncComponent(() => import('./templates/Template1.vue'));
const Template2 = defineAsyncComponent(() => import('./templates/Template2.vue'));
const Template3 = defineAsyncComponent(() => import('./templates/Template3.vue'));
const Template4 = defineAsyncComponent(() => import('./templates/Template4.vue'));
const Template5 = defineAsyncComponent(() => import('./templates/Template5.vue'));
const Template6 = defineAsyncComponent(() => import('./templates/Template6.vue'));
const Template7 = defineAsyncComponent(() => import('./templates/Template7.vue'));
const Template8 = defineAsyncComponent(() => import('./templates/Template8.vue'));
const Template9 = defineAsyncComponent(() => import('./templates/Template9.vue'));
const Receipt1 = defineAsyncComponent(() => import('./templates/Receipt1.vue'));
const Receipt2 = defineAsyncComponent(() => import('./templates/Receipt2.vue'));
const Receipt3 = defineAsyncComponent(() => import('./templates/Receipt3.vue'));
const Receipt4 = defineAsyncComponent(() => import('./templates/Receipt4.vue'));

// Active tab state
const activeTab = ref('invoice');

// Map template IDs to their components
const templateComponents = {
    // Invoice templates
    1: Template1,
    2: Template2,
    3: Template3,
    4: Template4,
    5: Template5,
    // Receipt templates
    6: Receipt1,
    7: Receipt2,
    8: Receipt3,
    9: Receipt4,
    7: Template7,
    8: Template8,
    9: Template9,
    10: Receipt1,
    11: Receipt2,
    12: Receipt3,
    13: Receipt4
};

// Helper function to get the component by template ID
const getTemplateComponent = (templateId) => {
    return templateComponents[templateId] || null;
};

// Prepare preview data for template thumbnails (using form data)
const previewData = computed(() => ({
    billTo: { 
        name: invoice.billTo.name || 'Client Name', 
        email: invoice.billTo.email || 'client@example.com', 
        address: invoice.billTo.address || '123 Client St\nCity, Country' 
    },
    invoice: { 
        number: invoice.invoiceNumber || 'INV-0001', 
        date: invoice.invoiceDate ? new Date(invoice.invoiceDate) : new Date() 
    },
    yourCompany: { 
        name: invoice.company.name || 'Your Company', 
        address: invoice.company.address || '456 Business Ave\nCity, Country', 
        phone: invoice.company.phone || '(123) 456-7890',
        email: invoice.company.email || 'contact@yourcompany.com'
    },
    items: invoice.items.map(item => ({
        name: item.description || 'Item',
        description: item.description || 'Item description',
        quantity: item.quantity || 1,
        price: item.price || 0,
        total: (item.quantity || 1) * (item.price || 0)
    })),
    taxPercentage: invoice.taxRate || 0,
    taxAmount: taxAmount.value || 0,
    subTotal: subtotal.value || 0,
    grandTotal: grandTotal.value || 0,
    selectedCurrency: invoice.currency || '$',
    paymentMethod: 'CARD',
    amountPaid: grandTotal.value || 0,
    change: 0,
    notes: invoice.notes || 'Thank you for your business!',
    footer: 'Terms & Conditions Apply',
    dueDate: invoice.dueDate ? new Date(invoice.dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
}));



// Reactive object to hold all invoice data
const invoice = reactive({
    currency: 'USD',
    billTo: { name: 'Acme Corp.', email: 'john.doe@example.com', address: '123 Main St\nAnytown, USA 12345' },
    shipTo: { name: '', email: '', address: '' },
    company: { name: 'New Company LLC', email: 'your@company.com', address: '456 Business Rd\nSuite 789, CA 67890' },
    invoiceNumber: 'INV-2024-001',
    invoiceDate: new Date().toISOString().slice(0,10),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().slice(0,10),
    items: [
        { description: 'High-quality item', quantity: 2, price: 50 },
        { description: 'Another product', quantity: 1, price: 120.50 },
        { description: 'Service Fee', quantity: 1, price: 25.00 },
    ],
    taxRate: 10,
    notes: 'Thank you for your business. We appreciate your prompt payment.',
});

// Refs for template selection and preview
const selectedTemplate = ref(1);
const showPreviewModal = ref(false);
const selectedPreviewTemplate = ref(null);

// Array of available templates with their IDs
const templates = ref([
    { id: 1, name: 'Template 1' },
    { id: 2, name: 'Template 2' },
    { id: 3, name: 'Template 3' },
    { id: 4, name: 'Template 4' },
    { id: 5, name: 'Template 5' },
    { id: 6, name: 'Template 6' },
    { id: 7, name: 'Template 7' },
    { id: 8, name: 'Template 8' },
    { id: 9, name: 'Template 9' },
    { id: 10, name: 'Receipt 1' },
    { id: 11, name: 'Receipt 2' },
    { id: 12, name: 'Receipt 3' },
    { id: 13, name: 'Receipt 4' },
]);

// --- TEMPLATE PREVIEW METHODS ---

// Open template preview modal
function openTemplatePreview(templateId) {
    selectedPreviewTemplate.value = templateId;
    showPreviewModal.value = true;
}

// Close preview modal
function closePreview() {
    showPreviewModal.value = false;
}

// Select template and close preview
function selectTemplate(templateId) {
    selectedTemplate.value = templateId;
    closePreview();
}

// Get template name by ID
function getTemplateName(templateId) {
    const template = templates.value.find(t => t.id === templateId);
    return template ? template.name : '';
}

// --- INVOICE METHODS ---

// Adds a new, empty item to the invoice.items array
function addItem() {
    invoice.items.push({ description: '', quantity: 1, price: 0 });
};

// Removes an item from the invoice.items array by its index
const removeItem = (index) => {
    invoice.items.splice(index, 1);
};

// Copies the billing address to the shipping address
const copyBillingAddress = () => {
    invoice.shipTo = structuredClone(invoice.billTo);
};

// --- COMPUTED PROPERTIES ---

// Calculates the subtotal of all items
const subtotal = computed(() => {
    return invoice.items.reduce((acc, item) => acc + ((item.quantity || 0) * (item.price || 0)), 0);
});

// Calculates the amount of tax based on the subtotal and tax rate
const taxAmount = computed(() => {
    return subtotal.value * ((invoice.taxRate || 0) / 100);
});

// Calculates the final grand total
const grandTotal = computed(() => {
    return subtotal.value + taxAmount.value;
});

// Formats a number into a currency string
const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '';
  
  // Map currency codes to their symbols for display
  const currencySymbols = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'INR': '₹',
    'JPY': '¥'
  };
  
  const currency = invoice.currency || 'USD';
  const symbol = currencySymbols[currency] || '$';
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      currencyDisplay: 'symbol',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount).replace(/^\D+/, symbol);
  } catch (e) {
    // Fallback in case of invalid currency code
    return `${symbol}${amount.toFixed(2)}`;
  }
};

// Downloads the current invoice/receipt as PDF
const downloadPDF = async () => {
  try {
    const element = document.getElementById('pdf-content');
    if (!element) {
      console.error('Could not find PDF content element');
      return;
    }

    // Show loading state
    const button = document.querySelector('button[onclick*="downloadPDF"]');
    const originalText = button?.innerHTML || 'Download PDF';
    if (button) {
      button.disabled = true;
      button.innerHTML = 'Generating PDF...';
    }

    // Create PDF
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    
    // Save the PDF
    const fileName = `${activeTab.value === 'invoice' ? 'Invoice' : 'Receipt'}_${invoice.number || 'new'}.pdf`;
    pdf.save(fileName);

    // Reset button state
    if (button) {
      button.disabled = false;
      button.innerHTML = originalText;
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
    
    // Reset button state on error
    const button = document.querySelector('button[onclick*="downloadPDF"]');
    if (button) {
      button.disabled = false;
      button.innerHTML = 'Download PDF';
    }
  }
};

// Simulates the invoice generation process
const generateInvoice = () => {
    alert(`Generating invoice with Template ${selectedTemplate.value}!\n\nFor this demo, the invoice data will be logged to the browser's console.`);
    console.log('--- INVOICE DATA ---');
    console.log(JSON.parse(JSON.stringify(invoice)));
    console.log('--- CALCULATED TOTALS ---');
    console.log('Subtotal:', formatCurrency(subtotal.value));
    console.log('Tax Amount:', formatCurrency(taxAmount.value));
    console.log('Grand Total:', formatCurrency(grandTotal.value));
}
</script>
