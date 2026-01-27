<template>
  <div class="view-container">
    <SurveyForm
    title="Sondage"
    :questions="questions"
    />
  </div>
</template>

<script setup>
import SurveyForm from '@/components/forms/public/SurveyForm.vue';

const questions = [
  { id: 'q1', type: 'text', label: 'Quel est votre nom ?', required: true },
  { id: 'q2', type:'text', label:'Quel est votre prénom ?', required: true },
  { id: 'q3', type: 'email', label: 'Votre adresse email', required: true },
  { id: 'q4', type:'text', label:'Quel est votre profession', required: false },
  { id: 'q5', type: 'rating', label: 'Notez notre service', scale: 5, required: true },
  { id: 'q6', type: 'textarea', label: 'Commentaires', required: false }
];
</script>

<style scoped>
.view-container {
  padding: 2rem 0;
}
</style>