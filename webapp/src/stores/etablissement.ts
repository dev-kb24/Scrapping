import { Etablissement } from "@/models/Etablissement";
import { ApiService } from "@/services/APIService";
import { defineStore } from "pinia";
import { ref } from "vue";

const api = new ApiService('http://localhost:8000/api');

export const useEtablissementStore = defineStore('etablissement', () => {
    const etablissements = ref<Etablissement[]>([])
    const fetchEtablissements = async() => {
        const etablissementsFound = await api.get<Etablissement[]>('/etablissements');
        if(etablissementsFound && etablissementsFound.data){
            etablissements.value = etablissementsFound.data;
        }
    }

    return{etablissements, fetchEtablissements};
})