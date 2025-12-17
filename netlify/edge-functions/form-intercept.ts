import type { Context } from "@netlify/edge-functions";
declare const Deno: { env: { get(key: string): string | undefined } };

export default async (request: Request, context: Context) => {
    if (request.method !== "POST") {
        return context.next();
    }

    const url = new URL(request.url);

    if (url.pathname !== "/") {
        return context.next();
    }
    const internalSecret = request.headers.get("X-Internal-Secret");
    const expectedSecret = Deno.env.get("INTERNAL_FORWARD_SECRET");

    if (internalSecret && expectedSecret && internalSecret === expectedSecret) {
        console.log(`[Edge] Verified internal forward - passing through to Netlify Forms`);
        return context.next();
    }

    try {
        const body = await request.text();
        const params = new URLSearchParams(body);

        const formName = params.get("form-name");
        if (!formName) {
            return context.next();
        }

        console.log(`[Edge] Form submission intercepted: ${formName} from ${context.ip}`);

        const botField = params.get("bot-field");
        const honeypotWebsite = params.get("website");
        const honeypotUrl = params.get("url");

        if (botField || honeypotWebsite || honeypotUrl) {
            console.log(`[Edge] BLOCKED: Honeypot triggered for ${formName} from ${context.ip}`);
            return new Response(JSON.stringify({
                success: false,
                message: "Form submission received"
            }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }

        const email = params.get("email")?.trim();
        if (!email) {
            console.log(`[Edge] BLOCKED: No email for ${formName} from ${context.ip}`);
            return new Response(JSON.stringify({
                success: false,
                message: "Email is required"
            }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log(`[Edge] BLOCKED: Invalid email format for ${formName} from ${context.ip}`);
            return new Response(JSON.stringify({
                success: false,
                message: "Invalid email format"
            }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        const recaptchaToken = params.get("recaptcha-token") || params.get("g-recaptcha-response");
        if (!recaptchaToken) {
            console.log(`[Edge] BLOCKED: No reCAPTCHA token for ${formName} from ${context.ip}`);
            return new Response(JSON.stringify({
                success: false,
                message: "Security verification required"
            }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        const formLoadTime = params.get("form-load-time");
        if (formLoadTime) {
            const loadTime = parseInt(formLoadTime, 10);
            const now = Date.now();
            const timeDiff = now - loadTime;

            if (timeDiff < 2000) {
                console.log(`[Edge] BLOCKED: Too fast (${timeDiff}ms) for ${formName} from ${context.ip}`);
                return new Response(JSON.stringify({
                    success: false,
                    message: "Please wait a moment before submitting"
                }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                });
            }
        }

        console.log(`[Edge] Forwarding ${formName} to validation function`);

        const validationUrl = new URL("/.netlify/functions/validate-form-submission", request.url);

        const response = await fetch(validationUrl.toString(), {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "X-Forwarded-For": context.ip || "",
                "User-Agent": request.headers.get("User-Agent") || "",
                "X-Edge-Validated": "true",
            },
            body: body,
        });

        return response;

    } catch (error) {
        console.error(`[Edge] Error processing form:`, error);
        return new Response(JSON.stringify({
            success: false,
            message: "Unable to process form submission"
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};

export const config = {
    path: "/*",
};