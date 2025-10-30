import { pdf } from 'pdf-to-img'

/**
 * Convert PDF buffer to base64 images
 * Returns array of base64 data URLs for each page
 */
export async function convertPDFToImages(buffer: Buffer): Promise<string[]> {
  try {
    const images: string[] = []
    const document = await pdf(buffer, { scale: 2.0 }) // Higher scale for better quality

    for await (const image of document) {
      // Convert to base64 data URL
      const base64 = image.toString('base64')
      const dataUrl = `data:image/png;base64,${base64}`
      images.push(dataUrl)
    }

    return images
  } catch (error) {
    console.error('PDF to image conversion error:', error)
    throw new Error('Failed to convert PDF to images')
  }
}

/**
 * Convert first N pages of PDF to images
 * Useful for limiting API costs
 */
export async function convertPDFPagesToImages(
  buffer: Buffer,
  maxPages: number = 5
): Promise<string[]> {
  try {
    const images: string[] = []
    const document = await pdf(buffer, { scale: 2.0 })

    let pageCount = 0
    for await (const image of document) {
      if (pageCount >= maxPages) break

      const base64 = image.toString('base64')
      const dataUrl = `data:image/png;base64,${base64}`
      images.push(dataUrl)
      pageCount++
    }

    return images
  } catch (error) {
    console.error('PDF pages to images conversion error:', error)
    throw new Error('Failed to convert PDF pages to images')
  }
}
