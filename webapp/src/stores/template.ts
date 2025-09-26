import { Template } from "@/models/Template";
import { ApiService } from "@/services/APIService";
import { defineStore } from "pinia";
import { ref } from "vue";

const api = new ApiService('http://localhost:8000/api');

export const useTemplateStore = defineStore('template', () => {
  const templates = ref<Template[]>([]);

  const fetchTemplates = async () => {
    const response = await api.get<Template[]>('/templates');
    if (response && response.data) {
      templates.value = response.data;
    }
  };

  const addTemplate = async (templateData: Partial<Template>) => {
    const response = await api.post<Template>('/templates', templateData);
    if (response && response.data) {
      await fetchTemplates();
    }
    return response.data;
  };

  const updateTemplate = async (id: number, templateData: Partial<Template>) => {
    await api.put(`/templates/${id}`, templateData);
    await fetchTemplates();
  };

  const deleteTemplate = async (id: number) => {
    await api.delete(`/templates/${id}`);
    templates.value = templates.value.filter(t => t.id !== id);
  };

  return { templates, fetchTemplates, addTemplate, updateTemplate, deleteTemplate };
});