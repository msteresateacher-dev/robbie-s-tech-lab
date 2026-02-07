// Gemini TTS Integration for Robbie the Robot

const GEMINI_TTS_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent';

// Convert PCM16 audio data to WAV format
function pcmToWav(pcmData, sampleRate = 24000) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = pcmData.length;
  
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  
  // RIFF header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');
  
  // fmt chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // chunk size
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  
  // data chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);
  
  // Copy PCM data
  const pcmView = new Uint8Array(buffer, 44);
  pcmView.set(new Uint8Array(pcmData));
  
  return buffer;
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
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
  const audioData = Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0));
  
  // Convert PCM to WAV
  const wavBuffer = pcmToWav(audioData.buffer);
  const blob = new Blob([wavBuffer], { type: 'audio/wav' });
  const url = URL.createObjectURL(blob);
  
  return url;
}