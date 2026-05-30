const axios = require('axios');
const { buildPrompts } = require('./promptBuilder');

const callWireAgent = async (agentId, promptText) => {
  const startTime = Date.now();
  
  try {
    // Assuming a standard Anakin Wire execution endpoint
    // Replace with the exact endpoint provided by Anakin API docs if different
    const url = `https://api.anakin.ai/v1/agents/${agentId}/run`;
    
    const response = await axios.post(url, {
      input: promptText,
      config: { timeout: 15000 }
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.ANAKIN_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 15000 // Ensure axios aborts if it takes > 15s
    });

    const latency = Date.now() - startTime;
    console.log(`[Wire API] Agent ${agentId} completed in ${latency}ms`);

    // Standardizing Anakin API response structure (adjust if actual API differs)
    const content = response.data?.choices?.[0]?.message?.content || response.data?.output || response.data;
    const model = response.data?.model || 'Anakin-Wire';

    return { content, model, latency_ms: latency };

  } catch (error) {
    const latency = Date.now() - startTime;
    console.error(`[Wire API] Agent ${agentId} failed after ${latency}ms:`, error.message);

    let errorMessage = 'Agent execution failed';
    if (error.response) {
      const status = error.response.status;
      if (status === 401) errorMessage = 'Unauthorized: Invalid Anakin API Key';
      else if (status === 429) errorMessage = 'Rate Limit Exceeded: Too many requests to Anakin Wire';
      else if (status === 503) errorMessage = 'Service Unavailable: Anakin Wire is currently down';
      else errorMessage = `Anakin API Error (${status})`;
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Timeout: Agent took longer than 15 seconds';
    }

    throw new Error(errorMessage);
  }
};

const runStudyWirePipeline = async (topic, subject, language) => {
  const prompts = buildPrompts(topic, subject, language);

  const agents = [
    { key: 'concept', id: process.env.ANAKIN_CONCEPT_AGENT_ID, prompt: prompts.concept },
    { key: 'analogy', id: process.env.ANAKIN_ANALOGY_AGENT_ID, prompt: prompts.analogy },
    { key: 'quiz', id: process.env.ANAKIN_QUIZ_AGENT_ID, prompt: prompts.quiz },
    { key: 'pyq', id: process.env.ANAKIN_PYQ_AGENT_ID, prompt: prompts.pyq },
    { key: 'studyPlan', id: process.env.ANAKIN_PLAN_AGENT_ID, prompt: prompts.studyPlan }
  ];

  // Rule: Run in PARALLEL using Promise.allSettled()
  const results = await Promise.allSettled(
    agents.map(agent => callWireAgent(agent.id, agent.prompt))
  );

  // Map results back to the requested structure, with graceful fallbacks
  const output = {};
  
  agents.forEach((agent, index) => {
    const result = results[index];
    if (result.status === 'fulfilled') {
      output[agent.key] = result.value;
      
      // Strict JSON parsing for quiz and studyPlan
      if (agent.key === 'quiz' || agent.key === 'studyPlan') {
        try {
          // Attempt to strip any accidental markdown blocks that the AI might have returned
          let rawContent = result.value.content;
          if (typeof rawContent === 'string') {
             rawContent = rawContent.replace(/^\\s*\`\`\`json/m, '').replace(/\`\`\`\\s*$/m, '').trim();
             output[agent.key].content = JSON.parse(rawContent);
          }
        } catch (e) {
          console.error(`Failed to parse strict JSON for ${agent.key}`, e);
          output[agent.key].content = agent.key === 'quiz' ? [] : []; // Fallback array
          output[agent.key].error = 'Failed to generate valid JSON format';
        }
      }
    } else {
      // Graceful fallback UI for failures
      const fallbackContent = agent.key === 'quiz' || agent.key === 'studyPlan' ? [] : `Unavailable: ${result.reason.message}`;
      output[agent.key] = {
        content: fallbackContent,
        model: 'Fallback',
        latency_ms: 0,
        error: result.reason.message
      };
    }
  });

  // Re-format for the exact API contract requested
  return {
    concept: output.concept,
    analogy: output.analogy,
    quiz: {
      questions: output.quiz.content || [],
      model: output.quiz.model,
      latency_ms: output.quiz.latency_ms
    },
    pyq: output.pyq,
    studyPlan: {
      days: output.studyPlan.content || [],
      model: output.studyPlan.model,
      latency_ms: output.studyPlan.latency_ms
    }
  };
};

module.exports = {
  runStudyWirePipeline
};
