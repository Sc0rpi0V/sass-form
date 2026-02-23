<template>
  <form @submit.prevent="onSubmit" class="form-container">
    <h2 class="form-title">Demande de projet</h2>
    <p class="form-description">
      Parlez-nous de votre projet et nous vous recontacterons dans les meilleurs délais.
    </p>

    <div class="form-section">
      <h3 class="section-title">Vos informations</h3>
      <BaseInput 
        id="company" 
        label="Entreprise" 
        :model-value="formData.company" 
        placeholder="Nom de votre entreprise"
        required 
        :error="getError('company')" 
        @update:model-value="handleInput('company', $event)"
        @blur="handleBlur('company')" 
      />

      <BaseInput 
        id="lastName" 
        label="Nom du contact" 
        :model-value="formData.lastName" 
        placeholder="Votre nom" 
        required
        :error="getError('lastName')" 
        @update:model-value="handleInput('lastName', $event)"
        @blur="handleBlur('lastName')" 
      />
      <BaseInput 
        id="firstName" 
        label="Prénom du contact" 
        :model-value="formData.firstName" 
        placeholder="Votre prénom"
        required :error="getError('firstName')" 
        @update:model-value="handleInput('firstName', $event)"
        @blur="handleBlur('firstName')" 
      />

      <BaseInput 
        id="email" 
        type="email" 
        label="Email" 
        :model-value="formData.email" 
        placeholder="votre@email.com"
        required :error="getError('email')" 
        @update:model-value="handleInput('email', $event)"
        @blur="handleBlur('email')" 
      />

      <BaseInput 
        id="phone" 
        type="tel" 
        label="Téléphone" 
        :model-value="formData.phone" 
        placeholder="06 12 34 56 78"
        required :error="getError('phone')" 
        @update:model-value="handleInput('phone', $event)"
        @blur="handleBlur('phone')" 
      />
    </div>

    <div class="form-section">
      <h3 class="section-title">Votre projet</h3>
      <BaseSelect 
        id="projectType" 
        label="Type de projet" 
        :model-value="formData.projectType"
        placeholder="Sélectionnez le type de projet" 
        :options="projectTypeOptions" 
        required
        :error="getError('projectType')" 
        @update:model-value="handleInput('projectType', $event)"
        @blur="handleBlur('projectType')" 
      />
      <BaseSelect 
        id="budget" 
        label="Budget estimé" 
        :model-value="formData.budget"
        placeholder="Sélectionnez une fourchette" 
        :options="budgetOptions" 
        required 
        :error="getError('budget')"
        @update:model-value="handleInput('budget', $event)" 
        @blur="handleBlur('budget')" 
      />
      <BaseSelect 
        id="timeline" 
        label="Délai souhaité" 
        :model-value="formData.timeline"
        placeholder="Quand souhaitez-vous démarrer ?" 
        :options="timelineOptions" 
        required 
        :error="getError('timeline')"
        @update:model-value="handleInput('timeline', $event)" 
        @blur="handleBlur('timeline')" 
      />
      <BaseTextarea 
        id="description" 
        label="Description du projet" 
        :model-value="formData.description"
        placeholder="Décrivez votre projet, vos objectifs et vos besoins..." 
        :rows="8" 
        required
        :error="getError('description')" 
        @update:model-value="handleInput('description', $event)"
        @blur="handleBlur('description')" 
      />
    </div>

    <div v-for="item in legalItems" :key="item.key" class="legal-section">
      <BaseCheckbox 
        :id="item.key" 
        :label="item.label" 
        :model-value="formData[item.key]" 
        required
        :error="getError(item.key)" 
        @update:model-value="handleInput(item.key, $event)" 
        @blur="handleBlur(item.key)" 
      />
      <BaseButton 
        type="button" 
        variant="outline" 
        @click="openModal(item.key)"
      >
        {{ item.buttonLabel }}
      </BaseButton>
    </div>

    <component 
      :is="activeModalComponent" 
      v-if="activeModalComponent" 
      @close="closeModal" 
    />

    <div 
      v-if="submitError" 
      class="alert alert-error"
    >
      {{ submitError }}
    </div>
    <div 
      v-if="submitSuccess" 
      class="alert alert-success"
    >
      Votre demande a été envoyée avec succès ! Nous vous
      recontacterons rapidement.
    </div>

    <div class="form-actions">
      <BaseButton 
        type="submit" 
        :loading="isSubmitting"
      >
        Envoyer la demande
      </BaseButton>

      <BaseButton 
        type="button" 
        variant="outline" 
        @click="resetForm"
      >
        Réinitialiser
      </BaseButton>
    </div>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useForm } from '@/composables/forms/useForm';
