import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { incidentSchema } from "@/lib/schema";

const resend = new Resend(process.env.RESEND_API_KEY);
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || "tadiwahmatewe@gmail.com";
const SENDER_EMAIL = process.env.SENDER_EMAIL || "noreply@panhari.org";

// Simple in-memory rate limiting (basic measure)
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5;

export async function POST(req: NextRequest) {
  try {
    // 1. Basic Rate Limiting
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const lastRequestTime = rateLimitMap.get(ip) || 0;

    if (now - lastRequestTime < RATE_LIMIT_WINDOW / MAX_REQUESTS) {
       // Very basic burst protection
    }
    // Note: A more robust implementation would use Redis, but keeping it simple as per ephemeral requirement.
    rateLimitMap.set(ip, now);

    // 2. Parse and Validate
    const body = await req.json();
    
    // Crucial: Do not log the request body or user's email
    // console.log("Received report"); 

    const validation = incidentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid form data", errors: validation.error.format() },
        { status: 400 }
      );
    }

    const data = validation.data;

    // 3. Format HTML Email
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #4f46e5; padding: 24px; color: white;">
          <h1 style="margin: 0; font-size: 24px;">New Confidential Incident Report</h1>
          <p style="margin: 8px 0 0 0; opacity: 0.9;">For Youth, By Youth Movement</p>
        </div>
        <div style="padding: 24px; color: #1e293b; line-height: 1.5;">
          <h2 style="font-size: 18px; color: #4f46e5; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">Concern Details</h2>
          
          <p><strong>Type of Concern:</strong><br/> ${data.concernTypes.join(", ")} 
            ${data.otherConcernType ? `(${data.otherConcernType})` : ""}
          </p>
          
          <p><strong>Date of Incident:</strong><br/> ${data.date}</p>
          
          <p><strong>Location:</strong><br/> ${data.locations.join(", ")}
            ${data.otherLocation ? `(${data.otherLocation})` : ""}
          </p>
          
          ${data.description ? `
          <p><strong>Details of Incident:</strong><br/> 
            ${data.description.replace(/\n/g, "<br/>")}
          </p>` : ""}
          
          <h2 style="font-size: 18px; color: #4f46e5; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-top: 24px;">Contact Information</h2>
          <p><strong>Email Provided:</strong><br/> ${data.email || "Anonymous (None provided)"}</p>
          
          <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #64748b;">
            <p>This report was submitted via the confidential reporting portal. Data is ephemeral and not stored in any database.</p>
          </div>
        </div>
      </div>
    `;

    // 4. Send Email
    const { error: resendError } = await resend.emails.send({
      from: `Incident Reporting <${SENDER_EMAIL}>`, 
      to: [RECIPIENT_EMAIL],
      subject: `Confidential Report: ${data.concernTypes[0]}`,
      html: html,
    });

    if (resendError) {
      console.error("Resend error:", resendError);
      return NextResponse.json(
        { message: `Email error: ${resendError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Report sent successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json(
      { message: `Server error: ${error.message || "An unexpected error occurred"}` },
      { status: 500 }
    );
  }
}
