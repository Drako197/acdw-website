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
    
    // Parse the body
    const bodyBuffer = Buffer.isBuffer(event.body) 
      ? event.body 
      : Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'utf8')
    
    busboy.write(bodyBuffer)
    busboy.end()
  })
}

module.exports = { parseMultipartFormData }

