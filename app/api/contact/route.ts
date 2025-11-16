import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import type { ContactFormData } from '@/types'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json()
    
    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'tony@cosmicjs.com',
      to: 'tony@cosmicjs.com',
      subject: `New Contact Form Submission from ${body.name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Contact Form Submission</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
            <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 30px; text-align: center;">
                <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">
                  🥁 DrumStore Pro
                </h1>
                <p style="margin: 10px 0 0 0; color: #e5e7eb; font-size: 14px;">
                  New Contact Form Submission
                </p>
              </div>
              
              <div style="padding: 30px;">
                <div style="margin-bottom: 24px;">
                  <h2 style="margin: 0 0 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                    Name
                  </h2>
                  <p style="margin: 0; color: #374151; font-size: 16px; line-height: 1.5;">
                    ${body.name}
                  </p>
                </div>
                
                <div style="margin-bottom: 24px;">
                  <h2 style="margin: 0 0 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                    Email
                  </h2>
                  <p style="margin: 0;">
                    <a href="mailto:${body.email}" style="color: #ef4444; text-decoration: none; font-size: 16px;">
                      ${body.email}
                    </a>
                  </p>
                </div>
                
                <div style="margin-bottom: 24px;">
                  <h2 style="margin: 0 0 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                    Message
                  </h2>
                  <div style="background-color: #f9fafb; border-left: 4px solid #ef4444; padding: 16px; border-radius: 4px;">
                    <p style="margin: 0; color: #374151; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">
${body.message}
                    </p>
                  </div>
                </div>
              </div>
              
              <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0; color: #6b7280; font-size: 12px;">
                  This email was sent from the DrumStore Pro contact form
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
New Contact Form Submission

Name: ${body.name}
Email: ${body.email}

Message:
${body.message}

---
This email was sent from the DrumStore Pro contact form.
      `
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true,
        messageId: data?.id
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}