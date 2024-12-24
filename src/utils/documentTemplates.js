// Document type definitions and field extractors
export const documentTemplates = {
  invoice: {
    name: 'Invoice',
    fields: [
      { name: 'invoiceNumber', label: 'Invoice Number', pattern: /Invoice\s*#?\s*([A-Z0-9-]+)/i },
      { name: 'date', label: 'Date', pattern: /Date:?\s*(\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4})/i },
      { name: 'totalAmount', label: 'Total Amount', pattern: /Total:?\s*[\$£€]?\s*([\d,]+\.?\d*)/i },
      { name: 'vendor', label: 'Vendor', pattern: /(From|Vendor|Company):\s*([^\n]+)/i },
      { name: 'customer', label: 'Customer', pattern: /(To|Bill To|Customer):\s*([^\n]+)/i }
    ],
    prompt: `For invoices, please focus on:
    1. Invoice number and date
    2. Vendor and customer details
    3. Line items with quantities and prices
    4. Total amount and tax details
    5. Payment terms and due dates`
  },
  receipt: {
    name: 'Receipt',
    fields: [
      { name: 'merchantName', label: 'Merchant', pattern: /^([^\n]+)/i },
      { name: 'date', label: 'Date', pattern: /(\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4})/i },
      { name: 'total', label: 'Total', pattern: /Total:?\s*[\$£€]?\s*([\d,]+\.?\d*)/i },
      { name: 'paymentMethod', label: 'Payment Method', pattern: /(Cash|Credit|Card|Debit)/i }
    ],
    prompt: `For receipts, please focus on:
    1. Store/merchant name and location
    2. Date and time of purchase
    3. Individual items and prices
    4. Total amount and tax
    5. Payment method used`
  },
  form: {
    name: 'Form',
    fields: [
      { name: 'title', label: 'Form Title', pattern: /^([^\n]+)/i },
      { name: 'name', label: 'Name', pattern: /Name:?\s*([^\n]+)/i },
      { name: 'date', label: 'Date', pattern: /Date:?\s*(\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4})/i },
      { name: 'signature', label: 'Signature', pattern: /Signature:?\s*([^\n]+)/i }
    ],
    prompt: `For forms, please focus on:
    1. Form title and type
    2. Personal information fields
    3. Date fields
    4. Checkbox and selection fields
    5. Signature fields`
  },
  idCard: {
    name: 'ID Card',
    fields: [
      { name: 'idNumber', label: 'ID Number', pattern: /(\b[A-Z0-9]{6,}\b)/i },
      { name: 'name', label: 'Name', pattern: /Name:?\s*([^\n]+)/i },
      { name: 'dob', label: 'Date of Birth', pattern: /DOB:?\s*(\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4})/i },
      { name: 'address', label: 'Address', pattern: /Address:?\s*([^\n]+)/i }
    ],
    prompt: `For ID cards, please focus on:
    1. ID number and type
    2. Full name
    3. Date of birth
    4. Address details
    5. Expiry date if present`
  }
};

// Extract fields based on document type
export const extractFields = (text, documentType) => {
  const template = documentTemplates[documentType];
  if (!template) return null;

  const fields = {};
  template.fields.forEach(field => {
    const match = text.match(field.pattern);
    fields[field.name] = match ? match[1].trim() : null;
  });

  return {
    type: template.name,
    fields
  };
};

// Get prompt based on document type
export const getTypeSpecificPrompt = (documentType) => {
  const template = documentTemplates[documentType];
  return template ? template.prompt : '';
};

// Detect document type from content
export const detectDocumentType = (text) => {
  const textLower = text.toLowerCase();
  
  if (textLower.includes('invoice') || textLower.includes('bill to')) {
    return 'invoice';
  }
  if (textLower.includes('receipt') || textLower.match(/total:?\s*[\$£€]/i)) {
    return 'receipt';
  }
  if (textLower.includes('form') || textLower.includes('please fill')) {
    return 'form';
  }
  if (textLower.includes('id') || textLower.includes('identification')) {
    return 'idCard';
  }
  
  return 'general';
};
