import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";
import { start } from "repl";

const systemPrompt = 
`
You are a virtual assistant designed to help students find professors based on their queries. You use data stored in Pinecone and employ Retrieval-Augmented Generation (RAG) to provide the top 3 professors that best match the user’s query. Your goal is to assist students by offering accurate and helpful information about professors.

Instructions:

Greeting: Start by greeting the user and asking how you can assist them.
Understanding the Query: Carefully analyze the user’s query to understand their requirements.
Data Retrieval: Use Pinecone to retrieve relevant data about professors based on the user’s query.
RAG Implementation: Apply Retrieval-Augmented Generation (RAG) to generate a response that includes the top 3 professors matching the query.
Response: Provide the user with the names and relevant details of the top 3 professors.
Follow-up: Ask if the user needs any further assistance or information.
Example Interaction:

User: Hi, I’m looking for a professor who teaches computer science and has good ratings. Agent: Hello! I’d be happy to help you find a professor. Based on your query, here are the top 3 professors who teach computer science and have excellent ratings:

Professor John Doe - Rating: 4.8/5
Professor Jane Smith - Rating: 4.7/5
Professor Emily Johnson - Rating: 4.6/5
Is there anything else I can assist you with?

`

const pcak = process.env.PINECONE_API_KEY as string;

export async function POST(request: Request) {
    const data = await request.json();
    const pc = new Pinecone({
        apiKey: pcak,
    });
    const index = pc.index('rag').namespace('ns1')
    const openai = new OpenAI()

    // this is the last conversation
    const text = data[data.length - 1].content
    const embedding = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
        encoding_format: 'float',
    })

    const results = await index.query({
        // top k means how many results we want
        topK: 3,
        includeMetadata: true,
        vector: embedding.data[0].embedding
    })

    let resultString = '\n\nReturned Results from Vector Database (done automatically):'

    results.matches.forEach((match: any) => {
        resultString += `

        Professor: ${match.id}
        Review: ${match.metadata.stars}
        Subject: ${match.metadata.subject}
        Stars: ${match.metadata.stars}
        \n\n

        `
    })

   const lastMessage = data[data.length - 1] 
   const lastMessageContent = lastMessage.content + resultString
   const lastDataWithoutLastMessage = data.slice(0, data.length - 1)
   const completion = await openai.chat.completions.create({
       model: 'gpt-4o-mini',
       stream: true,
       messages: [
           { role: 'system', content: systemPrompt },
           ...lastDataWithoutLastMessage,
           { role: 'user', content: lastMessageContent },
       ],

   })

   const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      try {
        for await (const chunk of completion) {
          const content = chunk.choices[0].delta?.content
          if (content) {
            const boldedContent = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            const text = encoder.encode(boldedContent)
            controller.enqueue(text)
          }
        }
      } catch (error) {
        controller.error(error)
      } finally {
        controller.close()
      }
    }
  })
  
  return new NextResponse(stream)
}

