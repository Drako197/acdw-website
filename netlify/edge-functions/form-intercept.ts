import type { Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {

    if (request.method !== "POST") {
        return context.next();
    }

    const url = new URL(request.url);

    if (url.pathname !== "/") {
        return context.next();
    }

    const validationUrl = new URL("/.netlify/functions/validate-form-submission", request.url);

    const body = await request.text();

    const response = await fetch(validationUrl.toString(), {
        method: "POST",
        headers: {
            "Content-Type": request.headers.get("Content-Type") || "application/x-www-form-urlencoded",
            "Origin": request.headers.get("Origin") || "",
            "User-Agent": request.headers.get("User-Agent") || "",
            "X-Forwarded-For": context.ip || "",
        },
        body: body,
    });

    return response;
};

export const config = {
    path: "/",
};