import { chartCache } from './cache';

const queue = [];
let processing = false;
const MAX_RETRIES = 3;
const BATCH_SIZE = 5; // Processa 5 requisições por vez
const BATCH_INTERVAL = 5000; // Espera 5 segundos entre lotes

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(url, retries = 0) {
  try {
    const response = await fetch(url);
    
    if (response.status === 429) {
      // Se atingiu o limite, espera mais tempo antes de tentar novamente
      const waitTime = (retries + 1) * 10000; // Aumenta o tempo de espera progressivamente
      await delay(waitTime);
      if (retries < MAX_RETRIES) {
        return fetchWithRetry(url, retries + 1);
      }
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (retries < MAX_RETRIES) {
      await delay(2000 * (retries + 1));
      return fetchWithRetry(url, retries + 1);
    }
    throw error;
  }
}

export async function processQueue() {
  if (processing) return;
  processing = true;

  while (queue.length > 0) {
    const batch = queue.splice(0, BATCH_SIZE);
    const batchPromises = batch.map(async ({ url, resolve, reject }) => {
      try {
        // Verifica o cache primeiro
        const cachedData = chartCache.get(url);
        if (cachedData) {
          resolve(cachedData);
          return;
        }

        const data = await fetchWithRetry(url);
        
        // Armazena no cache
        chartCache.set(url, data);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });

    await Promise.allSettled(batchPromises);
    
    if (queue.length > 0) {
      await delay(BATCH_INTERVAL);
    }
  }

  processing = false;
}

export function queueRequest(url) {
  // Verifica o cache primeiro
  const cachedData = chartCache.get(url);
  if (cachedData) {
    return Promise.resolve(cachedData);
  }

  return new Promise((resolve, reject) => {
    queue.push({ url, resolve, reject });
    processQueue();
  });
} 