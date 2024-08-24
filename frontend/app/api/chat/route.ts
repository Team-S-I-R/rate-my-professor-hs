import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";
import { start } from "repl";
import fetch from 'node-fetch';

(global as any).fetch = fetch;

const systemPrompt = `
You are a virtual assistant designed to help students with their queries. Your goal is to provide accurate and helpful information based on the user's questions, whether they are about professors, courses, or general academic advice.

Instructions:

1. Greeting: Start by greeting the user and asking how you can assist them.
2. Understanding the Query: Carefully analyze the user's query to understand their requirements.
3. Provide Information: Respond to the user's questions with relevant information, whether it pertains to professors, courses, or general academic topics.
4. Follow-up: Ask if the user needs any further assistance or information.

Important:
- Do not use any markdown formatting in your responses.
- Use '\n' to create new lines for better organization and readability.
- Structure your response with clear sections and line breaks.

Example Interaction:

User: Hi, I'm looking for a good professor for my computer science class.
Agent: Hello! I'd be happy to help you with that. I can provide information about professors, courses, or any other academic-related queries you might have. What specific information are you looking for?
`

const pcak = process.env.PINECONE_API_KEY as string;

export async function POST(request: Request) {
    const data = await request.json();
    const pc = new Pinecone({
        apiKey: pcak,
    });
    const index = pc.index('rag').namespace('ns1');
    const openai = new OpenAI();

    const text = data[data.length - 1].content;

    // Check for general greetings or non-specific queries
    if (text.toLowerCase().includes("hi") || text.toLowerCase().includes("hello")) {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: text },
            ],
        });
        return new NextResponse(response.choices[0].message.content);
    }

    const embedding = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
        encoding_format: 'float',
    });

    const results = await index.query({
        topK: 3,
        includeMetadata: true,
        vector: embedding.data[0].embedding,
    });

    let resultString = '\n\nReturned Results from Vector Database (done automatically):';

    results.matches.forEach((match: any) => {
        resultString += `
        Professor: ${match.id}
        Review: ${match.metadata.stars}
        Subject: ${match.metadata.subject}
        Stars: ${match.metadata.stars}
        \n\n
        `;
    });

    const lastMessageContent = text + resultString;
    const lastDataWithoutLastMessage = data.slice(0, data.length - 1);
    const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        stream: true,
        messages: [
            { role: 'system', content: systemPrompt },
            ...lastDataWithoutLastMessage,
            { role: 'user', content: lastMessageContent },
        ],
    });

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();
            try {
                for await (const chunk of completion) {
                    const content = chunk.choices[0].delta?.content;
                    if (content) {
                        const cleanedContent = content.replace(/\*/g, '');
                        const text = encoder.encode(cleanedContent);
                        controller.enqueue(text);
                    }
                }
            } catch (error) {
                controller.error(error);
            } finally {
                controller.close();
            }
        }
    });
    return new NextResponse(stream);
}