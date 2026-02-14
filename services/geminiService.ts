
import { GoogleGenAI, Type } from "@google/genai";
import { Message, KnowledgeBaseItem, LeadStatus } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const geminiService = {
  /**
   * Generates a suggested reply based on context and knowledge base
   */
  async generateReply(
    messages: Message[],
    knowledgeBase: KnowledgeBaseItem[],
    businessName: string
  ): Promise<string> {
    const kbContext = knowledgeBase.map(kb => `[${kb.category}] ${kb.title}: ${kb.content}`).join('\n');
    const conversation = messages.map(m => `${m.direction}: ${m.content}`).join('\n');

    const prompt = `
      ACT AS: Elite WhatsApp Sales Closer for "${businessName}".
      GOAL: Provide a helpful, high-intent response that moves the lead to the next stage.
      
      FACTUAL DATA (KNOWLEDGE BASE):
      ${kbContext}

      CURRENT CHAT HISTORY:
      ${conversation}

      MANDATORY CONSTRAINTS:
      1. TONE: Human-like, professional yet enthusiastic. Use conversational WhatsApp language (avoid corporate speak).
      2. LENGTH: ABSOLUTE MAXIMUM 150 characters. Be punchy and concise.
      3. CALL TO ACTION: You MUST end the message with a clear question or a specific next step (e.g., "Ready for the link?", "What time works for a call?").
      4. FORMATTING: Use 1 relevant emoji to keep it friendly (e.g., 🚀, ✅, ✨).
      5. UNCERTAINTY: If the Knowledge Base doesn't have the answer, say: "Great question! I'll have one of our specialists get back to you on that ASAP. Is there anything else I can help with?"

      OUTPUT ONLY THE SUGGESTED WHATSAPP MESSAGE:
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return response.text?.trim() || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
      console.error("Gemini Reply Error:", error);
      return "Unable to generate AI reply at this moment.";
    }
  },

  /**
   * Analyzes conversation and classifies lead status
   */
  async classifyLead(messages: Message[]): Promise<{ status: LeadStatus; reasoning: string }> {
    const conversation = messages.map(m => `${m.direction}: ${m.content}`).join('\n');

    const prompt = `
      Analyze this WhatsApp conversation and classify the lead status for our CRM.
      
      Statuses:
      - HOT: Customer is ready to buy, asking for payment details, or highly urgent.
      - WARM: Customer shows clear interest, asks specific questions, but hasn't committed yet.
      - COLD: Customer is unresponsive, says "no thanks", or is just browsing with low intent.

      Conversation:
      ${conversation}

      Output the result in JSON format with "status" and "reasoning" fields.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              status: { type: Type.STRING, description: 'HOT, WARM, or COLD' },
              reasoning: { type: Type.STRING, description: 'Short explanation of why this status was chosen' }
            },
            required: ["status", "reasoning"]
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      return {
        status: (result.status as LeadStatus) || LeadStatus.COLD,
        reasoning: result.reasoning || "No reasoning provided."
      };
    } catch (error) {
      console.error("Gemini Classify Error:", error);
      return { status: LeadStatus.COLD, reasoning: "Analysis failed." };
    }
  },

  /**
   * Summarizes a conversation
   */
  async summarizeConversation(messages: Message[]): Promise<string> {
    if (messages.length === 0) return "No conversation history.";
    
    const conversation = messages.map(m => `${m.direction}: ${m.content}`).join('\n');

    const prompt = `
      Provide a highly concise (max 20 words) executive summary of this conversation for a sales lead manager.
      Focus on customer intent and current blocker.

      Conversation:
      ${conversation}
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return response.text?.trim() || "Summary unavailable.";
    } catch (error) {
      console.error("Gemini Summary Error:", error);
      return "Could not summarize.";
    }
  }
};
