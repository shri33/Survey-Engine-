# Vue.js 3 + Firebase Survey Engine for Shopify

A lightweight, multilingual survey engine built with Vue.js 3, Firebase, and Bulma.io that seamlessly integrates with Shopify stores.

## 🚀 Features

- **Multilingual Support**: Automatic language detection and switching
- **Real-time Data Saving**: Answers are saved as users type or select options
- **Four Question Types**: Single-line, multi-line, dropdown, and checkbox
- **Shopify Integration**: Ready-to-use Liquid templates
- **Responsive Design**: Mobile-first approach with Bulma.io
- **Firebase Backend**: Scalable NoSQL database with real-time capabilities
- **Session Tracking**: Unique session IDs from URL parameters
- **Auto-submit**: Questions submit automatically on input or navigation

## 📁 Project Structure

```
survey-engine/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── LandingPage.vue
│   │   ├── SurveyForm.vue
│   │   ├── ThankYouPage.vue
│   │   └── QuestionTypes/
│   │       ├── SingleLineQuestion.vue
│   │       ├── MultiLineQuestion.vue
│   │       ├── DropdownQuestion.vue
│   │       └── CheckboxQuestion.vue
│   ├── composables/
│   │   ├── useFirebase.js
│   │   ├── useSurvey.js
│   │   └── useLanguage.js
│   ├── utils/
│   │   ├── firebase.js
│   │   └── constants.js
│   ├── assets/styles/
│   │   └── main.css
│   ├── App.vue
│   └── main.js
├── shopify-templates/
│   ├── survey-landing.liquid
│   ├── survey-form.liquid
│   └── survey-thank-you.liquid
├── database/
│   └── survey_engine.sql
├── firebase/
│   ├── firestore.rules
│   ├── firestore.indexes.json
│   └── firebase.json
├── package.json
├── vite.config.js
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 16+ and npm 8+
- Firebase account
- VS Code (recommended)

### Step 1: Project Initialization

```bash
# Create project directory
mkdir survey-engine
cd survey-engine

# Initialize npm project
npm init -y

# Install dependencies
npm install vue@^3.3.4 vue-router@^4.2.4 firebase@^10.3.1 bulma@^0.9.4 @fortawesome/fontawesome-free@^6.4.2 @vueuse/core@^10.3.0

# Install dev dependencies
npm install -D @vitejs/plugin-vue@^4.3.4 vite@^4.4.9 eslint@^8.47.0 eslint-plugin-vue@^9.17.0
```

### Step 2: Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Create a project"
   - Follow the setup wizard

2. **Enable Firestore Database**
   - In Firebase Console, go to "Firestore Database"
   - Click "Create database"
   - Choose "Start in test mode"
   - Select your preferred location

3. **Get Firebase Config**
   - Go to Project Settings (gear icon)
   - Scroll to "Your apps" section
   - Click "Web" icon to add a web app
   - Copy the configuration object

4. **Update Firebase Configuration**
   - Open `src/utils/firebase.js`
   - Replace the config object with your Firebase config

### Step 3: Firebase Rules and Indexes

1. **Install Firebase CLI**
```bash
npm install -g firebase-tools
firebase login
```

2. **Initialize Firebase in your project**
```bash
firebase init
# Select: Firestore, Hosting
# Use existing project
# Accept default files
```

3. **Deploy Firestore rules**
```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

### Step 4: Create Sample Data

Add this sample data to your Firestore database:

**Collection: `surveys`**
```javascript
// Document ID: customer-feedback
{
  id: "customer-feedback",
  title: {
    en: "Customer Feedback Survey",
    es: "Encuesta de Comentarios del Cliente"
  },
  description: {
    en: "Help us improve our service",
    es: "Ayúdanos a mejorar nuestro servicio"
  },
  active: true,
  created_at: new Date(),
  updated_at: new Date()
}
```

**Collection: `questions`**
```javascript
// Document ID: q1
{
  id: "q1",
  survey_id: "customer-feedback",
  question_text: {
    en: "How satisfied are you with our service?",
    es: "¿Qué tan satisfecho estás con nuestro servicio?"
  },
  question_type: "dropdown",
  options: {
    en: ["Very Satisfied", "Satisfied", "Neutral", "Unsatisfied", "Very Unsatisfied"],
    es: ["Muy Satisfecho", "Satisfecho", "Neutral", "Insatisfecho", "Muy Insatisfecho"]
  },
  required: true,
  order: 1,
  created_at: new Date()
}

// Document ID: q2
{
  id: "q2",
  survey_id: "customer-feedback",
  question_text: {
    en: "What could we improve?",
    es: "¿Qué podríamos mejorar?"
  },
  question_type: "multi_line",
  placeholder: {
    en: "Please share your suggestions...",
    es: "Por favor comparte tus sugerencias..."
  },
  required: false,
  order: 2,
  created_at: new Date()
}
```

### Step 5: Development

```bash
# Start development server
npm run dev

# Open browser to http://localhost:3000
```

### Step 6: Test URLs

Test your survey with these URL patterns:

```
http://localhost:3000/?survey=customer-feedback&lang=en&session=test123
http://localhost:3000/?survey=customer-feedback&lang=es&session=test456
```

