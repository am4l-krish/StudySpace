const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

const SYSTEM_SOCRATIC = `You are an AI study buddy inside StudySpace, a Solo Leveling themed student productivity app.
Your personality is sharp, encouraging, and slightly dramatic — like a dungeon master who wants the student to level up.

You teach using the Socratic method: never give answers directly. Ask questions that guide the student to the answer themselves.

When a student gives you a topic or pastes notes:
1. Summarize the topic in 2-3 sentences
2. Identify 3-5 core concepts they need to master
3. Ask ONE opening question to begin the session

Rules:
- Always end your message with exactly one question
- Never ask two questions at once
- Keep responses under 150 words
- Use Solo Leveling flavor occasionally (e.g. "Hunter", "Level up", "Dungeon", "Arise")`;

const SYSTEM_SUMMARY = `You are evaluating a student's Socratic study session inside StudySpace, a Solo Leveling themed app.
Respond ONLY with valid JSON. No markdown, no backticks, no explanation outside the JSON.

Return this exact shape:
{
  "score": <number 0-100>,
  "rank": <"E" | "D" | "C" | "B" | "A" | "S">,
  "strong": ["concept1", "concept2"],
  "weak": ["concept1"],
  "tip": "<one actionable improvement tip, under 20 words>",
  "message": "<short Solo Leveling flavored motivational message, under 25 words>"
}

Score rubric:
- 80-100 → S or A rank
- 60-79  → B or C rank
- 40-59  → D rank
- 0-39   → E rank`;

const callGroq = async (apiKey, messages, temperature = 0.7, max_tokens = 350) => {
  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({ model: MODEL, messages, max_tokens, temperature })
  });
  if (!res.ok) throw new Error(`Groq API error: ${res.status}`);
  const data = await res.json();
  return data.choices[0].message.content;
};

export const initSession = async (apiKey, topic) => {
  const messages = [
    { role: "system", content: SYSTEM_SOCRATIC },
    { role: "user", content: `My study topic: ${topic}` }
  ];
  return await callGroq(apiKey, messages);
};

export const continueSession = async (apiKey, topic, history, studentReply) => {
  const messages = [
    { role: "system", content: SYSTEM_SOCRATIC },
    { role: "user", content: `Topic: ${topic}` },
    ...history,
    { role: "user", content: studentReply }
  ];
  return await callGroq(apiKey, messages);
};

export const endSession = async (apiKey, topic, history) => {
  const transcript = history
    .map(m => `${m.role === "user" ? "Student" : "Tutor"}: ${m.content}`)
    .join("\n");

  const messages = [
    { role: "system", content: SYSTEM_SUMMARY },
    { role: "user", content: `Topic: ${topic}\n\nSession transcript:\n${transcript}` }
  ];

  const raw = await callGroq(apiKey, messages, 0.3, 400);
  try {
    return JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("Failed to parse session summary");
  }
};