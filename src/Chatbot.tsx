import { FormEvent, useState } from "react";

type Message = {
  role: "user" | "assistant";
  text: string;
};

const STARTER_MESSAGE =
  "Hi! I’m Keiko, Kaycee’s resume assistant. Ask me about her experience, insurance expertise, skills, education, or awards.";

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
  const response = data as {
    output?: Array<{ type?: string; text?: string }>;
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  const interactionText = response.output
    ?.filter((item) => item.type === "text" && item.text)
    .map((item) => item.text)
    .join("\n")
    .trim();
  if (interactionText) return cleanGeminiText(interactionText);

  return cleanGeminiText(
    response.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("")
      .trim() || "",
  );
}

export default function Chatbot({ darkMode = false }: { darkMode?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: STARTER_MESSAGE },
  ]);

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = input.trim();
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!question || isLoading) return;

    setInput("");
    setMessages((current) => [...current, { role: "user", text: question }]);
    setIsLoading(true);

    try {
      if (!apiKey) {
        throw new Error("The chatbot is not configured yet.");
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
          import.meta.env.VITE_GEMINI_MODEL || "gemini-3.5-flash-lite",
        )}:generateContent`,
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

      if (!response.ok) {
        const errorBody = (await response.json().catch(() => null)) as {
          error?: { message?: string };
        } | null;
        throw new Error(
          errorBody?.error?.message || "Gemini could not answer right now.",
        );
      }

      const answer = readGeminiText(await response.json());
      if (!answer) throw new Error("Gemini returned an empty response.");
      setMessages((current) => [
        ...current,
        { role: "assistant", text: answer },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text:
            error instanceof Error
              ? error.message
              : "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 sm:bottom-7 sm:right-7">
      {isOpen && (
        <section
          aria-label="Chat with Keiko, Kaycee's resume assistant"
          className={`chatbot-panel mb-3 flex h-[min(560px,calc(100vh-120px))] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border shadow-2xl ${darkMode ? "chatbot-panel-dark" : ""}`}
          style={{
            background: "rgba(247,250,240,0.97)",
            borderColor: "#D6E9C4",
            boxShadow: "0 24px 70px rgba(42,56,36,0.22)",
          }}
        >
          <div
            className="chatbot-header flex items-center justify-between px-5 py-4 text-white"
            style={{ background: "linear-gradient(135deg,#3D5C2E,#7FAE60)" }}
          >
            <div>
              <p className="font-semibold">Keiko</p>
              <p className="text-xs text-[#E6F0D8]">Powered by Gemini</p>
            </div>
            <button
              type="button"
              aria-label="Close chat"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1.5 text-xl leading-none transition hover:bg-white/15"
            >
              ×
            </button>
          </div>

          <div className="chatbot-messages flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <p
                  className={`chatbot-message max-w-[86%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${message.role === "user" ? "chatbot-message-user" : "chatbot-message-assistant"}`}
                  style={
                    message.role === "user"
                      ? { background: "#D96C82", color: "#fff" }
                      : { background: "#E6F0D8", color: "#2A3824" }
                  }
                >
                  {message.text}
                </p>
              </div>
            ))}
            {isLoading && (
              <p className="chatbot-thinking rounded-2xl bg-[#E6F0D8] px-3.5 py-2.5 text-sm text-[#52634A]">
                Thinking…
              </p>
            )}
          </div>

          <form
            onSubmit={sendMessage}
            className="chatbot-composer border-t border-[#D6E9C4] p-3"
          >
            <div className="chatbot-input-wrap flex items-end gap-2 rounded-2xl border border-[#D6E9C4] bg-white p-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about Kaycee’s experience..."
                aria-label="Message Keiko"
                className="chatbot-input min-w-0 flex-1 bg-transparent px-2 py-1.5 text-sm text-[#2A3824] outline-none placeholder:text-[#7A8F72]"
                disabled={isLoading}
              />
              <button
                type="submit"
                aria-label="Send message"
                disabled={isLoading || !input.trim()}
                className="chatbot-send rounded-xl px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                style={{ background: "#3D5C2E" }}
              >
                Send
              </button>
            </div>
          </form>
        </section>
      )}

      <button
        type="button"
        aria-label={isOpen ? "Close Keiko" : "Open Keiko"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
        style={{ background: "linear-gradient(135deg,#FD9FAE,#D96C82)" }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-6 w-6"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 9.5h10M7 13.5h6m-1.5 7L7 17H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5.5L11.5 20.5z"
          />
        </svg>
      </button>
    </div>
  );
}