import { useSubmissions } from '@/composables/submissions/useSubmissions';
import { validators } from '@/utils/validators';
import BaseInput from '@/components/ui/base/BaseInput.vue';
import BaseSelect from '@/components/ui/base/BaseSelect.vue';
import BaseTextarea from '@/components/ui/base/BaseTextarea.vue';
import BaseButton from '@/components/ui/base/BaseButton.vue';
import BaseCheckbox from '@/components/ui/base/BaseCheckbox.vue';
import CGUModal from '@/components/ui/modals/CGUModal.vue';
import CGVModal from '@/components/ui/modals/CGVModal.vue';
import PolicyModal from '@/components/ui/modals/PolicyModal.vue';
import { useCGU } from '@/composables/cgu/useCGU';
import { useCGV } from '@/composables/cgv/useCGV';
import { usePolicy } from '@/composables/policy/usePolicy';

const { activeVersion: activeCGU } = useCGU();
const { activeVersion: activeCGV } = useCGV();
const { activeVersion: activePolicy } = usePolicy();

const legalConfig = {
  cgu: { 
    label: "J'accepte les conditions générales d'utilisation", 
    buttonLabel: 'Lire les CGU', 
    modal: CGUModal, 
    isActive: () => !!activeCGU.value 
    },
  cgv: { 
    label: "J'accepte les conditions générales de vente", 
    buttonLabel: 'Lire les CGV', 
    modal: CGVModal, 
    isActive: () => !!activeCGV.value 
  },
  policy: { 
    label: "J'accepte la politique de confidentialité", 
    buttonLabel: 'Lire la politique de confidentialité', 
    modal: PolicyModal, 
    isActive: () => !!activePolicy.value 
}
};

const legalItems = computed(() => Object.entries(legalConfig).filter(([, cfg]) => cfg.isActive()).map(([key, cfg]) => ({ key, ...cfg })));
const openModalKey = ref(null);
const openModal = (key) => { openModalKey.value = key; };
const closeModal = () => { openModalKey.value = null; };
const activeModalComponent = computed(() => openModalKey.value ? legalConfig[openModalKey.value]?.modal ?? null : null);

const projectTypeOptions = [
  { value: 'website', label: 'Site web' },
  { value: 'webapp', label: 'Application web' },
  { value: 'mobile', label: 'Application mobile' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'other', label: 'Autre' }
];
const budgetOptions = [
  { value: '0-5k', label: 'Moins de 5 000 €' },
  { value: '5k-10k', label: '5 000 € - 10 000 €' },
  { value: '10k-25k', label: '10 000 € - 25 000 €' },
  { value: '25k-50k', label: '25 000 € - 50 000 €' },
  { value: '50k+', label: 'Plus de 50 000 €' }
];
const timelineOptions = [
  { value: 'urgent', label: 'Urgent (moins d\'1 mois)' },
  { value: '1-3months', label: '1 à 3 mois' },
  { value: '3-6months', label: '3 à 6 mois' },
  { value: '6months+', label: 'Plus de 6 mois' },
  { value: 'flexible', label: 'Flexible' }
];

const initialValues = { 
  company: '', 
  lastName: '', 
  firstName: '', 
  email: '', 
  phone: '', 
  projectType: '', 
  budget: '', 
  timeline: '', 
  description: '', 
  cgu: false, 
  cgv: false, 
  policy: false 
};
const validationRules = { 
  company: [validators.required, validators.minLength(2)], 
  lastName: [validators.required, validators.minLength(2)], 
  firstName: [validators.required, validators.minLength(2)], 
  email: [validators.required, validators.email], 
  phone: [validators.required, validators.phone], 
  projectType: [validators.required], 
  budget: [validators.required], 
  timeline: [validators.required], 
  description: [validators.required, validators.minLength(50)], 
  cgu: legalConfig.cgu.isActive() ? [validators.required] : [], 
  cgv: legalConfig.cgv.isActive() ? [validators.required] : [], 
  policy: legalConfig.policy.isActive() ? [validators.required] : [] 
};

const { 
  formData, 
  isSubmitting, 
  submitError, 
  submitSuccess, 
  handleInput, 
  handleBlur, 
  handleSubmit, 
  resetForm, 
  getError 
} = useForm(initialValues, validationRules, { persistKey: 'project-request-form' });
const { addSubmission } = useSubmissions();
const onSubmit = () => { 
  handleSubmit(async (data) => { await new Promise(resolve => setTimeout(resolve, 1500)); 
  addSubmission('project', data); console.log('Projet soumis:', data); }); 
};
</script>

<style scoped lang="scss">
@use '@/assets/styles/index' as *;

.form-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.form-description {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 2rem;
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.form-section:last-of-type {
  border-bottom: none;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.alert {
  padding: 0.75rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.alert-error {
  background-color: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.alert-success {
  background-color: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.legal-section {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;

  @include tablet {
    flex-direction: row;
    align-items: flex-start;
    gap: $spacing-md;
  }
}
</style>
