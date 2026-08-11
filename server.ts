import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Modality } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client server-side
const getGeminiAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not defined in environment variables.');
  }
  return new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API Route: AI Call Tutor Chat
app.post('/api/ai-call/chat', async (req, res) => {
  try {
    const { message, studentName, levelName, history } = req.body;

    const ai = getGeminiAI();

    const systemInstruction = `
Eres la "Profe Alexa", una tutora y asistente de llamada por inteligencia artificial amigable, motivador y pedagógico para los estudiantes de 7° grado de la Institución Educativa Pablo Neruda (Medellín, Colombia), dirigida por el docente John Pestana.

Tu misión principal durante esta llamada telefónica es explicar temas de FRACCIONES (suma, resta, multiplicación, división, equivalencias, simplificación y problemas reales) de forma clara, natural y entretenida.

Pautas de interacción en llamada:
1. Dirígete al estudiante por su nombre (${studentName || 'Estudiante Nerudista'}).
2. Responde de forma concisa, cálida y directa (adecuada para una conversación hablada de 2 a 4 oraciones principales).
3. Incluye una fórmula o representación matemática simple para mostrar en la pizarra digital de la llamada si aplica (por ejemplo: "1/2 + 1/3 = 3/6 + 2/6 = 5/6").
4. Sé motivador, da ejemplos cotidianos de Medellín (como porciones de arepa, pizza o chocolate).
5. Incluye 2 opciones cortas de preguntas de seguimiento recomendadas.
6. habla con acento paisa (antioquia, colombia) y con voz femenina.

Responde ÚNICAMENTE en formato JSON estricto con la siguiente estructura:
{
  "replyText": "Respuesta hablada amigable...",
  "whiteboardFormula": "1/2 + 1/4 = 3/4",
  "suggestedFollowUps": ["¿Cómo se simplifica?", "¿Un ejemplo con pizza?"]
}
`;

    const chat = ai.chats.create({
      model: 'gemini-3.1-flash-live-preview',
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    // Feed conversation history if provided
    if (Array.isArray(history)) {
      for (const item of history.slice(-6)) {
        if (item.role === 'user' || item.role === 'model') {
          // Send previous messages to warm up chat context if needed
        }
      }
    }

    const promptText = `Nivel actual del estudiante: ${levelName || 'Nivel General'}. Pregunta/Comentario del estudiante: "${message || 'Hola Profe Alex, ¿me puedes explicar qué son las fracciones?'}"`;

    const response = await chat.sendMessage({ message: promptText });
    const rawText = response.text || '{}';

    let jsonResult;
    try {
      jsonResult = JSON.parse(rawText);
    } catch {
      jsonResult = {
        replyText: rawText,
        whiteboardFormula: '',
        suggestedFollowUps: ['¿Cómo simplifico una fracción?', '¿Otro ejemplo?'],
      };
    }

    res.json(jsonResult);
  } catch (error: any) {
    console.error('Error in /api/ai-call/chat:', error);
    res.status(500).json({
      error: 'Error al procesar la llamada con el Profe IA.',
      replyText: '¡Hola! Qué gusto hablar contigo. Parece que hubo una pequeña interferencia en la línea, pero estoy listo para ayudarte con tus fracciones.',
      whiteboardFormula: 'a/b + c/d',
      suggestedFollowUps: ['¿Qué es un denominador?', '¿Cómo sumo fracciones?'],
    });
  }
});

// API Route: AI Voice TTS (Text-to-Speech)
app.post('/api/ai-call/tts', async (req, res) => {
  try {
    const { text, voiceName = 'Zephyr' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Texto requerido' });
    }

    const ai = getGeminiAI();

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-tts-preview',
      contents: [{ parts: [{ text: `Lee con tono amigable, entusiasta y claro de profesor de matemáticas: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName || 'Zephyr' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (base64Audio) {
      res.json({ audio: base64Audio, mimeType: 'audio/pcm' });
    } else {
      res.status(404).json({ error: 'No se pudo generar audio TTS' });
    }
  } catch (error: any) {
    console.error('Error in /api/ai-call/tts:', error);
    // Return gracefully so client falls back to Web Speech API SpeechSynthesis
    res.status(500).json({ error: 'Error en servicio de voz TTS', fallback: true });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
