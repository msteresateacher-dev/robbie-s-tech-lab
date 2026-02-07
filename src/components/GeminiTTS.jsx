// Gemini TTS Integration for Robbie the Robot

const GEMINI_TTS_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent';

// Convert PCM16 audio data to WAV format
function encodeWAV(samples, sampleRate = 24000) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const bytesPerSample = bitsPerSample / 8;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  
  // Convert samples to Int16Array if needed
  let int16Samples;
  if (samples instanceof Int16Array) {
    int16Samples = samples;
  } else {
    // Assume it's raw bytes, convert to Int16
    int16Samples = new Int16Array(samples.buffer || samples);
  }
  
  const dataSize = int16Samples.length * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  
  // RIFF chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true); // file size - 8
  writeString(view, 8, 'WAVE');
  
  // fmt sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // subchunk size (16 for PCM)
  view.setUint16(20, 1, true); // audio format (1 = PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  
  // data sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);
  
  // Write audio samples
  const offset = 44;
  for (let i = 0; i < int16Samples.length; i++) {
    view.setInt16(offset + i * 2, int16Samples[i], true);
  }
  
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
  const mimeType = data.candidates[0].content.parts[0].inlineData.mimeType || 'audio/pcm';
  
  // Decode base64 to raw PCM bytes
  const binaryString = atob(audioBase64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  // Convert to Int16Array (PCM16 format)
  const int16Array = new Int16Array(bytes.buffer);
  
  // Determine sample rate from mimeType or use default
  const sampleRate = mimeType.includes('rate=') 
    ? parseInt(mimeType.split('rate=')[1]) 
    : 24000;
  
  // Convert PCM to WAV with proper encoding
  const wavBuffer = encodeWAV(int16Array, sampleRate);
  const blob = new Blob([wavBuffer], { type: 'audio/wav' });
  const url = URL.createObjectURL(blob);
  
  return url;
}