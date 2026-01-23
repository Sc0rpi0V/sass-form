# Guide d'utilisation - Forms Starter Pack

## 📦 Installation

```bash
# Créer le projet Vue.js
npm create vue@latest mon-projet-forms

# Options recommandées lors de la création :
# ✅ Vue Router
# ❌ Pinia (optionnel pour ce starter)
# ❌ Les autres options

cd mon-projet-forms
npm install
```

## 🗂️ Structure des fichiers

Créez l'arborescence suivante dans votre projet :

```
src/
├── components/
│   ├── ui/
│   │   ├── BaseButton.vue
│   │   ├── BaseInput.vue
│   │   ├── BaseTextarea.vue
│   │   ├── BaseSelect.vue
│   │   └── BaseCheckbox.vue
│   └── forms/
│       ├── RegistrationForm.vue
│       ├── ContactForm.vue
│       ├── NewsletterForm.vue
│       ├── QuestionForm.vue
│       └── ProjectRequestForm.vue
├── composables/
│   ├── useForm.js
│   └── useValidation.js
├── utils/
│   └── validators.js
├── views/
│   ├── RegistrationView.vue
│   ├── ContactView.vue
│   ├── NewsletterView.vue
│   ├── QuestionView.vue
│   └── ProjectView.vue
├── router/
│   └── index.js
├── App.vue
└── main.js
```

## 🚀 Lancer le projet

```bash
npm run dev
```

Accédez à `http://localhost:5173`

## 📝 Utilisation des composables

### `useForm`

Le composable principal pour gérer vos formulaires :

```javascript
import { useForm } from '@/composables/forms/useForm';
import { validators } from '@/utils/validators';

const {
  formData,           // Données réactives du formulaire
  isSubmitting,       // État de soumission
  submitError,        // Erreur de soumission
  submitSuccess,      // Succès de soumission
  handleInput,        // Fonction pour gérer les changements
  handleBlur,         // Fonction pour gérer la perte de focus
  handleSubmit,       // Fonction pour soumettre le formulaire
  resetForm,          // Réinitialiser le formulaire
  getError            // Obtenir l'erreur d'un champ
} = useForm(initialValues, validationRules);
```

### `useValidation`

Gestion automatique de la validation :

```javascript
const validationRules = {
  email: [validators.required, validators.email],
  password: [validators.required, validators.minLength(8)]
};
```

## 🔧 Validators disponibles

- `validators.required` : Champ obligatoire
- `validators.email` : Format email valide
- `validators.phone` : Téléphone français valide
- `validators.minLength(n)` : Longueur minimale
- `validators.maxLength(n)` : Longueur maximale
- `validators.url` : URL valide
- `validators.match(field, label)` : Correspondance avec un autre champ

## 🎨 Personnalisation

### Ajouter un nouveau validateur

```javascript
// Dans utils/validators.js
export const validators = {
  // ... validateurs existants
  
  custom: (value) => {
    return condition ? true : 'Message d\'erreur';
  }
};
```

### Créer un nouveau formulaire

1. Créer le composant dans `components/forms/`
2. Importer les composants UI nécessaires
3. Définir `initialValues` et `validationRules`
4. Utiliser le composable `useForm`
5. Créer la vue dans `views/`
6. Ajouter la route dans `router/index.js`

## 📱 Responsive

Tous les formulaires sont responsive et s'adaptent automatiquement aux écrans mobiles.

## 🎯 Bonnes pratiques

1. **Validation progressive** : La validation se déclenche après le premier blur
2. **Feedback visuel** : Erreurs affichées en rouge sous les champs
3. **États de chargement** : Boutons avec spinner pendant la soumission
4. **Messages de succès** : Confirmation après soumission réussie
5. **Réinitialisation** : Possibilité de réinitialiser le formulaire

## 🔄 Intégration avec une API

Modifiez la fonction `onSubmit` dans vos formulaires :

```javascript
const onSubmit = () => {
  handleSubmit(async (data) => {
    // Remplacer la simulation par un vrai appel API
    const response = await fetch('/api/endpoint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de l\'envoi');
    }
    
    return await response.json();
  });
};
```

## 🎨 Thématisation

Les couleurs principales sont définies dans les composants. Pour les modifier globalement, créez un fichier CSS de variables :

```css
:root {
  --primary-color: #3b82f6;
  --error-color: #ef4444;
  --success-color: #10b981;
  --border-color: #d1d5db;
}
```

## 📦 Build pour la production

```bash
npm run build
```

Les fichiers optimisés seront dans le dossier `dist/`.