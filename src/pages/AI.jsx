import { useState } from 'react'

function AI() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = { role: 'user', content: input }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_OPENAI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: updatedMessages.map(msg => ({
              role: msg.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: msg.content }]
            })),
            systemInstruction: {
              parts: [{ text: 'You are an AI study assistant for a student app called SideQuest. Help students with studies, explain concepts, solve problems, and give study tips. Keep responses concise and clear.' }]
            }
          })
        }
      )
      
      const data = await response.json()
      
      if (data.error) {
        setMessages([...updatedMessages, { role: 'assistant', content: `⚠ ${data.error.message}` }])
      } else {
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '⚠ No response received.'
        setMessages([...updatedMessages, { role: 'assistant', content: text }])
      }
    } catch (err) {
      setMessages([...updatedMessages, { role: 'assistant', content: '⚠ Error connecting to AI. Please try again.' }])
    }

    setLoading(false)
  }

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 72px)' }}>
      <h1 className="page-title">AI Assistant</h1>

      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '80px', color: '#4b5563' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>⚡</div>
            <div style={{ fontFamily: 'Cinzel, serif', color: '#a78bfa', fontSize: '14px', letterSpacing: '2px', marginBottom: '8px' }}>SYSTEM READY</div>
            <div style={{ fontSize: '12px', letterSpacing: '1px' }}>Ask me anything about your studies...</div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '70%', padding: '12px 16px', borderRadius: '4px',
              fontSize: '14px', lineHeight: '1.6',
              background: msg.role === 'user' ? 'linear-gradient(135deg, #5b21b6, #7c3aed)' : 'linear-gradient(135deg, #0d0d1f, #10102a)',
              border: msg.role === 'user' ? 'none' : '1px solid #2a1f6e',
              color: '#e0e0ff',
              boxShadow: msg.role === 'user' ? '0 0 16px rgba(124,58,237,0.3)' : 'none'
            }}>
              {msg.role === 'assistant' && (
                <div style={{ fontSize: '10px', color: '#a78bfa', letterSpacing: '2px', marginBottom: '6px', fontFamily: 'Cinzel, serif' }}>⚡ SYSTEM</div>
              )}
              <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ padding: '12px 16px', background: 'linear-gradient(135deg, #0d0d1f, #10102a)', border: '1px solid #2a1f6e', borderRadius: '4px', color: '#a78bfa', fontSize: '12px', letterSpacing: '2px', fontFamily: 'Cinzel, serif' }}>
              ⚡ Processing...
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Ask your question..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          style={{
            flex: 1, padding: '12px 16px', borderRadius: '2px',
            border: '1px solid #2a1f6e', background: 'rgba(124,58,237,0.05)',
            color: '#e0e0ff', fontSize: '14px', fontFamily: 'Cinzel, serif', outline: 'none'
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            padding: '12px 24px', borderRadius: '2px',
            background: loading ? '#1e1a4a' : 'linear-gradient(135deg, #5b21b6, #7c3aed)',
            color: loading ? '#4b5563' : 'white', border: 'none',
            fontSize: '12px', cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'Cinzel, serif', letterSpacing: '1px'
          }}
        >
          {loading ? '...' : 'Send ⚡'}
        </button>
      </div>
    </div>
  )
}

export default AI