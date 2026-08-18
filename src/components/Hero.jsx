import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function AnimatedStat({ value }) {
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    if (!value) return;

    const isNumeric = /\d/.test(value);
    let animationFrameId;
    let intervalId;
    let timeoutId;

    const startAnimation = () => {
      if (isNumeric) {
        const numericString = value.replace(/[^\d.-]/g, '');
        const number = parseFloat(numericString);

        if (isNaN(number)) {
          setDisplayValue(value);
          return;
        }

        const hasCommas = value.includes(',');
        const prefixMatch = value.match(/^[^\d.-]+/);
        const prefix = prefixMatch ? prefixMatch[0] : '';
        const suffixMatch = value.match(/[^\d.,]+$/);
        const suffix = suffixMatch ? suffixMatch[0] : '';

        const duration = 2000;
        const startTime = performance.now();

        const animate = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const currentNumber = Math.floor(easeProgress * number);

          let formattedNumber = currentNumber.toString();
          if (hasCommas) {
            formattedNumber = currentNumber.toLocaleString('en-US');
          }

          setDisplayValue(`${prefix}${formattedNumber}${suffix}`);

          if (progress < 1) {
            animationFrameId = requestAnimationFrame(animate);
          } else {
            setDisplayValue(value);
          }
        };

        animationFrameId = requestAnimationFrame(animate);
      } else {
        let currentText = '';
        const totalChars = value.length;
        const duration = 2000;
        const timePerChar = duration / totalChars;

        let index = 0;
        intervalId = setInterval(() => {
          currentText += value[index];
          setDisplayValue(currentText);
          index++;
          if (index >= totalChars) {
            clearInterval(intervalId);
            setDisplayValue(value);
          }
        }, timePerChar);
      }
    };

    // Delay animation to sync with LoadingScreen fade out (1100ms fade start + 400ms)
    timeoutId = setTimeout(startAnimation, 1500);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [value]);

  return <>{displayValue}</>;
}

export default function Hero({ heroConfig, onExplorePrograms, onApplyNow }) {
  const customBgStyle = heroConfig?.backgroundImage 
    ? { '--hero-bg-url': `url("${heroConfig.backgroundImage}")` } 
    : {};

  return (
    <section className="hero-section" style={customBgStyle}>
      <div className="hero-badge" data-aos="fade-down">
        <span>{heroConfig?.badge}</span>
      </div>

      <h1 className="hero-title" data-aos="fade-up" data-aos-delay="100">
        {heroConfig?.title}
      </h1>

      <div className="hero-cta-group" data-aos="zoom-in" data-aos-delay="200">
        <a href="#programs" className="btn btn-gold" onClick={onExplorePrograms} style={{ padding: '14px 28px', fontSize: '15px', color: '#ffffff', fontWeight: 'bold', textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>
          📑 Explore Online Programs
        </a>
        <Link to="/apply" className="btn btn-maroon" style={{ padding: '14px 28px', fontSize: '15px' }}>
          🎓 Apply Now
        </Link>
      </div>

      <div className="hero-stats-row">
        {heroConfig?.stats?.map((stat, idx) => (
          <div className="stat-card" key={`hero-stat-${idx}`} data-aos="fade-up" data-aos-delay={300 + (idx * 100)}>
            <div className="stat-num"><AnimatedStat value={stat.num} /></div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
