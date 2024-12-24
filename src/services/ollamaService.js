import { formatInvoicePrompt, parseInvoiceResponse } from './invoiceExtractor';

const API_URL = 'http://135.224.195.180:11434/api/chat';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to clean and validate base64 string
const cleanBase64 = (base64String) => {
  // Remove any whitespace
  base64String = base64String.trim();
  // Remove data URL prefix if present
  if (base64String.includes(',')) {
    base64String = base64String.split(',')[1];
  }
  // Ensure the string is properly padded
  while (base64String.length % 4) {
    base64String += '=';
  }
  return base64String;
};

export const processImageWithRetry = async (base64Image, onProgress) => {
  let retries = 0;
  
  while (retries < MAX_RETRIES) {
    try {
      const cleanedBase64 = cleanBase64(base64Image);
      
      const requestBody = {
        model: 'llama3.2-vision',
        messages: [{
          role: 'user',
          content: `Analyze this invoice image and extract information in the following format:

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
Bank Account Number: [value]

If any field is not found, write "not available" for that field.`,
          images: [cleanedBase64]
        }],
        stream: true,
        options: {
          temperature: 0.3,
          max_tokens: 2048
        }
      };

      // Log request details for debugging
      console.log('Request URL:', API_URL);
      console.log('Request headers:', {
        'Content-Type': 'application/json'
      });
      console.log('Request body structure:', {
        model: requestBody.model,
        messageCount: requestBody.messages.length,
        firstMessageContent: typeof requestBody.messages[0].content,
        hasImages: !!requestBody.messages[0].images,
        imageCount: requestBody.messages[0].images?.length,
        imageSize: requestBody.messages[0].images[0].length,
        options: requestBody.options
      });

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', {
          status: response.status,
          statusText: response.statusText,
          errorText
        });
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }

      let fullText = '';
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const json = JSON.parse(line);
            if (json.message?.content) {
              const processedContent = json.message.content.replace(/#+\s/g, '');
              fullText += processedContent;
              onProgress?.(fullText);
            }
          } catch (e) {
            console.warn('Error parsing chunk:', e, 'Raw chunk:', line);
          }
        }
      }

      if (!fullText.trim()) {
        throw new Error('No text was extracted from the image');
      }

      return parseInvoiceResponse(fullText);
    } catch (error) {
      retries++;
      console.error(`Attempt ${retries} failed:`, error);
      
      if (retries === MAX_RETRIES) {
        throw new Error(`Failed after ${MAX_RETRIES} attempts: ${error.message}`);
      }
      
      await sleep(RETRY_DELAY * retries);
    }
  }
};
