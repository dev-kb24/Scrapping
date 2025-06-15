import { Scrape } from "@/models/Scrape";
import { ApiService } from "@/services/APIService";
import { defineStore } from "pinia";
import { ref } from "vue";

const api = new ApiService('http://localhost:4173/api');

export const useScrapeStore = defineStore('scrape', () => {
  const scrapes = ref<Scrape[]>([]);

  const fetchScrapes = async () => {
    const found = await api.get<Scrape[]>('/scrape');
    if (found && found.data) {
      scrapes.value = found.data;
    }
  };

  const deleteScrape = async (id: string) => {
    try {
      await api.delete(`/scrape/${id}`);
      scrapes.value = scrapes.value.filter(scrape => scrape.id !== id);
    } catch (error) {
      console.log(error);
    }
  };

  const addScrape = async (scrapeData: Partial<Scrape>) => {
    try {
      const response = await api.post<Scrape>(`/scrape`, scrapeData);
      if (response && response.data) {
        await fetchScrapes(); // Refresh the list after adding
      }
      return response.data;
    } catch (error) {
      console.error('Error adding scrape:', error);
      throw error;
    }
  };

  return { scrapes, fetchScrapes, deleteScrape, addScrape };
});