### Step 7: Build and Deploy

```bash
# Build for production
npm run build

# Deploy to Firebase Hosting
npm run firebase:deploy

# Or deploy manually
firebase deploy --only hosting
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in your project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### URL Parameters

The survey engine reads these URL parameters:

- `survey`: Survey ID (required)
- `lang`: Language code (en, es, fr, etc.)
- `session`: Unique session identifier
- `user`: Optional user identifier

Example:
```
https://yourstore.com/pages/survey?survey=customer-feedback&lang=en&session=abc123&user=customer456
```

## 🎨 Customization

### Adding New Languages

1. Update `src/utils/constants.js`:
```javascript
export const SUPPORTED_LANGUAGES = {
  en: 'English',
  es: 'Español',
  fr: 'Français', // Add new language
}
```

2. Add translations to your Firestore documents
3. Update Shopify Liquid templates with new language conditions

### Adding New Question Types

1. Create a new component in `src/components/QuestionTypes/`
2. Register it in `src/components/SurveyForm.vue`
3. Update `src/utils/constants.js` with the new type
4. Update the database schema

### Styling

Customize the appearance by modifying:
- `src/assets/styles/main.css` for global styles
- Individual component `<style>` sections
- Bulma variables (create `src/assets/styles/variables.scss`)

## 🔌 Shopify Integration

### Installation Steps

1. **Upload Liquid Templates**
   - Copy files from `shopify-templates/` to your Shopify theme
   - Place them in the `templates/` directory

2. **Create Pages**
   - Admin → Online Store → Pages
   - Create pages with templates:
     - "Survey Landing" → `survey-landing.liquid`
     - "Survey Form" → `survey-form.liquid`
     - "Thank You" → `survey-thank-you.liquid`

3. **Upload Assets**
   - Build your Vue.js app: `npm run build`
   - Upload `dist/assets/*` files to Shopify Assets
   - Update asset URLs in liquid templates

4. **Test Integration**
   - Visit: `https://yourstore.com/pages/survey-landing?survey=customer-feedback&lang=en&session=test123`

## 📊 Data Structure

### Database Schema (PostgreSQL equivalent)

The Firebase collections mirror this SQL structure:

```sql
-- Surveys table
CREATE TABLE surveys (
    id VARCHAR(50) PRIMARY KEY,
    title JSONB NOT NULL,
    description JSONB,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Questions table
CREATE TABLE questions (
    id VARCHAR(50) PRIMARY KEY,
    survey_id VARCHAR(50) REFERENCES surveys(id),
    question_text JSONB NOT NULL,
    question_type question_type_enum NOT NULL,
    options JSONB,
    placeholder JSONB,
    required BOOLEAN DEFAULT false,
    validation_rules JSONB,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Responses table
CREATE TABLE responses (
    id VARCHAR(50) PRIMARY KEY,
    survey_id VARCHAR(50) REFERENCES surveys(id),
    session_id VARCHAR(100) NOT NULL,
    user_id VARCHAR(50),
    language VARCHAR(10) NOT NULL,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Answers table
CREATE TABLE answers (
    id VARCHAR(50) PRIMARY KEY,
    response_id VARCHAR(50) REFERENCES responses(id),
    question_id VARCHAR(50) REFERENCES questions(id),
    answer_text TEXT,
    answer_value JSONB,
    language VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔍 Troubleshooting

### Common Issues

1. **Firebase Connection Issues**
   - Check your Firebase config in `src/utils/firebase.js`
   - Verify Firestore rules allow public read access
   - Check browser console for CORS errors

2. **Questions Not Loading**
   - Verify sample data exists in Firestore
   - Check survey ID in URL matches Firestore document
   - Ensure questions have correct `survey_id` field

3. **Answers Not Saving**
   - Check Firestore rules allow write access
   - Verify network connectivity
   - Check browser console for errors

4. **Shopify Integration Issues**
   - Ensure asset URLs are correct in Liquid templates
   - Check page templates are properly assigned
   - Verify HTTPS is enabled

### Debug Mode

Enable debug logging by adding to your `src/utils/firebase.js`:

```javascript
import { connectFirestoreEmulator } from 'firebase/firestore'

// For local development only
if (location.hostname === 'localhost') {
  connectFirestoreEmulator(db, 'localhost', 8080)
}
```

## 🚀 Deployment

### Firebase Hosting

```bash
# Build and deploy
npm run firebase:deploy

# Deploy only hosting
firebase deploy --only hosting

# Deploy only Firestore rules
firebase deploy --only firestore
```

### Other Hosting Providers

The built files in `dist/` can be deployed to any static hosting provider:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

## 📈 Analytics and Reporting

Future enhancements can include:

1. **Real-time Dashboard**
   - Response statistics
   - Completion rates
   - Language preferences

2. **Export Functionality**
   - CSV export of responses
   - PDF reports
   - Integration with Google Sheets

3. **Advanced Analytics**
   - Response time tracking
   - Drop-off analysis
   - A/B testing capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

**Shri Srivastava**
- Frontend Developer specializing in Vue.js and Firebase
- Experience with Shopify integrations and multilingual applications

---

For questions or support, please create an issue in the repository or contact the development team.