interface GenerateMessageParams {
  dayIndex: number
  theme: string
  buyerName: string
  recipientName: string
}

export async function generateAIMessage(params: GenerateMessageParams): Promise<string> {
  const { dayIndex, theme, buyerName, recipientName } = params
  
  // OpenAI API çağrısı
  if (process.env.AI_PROVIDER === 'openai') {
    return await generateWithOpenAI(params)
  }
  
  // Anthropic Claude API çağrısı
  if (process.env.AI_PROVIDER === 'anthropic') {
    return await generateWithAnthropic(params)
  }
  
  // Fallback: Mock içerik
  return generateMockMessage(params)
}

async function generateWithOpenAI(params: GenerateMessageParams): Promise<string> {
  const { dayIndex, theme, buyerName, recipientName } = params
  
  const prompt = `Sen romantik ve duygusal bir hediye mesajı yazıyorsun. 
  
Gün: ${dayIndex}
Tema: ${theme}
Gönderen: ${buyerName}
Alıcı: ${recipientName}

Her gün farklı, samimi ve kişisel bir mesaj yaz. 2-3 cümle uzunluğunda olsun. Türkçe yaz.`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Sen romantik ve duygusal hediye mesajları yazan bir asistansın. Her mesaj samimi, kişisel ve günlük olmalı.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.8,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0].message.content.trim()
  } catch (error) {
    console.error('OpenAI API error:', error)
    return generateMockMessage(params)
  }
}

async function generateWithAnthropic(params: GenerateMessageParams): Promise<string> {
  const { dayIndex, theme, buyerName, recipientName } = params
  
  const prompt = `Sen romantik ve duygusal bir hediye mesajı yazıyorsun. 

Gün: ${dayIndex}
Tema: ${theme}
Gönderen: ${buyerName}
Alıcı: ${recipientName}

Her gün farklı, samimi ve kişisel bir mesaj yaz. 2-3 cümle uzunluğunda olsun. Türkçe yaz.`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 150,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
      }),
    })

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`)
    }

    const data = await response.json()
    return data.content[0].text.trim()
  } catch (error) {
    console.error('Anthropic API error:', error)
    return generateMockMessage(params)
  }
}

function generateMockMessage(params: GenerateMessageParams): string {
  const { dayIndex, theme, buyerName, recipientName } = params
  
  const messages = [
    `Sevgili ${recipientName}, bugün senin için özel bir gün. ${buyerName} olarak sana olan sevgimi bu güzel çiçekle ifade etmek istiyorum. 💕`,
    `Canım ${recipientName}, ${theme} temasıyla sana bu mesajı gönderiyorum. Her gün seni düşünüyorum ve seninle olmak beni mutlu ediyor. 🌸`,
    `Sevgili ${recipientName}, ${dayIndex}. günümüzde sana olan sevgim daha da büyüyor. Bu güzel anları seninle paylaşmak harika. 💖`,
    `Canım ${recipientName}, ${theme} ruhuyla sana bu mesajı yazıyorum. Sen benim hayatımın en güzel çiçeğisin. 🌺`,
    `Sevgili ${recipientName}, her gün seni daha çok seviyorum. Bu özel günde sana olan sevgimi bu çiçekle ifade etmek istiyorum. 💐`
  ]
  
  return messages[dayIndex % messages.length]
}
