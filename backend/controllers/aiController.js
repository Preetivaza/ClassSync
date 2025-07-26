import axios from "axios";
import Assignment from "../models/Assignment.js";


export const generateAssignment = async (req, res) => {
  try {
    const { topic, createdBy } = req.body;

    
    const response = await axios.post(
      "https://api.openai.com/v1/completions ",
      {
        prompt: `Generate 5 multiple-choice questions about ${topic}`,
        max_tokens: 100,
        model: "text-davinci-003",
        temperature: 0.7,
      },
      {
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      }
    );

    const questions = response.data.choices[0].text;

    
    const assignment = new Assignment({
      topic,
      questions: JSON.parse(questions), // Assuming the AI returns JSON
      createdBy,
    });
    await assignment.save();

    res.json(assignment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
