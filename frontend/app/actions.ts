'use server'
import * as cheerio from 'cheerio';
import axios from 'axios';
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const pcak = process.env.PINECONE_API_KEY as string;

export async function scrapeDataFromWeb(url: string) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Extract relevant information from the page
    const professor = $('div.NameTitle__Name-dowf0z-0.cfjPUG').text().trim();
    const subject = $('a.TeacherDepartment__StyledDepartmentLink-fl79e8-0').text().trim();
    const stars = $('div.RatingValue__Numerator-qw8sqy-2').first().text().trim();
    // there are a lot of reviews so i just picked the first one
    const review = $('div.Comments__StyledComments-dzzyvm-0').first().text().trim();


    console.log("professor,", professor)
    console.log("subject,", subject)
    console.log("stars,", stars)
    console.log("review,", review)
    // Create an embedding for the scraped data
    const openai = new OpenAI();
    const text = `${professor} is a professor in the ${subject} department with an overall quality rating of ${stars} and here is a review on their teaching: ${review}.`;
    const embedding = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
      encoding_format: 'float',
    });

    // Store the embedding in Pinecone
    const pc = new Pinecone({ apiKey: pcak });
    const index = pc.index('rag').namespace('ns1');
    await index.upsert([{
      id: professor,
      values: embedding.data[0].embedding,
      metadata: {
        subject,
        stars,
        review,
      },
    }]);

    // Return a success message
    return { 
      success: true, 
      message: `**Found some information about Professor:** \n\n- **Name**: ${professor} \n- **Subject**: ${subject} \n- **Stars**: ${stars} \n- **Review**: ${review}. \n\n*Send another url to find relevant information. Use the text mode to find similar professors too!*` 
    };
    } catch (error) {
    console.error('Error scraping data:', error);
    // Throw an error that can be caught and handled by the client
    throw new Error('Failed to scrape and store data');
  }
}