// Gemini TTS Integration for Robbie the Robot

const GEMINI_TTS_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent';

// Convert PCM16 audio data to WAV format
function encodeWAV(pcmData, sampleRate = 24000) {
  const numChannels = 1;
  const bitsPerSample = 16;
  
  // Ensure pcmData is Int16Array
  const samples = pcmData instanceof Int16Array ? pcmData : new Int16Array(pcmData);
  const numSamples = samples.length;
  const dataSize = numSamples * 2; // 2 bytes per sample (16-bit)
  
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  
  // RIFF chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');
  
  // fmt sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // PCM
  view.setUint16(20, 1, true); // Linear PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true); // byte rate
  view.setUint16(32, numChannels * 2, true); // block align
  view.setUint16(34, bitsPerSample, true);
  
  // data sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);
  
  // Write PCM samples as little-endian
  const offset = 44;
  for (let i = 0; i < numSamples; i++) {
    view.setInt16(offset + i * 2, samples[i], true);
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
  
  console.log('API Response:', data);
  
  // Extract audio data from response
  if (!data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data) {
    throw new Error('No audio data in response');
  }

  const audioBase64 = data.candidates[0].content.parts[0].inlineData.data;
  const mimeType = data.candidates[0].content.parts[0].inlineData.mimeType || 'audio/pcm';
  
  console.log('MimeType:', mimeType);
  console.log('Base64 length:', audioBase64.length);
  
  // Decode base64 to bytes
  const binaryString = atob(audioBase64);
  const byteArray = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    byteArray[i] = binaryString.charCodeAt(i);
  }
  
  console.log('Decoded bytes:', byteArray.length);
  
  // Create Int16Array from bytes (little-endian PCM16)
  const buffer = byteArray.buffer;
  const int16Array = new Int16Array(buffer);
  
  console.log('PCM samples:', int16Array.length);
  
  // Extract sample rate from mimeType (e.g., "audio/pcm;rate=24000")
  let sampleRate = 24000;
  if (mimeType.includes('rate=')) {
    const match = mimeType.match(/rate=(\d+)/);
    if (match) {
      sampleRate = parseInt(match[1]);
    }
  }
  
  console.log('Sample rate:', sampleRate);
  
  // Encode as WAV
  const wavBuffer = encodeWAV(int16Array, sampleRate);
  const blob = new Blob([wavBuffer], { type: 'audio/wav' });
  const url = URL.createObjectURL(blob);
  
  console.log('WAV URL created:', url);
  
  return url;
}