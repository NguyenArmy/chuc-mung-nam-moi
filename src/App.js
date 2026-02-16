// src/App.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

// --- COMPONENT: CHÚ NGỰA CHIBI (Giữ nguyên) ---
const ChibiHorse = ({ mood }) => {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <path d="M40,140 Q20,120 30,100 T50,130" fill="#d84315" stroke="#bf360c" strokeWidth="3" />
      <ellipse cx="100" cy="155" rx="55" ry="40" fill="#ffab91" />
      <g fill="#ffab91" stroke="#d84315" strokeWidth="2">
        <rect x="60" y="180" width="15" height="20" rx="5" />
        <rect x="125" y="180" width="15" height="20" rx="5" />
        <rect x="60" y="195" width="15" height="5" fill="#5d4037" stroke="none" />
        <rect x="125" y="195" width="15" height="5" fill="#5d4037" stroke="none" />
      </g>
      <g transform="translate(0, -20)">
        <path d="M60,60 Q50,90 70,110 L90,100 Q80,80 70,60 Z" fill="#d84315" />
        <path d="M70,60 L60,30 L90,50 Z" fill="#ffab91" stroke="#d84315" strokeWidth="2" />
        <path d="M130,60 L140,30 L110,50 Z" fill="#ffab91" stroke="#d84315" strokeWidth="2" />
        <ellipse cx="100" cy="90" rx="50" ry="45" fill="#ffab91" stroke="#d84315" strokeWidth="2" />
        <path d="M80,50 Q100,30 120,50 Q110,70 100,65 Q90,70 80,50" fill="#d84315" />
        <ellipse cx="80" cy="85" rx="8" ry="12" fill="white" />
        <circle cx="80" cy="85" r="5" fill="black" />
        <circle cx="82" cy="82" r="2" fill="white" />
        <ellipse cx="120" cy="85" rx="8" ry="12" fill="white" />
        <circle cx="120" cy="85" r="5" fill="black" />
        <circle cx="118" cy="82" r="2" fill="white" />
        <g transform="translate(0, 10)">
          <ellipse cx="100" cy="100" rx="25" ry="18" fill="#ffccbc" opacity="0.8" />
          <circle cx="90" cy="95" r="2" fill="#d84315" />
          <circle cx="110" cy="95" r="2" fill="#d84315" />
          {mood === 'normal' && <path d="M95,105 Q100,110 105,105" fill="none" stroke="#bf360c" strokeWidth="2" strokeLinecap="round" />}
          {mood === 'happy' && <path d="M90,105 Q100,115 110,105" fill="none" stroke="#bf360c" strokeWidth="2" strokeLinecap="round" />}
          {mood === 'excited' && <circle cx="100" cy="108" r="5" fill="#3e2723" />}
        </g>
        <circle cx="70" cy="105" r="7" fill="#f48fb1" opacity="0.5" />
        <circle cx="130" cy="105" r="7" fill="#f48fb1" opacity="0.5" />
      </g>
    </svg>
  );
};

// --- DATA ---
const WISHES = [
  "Năm mới Tết đến\nRước hên vào nhà\nQuà cáp bao la\nMọi nhà no đủ",
  "Tiền vào như nước sông Đà\nTiền ra nhỏ giọt như cà phê phin",
  "Vạn sự như ý\nTỷ sự như mơ\nTriệu điều bất ngờ\nNgập tràn hạnh phúc",
  "Hay ăn chóng béo\nTiền nhiều như kẹo\nTình chặt như keo\nĐáng yêu như mèo",
  "Sức khỏe vô đối\nTiền bạc rủng rỉnh\nGia đình hạnh phúc\nCả năm sung túc"
];

