const buildPrompts = (topic, subject, language) => {
  const isHinglish = language === 'hi';
  const languageInstruction = isHinglish
    ? 'You MUST respond in Hinglish (Hindi written in English script, mixing English and Hindi naturally). Use relatable tone.'
    : 'You MUST respond in clear, simple English suitable for a university student.';

  return {
    concept: `
You are a Computer Science professor explaining the topic "${topic}" for the subject "${subject}".
${languageInstruction}
Provide a structured, easy-to-understand explanation using markdown. Include bullet points if necessary.
Limit your response to 200-300 words. Do not use analogies here.
    `.trim(),

    analogy: `
You are a creative tutor explaining the CS topic "${topic}" for the subject "${subject}".
${languageInstruction}
You MUST use ONLY Indian references — chai, cricket, railway, dhabas, Bollywood, jugaad, etc.
Provide exactly ONE brilliant real-life analogy that makes this complex CS topic instantly clear to an Indian student.
Format in markdown.
    `.trim(),

    quiz: `
You are an examiner creating a quiz on the CS topic "${topic}" for the subject "${subject}".
${languageInstruction}
Generate exactly 5 multiple-choice questions testing core understanding of the topic.
You MUST return STRICT JSON and ONLY JSON. Do not include markdown formatting or backticks around the JSON.
The JSON must be an array of exactly 5 objects, where each object has these exact keys:
"q" (the question string),
"options" (an array of exactly 4 string options),
"answer" (a 0-indexed integer 0, 1, 2, or 3 representing the correct option index).
    `.trim(),

    pyq: `
You are a seasoned examiner analyzing Previous Year Questions (PYQs) for the CS topic "${topic}" in "${subject}".
${languageInstruction}
Describe the common patterns in how this topic is tested in Indian university exams. Mention common question types, edge cases usually asked, and standard derivations or numericals if applicable.
Format in markdown. Limit to 150-200 words.
    `.trim(),

    studyPlan: `
You are an academic planner creating a 3-day revision plan for the CS topic "${topic}" in "${subject}".
${languageInstruction}
You MUST return STRICT JSON and ONLY JSON. Do not include markdown formatting or backticks around the JSON.
The JSON must be an array of exactly 3 objects (one for each day), where each object has these exact keys:
"day" (an integer, e.g., 1, 2, 3),
"focus" (a short string describing the day's main goal),
"tasks" (an array of 3-4 specific, actionable study task strings).
    `.trim()
  };
};

module.exports = {
  buildPrompts
};
