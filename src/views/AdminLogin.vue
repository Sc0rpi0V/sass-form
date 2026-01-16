<template>
  <div class="admin-login-page">
    <div class="login-container">
      <div class="login-card">
        <h1 class="login-title">Connexion Administrateur</h1>
        <p class="login-subtitle">Accédez au dashboard d'administration</p>

        <form @submit.prevent="handleLogin" class="login-form">
          <BaseInput
            id="email"
            type="email"
            label="Email"
            v-model="email"
            placeholder="admin@example.com"
            required
            :error="errors.email"
            @blur="errors.email = ''"
          />

          <BaseInput
            id="password"
            type="password"
            label="Mot de passe"
            v-model="password"
            placeholder="Votre mot de passe"
            required
            :error="errors.password"
            @blur="errors.password = ''"
          />

          <div v-if="loginError" class="error-alert">
            {{ loginError }}
          </div>

          <BaseButton
            type="submit"
            :loading="isLoading"
            class="login-btn"
          >
            Se connecter
          </BaseButton>
        </form>

        <div class="login-info">
          <p class="info-title">Identifiants par défaut:</p>
          <code class="info-code">
            Email: admin@example.com<br/>
            Mot de passe: Admin123!
          </code>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseButton from '@/components/ui/BaseButton.vue';

const router = useRouter();
const route = useRoute();
const { login } = useAuth();

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const loginError = ref(null);
const errors = ref({
  email: '',
  password: ''
});

const handleLogin = async () => {
  // Réinitialiser les erreurs
  errors.value = { email: '', password: '' };
  loginError.value = null;

  // Validation basique
  if (!email.value) {
    errors.value.email = 'Email requis';
    return;
  }
  if (!password.value) {
    errors.value.password = 'Mot de passe requis';
    return;
  }

  isLoading.value = true;

  try {
    const success = await login(email.value, password.value);

    if (success) {
      // Redirection vers la page demandée ou dashboard
      const redirect = route.query.redirect || '/admin/dashboard';
      router.push(redirect);
    } else {
      loginError.value = 'Email ou mot de passe incorrect';
    }
  } catch (error) {
    loginError.value = 'Erreur de connexion. Veuillez réessayer.';
    console.error('Login error:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped lang="scss">
@use '@/assets/styles/index' as *;

.admin-login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: $spacing-lg;
}

.login-container {
  width: 100%;
  max-width: 450px;
}

.login-card {
  background: $color-background;
  border-radius: $border-radius-lg;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: $spacing-3xl;
}

.login-title {
  font-size: $font-size-3xl;
  font-weight: 700;
  color: $color-text;
  margin: 0 0 $spacing-sm 0;
  text-align: center;
}

.login-subtitle {
  font-size: $font-size-sm;
  color: $color-text-light;
  margin: 0 0 $spacing-2xl 0;
  text-align: center;
}

.login-form {
  margin-bottom: $spacing-2xl;
}

.error-alert {
  background-color: #fee;
  color: $color-error;
  padding: $spacing-md;
  border-radius: $border-radius;
  margin-bottom: $spacing-lg;
  font-size: $font-size-sm;
  text-align: center;
  border: 1px solid $color-error;
}

.login-btn {
  width: 100%;
  margin-top: $spacing-lg;
}

.login-info {
  background: #f9fafb;
  padding: $spacing-lg;
  border-radius: $border-radius;
  border: 1px solid $color-border;
}

.info-title {
  font-size: $font-size-sm;
  font-weight: 600;
  color: $color-text;
  margin: 0 0 $spacing-sm 0;
}

.info-code {
  display: block;
  background: #fff;
  padding: $spacing-md;
  border-radius: $border-radius-sm;
  font-size: $font-size-xs;
  font-family: 'Courier New', Courier, monospace;
  color: #666;
  line-height: 1.8;
}
</style>
