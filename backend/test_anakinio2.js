const axios = require('axios');
const test = async () => {
  try {
    const res = await axios.post('https://api.anakin.io/v1/search', {
      prompt: "Explain deadlock in OS simply"
    }, {
      headers: {
        'X-API-Key': 'ask_efc36ab83b28c67b6c051ac6dd3a2162de9ac2097fc2eebe38f8fe8c894d5801',
        'Content-Type': 'application/json'
      }
    });
    console.log("SUCCESS:", JSON.stringify(res.data, null, 2));
  } catch (e) {
    console.log("ERROR:", e.response ? e.response.data : e.message);
  }
};
test();
