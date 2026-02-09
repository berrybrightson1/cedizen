import { CreateWebWorkerMLCEngine, type MLCEngineInterface } from "@mlc-ai/web-llm";

let engine: MLCEngineInterface | null = null;

export async function initEngine(onProgress: (progress: number) => void) {
    if (engine) return engine;

    // We use Llama-3.2-1B-Instruct-q4f16_1-MLC as a lightweight candidate
    // For production, this would be a specific model suitable for the user's device
    const selectedModel = "Llama-3.2-1B-Instruct-q4f16_1-MLC";

    engine = await CreateWebWorkerMLCEngine(
        new Worker(new URL("./worker.ts", import.meta.url), { type: "module" }),
        selectedModel,
        {
            initProgressCallback: (report) => {
                onProgress(Math.round(report.progress * 100));
            }
        }
    );

    return engine;
}

export async function getAnswer(prompt: string, context: string) {
    if (!engine) throw new Error("Engine not initialized");

    const systemPrompt = `You are Cedizen, a helpful legal assistant for Ghana. 
  Answer only based on the provided constitutional context. 
  If the answer is not in the context, say you don't know and advise seeking professional legal counsel.
  
  CONTEXT:
  ${context}`;

    const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
    ];

    const reply = await engine.chat.completions.create({
        messages: (messages as any),
    });

    return reply.choices[0].message.content;
}
