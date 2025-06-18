import { Etablissement } from "@/models/Etablissement";
import { ApiService } from "@/services/APIService";
import { defineStore } from "pinia";
import { ref } from "vue";

const api = new ApiService('http://localhost:4173/api');

export const useEtablissementStore = defineStore('etablissement', () => {
    const etablissements = ref<Etablissement[]>([])
    const fetchEtablissements = async() => {
        const etablissementsFound = await api.get<Etablissement[]>('/etablissements');
        if(etablissementsFound && etablissementsFound.data){
            etablissements.value = etablissementsFound.data;
        }
    }

    const updateEtablissement = async (id: string) => {
        if(etablissements.value.length === 0 || !id){
            return null;
        }
        let etablissementToUpdate = etablissements.value.find(etablissement => etablissement.id === id);
        try {
            await api.put(`/etablissements/${id}`, etablissementToUpdate);
        } catch (error) {
            console.log(error);
        }
    }

    const deleteEtablissement = async (id: string) => {
        if(etablissements.value.length === 0 || !id){
            return null;
        }
        try {
            await api.delete(`/etablissements/${id}`);
            etablissements.value = etablissements.value.filter(etablissement => etablissement.id !== id);
        } catch (error) {
          console.log(error);  
        }
    }

    const addEtablissement = async (etablissementData: Partial<Etablissement>) => {
        try {
            const response = await api.post<Etablissement>(`/etablissements`, etablissementData);
            if (response && response.data) {
                await fetchEtablissements(); // Refresh the list after adding
            }
            return response.data;
        } catch (error) {
            console.error('Error adding etablissement:', error);
            throw error;
        }
    };

    const findEtablissement = (id: string) => {
        if(etablissements.value.length === 0 || !id){
            return null;
        }
        return etablissements.value.find(etablissement => etablissement.id === id);
    }

    return{etablissements, fetchEtablissements, findEtablissement, updateEtablissement, deleteEtablissement, addEtablissement};
})
