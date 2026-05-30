const axios = require('axios');
const test = async () => {
  try {
    const res = await axios.post('https://api.anakin.ai/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: [{role: "user", content: "Hello"}]
    }, {
      headers: {
        'Authorization': 'Bearer ask_efc36ab83b28c67b6c051ac6dd3a2162de9ac2097fc2eebe38f8fe8c894d5801',
        'Content-Type': 'application/json'
      }
    });
    console.log("SUCCESS:", res.data);
  } catch (e) {
    console.log("ERROR:", e.response ? e.response.data : e.message);
  }
};
test();
