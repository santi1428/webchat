import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generateResponseSuggestions = async (
  p: Array<string>
): Promise<string> => {
  const prompt = [
    'We have a chat with user A and user B. Return three suggestions for a response with a limit of 20 characters each suggestion. Don\'t use any especial separator or break line, only plain answers in Array format using JSON. Example: ["suggestion 1", "suggestion 2", "suggestion 3"]',
    ...p,
  ];
  const result = await model.generateContent(prompt);
  return result.response.text();
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const session = await getServerSession(req, res, authOptions);
  // if (session) {
  try {
    if (req.method === "GET") {
      const { prompt } = req.query as { prompt: string };
      const promptArray = prompt.split("||");
      const response: string = await generateResponseSuggestions(promptArray);
      return res.status(200).json({ response });
    } else if (req.method === "DELETE") {
      //   await deleteUserNotification(req, res, session);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).end();
  }
  // } else {
  //   res.status(401).end();
  // }
}
