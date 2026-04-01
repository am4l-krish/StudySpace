import { useState, useRef, useEffect } from "react";
import { initSession, continueSession, endSession } from "../utils/studyBuddy";
import { useAuth } from "../context/AuthContext";

const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY;

const RANK_COLORS = {
  S: { color: '#fac775', stroke: '#ba7517', text: '#0a0a14', label: 'Shadow Monarch' },
  A: { color: '#9fe1cb', stroke: '#1d9e75', text: '#0a0a14', label: 'National Level Hunter' },
  B: { color: '#85b7eb', stroke: '#185fa5', text: '#0a0a14', label: 'Elite Hunter' },
  C: { color: '#afa9ec', stroke: '#534ab7', text: '#0a0a14', label: 'Hunter' },
  D: { color: '#b4b2a9', stroke: '#5f5e5a', text: '#0a0a14', label: 'Novice Hunter' },
  E: { color: '#f09595', stroke: '#a32d2d', text: '#0a0a14', label: 'Weakest Hunter' },
};

function HexBadge({ rank, size = 100 }) {
  const r = RANK_COLORS[rank] || RANK_COLORS['E'];
  const fontSize = size * 0.36;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg" style={{ width: size, height: size, display: 'block' }}>
        {/* Outer hex ring */}
        <polygon points="36,4 63,20 63,52 36,68 9,52 9,20"
          fill={r.color} fillOpacity="0.18"
          stroke={r.color} strokeWidth="0.8" strokeOpacity="0.6" />
        {/* Mid hex */}
        <polygon points="36,10 57,22 57,50 36,62 15,50 15,22"
          fill={r.color} fillOpacity="0.1" />
        {/* Core hex */}
        <polygon points="36,16 53,26 53,46 36,56 19,46 19,26"
          fill={r.color} fillOpacity="0.9" />
        {/* Inner glow ring */}
        <polygon points="36,4 63,20 63,52 36,68 9,52 9,20"
          fill="none" stroke={r.color} strokeWidth="0.5" strokeOpacity="0.3"
          transform="scale(0.94) translate(2.2, 2.2)" />
        {/* Rank letter */}
        <text
          x="36" y="36"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="Cinzel, serif"
          fontWeight="900"
          fontSize={fontSize * (72 / size)}
          fill={r.text}
        >{rank}</text>
      </svg>
    </div>
  );
}

