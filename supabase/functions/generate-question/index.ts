import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SYSTEM_PROMPT = `You are a quiz question generator for Nexora, a competitive learning platform. Generate exactly ONE multiple choice question.
Return ONLY valid JSON, no markdown, no explanation.

Format:
{
  "question": "question text here",
  "options": {
    "A": "option A text",
    "B": "option B text",
    "C": "option C text",
    "D": "option D text"
  },
  "correct": "A",
  "explanation": "brief explanation why this is correct (max 2 sentences)"
}

Rules:
- Question must be factual and accurate
- All 4 options must be plausible
- Correct answer must be objectively true
- Explanation must be educational
- NEVER repeat the same question
- Language: English only`;

const CATEGORY_DETAILS: Record<string, string> = {
  general: "broad factual topics, trivia, science, history",
  football: "World Cup, UEFA Champions League, leagues, famous players",
  ai: "AI, ML, Web3, Blockchain, future tech",
};

const FALLBACK_QUESTIONS: Record<string, Record<string, any[]>> = {
  general: {
    easy: [
      {
        question: "What is the capital city of France?",
        options: { A: "Berlin", B: "Madrid", C: "Paris", D: "Rome" },
        correct: "C",
        explanation: "Paris has been the capital of France since the 10th century and is the country's largest city.",
      },
      {
        question: "How many continents are there on Earth?",
        options: { A: "5", B: "6", C: "7", D: "8" },
        correct: "C",
        explanation: "There are 7 continents: Africa, Antarctica, Asia, Australia, Europe, North America, and South America.",
      },
    ],
    medium: [
      {
        question: "Which element has the chemical symbol 'Au'?",
        options: { A: "Silver", B: "Gold", C: "Aluminum", D: "Argon" },
        correct: "B",
        explanation: "Au comes from the Latin word 'aurum', meaning gold. Gold is a precious metal used throughout history.",
      },
    ],
    hard: [
      {
        question: "In which year did the Byzantine Empire officially fall?",
        options: { A: "1453", B: "1492", C: "1500", D: "1517" },
        correct: "A",
        explanation: "The Byzantine Empire fell in 1453 when Constantinople was captured by the Ottoman Empire under Mehmed II.",
      },
    ],
  },
  football: {
    easy: [
      {
        question: "How many players are on a football (soccer) team on the field?",
        options: { A: "9", B: "10", C: "11", D: "12" },
        correct: "C",
        explanation: "A football team has 11 players on the field, including the goalkeeper.",
      },
    ],
    medium: [
      {
        question: "Which country won the 2018 FIFA World Cup?",
        options: { A: "Brazil", B: "Germany", C: "France", D: "Argentina" },
        correct: "C",
        explanation: "France won the 2018 FIFA World Cup by defeating Croatia 4-2 in the final held in Russia.",
      },
    ],
    hard: [
      {
        question: "Which player scored the most goals in a single FIFA World Cup tournament?",
        options: { A: "Pele", B: "Just Fontaine", C: "Ronaldo", D: "Gerd Muller" },
        correct: "B",
        explanation: "Just Fontaine scored 13 goals in the 1958 World Cup, a record for a single tournament that still stands.",
      },
    ],
  },
  ai: {
    easy: [
      {
        question: "What does 'AI' stand for?",
        options: { A: "Automated Internet", B: "Artificial Intelligence", C: "Advanced Integration", D: "Algorithmic Index" },
        correct: "B",
        explanation: "AI stands for Artificial Intelligence, the simulation of human intelligence by machines.",
      },
    ],
    medium: [
      {
        question: "What is a neural network in machine learning?",
        options: { A: "A physical network of computers", B: "A series of algorithms that recognizes patterns in data", C: "A type of database", D: "A programming language" },
        correct: "B",
        explanation: "A neural network is a series of algorithms modeled after the human brain that identifies patterns and relationships in data.",
      },
    ],
    hard: [
      {
        question: "Which consensus mechanism does Ethereum use after 'The Merge'?",
        options: { A: "Proof of Work", B: "Proof of Stake", C: "Proof of Authority", D: "Proof of Burn" },
        correct: "B",
        explanation: "Ethereum transitioned from Proof of Work to Proof of Stake in September 2022 with 'The Merge', reducing energy consumption by ~99.95%.",
      },
    ],
  },
};

function getFallbackQuestion(category: string, difficulty: string) {
  const cat = FALLBACK_QUESTIONS[category] || FALLBACK_QUESTIONS.general;
  const diffs = cat[difficulty] || cat.easy;
  return diffs[Math.floor(Math.random() * diffs.length)];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { category, difficulty } = await req.json();

    if (!category || !difficulty) {
      return new Response(
        JSON.stringify({ error: "Missing category or difficulty" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const categoryDetail = CATEGORY_DETAILS[category] || CATEGORY_DETAILS.general;
    const difficultyName = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    const userMessage = `Generate a ${difficulty} difficulty question about ${category}.
Category details:
- ${categoryDetail}
Difficulty: ${difficultyName}`;

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");

    if (!apiKey) {
      // Fallback to built-in questions if no API key
      const question = getFallbackQuestion(category, difficulty);
      return new Response(
        JSON.stringify(question),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", errText);
      const question = getFallbackQuestion(category, difficulty);
      return new Response(
        JSON.stringify(question),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const text = data?.content?.[0]?.text || "";

    // Parse JSON from response, stripping any markdown fences
    let jsonText = text.trim();
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    try {
      const parsed = JSON.parse(jsonText);
      // Validate structure
      if (!parsed.question || !parsed.options || !parsed.correct) {
        throw new Error("Invalid question structure");
      }
      return new Response(
        JSON.stringify(parsed),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch {
      // Parse failed, use fallback
      const question = getFallbackQuestion(category, difficulty);
      return new Response(
        JSON.stringify(question),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to generate question" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
