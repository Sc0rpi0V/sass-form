<template>
  <div class="user-login">
    <form @submit.prevent="onSubmit" class="form-container">
      <h2>Connexion</h2>

      <BaseInput
        id="email"
        type="email"
        label="Email"
        placeholder="votre@email.com"
        v-model="email"
        required
      />

      <BaseInput
        id="password"
        type="password"
        label="Mot de passe"
        placeholder="••••••••"
        v-model="password"
        required
      />

      <div v-if="loginError" class="alert alert-error">
        {{ loginError }}
      </div>

      <div class="form-actions">
        <BaseButton type="submit" :loading="isSubmitting">Se connecter</BaseButton>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import { useUserAuth } from '@/composables/useUserAuth';

const router = useRouter();
const route = useRoute();

const { login } = useUserAuth();

const email = ref('');
const password = ref('');
const loginError = ref('');
const isSubmitting = ref(false);

const onSubmit = async () => {
  loginError.value = '';
  isSubmitting.value = true;

  const success = await login(email.value, password.value);
  isSubmitting.value = false;

  if (success) {
    const redirectTo = route.query.redirect || '/user/dashboard';
    router.push(redirectTo);
  } else {
    loginError.value = 'Email ou mot de passe incorrect';
  }
};
</script>

<style scoped>
.form-container {
  max-width: 400px;
  margin: 3rem auto;
  padding: 2rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}

.form-actions {
  margin-top: 1.5rem;
}

.alert-error {
  color: #991b1b;
  background: #fee2e2;
  border: 1px solid #fca5a5;
  padding: 0.75rem;
  border-radius: 0.375rem;
  margin-top: 1rem;
}
</style>
