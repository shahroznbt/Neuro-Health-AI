import Groq from "groq-sdk";

// const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export const sendMessageToAI = async (
    message: string,
    history: { role: "user" | "assistant"; content: string }[],
    userContext: string
): Promise<string> => {

    if (!API_KEY) {
        console.error("Groq API key is missing.");
        return "System Configuration Error: API Key missing.";
    }

    const groq = new Groq({
        apiKey: API_KEY,
        dangerouslyAllowBrowser: true
    });

    const systemPrompt = `You are Neuro AI, a compassionate and expert neurological health assistant.

User Context: ${userContext}

Provide helpful, accurate, and supportive information while always recommending consulting a professional for critical issues.

Keep responses concise, human-like, and empathetic.
Avoid medical diagnosis, but offer general guidance and tracked stats interpretation.`;

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                ...history.map(msg => ({
                    role: msg.role,
                    content: msg.content
                })),
                { role: "user", content: message }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 1024,
        });

        return (
            completion.choices[0]?.message?.content ||
            "I'm sorry, I couldn't process that. Please try again."
        );

    } catch (error) {
        console.error("Groq Chat Error:", error);
        return "I'm having trouble connecting to my neural network. Please check your connection and try again.";
    }
};




