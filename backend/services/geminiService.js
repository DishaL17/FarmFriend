const CANDIDATE_MODELS = [
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.8-flash",
  "gemini-flash-latest",
];

const delay = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const generateAIResponse = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Gemini API key is missing from .env");
  }

  let lastError = null;

  // Try candidate models in order until one succeeds
  for (const model of CANDIDATE_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`Gemini API call (model: ${model}, attempt: ${attempt}/2)`);

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 800,
            },
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          const error = new Error(
            data.error?.message || `Gemini API request failed with status ${response.status}`
          );
          error.status = response.status;

          // If model is not found (404) or busy/high demand (503), try next model
          if (response.status === 404 || response.status === 503) {
            console.warn(`Model ${model} returned ${response.status}, trying fallback model...`);
            lastError = error;
            break;
          }

          throw error;
        }

        const aiText = data.candidates?.[0]?.content?.parts
          ?.map((part) => part.text || "")
          .join("")
          .trim();

        if (!aiText) {
          throw new Error("Gemini returned an empty response");
        }

        console.log(`Gemini response generated successfully using ${model}!`);
        return aiText;

      } catch (error) {
        lastError = error;
        console.error(
          `Gemini attempt ${attempt} with model ${model} failed:`,
          error.message
        );

        // If not retryable or final attempt for this model, don't wait
        const retryable =
          [408, 429, 500, 502, 503, 504].includes(error.status) ||
          !error.status;

        if (!retryable || attempt === 2) {
          break;
        }

        await delay(attempt * 1200);
      }
    }
  }

  throw lastError || new Error("Failed to generate AI response with all candidate models.");
};
