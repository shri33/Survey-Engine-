-- Survey Engine Database Schema
-- PostgreSQL compatible schema that mirrors Firebase structure

-- Enum types for question types
CREATE TYPE question_type_enum AS ENUM (
    'single_line',
    'multi_line', 
    'dropdown',
    'checkbox'
);

-- Enum for supported languages
CREATE TYPE language_enum AS ENUM (
    'en',
    'es',
    'fr',
    'de',
    'it',
    'pt',
    'zh',
    'ja'
);

-- Surveys table - main survey configurations
CREATE TABLE surveys (
    id VARCHAR(255) PRIMARY KEY,
    title JSONB NOT NULL, -- {"en": "English Title", "es": "Spanish Title"}
    description JSONB,
    instructions JSONB,
    thank_you_message JSONB,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB -- Additional survey settings
);

-- Questions table - individual survey questions
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id VARCHAR(255) REFERENCES surveys(id) ON DELETE CASCADE,
    question_text JSONB NOT NULL, -- {"en": "Question?", "es": "Pregunta?"}
    question_type question_type_enum NOT NULL,
    options JSONB, -- For dropdown/checkbox: {"en": ["Option1", "Option2"], "es": ["Opción1", "Opción2"]}
    placeholder JSONB, -- {"en": "Enter your answer...", "es": "Ingresa tu respuesta..."}
    required BOOLEAN DEFAULT false,
    order_index INTEGER NOT NULL DEFAULT 0,
    validation_rules JSONB, -- {"min_length": 5, "max_length": 500, "pattern": "regex"}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_survey_question_order UNIQUE (survey_id, order_index)
);

-- Response sessions - tracks individual survey completion sessions
CREATE TABLE response_sessions (
    id VARCHAR(255) PRIMARY KEY, -- From URL query string
    survey_id VARCHAR(255) REFERENCES surveys(id) ON DELETE CASCADE,
    language language_enum NOT NULL,
    user_agent TEXT,
    ip_address INET,
    referrer TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    is_complete BOOLEAN DEFAULT false,
    metadata JSONB -- Additional session data like UTM params
);

-- Individual question answers
CREATE TABLE answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) REFERENCES response_sessions(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    answer_text TEXT, -- For text-based answers
    answer_options TEXT[], -- For multiple choice (array of selected options)
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_session_question UNIQUE (session_id, question_id)
);

-- Survey analytics and reporting views
CREATE TABLE survey_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id VARCHAR(255) REFERENCES surveys(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_sessions INTEGER DEFAULT 0,
    completed_sessions INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2),
    avg_completion_time INTERVAL,
    language_breakdown JSONB, -- {"en": 150, "es": 45}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_survey_date UNIQUE (survey_id, date)
);

-- Indexes for performance optimization
CREATE INDEX idx_questions_survey_id ON questions(survey_id);
CREATE INDEX idx_questions_order ON questions(survey_id, order_index);
CREATE INDEX idx_response_sessions_survey ON response_sessions(survey_id);
CREATE INDEX idx_response_sessions_started ON response_sessions(started_at);
CREATE INDEX idx_answers_session ON answers(session_id);
CREATE INDEX idx_answers_question ON answers(question_id);
CREATE INDEX idx_answers_submitted ON answers(submitted_at);
CREATE INDEX idx_survey_stats_survey ON survey_stats(survey_id, date);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_surveys_updated_at BEFORE UPDATE ON surveys
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_answers_updated_at BEFORE UPDATE ON answers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data insertion
INSERT INTO surveys (id, title, description, instructions, thank_you_message) VALUES 
(
    'customer-feedback',
    '{"en": "Customer Feedback Survey", "es": "Encuesta de Comentarios del Cliente"}',
    '{"en": "Help us improve our products and services", "es": "Ayúdanos a mejorar nuestros productos y servicios"}',
    '{"en": "Please answer all questions honestly. Your feedback is valuable to us.", "es": "Por favor responde todas las preguntas honestamente. Tus comentarios son valiosos para nosotros."}',
    '{"en": "Thank you for your feedback!", "es": "¡Gracias por tus comentarios!"}'
),
(
    'product-review',
    '{"en": "Product Review", "es": "Reseña del Producto"}',
    '{"en": "Share your experience with our product", "es": "Comparte tu experiencia con nuestro producto"}',
    '{"en": "Your honest review helps other customers make informed decisions.", "es": "Tu reseña honesta ayuda a otros clientes a tomar decisiones informadas."}',
    '{"en": "Thank you for your review!", "es": "¡Gracias por tu reseña!"}'
);

INSERT INTO questions (survey_id, question_text, question_type, options, required, order_index) VALUES 
(
    'customer-feedback',
    '{"en": "How satisfied are you with our service?", "es": "¿Qué tan satisfecho estás con nuestro servicio?"}',
    'dropdown',
    '{"en": ["Very Satisfied", "Satisfied", "Neutral", "Unsatisfied", "Very Unsatisfied"], "es": ["Muy Satisfecho", "Satisfecho", "Neutral", "Insatisfecho", "Muy Insatisfecho"]}',
    true,
    1
),
(
    'customer-feedback',
    '{"en": "What is your name?", "es": "¿Cuál es tu nombre?"}',
    'single_line',
    NULL,
    true,
    2
),
(
    'customer-feedback',
    '{"en": "Please provide additional feedback:", "es": "Por favor proporciona comentarios adicionales:"}',
    'multi_line',
    NULL,
    false,
    3
),
(
    'customer-feedback',
    '{"en": "Which features do you use most? (Select all that apply)", "es": "¿Qué características usas más? (Selecciona todas las que correspondan)"}',
    'checkbox',
    '{"en": ["Online Support", "Phone Support", "Documentation", "Video Tutorials"], "es": ["Soporte en Línea", "Soporte Telefónico", "Documentación", "Tutoriales en Video"]}',
    false,
    4
);

-- Comments for documentation
COMMENT ON TABLE surveys IS 'Main survey configurations with multilingual support';
COMMENT ON TABLE questions IS 'Individual questions belonging to surveys with type and language support';
COMMENT ON TABLE response_sessions IS 'Tracks individual survey completion sessions with metadata';
COMMENT ON TABLE answers IS 'Individual answers to questions within response sessions';
COMMENT ON TABLE survey_stats IS 'Aggregated statistics for surveys by date';

COMMENT ON COLUMN surveys.title IS 'Multilingual survey titles stored as JSON object';
COMMENT ON COLUMN surveys.metadata IS 'Additional survey configuration like theme, styling, etc.';
COMMENT ON COLUMN questions.validation_rules IS 'JSON object containing validation rules for the question';
COMMENT ON COLUMN response_sessions.metadata IS 'Additional session data like UTM parameters, device info, etc.';
COMMENT ON COLUMN answers.answer_options IS 'Array of selected options for checkbox/multiple choice questions';