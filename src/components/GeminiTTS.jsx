// Gemini TTS Integration for Robbie the Robot

const GEMINI_TTS_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent';

// Convert PCM16 audio data to WAV format
function pcmToWav(pcmBase64, sampleRate = 24000) {
  const byteCharacters = atob(pcmBase64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const buffer = byteArray.buffer;
  
  const wavHeader = new ArrayBuffer(44);
  const view = new DataView(wavHeader);

  // RIFF identifier
  view.setUint32(0, 0x52494646, false); // "RIFF"
  view.setUint32(4, 36 + buffer.byteLength, true);
  view.setUint32(8, 0x57415645, false); // "WAVE"
  // FMT chunk
  view.setUint32(12, 0x666d7420, false); // "fmt "
  view.setUint32(16, 16, true); // Subchunk1Size
  view.setUint16(20, 1, true); // AudioFormat (1 = PCM)
  view.setUint16(22, 1, true); // NumChannels (Mono)
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, sampleRate * 2, true); // ByteRate
  view.setUint16(32, 2, true); // BlockAlign
  view.setUint16(34, 16, true); // BitsPerSample
  // Data chunk
  view.setUint32(36, 0x64617461, false); // "data"
  view.setUint32(40, buffer.byteLength, true);

  const blob = new Blob([wavHeader, buffer], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
}

// Exponential backoff retry logic
async function fetchWithRetry(url, options, maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      
      if (response.status === 429 || response.status >= 500) {
        const waitTime = Math.min(1000 * Math.pow(2, i), 10000);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      throw new Error(`API error: ${response.status}`);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const waitTime = Math.min(1000 * Math.pow(2, i), 10000);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  throw new Error('Max retries reached');
}

export async function speakWithGemini(text, voiceName = 'Puck', apiKey) {
  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }

  // Add robotic persona to the text
  const roboticPrompt = `Say in a friendly, slightly metallic robotic voice: ${text}`;

  const requestBody = {
    contents: [{
      parts: [{ text: roboticPrompt }]
    }],
    generationConfig: {
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {
            voiceName: voiceName
          }
        }
      }
    }
  };

  const response = await fetchWithRetry(
    `${GEMINI_TTS_ENDPOINT}?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    }
  );

  const data = await response.json();
  
  // Extract audio data from response
  if (!data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data) {
    throw new Error('No audio data in response');
  }

  const audioBase64 = data.candidates[0].content.parts[0].inlineData.data;
  const mimeType = data.candidates[0].content.parts[0].inlineData.mimeType || 'audio/pcm';
  
  // Extract sample rate from mimeType (e.g., "audio/pcm;rate=24000")
  const sampleRateMatch = mimeType.match(/rate=(\d+)/);
  const sampleRate = sampleRateMatch ? parseInt(sampleRateMatch[1]) : 24000;
  
  // Convert PCM to WAV
  const audioUrl = pcmToWav(audioBase64, sampleRate);
  
  return audioUrl;
}