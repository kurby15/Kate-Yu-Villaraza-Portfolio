type ChatRequest = {
  question?: unknown;
};

type VercelRequest = {
  method?: string;
  body?: ChatRequest;
};

type VercelResponse = {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
};

const RESUME_CONTEXT = `
Name: Kaycee Villaraza
Location: Pasig City
Current role: Insurance Specialist at QBE Insurance - GSSC (Group Shared Services Centre), 2013 to present.
Professional summary: Insurance Specialist with 13 years of experience managing personal and commercial insurance portfolios for a globally recognized insurer headquartered in Australia. Her expertise includes underwriting support, risk assessment, policy administration, compliance, broker relations, customer retention, and analytical decision-making.

QBE experience:
- Mercedes-Benz Motor Vehicle Insurance: Oversees QBE's premium motor vehicle portfolio, supports dealerships and clients nationwide, manages 60-80 weekly policy enquiries, handles billing, alterations, cancellations, renewals, documentation, missed payments, underwriting guidance, manual renewal reviews, and client complaints.
- DIGI Small Business Insurance: Manages end-to-end policy processes for Australian small business clients, including policy setup, billing, renewals, support, cover enquiries, mid-term alterations, and policy documents such as Certificates of Currency, tax invoices, payment histories, claims histories, and renewal letters.
- Remediation for Motor, Home, Business, and Farm Insurance: Reviews client accounts and transactions, verifies financial discrepancies, resolves issues with clients and brokers, issues refunds, performs remediation actions, documents cases for audit readiness, and protects financial integrity.
- Domestic Portfolio for intermediaries, financial institutions, and brokers: Liaises with intermediaries, brokers, and banks; interprets requirements; advises on policy changes; and negotiates contracts, pricing, and agreements.
- Other QBE product lines from 2013 to 2017: Home and Contents Insurance, Motor Vehicle Insurance, Consumer Credit Insurance, Pleasure Craft Insurance, Caravan Insurance, Trailer Insurance, and Horse Float Insurance.
- CTP Insurance, 2012-2013: Supported compulsory third-party insurance for New South Wales, South Australia, and Queensland, including quotes, applications, vehicle registration support, coverage explanations, and policy setup.

Previous experience:
- Billing Analyst for Origin Energy Australia at Aegis People Services: Managed billing operations, invoicing, collections, repayment plans, delinquent accounts, client communication, and compliance records.
- 411 Directory Assistance for T-Mobile and Verizon at ePerformax Contact Centre: Handled high-volume inbound calls, directory lookups, customer concerns, confidential information, and service-quality requirements.

Core skills: Insurance products, Australian insurance regulations and compliance frameworks including ASIC, APRA, and AFCA, underwriting support, risk analysis, policy administration, customer service, broker and client relations, remediation, financial accuracy, training and mentoring, time management, prioritization, and cross-functional teamwork.

Education: Bachelor of Science in Psychology, University of Santo Tomas, 2010.
Recognition: Retention Champion Award (2016); 10 Years of Service and Integrity Award (2023); Partnership and Synergy Award (2023); Performance Excellence Award (2024); QBE DNA Champion (2025).
`;

function cleanGeminiText(text: string): string {
  return text.replace(/\*/g, "").trim();
}

function readGeminiText(data: unknown): string {
  if (!data || typeof data !== "object") return "";
  const result = data as {
    output?: Array<{ type?: string; text?: string }>;
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  const interactionText = result.output
    ?.filter((item) => item.type === "text" && item.text)
    .map((item) => item.text)
    .join("\n")
    .trim();
  if (interactionText) return cleanGeminiText(interactionText);

  return cleanGeminiText(
    result.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("")
      .trim() || "",
  );
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed." });
  }

  const question =
    typeof request.body?.question === "string"
      ? request.body.question.trim()
      : "";
  const apiKey = process.env.GEMINI_API_KEY;

  if (!question) {
    return response.status(400).json({ error: "Question is required." });
  }
  if (!apiKey) {
    return response
      .status(500)
      .json({ error: "The chatbot is not configured yet." });
  }

  try {
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: {
          "x-goog-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `You are Keiko, Kaycee Villaraza's helpful resume assistant. Answer using only the resume context below. Be concise, warm, and professional. Never invent employers, dates, skills, responsibilities, awards, or qualifications. If the answer is not in the resume, say that the resume does not specify it. If the question is unrelated, say you can help with Kaycee's experience, insurance expertise, skills, education, or awards.\n\nResume context:\n${RESUME_CONTEXT}\nVisitor question: ${question}`,
                },
              ],
            },
          ],
        }),
      },
    );

    const data = await geminiResponse.json();
    if (!geminiResponse.ok) {
      const message =
        data && typeof data === "object" && "error" in data
          ? (data.error as { message?: string })?.message
          : undefined;
      return response
        .status(geminiResponse.status)
        .json({ error: message || "Gemini could not answer right now." });
    }

    const answer = readGeminiText(data);
    if (!answer) {
      return response
        .status(502)
        .json({ error: "Gemini returned an empty response." });
    }
    return response.status(200).json({ answer });
  } catch {
    return response
      .status(502)
      .json({ error: "Gemini could not answer right now." });
  }
}