export default function AIAssistant() {
  const { user } = useAuth();
  const [mode, setMode] = useState("idle");
  const [topic, setTopicInput] = useState("");
  const [activeTopic, setActiveTopic] = useState("");
  const [history, setHistory] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, mode]);

  const startSession = async () => {
    if (!topic.trim()) return;
    setError("");
    setMode("loading");
    setActiveTopic(topic.trim());
    setHistory([]);
    setMessages([]);
    try {
      const reply = await initSession(GROQ_KEY, topic.trim());
      const firstMsg = { role: "assistant", content: reply };
      setMessages([firstMsg]);
      setHistory([firstMsg]);
      setMode("session");
    } catch (e) {
      setError("Failed to start session. Check your GROQ API key.");
      setMode("idle");
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || mode !== "session") return;
    const userMsg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    const newHistory = [...history, userMsg];
    setMessages(newMessages);
    setHistory(newHistory);
    setInput("");
    setMode("loading");
    try {
      const reply = await continueSession(GROQ_KEY, activeTopic, history, userMsg.content);
      const assistantMsg = { role: "assistant", content: reply };
      setMessages([...newMessages, assistantMsg]);
      setHistory([...newHistory, assistantMsg]);
      setMode("session");
    } catch (e) {
      setError("Something went wrong. Try again.");
      setMode("session");
    }
  };

  const finishSession = async () => {
    if (history.length < 2) {
      setError("Have at least one exchange before ending the session.");
      return;
    }
    setError("");
    setMode("loading");
    try {
      const summary = await endSession(GROQ_KEY, activeTopic, history);
      setResult(summary);
      setMode("result");

      if (user) {
        const sessionData = {
          ...summary,
          topic: activeTopic,
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        };
        localStorage.setItem(`studySession_${user.uid}`, JSON.stringify(sessionData));
      }
    } catch (e) {
      setError("Failed to generate summary. Try again.");
      setMode("session");
    }
  };

  const resetSession = () => {
    setMode("idle");
    setTopicInput("");
    setActiveTopic("");
    setHistory([]);
    setMessages([]);
    setResult(null);
    setError("");
    setInput("");
  };

  return (
    <div style={{ padding: "24px", maxWidth: "760px", margin: "0 auto", fontFamily: "var(--font-sans, sans-serif)" }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '11px', color: '#4b5563', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '6px' }}>
          ▸ System Notification
        </div>
        <h1 className="page-title">AI Study Buddy</h1>
        <div style={{
          background: 'rgba(124,58,237,0.08)',
          border: '1px solid rgba(124,58,237,0.2)',
          borderLeft: '3px solid #7c3aed',
          padding: '12px 16px', borderRadius: '2px',
          fontSize: '13px', color: '#a78bfa',
          letterSpacing: '0.5px', marginTop: '12px'
        }}>
          ⚡ Socratic tutor mode — answer questions to level up your understanding.
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '4px', padding: '10px 14px', fontSize: '13px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {/* IDLE */}
      {mode === "idle" && (
        <div style={{ background: 'linear-gradient(135deg, #0d0d1f, #10102a)', border: '1px solid #2a1f6e', borderRadius: '4px', padding: '24px' }}>
          <p style={{ fontSize: '13px', color: '#4b5563', marginBottom: '16px', marginTop: 0, letterSpacing: '0.5px' }}>
            Enter a topic or paste your notes to begin a Socratic session.
          </p>
          <textarea
            value={topic}
            onChange={e => setTopicInput(e.target.value)}
            placeholder="e.g. OS memory management, Paging and segmentation..."
            rows={4}
            style={{ width: '100%', boxSizing: 'border-box', fontSize: '13px', padding: '10px 12px', borderRadius: '2px', border: '1px solid #2a1f6e', background: 'rgba(124,58,237,0.04)', color: '#e2e8f0', resize: 'vertical', fontFamily: 'inherit' }}
          />
          <button
            onClick={startSession}
            disabled={!topic.trim()}
            style={{ marginTop: '12px', padding: '10px 24px', fontSize: '13px', fontWeight: 600, borderRadius: '2px', border: '1px solid #7c3aed', background: 'rgba(124,58,237,0.12)', color: '#a78bfa', cursor: topic.trim() ? 'pointer' : 'not-allowed', opacity: topic.trim() ? 1 : 0.5, letterSpacing: '1px' }}
          >
            BEGIN SESSION →
          </button>
        </div>
      )}

      {/* SESSION */}
      {(mode === "session" || (mode === "loading" && messages.length > 0)) && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', color: '#4b5563', letterSpacing: '1px' }}>
              TOPIC: <span style={{ color: '#a78bfa' }}>{activeTopic}</span>
            </span>
            <button
              onClick={finishSession}
              disabled={mode === "loading"}
              style={{ fontSize: '12px', padding: '6px 16px', borderRadius: '2px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.06)', color: '#ef4444', cursor: 'pointer', letterSpacing: '1px' }}
            >
              END SESSION
            </button>
          </div>

          <div style={{ border: '1px solid #2a1f6e', borderRadius: '4px', padding: '16px', minHeight: '320px', maxHeight: '440px', overflowY: 'auto', background: 'linear-gradient(135deg, #0d0d1f, #10102a)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '80%', padding: '10px 14px',
                  borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  background: msg.role === 'user' ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.04)',
                  border: msg.role === 'user' ? '1px solid rgba(124,58,237,0.3)' : '1px solid #2a1f6e',
                  color: msg.role === 'user' ? '#c4b5fd' : '#9ca3af',
                  fontSize: '13px', lineHeight: '1.6'
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {mode === "loading" && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '10px 14px', borderRadius: '12px 12px 12px 2px', background: 'rgba(255,255,255,0.04)', border: '1px solid #2a1f6e', fontSize: '13px', color: '#4b5563' }}>
                  Thinking...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Type your answer..."
              disabled={mode === "loading"}
              style={{ flex: 1, fontSize: '13px', padding: '10px 14px', borderRadius: '2px', border: '1px solid #2a1f6e', background: 'rgba(124,58,237,0.04)', color: '#e2e8f0', fontFamily: 'inherit' }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || mode === "loading"}
              style={{ padding: '10px 20px', fontSize: '13px', fontWeight: 600, borderRadius: '2px', border: '1px solid #7c3aed', background: 'rgba(124,58,237,0.12)', color: '#a78bfa', cursor: 'pointer', opacity: (!input.trim() || mode === "loading") ? 0.5 : 1, letterSpacing: '1px' }}
            >
              SEND
            </button>
          </div>
        </div>
      )}

      {/* LOADING initial */}
      {mode === "loading" && messages.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#4b5563', fontSize: '13px', letterSpacing: '1px' }}>
          SUMMONING YOUR STUDY DUNGEON...
        </div>
      )}

      {/* RESULT */}
      {mode === "result" && result && (() => {
        const rc = RANK_COLORS[result.rank] || RANK_COLORS['E'];
        return (
          <div>
            {/* Rank card */}
            <div style={{
              background: 'linear-gradient(135deg, #0d0d1f, #10102a)',
              border: `1px solid ${rc.color}33`,
              borderRadius: '4px',
              padding: '28px 24px',
              marginBottom: '16px',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))'
            }}>
              {/* Top shimmer line */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: `linear-gradient(90deg, transparent, ${rc.color}, transparent)` }} />

              <HexBadge rank={result.rank} size={100} />

              <div>
                <div style={{ fontSize: '10px', color: '#4b5563', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>Session Result</div>
                <div style={{ fontFamily: 'Cinzel, serif', fontSize: '28px', fontWeight: '900', color: rc.color, textShadow: `0 0 20px ${rc.color}55`, lineHeight: 1 }}>
                  {result.rank}-RANK
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px', letterSpacing: '1px' }}>
                  {rc.label}
                </div>
                <div style={{ fontSize: '12px', color: '#4b5563', marginTop: '8px', fontStyle: 'italic' }}>
                  "{result.message}"
                </div>
              </div>
            </div>

            {/* Score + Exchanges */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '4px', padding: '16px', textAlign: 'center' }}>
                <p style={{ fontSize: '11px', color: '#4b5563', margin: '0 0 4px', letterSpacing: '1px' }}>SCORE</p>
                <p style={{ fontSize: '32px', fontWeight: 700, margin: 0, color: '#a78bfa', fontFamily: 'Cinzel, serif' }}>{result.score}</p>
              </div>
              <div style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '4px', padding: '16px', textAlign: 'center' }}>
                <p style={{ fontSize: '11px', color: '#4b5563', margin: '0 0 4px', letterSpacing: '1px' }}>EXCHANGES</p>
                <p style={{ fontSize: '32px', fontWeight: 700, margin: 0, color: '#a78bfa', fontFamily: 'Cinzel, serif' }}>{history.filter(m => m.role === 'user').length}</p>
              </div>
            </div>

            {/* Strong / Needs Work */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: '4px', padding: '14px 16px' }}>
                <p style={{ fontSize: '10px', color: '#22c55e', fontWeight: 600, margin: '0 0 8px', letterSpacing: '1px' }}>STRONG</p>
                {result.strong?.map((c, i) => (
                  <p key={i} style={{ fontSize: '12px', margin: '0 0 4px', color: '#9ca3af' }}>• {c}</p>
                ))}
              </div>
              <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '4px', padding: '14px 16px' }}>
                <p style={{ fontSize: '10px', color: '#ef4444', fontWeight: 600, margin: '0 0 8px', letterSpacing: '1px' }}>NEEDS WORK</p>
                {result.weak?.map((c, i) => (
                  <p key={i} style={{ fontSize: '12px', margin: '0 0 4px', color: '#9ca3af' }}>• {c}</p>
                ))}
              </div>
            </div>

            {/* Tip */}
            <div style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.15)', borderRadius: '4px', padding: '12px 16px', fontSize: '12px', color: '#06b6d4', marginBottom: '20px', letterSpacing: '0.5px' }}>
              ⚡ {result.tip}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={resetSession}
                style={{ flex: 1, padding: '10px', fontSize: '13px', fontWeight: 600, borderRadius: '2px', border: '1px solid #2a1f6e', background: 'transparent', color: '#6b7280', cursor: 'pointer', letterSpacing: '1px' }}
              >
                NEW SESSION
              </button>
              <button
                onClick={() => { setMode('session'); setResult(null); }}
                style={{ flex: 1, padding: '10px', fontSize: '13px', fontWeight: 600, borderRadius: '2px', border: '1px solid #7c3aed', background: 'rgba(124,58,237,0.12)', color: '#a78bfa', cursor: 'pointer', letterSpacing: '1px' }}
              >
                CONTINUE SESSION
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}