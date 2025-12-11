

const { checkRateLimit, getRateLimitHeaders, getClientIP } = require('./utils/rate-limiter')
const { getSecurityHeaders } = require('./utils/cors-config')

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET

exports.handler = async (event, context) => {

    const headers = getSecurityHeaders(event)

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    }
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

    // Rate limiting
    const ip = getClientIP(event)
    const rateLimitResult = await checkRateLimit(ip, 'form')
    if (!rateLimitResult.allowed) {
        return {
            statusCode: 429,
            headers: {
                ...headers,
                ...getRateLimitHeaders(rateLimitResult)
            },
            body: JSON.stringify({
                error: 'Too many form submissions. Please wait and try again.',
                retryAfter: rateLimitResult.retryAfter
            }),
        }
    }

  try {
    // Check if Cloudinary is configured
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      console.error('❌ Cloudinary not configured - missing environment variables')
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Image upload service not configured',
          message: 'Please contact support'
        }),
      }
    }

    // Parse request body
    const body = JSON.parse(event.body || '{}')
    const { imageData } = body
    // Note: We don't use folder parameter - let the upload preset handle folder organization
    // This avoids "Display name cannot contain slashes" errors

    if (!imageData) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No image data provided' }),
      }
    }

    // Validate that it's a data URL
    if (!imageData.startsWith('data:image/')) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid image format. Expected data URL.' }),
      }
    }

    // Extract base64 data from data URL
    const base64Data = imageData.split(',')[1]
    if (!base64Data) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid data URL format' }),
      }
    }

    // Convert base64 to buffer
    const imageBuffer = Buffer.from(base64Data, 'base64')
    
    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (imageBuffer.length > maxSize) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'File size exceeds 5MB limit' }),
      }
    }

    // Upload to Cloudinary using their API
    // Cloudinary accepts data URLs directly when sent as form data
    const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`
    
    // Use unsigned upload preset (required for this approach)
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET
    if (!uploadPreset) {
      console.error('❌ No upload preset configured - upload preset is required')
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Image upload service not configured',
          message: 'Upload preset is required. Please configure CLOUDINARY_UPLOAD_PRESET environment variable.'
        }),
      }
    }
    
    // Log configuration (without sensitive data)
    console.log('📤 Starting Cloudinary upload:', {
      cloudName: CLOUDINARY_CLOUD_NAME,
      hasApiKey: !!CLOUDINARY_API_KEY,
      hasApiSecret: !!CLOUDINARY_API_SECRET,
      uploadPreset: uploadPreset,
      imageDataLength: imageData.length,
      imageDataPrefix: imageData.substring(0, 50) // First 50 chars for debugging
    })
    
    // Cloudinary accepts data URLs directly in the file parameter
    // We'll use URLSearchParams which works for data URLs
    // Note: For unsigned uploads, we can only use specific parameters
    // Allowed: upload_preset, public_id, folder, asset_folder, tags, context, etc.
    // NOT allowed: display_name (only for signed uploads)
    const formData = new URLSearchParams()
    formData.append('file', imageData) // Full data URL (e.g., "data:image/jpeg;base64,...")
    formData.append('upload_preset', uploadPreset)
    
    // Use public_id to control the filename (allowed in unsigned uploads)
    // This also helps control the display name indirectly
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const publicId = `acdw-upgrade-forms/upgrade-${timestamp}-${randomStr}`
    formData.append('public_id', publicId)
    
    let uploadResponse
    try {
      uploadResponse = await fetch(cloudinaryUploadUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
      })
    } catch (fetchError) {
      console.error('❌ Fetch error when calling Cloudinary:', {
        message: fetchError.message,
        stack: fetchError.stack,
        name: fetchError.name,
        code: fetchError.code
      })
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Image upload failed',
          message: 'Network error connecting to image service',
          details: process.env.NODE_ENV === 'development' ? fetchError.message : undefined
        }),
      }
    }

    // Parse response with better error handling
    const responseText = await uploadResponse.text()
    let uploadResult
    
    try {
      uploadResult = JSON.parse(responseText)
    } catch (parseError) {
      console.error('❌ Failed to parse Cloudinary response:', {
        status: uploadResponse.status,
        statusText: uploadResponse.statusText,
        responseText: responseText.substring(0, 500) // First 500 chars
      })
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Image upload failed',
          message: 'Invalid response from image service'
        }),
      }
    }

    if (!uploadResponse.ok || uploadResult.error) {
      console.error('❌ Cloudinary upload error:', {
        status: uploadResponse.status,
        statusText: uploadResponse.statusText,
        error: uploadResult.error,
        fullResponse: uploadResult
      })
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Image upload failed',
          message: uploadResult.error?.message || uploadResult.error || 'Failed to upload image',
          details: process.env.NODE_ENV === 'development' ? uploadResult : undefined
        }),
      }
    }

    // Verify we got a valid secure_url (this is the clickable URL)
    if (!uploadResult.secure_url) {
      console.error('❌ Cloudinary response missing secure_url:', uploadResult)
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Image upload failed',
          message: 'Invalid response from image service - no URL returned'
        }),
      }
    }

    // Log successful upload with full details
    const ip = getClientIP(event)
    console.log('📸 Image uploaded to Cloudinary successfully:', {
      publicId: uploadResult.public_id,
      secureUrl: uploadResult.secure_url,
      url: uploadResult.url,
      size: uploadResult.bytes,
      format: uploadResult.format,
      width: uploadResult.width,
      height: uploadResult.height,
      ip
    })

    // Return the secure URL (this is a permanent, viewable HTTPS URL)
    // Format: https://res.cloudinary.com/cloud-name/image/upload/v1234567890/folder/filename.jpg
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        imageUrl: uploadResult.secure_url, // HTTPS URL - paste in browser to view
        publicId: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        size: uploadResult.bytes
      }),
    }

  } catch (error) {
    console.error('❌ Image upload error (catch block):', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    })
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Image upload failed',
        message: 'An error occurred processing your image',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }),
    }
  }
}

