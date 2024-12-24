export const formatInvoicePrompt = () => {
  return `You are an invoice data extraction assistant. Extract the following information from the invoice image in a structured format. For any field that is not found in the image, write "not available".

Please extract:
1. Invoice number
2. Invoice Date
3. Invoice Amount
4. Currency
5. Legal Entity Name
6. Legal Entity Address
7. Vendor Name
8. Vendor Address
9. Payment Terms
10. Payment Method
11. VAT ID
12. GL Account Number
13. Bank Account Number

Format your response as:
Invoice number: [value]
Invoice Date: [value]
Invoice Amount: [value]
Currency: [value]
Legal Entity Name: [value]
Legal Entity Address: [value]
Vendor Name: [value]
Vendor Address: [value]
Payment Terms: [value]
Payment Method: [value]
VAT ID: [value]
GL Account Number: [value]
Bank Account Number: [value]`;
};

export const parseInvoiceResponse = (response) => {
  const fields = [
    'Invoice number',
    'Invoice Date',
    'Invoice Amount',
    'Currency',
    'Legal Entity Name',
    'Legal Entity Address',
    'Vendor Name',
    'Vendor Address',
    'Payment Terms',
    'Payment Method',
    'VAT ID',
    'GL Account Number',
    'Bank Account Number'
  ];

  const result = {};
  
  fields.forEach(field => {
    // Make the regex more flexible to handle variations in formatting
    const regex = new RegExp(`${field}:?\\s*([^\\n]+)`, 'i');
    const match = response.match(regex);
    result[field] = match ? match[1].trim() : 'not available';
  });

  return result;
};
