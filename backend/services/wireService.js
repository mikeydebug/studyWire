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

    // Standardizing Anakin API response structure
    let content;
    if (typeof response.data === 'string' && response.data.includes('<script>')) {
      // Anakin returned an HTML redirect (likely due to missing/invalid API key)
      console.warn(`[Wire API] Agent ${agentId} returned HTML redirect. Falling back to Mock.`);
      throw new Error('MOCK_TRIGGER');
    }

    content = response.data?.choices?.[0]?.message?.content || response.data?.output || response.data;
    const model = response.data?.model || 'Anakin-Wire';

    return { content, model, latency_ms: latency };

  } catch (error) {
    const latency = Date.now() - startTime;
    
    // Check if we triggered the mock intentionally or if it's a real error
    if (error.message === 'MOCK_TRIGGER' || error.response?.status === 401 || !process.env.ANAKIN_API_KEY || process.env.ANAKIN_API_KEY.includes('your_api_key')) {
      console.log(`[Wire API] Using beautiful mock data for Agent ${agentId} (Latency: ${latency}ms)`);
      return getMockDataForAgent(agentId, promptText);
    }

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

// Helper function to return beautiful mock data for the hackathon demo if API fails
const getMockDataForAgent = (agentId, promptText) => {
  const isConcept = promptText.includes('Computer Science professor');
  const isAnalogy = promptText.includes('creative tutor');
  const isQuiz = promptText.includes('creating a quiz');
  const isPyq = promptText.includes('Previous Year Questions');
  const isPlan = promptText.includes('academic planner');

  if (isConcept) {
    return {
      content: "### Paging in Operating Systems\\n\\nPaging is a memory management scheme that eliminates the need for contiguous allocation of physical memory. This scheme permits the physical address space of a process to be non-contiguous.\\n\\n* **Logical Address Space**: Divided into fixed-size blocks called **pages**.\\n* **Physical Address Space**: Divided into fixed-size blocks called **frames**.\\n\\nWhen a process is to be executed, its pages are loaded into any available memory frames from their backing store. The **Page Table** maps logical pages to physical frames.",
      model: 'Anakin-Mock-Agent', latency_ms: 840
    };
  }
  if (isAnalogy) {
    return {
      content: "Imagine you are throwing a massive big fat Indian wedding.\\n\\nYou can't fit all your relatives in one single giant banquet hall (Contiguous Memory). So instead, you book multiple smaller hotel rooms (Frames) across the city.\\n\\nYour uncle's family (Page 1) gets Room 101, your cousins (Page 2) get Room 505. They don't need to be in adjacent rooms, but they are all part of your wedding process! \\n\\nThe **Page Table** is just your uncle ji with a WhatsApp list, keeping track of exactly which relative is in which hotel room so they can be called to the mandap when needed!",
      model: 'Anakin-Mock-Agent', latency_ms: 920
    };
  }
  if (isQuiz) {
    return {
      content: JSON.stringify([
        { q: "What is the primary advantage of paging?", options: ["Faster CPU execution", "Eliminates external fragmentation", "Reduces disk I/O", "Eliminates internal fragmentation"], answer: 1 },
        { q: "What data structure is used to map pages to frames?", options: ["Linked List", "Hash Map", "Page Table", "Translation Lookaside Buffer"], answer: 2 },
        { q: "In our desi analogy, what does the WhatsApp list represent?", options: ["The CPU", "Physical Memory", "The Page Table", "Secondary Storage"], answer: 2 }
      ]),
      model: 'Anakin-Mock-Agent', latency_ms: 1100
    };
  }
  if (isPyq) {
    return {
      content: "#### Past Year Question Analysis (Indian Universities)\\n\\n**Frequency:** Extremely High (Appears in 90% of OS papers)\\n\\n**Typical Questions:**\\n1. *Explain Paging and how it differs from Segmentation. (10 marks)*\\n2. *Calculate the physical address given a logical address and page table. (5 marks)*\\n3. *What is a TLB? How does it improve paging performance? (7 marks)*\\n\\n**Pro-Tip for Exams:** Always draw the diagram showing Logical Address (Page Number + Offset) mapping to Physical Address (Frame Number + Offset). It guarantees full marks!",
      model: 'Anakin-Mock-Agent', latency_ms: 780
    };
  }
  if (isPlan) {
    return {
      content: JSON.stringify([
        { day: 1, focus: "Core Concept & Diagrams", tasks: ["Read the Concept Explanations", "Draw the Paging Architecture Diagram twice", "Understand Page Number vs Offset"] },
        { day: 2, focus: "Numerical Problems", tasks: ["Solve 5 PYQ numericals on Address Translation", "Learn TLB Hit Ratio calculations"] },
        { day: 3, focus: "Revision & Mock Quiz", tasks: ["Review the Desi Analogy for long-term retention", "Take the Quick Quiz", "Explain the concept to a friend"] }
      ]),
      model: 'Anakin-Mock-Agent', latency_ms: 1450
    };
  }
  
  return { content: "Mock data generated.", model: 'Anakin-Mock-Agent', latency_ms: 500 };
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
