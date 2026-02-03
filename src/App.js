// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// --- COMPONENT: CHÚ RỒNG CHIBI (SVG) ---
const ChibiDragon = ({ mood }) => {
  // mood: 'normal', 'happy', 'excited'
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="dragon-svg">
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Đuôi rồng */}
      <path d="M40,160 Q20,140 30,120 T60,150" fill="#4caf50" stroke="#2e7d32" strokeWidth="3" />

      {/* Thân rồng */}
      <ellipse cx="100" cy="160" rx="50" ry="40" fill="#66bb6a" />
      <path d="M70,160 Q100,190 130,160" fill="none" stroke="#a5d6a7" strokeWidth="3" opacity="0.5" />

      {/* Đầu rồng */}
      <g transform="translate(0, -10)">
        {/* Sừng */}
        <path d="M80,80 Q70,50 60,60" fill="#ffca28" stroke="#f57f17" strokeWidth="2" />
        <path d="M120,80 Q130,50 140,60" fill="#ffca28" stroke="#f57f17" strokeWidth="2" />

        {/* Mặt */}
        <circle cx="100" cy="100" r="45" fill="#66bb6a" stroke="#2e7d32" strokeWidth="2" />

        {/* Mắt to tròn */}
        <ellipse cx="85" cy="95" rx="8" ry="12" fill="white" />
        <circle cx="85" cy="95" r="5" fill="black" />
        <circle cx="87" cy="92" r="2" fill="white" /> {/* Đốm sáng mắt */}

        <ellipse cx="115" cy="95" rx="8" ry="12" fill="white" />
        <circle cx="115" cy="95" r="5" fill="black" />
        <circle cx="113" cy="92" r="2" fill="white" />

        {/* Má hồng */}
        <circle cx="75" cy="110" r="6" fill="#f48fb1" opacity="0.6" />
        <circle cx="125" cy="110" r="6" fill="#f48fb1" opacity="0.6" />

        {/* Miệng thay đổi theo mood */}
        {mood === 'normal' && <path d="M95,115 Q100,120 105,115" fill="none" stroke="#1b5e20" strokeWidth="2" strokeLinecap="round" />}
        {mood === 'happy' && <path d="M90,115 Q100,125 110,115" fill="none" stroke="#1b5e20" strokeWidth="2" strokeLinecap="round" />}
        {mood === 'excited' && <circle cx="100" cy="118" r="5" fill="#3e2723" />}
      </g>

      {/* Tay nhỏ */}
      <circle cx="70" cy="150" r="10" fill="#4caf50" />
      <circle cx="130" cy="150" r="10" fill="#4caf50" />
    </svg>
  );
};

const WISHES = [
  "Chúc bạn năm mới:\nSức khỏe vô biên\nKiếm được nhiều tiền\nĐời sướng như tiên",
  "Tân niên tân phúc tân phú quý\nTấn tài tấn lộc tấn bình an",
  "Tiền vào cửa trước\nVàng vào cửa sau\nHai cái gặp nhau\nChui vào két sắt",
  "Hay ăn chóng béo\nTiền nhiều như kẹo\nTình chặt như keo\nĐáng yêu như mèo"
];

