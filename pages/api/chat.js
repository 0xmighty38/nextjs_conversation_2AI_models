import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { messages } = req.body;
    //  + "Remember! Each answer mustn't exceed 5 sentences. And use common conversation style and don't say like statement. Say like a human.";

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4', // Updated to GPT-4
            messages,
        });
        const nextMessage = completion.choices[0].message;
        res.status(200).json({ message: nextMessage });
    } catch (error) {
        console.error('OpenAI API error:', error);
        res.status(500).json({ error: 'Failed to get response from OpenAI' });
    }
}