const App = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [wish, setWish] = useState("");
  const [envelopeState, setEnvelopeState] = useState('closed');
  const [moneyValue, setMoneyValue] = useState("0");
  const [moneyStyle, setMoneyStyle] = useState(1);
  const [mascotMood, setMascotMood] = useState('normal');
  const [mascotTalk, setMascotTalk] = useState("Chào bạn! Năm mới phi nước đại nhé!");
  const [showTalk, setShowTalk] = useState(true);
  const canvasRef = useRef(null);

  // --- LOGIC PHÁO HOA LIÊN TỤC ---
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor(x, y) {
        // Nếu không có tọa độ, random ở nửa trên màn hình
        this.x = x || Math.random() * canvas.width;
        this.y = y || Math.random() * canvas.height * 0.6;
        this.size = Math.random() * 3 + 2; // Hạt to hơn chút
        this.speedX = Math.random() * 5 - 2.5; // Tốc độ nhanh hơn
        this.speedY = Math.random() * 5 - 2.5;
        const colors = ['#ff4081', '#ffd700', '#00e676', '#2979ff', '#ff3d00', '#ffffff'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.life = 100;
        this.gravity = 0.05; // Thêm trọng lực nhẹ
      }
      update() {
        this.speedY += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 1.5; // Tan biến nhanh hơn
        this.size *= 0.97; // Nhỏ lại
      }
      draw() {
        ctx.globalAlpha = this.life / 100;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const animate = () => {
      // TẠO HIỆU ỨNG ĐUÔI MỜ (Thay vì xóa sạch)
      // Sử dụng màu nền tối của body với độ trong suốt thấp
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = '#1a0000'; // Màu nền trùng với body
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;

      // Cập nhật và vẽ các hạt hiện có
      particles.forEach((p, i) => {
        p.update();
        p.draw();
        if (p.life <= 0 || p.size <= 0.1) particles.splice(i, 1);
      });

      // --- TỰ ĐỘNG BẮN PHÁO HOA LIÊN TỤC ---
      // Xác suất khoảng 3.5% mỗi khung hình sẽ có 1 vụ nổ mới
      if (Math.random() < 0.035) {
        const x = Math.random() * canvas.width;
        // Nổ ở khoảng 60% phía trên màn hình cho đẹp
        const y = Math.random() * canvas.height * 0.6;
        // Tạo chùm hạt (khoảng 35 hạt)
        for (let i = 0; i < 35; i++) {
          particles.push(new Particle(x, y));
        }
      }

      requestAnimationFrame(animate);
    };

    // Hàm bắn pháo hoa khi mở lì xì (bắn thêm nhiều hơn)
    canvas.burst = () => {
      for (let k = 0; k < 4; k++) {
        setTimeout(() => {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height / 2;
          for (let i = 0; i < 50; i++) particles.push(new Particle(x, y));
        }, k * 250);
      }
    };

    animate();
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const updateMascot = useCallback((mood, text) => {
    setMascotMood(mood); setShowTalk(false);
    setTimeout(() => { setMascotTalk(text); setShowTalk(true); }, 100);
  }, []);

  // --- XỬ LÝ SỰ KIỆN ---
  const handleStart = () => {
    setWish(WISHES[Math.floor(Math.random() * WISHES.length)]);
    setIsFlipped(true);
    updateMascot('happy', 'Oa! Lời chúc hay quá! Mở lì xì đi nào!');
  };

  const handleOpenEnvelope = (e) => {
    e.stopPropagation();
    if (envelopeState !== 'closed') return;

    // Random tiền lẻ
    const rawValue = Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000;
    const formattedValue = rawValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    const randomStyle = Math.floor(Math.random() * 5) + 1;

    setMoneyValue(formattedValue);
    setMoneyStyle(randomStyle);
    setEnvelopeState('opened');

    updateMascot('excited', `Wow! ${formattedValue} VNĐ! Số đẹp quá!`);

    // Bắn thêm pháo hoa chúc mừng
    if (canvasRef.current && canvasRef.current.burst) canvasRef.current.burst();
  };

  const handleReset = (e) => {
    e.stopPropagation();
    setIsFlipped(false);
    setTimeout(() => {
      setEnvelopeState('closed');
      setMoneyValue("0");
      updateMascot('normal', 'Bấm lại để nhận lộc tiếp nha!');
    }, 600);
  };

  return (
    <div className="app-container">
      <canvas ref={canvasRef} id="canvas-fireworks" />

      <div className="card-scene">
        <div className="mascot-container">
          <div className={`speech-bubble ${showTalk ? 'show' : ''}`}>{mascotTalk}</div>
          <ChibiHorse mood={mascotMood} />
        </div>

        <div className="card">
          {/* MẶT TRƯỚC */}
          <div className={`card-face card-front ${isFlipped ? 'fall-down' : ''}`} onClick={handleStart}>
            <div className="pattern-bg"></div>
            <h1 className="front-title">2026</h1>
            <span className="front-subtitle">XUÂN ẤT TỴ</span>
            <button className="btn-start">KHAI XUÂN ĐÓN LỘC</button>
          </div>

          {/* MẶT SAU */}
          <div className={`card-face card-back ${isFlipped ? 'rise-up' : ''}`}>
            <div className="wish-text">
              {wish.split('\n').map((line, i) => <div key={i}>{line}</div>)}
            </div>

            <div className="envelope-area">
              {envelopeState === 'opened' ? (
                <div className={`money-bill money-style-${moneyStyle}`}>
                  <div className="money-content">
                    <span className="money-label">NGÂN HÀNG MAY MẮN</span>
                    <div>
                      <span>{moneyValue}</span>
                      <span className="money-unit"> VNĐ</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="viet-envelope" onClick={handleOpenEnvelope}>
                  <div className="coin-decoration">Lộc</div>
                </div>
              )}
            </div>

            {envelopeState === 'opened' && (
              <button className="btn-reset" onClick={handleReset}>Xin quẻ khác</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;