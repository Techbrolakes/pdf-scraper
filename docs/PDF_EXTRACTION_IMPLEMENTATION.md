# PDF Extraction System - Implementation Complete

## Overview
A comprehensive PDF extraction system that automatically detects PDF types and routes them to the appropriate processing method.

## Architecture

### File Structure
```
lib/
├── pdf/
│   ├── types.ts              # TypeScript type definitions
│   ├── pdf-utils.ts          # PDF analysis and validation utilities
│   ├── text-extractor.ts     # Text-based PDF extraction
│   ├── image-extractor.ts    # Image-based PDF extraction (with canvas)
│   └── extractor.ts          # Main extraction orchestrator
└── openai/
    ├── client.ts             # OpenAI client configuration
    └── resume-parser.ts      # Resume parsing with GPT-4/Vision
```

## PDF Type Detection

The system automatically analyzes PDFs and categorizes them:

1. **Text-based PDF**: Contains selectable text, no images
   - Uses direct text extraction with pdfjs-dist
   - Processes with GPT-4 for resume parsing
   - Most cost-effective method

2. **Image-based PDF**: Scanned documents with no extractable text
   - Converts pages to images using canvas
   - Processes with GPT-4 Vision
   - Higher cost but handles scanned resumes

3. **Hybrid PDF**: Contains both text and images
   - Extracts text where available
   - Converts image-heavy pages to images
   - Uses appropriate GPT model based on content

## Key Features

### Automatic Type Detection
- Analyzes text density (characters per page)
- Counts embedded images
- Determines optimal extraction method
- No manual configuration needed

### Text Extraction
- Page-by-page parallel processing
- Proper text cleaning and normalization
- Handles multi-column layouts
- Resource cleanup with `destroy()`

### Image Extraction
- Renders PDF pages to canvas at 2x scale
- Compresses images with Sharp (max 1600px width)
- JPEG compression at 85% quality
- Limits to 10 pages for cost control

### OpenAI Integration
- GPT-4 Turbo for text-based resumes
- GPT-4 Vision for image-based resumes
- Structured JSON output
- Low temperature (0.1) for consistency

## Dependencies

### Installed Packages
```json
{
  "pdfjs-dist": "^5.4.296",
  "canvas": "latest",
  "sharp": "latest",
  "openai": "^6.7.0"
}
```

### Configuration

#### next.config.ts
```typescript
experimental: {
  serverComponentsExternalPackages: ['canvas', 'sharp'],
},
webpack: (config) => {
  config.resolve.alias.canvas = false;
  config.resolve.alias.encoding = false;
  return config;
}
```

## Usage

### In API Routes
```typescript
import { extractFromPDF } from '@/lib/pdf/extractor';
import { parseResume } from '@/lib/openai/resume-parser';

// Extract content (auto-detects type)
const extractionResult = await extractFromPDF(buffer);

// Parse with OpenAI (auto-selects model)
const resumeData = await parseResume(extractionResult);
```

### Extraction Result Structure
```typescript
interface PDFExtractionResult {
  success: boolean;
  text?: string;              // For text-based PDFs
  images?: string[];          // Base64 images for image-based PDFs
  pageCount: number;
  hasText: boolean;
  hasImages: boolean;
  error?: string;
}
```

## Performance Optimizations

1. **Parallel Processing**: Extracts text from all pages simultaneously
2. **Image Compression**: Reduces image size by ~70% before sending to OpenAI
3. **Page Limiting**: Processes max 10 pages for image-based PDFs
4. **Resource Cleanup**: Properly destroys PDF documents after processing
5. **Smart Routing**: Uses cheaper GPT-4 for text when possible

## Cost Optimization

- **Text-based**: ~$0.01 per resume (GPT-4 Turbo)
- **Image-based**: ~$0.10 per resume (GPT-4 Vision, 10 pages max)
- **Hybrid**: Variable based on content mix

## Error Handling

The system handles:
- Invalid PDF files
- Corrupted PDFs
- Empty files
- Extraction failures
- OpenAI API errors
- Rate limiting
- Timeout errors

## Migration Notes

### From Old System
- Replaced `pdf-parse` with `pdfjs-dist` legacy build
- Removed dependency on `pdf-to-image` utility
- Consolidated extraction logic into single module
- Improved type detection accuracy
- Added proper canvas support for Node.js

### Breaking Changes
- Import paths changed from `@/lib/pdf-utils` to `@/lib/pdf/extractor`
- Different result structure (no `pdfType` enum, use boolean flags)
- Automatic type detection (no manual specification needed)

## Testing

### Test Different PDF Types
1. **Text PDF**: Standard resume with selectable text
2. **Scanned PDF**: Photo/scan of a resume
3. **Hybrid PDF**: Resume with charts, logos, and text

### Verification
```bash
# Check extraction
console.log('Type:', extractionResult.hasText ? 'text' : 'image');
console.log('Pages:', extractionResult.pageCount);
console.log('Success:', extractionResult.success);
```

## Troubleshooting

### Canvas Errors
- Ensure `canvas` package is installed
- Check `serverComponentsExternalPackages` in next.config.ts
- Verify webpack aliases are set

### Worker Errors
- Using legacy build: `pdfjs-dist/legacy/build/pdf.mjs`
- Worker disabled: `GlobalWorkerOptions.workerSrc = ''`
- No CDN URLs in Node.js environment

### Memory Issues
- Limit page processing (default: 10 pages)
- Reduce image scale (default: 2.0)
- Lower JPEG quality (default: 85%)

## Next Steps

1. Monitor OpenAI usage and costs
2. Implement caching for duplicate files
3. Add progress tracking for large files
4. Consider streaming for very large PDFs
5. Add retry logic for transient failures

## Support

For issues or questions:
- Check console logs for detailed error messages
- Verify environment variables (OPENAI_API_KEY)
- Test with different PDF types
- Review OpenAI API status
