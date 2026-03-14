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
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: 'You are SideQuest AI, a helpful academic assistant for students. Help with studies, assignments, explanations, and academic questions. Be concise and clear.' },
            ...updatedMessages
          ]
        })
      })

      if (!response.ok) {
        const err = await response.json()
        console.error('Groq API error:', err)
        setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ Error: ${err.error?.message || 'Something went wrong'}` }])
        setLoading(false)
        return
      }

      const data = await response.json()
      const aiMessage = { role: 'assistant', content: data.choices[0].message.content }
      setMessages(prev => [...prev, aiMessage])
    } catch (err) {
      console.error('Groq error:', err)
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Something went wrong. Try again!' }])
    }

    setLoading(false)
  }

  return (
    <div className="ai-page" style={{ padding: '20px', height: 'calc(100vh - 40px)', display: 'flex', flexDirection: 'column' }}>
      <h1 className="page-title">AI Assistant</h1>

      <div style={{
        flex: 1, overflowY: 'auto', marginBottom: '16px',
        background: 'linear-gradient(135deg, #0d0d1f, #10102a)',
        border: '1px solid #2a1f6e', borderRadius: '4px', padding: '16px',
        display: 'flex', flexDirection: 'column', gap: '12px'
      }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', opacity: 0.4, marginTop: '40px' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🤖</div>
            <div style={{ fontSize: '13px', color: '#a78bfa', fontFamily: 'Cinzel, serif', letterSpacing: '1px' }}>SideQuest AI is ready</div>
            <div style={{ fontSize: '11px', color: '#4b5563', marginTop: '4px' }}>Ask anything about your studies!</div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
          }}>
            <div style={{
              maxWidth: '75%', padding: '10px 14px',
              fontSize: '13px', lineHeight: '1.6', fontFamily: 'Cinzel, serif',
              background: msg.role === 'user'
                ? 'linear-gradient(135deg, #5b21b6, #7c3aed)'
                : 'rgba(124,58,237,0.08)',
              color: msg.role === 'user' ? '#fff' : '#e0d0ff',
              border: msg.role === 'user' ? 'none' : '1px solid #2a1f6e',
              borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px'
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '10px 14px', borderRadius: '12px 12px 12px 2px',
              background: 'rgba(124,58,237,0.08)', border: '1px solid #2a1f6e',
              fontSize: '13px', color: '#a78bfa', fontFamily: 'Cinzel, serif'
            }}>
              ⚡ Thinking...
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Ask your academic question..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          style={{
            flex: 1, padding: '12px 16px', borderRadius: '2px',
            border: '1px solid #2a1f6e', background: 'rgba(124,58,237,0.05)',
            color: '#e0e0ff', fontSize: '13px', fontFamily: 'Cinzel, serif', outline: 'none'
          }}
        />
        <button onClick={sendMessage} disabled={loading} style={{
          padding: '12px 24px', borderRadius: '2px',
          background: loading ? '#2a1f6e' : 'linear-gradient(135deg, #5b21b6, #7c3aed)',
          color: 'white', border: 'none', fontSize: '12px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontFamily: 'Cinzel, serif', letterSpacing: '1px'
        }}>
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  )
}

export default AI