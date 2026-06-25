export interface GeneratedQuestion {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correct: string;
  explanation: string;
}

export async function generateQuestion(
  category: string,
  difficulty: string,
  retry = true
): Promise<GeneratedQuestion> {
  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-question`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (import.meta.env.VITE_SUPABASE_ANON_KEY) {
    headers['Authorization'] = `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`;
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ category, difficulty }),
    });

    if (!response.ok) {
      throw new Error(`Request failed (${response.status})`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    // Validate structure
    if (!data.question || !data.options || !data.correct) {
      throw new Error('Invalid question format');
    }

    return data as GeneratedQuestion;
  } catch (err) {
    if (retry) {
      // Auto-retry once
      return generateQuestion(category, difficulty, false);
    }
    throw err;
  }
}
