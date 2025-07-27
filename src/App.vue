<template>
  <div id="app-container" class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
    <!-- App Header -->
    <header class="text-center mb-10">
        <h1 class="text-3xl font-bold text-gray-800">Bill Generator</h1>
    </header>

    <main class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Side: Invoice Form -->
        <div class="lg:col-span-2 bg-white p-6 sm:p-8 rounded-xl shadow-lg">
            
            <!-- Currency Selector -->
            <div class="mb-6">
                <label for="currency" class="block text-sm font-medium text-gray-700">Select Currency</label>
                <select id="currency" v-model="invoice.currency" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                    <option value="$">USD ($)</option>
                    <option value="€">EUR (€)</option>
                    <option value="£">GBP (£)</option>
                    <option value="₹">INR (₹)</option>
                    <option value="¥">JPY (¥)</option>
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
                 <h2 class="text-xl font-semibold text-gray-800 mb-6 text-center">Template Gallery</h2>
                 <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                     <!-- Loop through available templates -->
                     <div v-for="template in templates" :key="template.id" @click="selectedTemplate = template.id"
                        class="cursor-pointer border-2 rounded-lg overflow-hidden transition-all duration-200"
                        :class="{'border-indigo-500 ring-2 ring-indigo-500 ring-offset-2': selectedTemplate === template.id, 'border-gray-200 hover:border-indigo-400': selectedTemplate !== template.id}">
                        <img :src="template.thumbnail" :alt="template.name" class="w-full h-auto object-cover bg-gray-100">
                        <p class="text-center text-sm p-1 bg-gray-50">{{ template.name }}</p>
                    </div>
                 </div>
                 <button @click="generateInvoice" class="mt-8 w-full px-4 py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">Generate Invoice</button>
            </div>
        </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';

// Reactive object to hold all invoice data
const invoice = reactive({
    currency: '$',
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

// Ref to track the currently selected template
const selectedTemplate = ref(1);

// Array of available templates with placeholder images
const templates = ref([
    { id: 1, name: 'Template 1', thumbnail: 'https://placehold.co/150x200/6366f1/ffffff?text=Template%5Cn1' },
    { id: 2, name: 'Template 2', thumbnail: 'https://placehold.co/150x200/10b981/ffffff?text=Template%5Cn2' },
    { id: 3, name: 'Template 3', thumbnail: 'https://placehold.co/150x200/ef4444/ffffff?text=Template%5Cn3' },
    { id: 4, name: 'Template 4', thumbnail: 'https://placehold.co/150x200/f59e0b/ffffff?text=Template%5Cn4' },
    { id: 5, name: 'Template 5', thumbnail: 'https://placehold.co/150x200/3b82f6/ffffff?text=Template%5Cn5' },
    { id: 6, name: 'Template 6', thumbnail: 'https://placehold.co/150x200/8b5cf6/ffffff?text=Template%5Cn6' },
]);

// --- METHODS ---

// Adds a new, empty item to the invoice.items array
const addItem = () => {
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
    if (typeof amount !== 'number') {
        amount = 0;
    }
    return `${invoice.currency}${amount.toFixed(2)}`;
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
