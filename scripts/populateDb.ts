import { AstraDB } from "@datastax/astra-db-ts";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import 'dotenv/config';
import pdf from 'pdf-parse';
import OpenAI from 'openai';
import { SimilarityMetric } from "../app/hooks/useConfiguration";
import fs from 'fs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const { ASTRA_DB_APPLICATION_TOKEN, ASTRA_DB_API_ENDPOINT, ASTRA_DB_NAMESPACE } = process.env;

const astraDb = new AstraDB(ASTRA_DB_APPLICATION_TOKEN, ASTRA_DB_API_ENDPOINT, ASTRA_DB_NAMESPACE);

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

const similarityMetrics: SimilarityMetric[] = [
  'cosine',
  'euclidean',
  'dot_product',
];

const pdfPaths = [
  // 'scripts/dgca.pdf',
  // 'scripts/mango1.pdf',
  //  'scripts/mango2.pdf',
  //   'scripts/mango3.pdf',
  //    'scripts/Moringa_report.pdf',
  //     'scripts/RICE-TEXT.pdf',
  //     'scripts/rpto.pdf',
  //     'scripts/sesame.pdf',
  // Add more paths as needed
];

// const videoSuggestions = [
//   { url: 'https://www.youtube.com/watch?v=example1', title: 'Example Video 1' },
//   { url: 'https://www.youtube.com/watch?v=example2', title: 'Example Video 2' },
//   // Add more video suggestions as needed
// ];

// const imageSuggestions = [
//   { url: 'https://example.com/image1.jpg', title: 'Example Image 1' },
//   { url: 'https://example.com/image2.jpg', title: 'Example Image 2' },
//   // Add more image suggestions as needed
// ];

const createCollection = async (similarity_metric: SimilarityMetric = 'cosine') => {
  try {
    const res = await astraDb.createCollection(`chat_${similarity_metric}`, {
      vector: {
        dimension: 1536,
        metric: similarity_metric,
      }
    });
    console.log(res);
  } catch (e) {
    console.log(`chat_${similarity_metric} already exists`);
  }
};

const loadPDFData = async (pdfPath, similarity_metric: SimilarityMetric = 'cosine') => {
  const dataBuffer = fs.readFileSync(pdfPath);
  const data = await pdf(dataBuffer);

  const collection = await astraDb.collection(`chat_${similarity_metric}`);
  const chunks = await splitter.splitText(data.text);
  
  let i = 0;
  for await (const chunk of chunks) {
    const { data: embeddingData } = await openai.embeddings.create({ input: chunk, model: 'text-embedding-ada-002' });

    const res = await collection.insertOne({
      document_id: `${pdfPath}-${i}`,
      $vector: embeddingData[0]?.embedding,
      url: pdfPath,
      title: "PDF Document",
      content: chunk,
      // videoSuggestions,
      // imageSuggestions
    });
    i++;
  }
  console.log(`Data from ${pdfPath} loaded`);
};

const loadAllPDFs = async (similarity_metric: SimilarityMetric = 'cosine') => {
  for (const pdfPath of pdfPaths) {
    await loadPDFData(pdfPath, similarity_metric);
  }
};

similarityMetrics.forEach(metric => {
  createCollection(metric).then(() => loadAllPDFs(metric));
});
