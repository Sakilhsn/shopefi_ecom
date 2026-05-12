import OpenAI from "openai";
import fs from "fs";
 
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
 
// Tools
function addNumbers(a, b) {
  return  `${a}${b}`;
}
 
function saveFile(content) {
  fs.writeFileSync("bot.txt", content);
  return "File saved successfully";
}
 
export const chatbot = async (req, res) => {
  try {
    const { message } = req.body;
 
    const tools = [
      {
        type: "function",
        function: {
          name: "addNumbers",
          description: "Add two numbers",
          parameters: {
            type: "object",
            properties: {
              a: { type: "number" },
              b: { type: "number" },
            },
            required: ["a", "b"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "saveFile",
          description: "Save content into file",
          parameters: {
            type: "object",
            properties: {
              content: { type: "string" },
            },
            required: ["content"],
          },
        },
      },
    ];
 
    const messages = [
      {
        role: "system",
        content:
          "You are an AI assistant for Shopefi ecommerce website.",
      },
      {
        role: "user",
        content: message,
      },
    ];
 
    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages,
      tools,
    });
 console.log("OpenAI Response:", response);
    const msg = response.choices[0].message;
 
    // TOOL CALLS
    if (msg.tool_calls) {
      const toolCall = msg.tool_calls[0];
 
      // ADD NUMBERS
      if (toolCall.function.name === "addNumbers") {
        const args = JSON.parse(toolCall.function.arguments);
 
        const result = addNumbers(args.a, args.b);
 
        return res.json({
          reply: `Result: ${result}`,
        });
      }
 
      // SAVE FILE
      if (toolCall.function.name === "saveFile") {
        const args = JSON.parse(toolCall.function.arguments);
 
        const result = saveFile(args.content);
 
        return res.json({
          reply: result,
        });
      }
    }
 
    // NORMAL RESPONSE
    res.json({
      reply: msg.content,
    });
  } catch (error) {
    console.log(error);
 
    res.status(500).json({
      error: "Something went wrong",
    });
  }
};