const App = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [wish, setWish] = useState("");
  const [envelopeState, setEnvelopeState] = useState('closed'); // 'closed', 'opening', 'opened'
  const [money, setMoney] = useState(0);

  // Trạng thái Rồng
  const [dragonMood, setDragonMood] = useState('normal');
  const [dragonTalk, setDragonTalk] = useState("Chào bạn! Năm mới vui vẻ nhé!");

  const canvasRef = useRef(null);

  // --- LOGIC PHÁO HOA (GIỮ NGUYÊN) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particles = [];
    const resizeCanvas = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = `hsl(${Math.random() * 60 + 10}, 100%, 50%)`; // Tone vàng cam đỏ
      }
      update() { this.x += this.speedX; this.y += this.speedY; if (this.size > 0.1) this.size -= 0.005; }
      draw() { ctx.fillStyle = this.color; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); }
    }
    const animate = () => {
      ctx.fillStyle = 'rgba(43, 10, 10, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => { p.update(); p.draw(); if (p.size <= 0.1) particles.splice(i, 1); });
      if (particles.length < 80) particles.push(new Particle());
      requestAnimationFrame(animate);
    }
    animate();
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // --- XỬ LÝ SỰ KIỆN ---

  const handleStart = () => {
    const randomWish = WISHES[Math.floor(Math.random() * WISHES.length)];
    setWish(randomWish);
    setIsFlipped(true);

    // Rồng phản ứng
    setDragonMood('happy');
    setDragonTalk("Oa! Lời chúc hay quá! Mau mở lì xì đi!");
  };

  const handleOpenEnvelope = () => {
    if (envelopeState !== 'closed') return;
    setEnvelopeState('opening');
    setDragonMood('excited');
    setDragonTalk("Hồi hộp quá! Bao nhiêu đây?");

    setTimeout(() => {
      const randomMoney = Math.random() > 0.5 ? 10000 : 5000;
      setMoney(randomMoney);
      setEnvelopeState('opened');

      if (randomMoney === 10000) setDragonTalk("Wow! 10k luôn! Đại gia rồi!");
      else setDragonTalk("5k lấy lộc đầu năm nha!");
    }, 1000);
  };

  const handleReset = (e) => {
    e.stopPropagation();
    setIsFlipped(false);
    setEnvelopeState('closed');
    setMoney(0);
    setDragonMood('normal');
    setDragonTalk("Bấm lại để nhận lộc tiếp nha!");
  };

  return (
    <div className="app-container">
      <canvas ref={canvasRef} />

      <div className="card-scene">

        {/* --- CHÚ RỒNG CHỈ DẪN --- */}
        <div className="mascot-container">
          <div className="speech-bubble">{dragonTalk}</div>
          <ChibiDragon mood={dragonMood} />
        </div>

        <div className={`card ${isFlipped ? 'is-flipped' : ''}`}>

          {/* MẶT TRƯỚC */}
          <div className="card-face card-front" onClick={handleStart}>
            <div className="pattern-bg"></div>
            <h1 style={{ fontFamily: 'Dancing Script', fontSize: '3.5rem', margin: 0, textShadow: '2px 2px 4px black' }}>2026</h1>
            <h2 style={{ color: '#fffde7', marginBottom: '30px', fontSize: '1.2rem' }}>CHÚC MỪNG NĂM MỚI</h2>
            <button className="btn-start">KHAI XUÂN</button>
          </div>

          {/* MẶT SAU */}
          <div className="card-face card-back">
            <div className="corner-decoration top-left"></div>
            <div className="corner-decoration top-right"></div>
            <div className="corner-decoration bottom-left"></div>
            <div className="corner-decoration bottom-right"></div>

            <div className="wish-text">
              {wish.split('\n').map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>

            <div className="envelope-wrapper">
              {envelopeState === 'opened' ? (
                <div className={`money-bill ${money === 10000 ? 'money-10k' : 'money-5k'}`}>
                  <span className="money-label">NGÂN HÀNG ĐỊA PHỦ</span>
                  <span>{money === 10000 ? '10.000' : '5.000'}</span>
                  <span style={{ fontSize: '1rem' }}>VNĐ</span>
                </div>
              ) : (
                <div
                  className={`viet-envelope ${envelopeState === 'opening' ? 'shake' : ''}`}
                  onClick={handleOpenEnvelope}
                >
                  <div className="coin-decoration">Lộc</div>
                </div>
              )}
            </div>

            {envelopeState === 'opened' && (
              <button style={{ marginTop: '20px', padding: '8px 20px', borderRadius: '20px', border: 'none', cursor: 'pointer', background: '#d32f2f', color: 'white' }} onClick={handleReset}>
                Xin quẻ khác
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;