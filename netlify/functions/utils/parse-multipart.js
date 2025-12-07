/**
 * Parse multipart/form-data using busboy
 * Used for forms with file uploads (like core-upgrade form)
 */

const Busboy = require('busboy')

/**
 * Parse multipart form data from Netlify Function event
 * @param {Object} event - Netlify Function event
 * @returns {Promise<{fields: Object, files: Object}>}
 */
function parseMultipartFormData(event) {
  return new Promise((resolve, reject) => {
    const busboy = Busboy({ headers: event.headers })
    const fields = {}
    const files = {}
    let hasError = false
    
    busboy.on('file', (fieldname, file, info) => {
      const { filename, encoding, mimeType } = info
      const chunks = []
      
      file.on('data', (data) => {
        chunks.push(data)
      })
      
      file.on('end', () => {
        files[fieldname] = {
          filename,
          encoding,
          mimeType,
          data: Buffer.concat(chunks)
        }
      })
      
      file.on('error', (err) => {
        if (!hasError) {
          hasError = true
          reject(err)
        }
      })
    })
    
    busboy.on('field', (fieldname, value) => {
      fields[fieldname] = value
    })
    
    busboy.on('finish', () => {
      if (!hasError) {
        resolve({ fields, files })
      }
    })
    
    busboy.on('error', (err) => {
      if (!hasError) {
        hasError = true
        reject(err)
      }
    })
    
    // Parse the body - Netlify Functions may receive body as string or Buffer
    let bodyBuffer
    if (Buffer.isBuffer(event.body)) {
      bodyBuffer = event.body
    } else if (typeof event.body === 'string') {
      // If it's a string, check if it's base64 encoded
      if (event.isBase64Encoded) {
        bodyBuffer = Buffer.from(event.body, 'base64')
      } else {
        // If it's a plain string, convert to buffer
        bodyBuffer = Buffer.from(event.body, 'binary')
      }
    } else {
      // Fallback: try to convert to buffer
      bodyBuffer = Buffer.from(String(event.body), 'binary')
    }
    
    try {
      busboy.write(bodyBuffer)
      busboy.end()
    } catch (writeError) {
      if (!hasError) {
        hasError = true
        reject(new Error(`Failed to write to busboy: ${writeError.message}`))
      }
    }
  })
}

module.exports = { parseMultipartFormData }

