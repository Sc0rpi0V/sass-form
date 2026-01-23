<template>
  <form @submit.prevent="onSubmit" class="form-container">
    <h2 class="form-title">Paiement</h2>
    <p class="form-description">
      Veuillez renseigner vos informations et choisir votre méthode de paiement.
    </p>

    <BaseInput
      id="firstName"
      label="Prénom"
      :model-value="formData.firstName"
      placeholder="Votre prénom"
      required
      :error="getError('firstName')"
      @update:model-value="handleInput('firstName', $event)"
      @blur="handleBlur('firstName')"
    />

    <BaseInput
      id="lastName"
      label="Nom"
      :model-value="formData.lastName"
      placeholder="Votre nom"
      required
      :error="getError('lastName')"
      @update:model-value="handleInput('lastName', $event)"
      @blur="handleBlur('lastName')"
    />

    <BaseInput
      id="email"
      type="email"
      label="Adresse email"
      :model-value="formData.email"
      placeholder="votre@email.com"
      required
      :error="getError('email')"
      @update:model-value="handleInput('email', $event)"
      @blur="handleBlur('email')"
    />

    <BaseInput
      id="amount"
      type="number"
      label="Montant"
      :model-value="formData.amount"
      placeholder="Ex: 150"
      required
      :error="getError('amount')"
      @update:model-value="handleInput('amount', $event)"
      @blur="handleBlur('amount')"
    />

    <BaseSelect
      id="paymentMethod"
      label="Méthode de paiement"
      :model-value="formData.paymentMethod"
      :options="paymentOptions"
      required
      :error="getError('paymentMethod')"
      @update:model-value="handleInput('paymentMethod', $event)"
      @blur="handleBlur('paymentMethod')"
    />

    <template v-if="formData.paymentMethod === 'cheque'">
      <BaseInput
        id="chequeNumber"
        label="Numéro de chèque"
        :model-value="formData.chequeNumber"
        placeholder="Ex: 123456"
        required
        :error="getError('chequeNumber')"
        @update:model-value="handleInput('chequeNumber', $event)"
        @blur="handleBlur('chequeNumber')"
      />

      <BaseInput
        id="bankName"
        label="Nom de la banque"
        :model-value="formData.bankName"
        placeholder="Nom de votre banque"
        required
        :error="getError('bankName')"
        @update:model-value="handleInput('bankName', $event)"
        @blur="handleBlur('bankName')"
      />
    </template>

    <template v-else-if="formData.paymentMethod === 'virement'">
      <BaseInput
        id="iban"
        label="IBAN"
        :model-value="formData.iban"
        placeholder="FR76 1234 5678 9012 3456 7890 123"
        required
        :error="getError('iban')"
        @update:model-value="handleInput('iban', $event)"
        @blur="handleBlur('iban')"
      />

      <BaseInput
        id="bic"
        label="BIC"
        :model-value="formData.bic"
        placeholder="Ex: ABCDFRPP"
        required
        :error="getError('bic')"
        @update:model-value="handleInput('bic', $event)"
        @blur="handleBlur('bic')"
      />
    </template>

    <template v-else-if="formData.paymentMethod === 'paypal'">
      <BaseInput
        id="paypalEmail"
        type="email"
        label="Email PayPal"
        :model-value="formData.paypalEmail"
        placeholder="paypal@email.com"
        required
        :error="getError('paypalEmail')"
        @update:model-value="handleInput('paypalEmail', $event)"
        @blur="handleBlur('paypalEmail')"
      />
    </template>

    <div v-if="submitError" class="alert alert-error">
      {{ submitError }}
    </div>

    <div v-if="submitSuccess" class="alert alert-success">
      Paiement enregistré avec succès !
    </div>

    <div class="form-actions">
      <BaseButton type="submit" :loading="isSubmitting">
        Valider le paiement
      </BaseButton>
      <BaseButton type="button" variant="outline" @click="resetForm">
        Réinitialiser
      </BaseButton>
    </div>
  </form>
</template>

<script setup>
import { useForm } from '@/composables/forms/useForm';
import { useSubmissions } from '@/composables/submissions/useSubmissions';
import { validators } from '@/utils/validators';
import BaseInput from '@/components/ui/base/BaseInput.vue';
import BaseSelect from '@/components/ui/BaseSelect.vue';
import BaseButton from '@/components/ui/base/BaseButton.vue';

const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  amount: '',
  paymentMethod: '',
  chequeNumber: '',
  bankName: '',
  iban: '',
  bic: '',
  paypalEmail: ''
};

const paymentOptions = [
  { label: 'Chèque', value: 'cheque' },
  { label: 'Virement bancaire', value: 'virement' },
  { label: 'PayPal', value: 'paypal' }
];

const validationRules = {
  firstName: [validators.required, validators.minLength(2)],
  lastName: [validators.required, validators.minLength(2)],
  email: [validators.required, validators.email],
  amount: [validators.required],
  paymentMethod: [validators.required],

  chequeNumber: [
    (value, formData) =>
      formData.paymentMethod === 'cheque'
        ? validators.required(value)
        : true
  ],
  bankName: [
    (value, formData) =>
      formData.paymentMethod === 'cheque'
        ? validators.required(value)
        : true
  ],
  iban: [
    (value, formData) =>
      formData.paymentMethod === 'virement'
        ? validators.required(value)
        : true
  ],
  bic: [
    (value, formData) =>
      formData.paymentMethod === 'virement'
        ? validators.required(value)
        : true
  ],
  paypalEmail: [
    (value, formData) =>
      formData.paymentMethod === 'paypal'
        ? validators.required(value) && validators.email(value)
        : true
  ]
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
} = useForm(initialValues, validationRules, {
  persistKey: 'payment-form'
});

const { addSubmission } = useSubmissions();

const onSubmit = () => {
  handleSubmit(async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    addSubmission('payment', data);
    console.log('Paiement soumis:', data);
  });
};
</script>

<style scoped lang="scss">
.form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.form-description {
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
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
</style>
