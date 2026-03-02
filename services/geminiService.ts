import { GoogleGenAI, Type } from "@google/genai";
import { WorkoutPlan, Exercise } from '../types';

// Initialize Gemini (Default)
const getAiClient = (apiKey: string) => new GoogleGenAI({ apiKey });

// Default client for text generation which doesn't require user-selected key in some contexts,
// but consistent use of process.env.API_KEY is recommended.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const WORKOUT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    description: { type: Type.STRING },
    durationMinutes: { type: Type.NUMBER },
    difficulty: { type: Type.STRING },
    exercises: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          muscleGroup: { type: Type.STRING },
          variation: { type: Type.STRING },
          restSeconds: { type: Type.NUMBER },
          note: { type: Type.STRING },
          targetSets: { type: Type.NUMBER, description: "Number of sets to perform" },
          targetReps: { type: Type.STRING, description: "Target rep range, e.g., '8-12'" },
        }
      }
    }
  },
  required: ["name", "description", "exercises", "durationMinutes", "difficulty"]
};

export const generateWorkout = async (prompt: string): Promise<WorkoutPlan | null> => {
  try {
    const fullPrompt = `Create a structured gym workout plan based on this request: "${prompt}".
    Ensure it includes specific exercises, set counts, rep ranges, and technique notes.
    The response must be valid JSON matching the schema provided.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: fullPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: WORKOUT_SCHEMA,
      },
    });

    const text = response.text;
    if (!text) return null;

    const data = JSON.parse(text);

    // Transform API data to our internal App state structure (adding IDs)
    const formattedExercises: Exercise[] = data.exercises.map((ex: any) => {
      const sets = [];
      for (let i = 0; i < (ex.targetSets || 3); i++) {
        sets.push({
          id: Math.random().toString(36).substr(2, 9),
          reps: 0,
          weight: 0,
          completed: false,
          targetReps: ex.targetReps || '10'
        });
      }
      return {
        id: Math.random().toString(36).substr(2, 9),
        name: ex.name,
        muscleGroup: ex.muscleGroup,
        variation: ex.variation,
        availableVariations: [ex.variation], // Default to single if generated
        restSeconds: ex.restSeconds,
        note: ex.note,
        sets: sets
      };
    });

    return {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name,
      description: data.description,
      difficulty: data.difficulty as any,
      durationMinutes: data.durationMinutes,
      exercises: formattedExercises
    };

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    return null;
  }
};

export const generateExerciseVideo = async (exerciseName: string, variation: string): Promise<string | null> => {
  try {
    // 1. Mandatory API Key Selection for Veo
    // @ts-ignore - window.aistudio is injected by the environment
    if (window.aistudio && !await window.aistudio.hasSelectedApiKey()) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
    }

    // 2. Create fresh client with current key
    const veoAi = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // 3. Initiate Video Generation
    const prompt = `Cinematic, clear, instructional gym demonstration video of a person performing ${exerciseName} (${variation}). The form should be perfect. Neutral background, focus on the movement.`;
    
    let operation = await veoAi.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p', 
        aspectRatio: '16:9' 
      }
    });

    // 4. Poll for completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5 seconds
      operation = await veoAi.operations.getVideosOperation({operation: operation});
    }

    // 5. Extract Video URI
    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) return null;

    // 6. Return fetchable URL with appended key
    return `${videoUri}&key=${process.env.API_KEY}`;

  } catch (error) {
    console.error("Video Generation Error:", error);
    return null;
  }
};