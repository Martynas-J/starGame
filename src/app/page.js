'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// Game Data
const REALMS = [
  { id: 'starter', name: 'Starter Realm', minEnergy: 0, multiplier: 1, color: '#4fc3f7' },
  { id: 'nebula', name: 'Nebula Realm', minEnergy: 1000, multiplier: 2, color: '#ba68c8' },
  { id: 'supernova', name: 'Supernova Realm', minEnergy: 10000, multiplier: 5, color: '#ff7043' },
  { id: 'blackhole', name: 'Black Hole Realm', minEnergy: 100000, multiplier: 10, color: '#212121' },
];

const UPGRADES = [
  { id: 'click1', name: 'Cosmic Touch', type: 'click', baseCost: 10, basePower: 1, description: '+1 per click' },
  { id: 'click2', name: 'Stellar Power', type: 'click', baseCost: 100, basePower: 5, description: '+5 per click' },
  { id: 'click3', name: 'Galactic Force', type: 'click', baseCost: 500, basePower: 25, description: '+25 per click' },
  { id: 'click4', name: 'Universal Might', type: 'click', baseCost: 2500, basePower: 100, description: '+100 per click' },
  { id: 'passive1', name: 'Cosmic Rift', type: 'passive', baseCost: 50, basePower: 1, description: '+1 per second' },
  { id: 'passive2', name: 'Star Stream', type: 'passive', baseCost: 300, basePower: 5, description: '+5 per second' },
  { id: 'passive3', name: 'Galaxy Flow', type: 'passive', baseCost: 1500, basePower: 20, description: '+20 per second' },
  { id: 'passive4', name: 'Quantum Current', type: 'passive', baseCost: 7500, basePower: 100, description: '+100 per second' },
  { id: 'mult1', name: 'Energy Amplifier', type: 'multiplier', baseCost: 1000, basePower: 1.5, description: '1.5x all energy' },
  { id: 'mult2', name: 'Reality Warper', type: 'multiplier', baseCost: 5000, basePower: 2, description: '2x all energy' },
];

export default function CosmicClicker() {
  // Game State
  const [energy, setEnergy] = useState(0);
  const [totalEnergy, setTotalEnergy] = useState(0);
  const [upgrades, setUpgrades] = useState({});
  const [particles, setParticles] = useState([]);
  const [clickEffects, setClickEffects] = useState([]);
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [orbPulse, setOrbPulse] = useState(false);
  const [stars, setStars] = useState([]);
  const [lastSaved, setLastSaved] = useState(null);
  
  // Generate stars on client only
  useEffect(() => {
    const generatedStars = [...Array(100)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${2 + Math.random() * 3}s`
    }));
    setStars(generatedStars);
  }, []);
  
  const particleId = useRef(0);
  const clickEffectId = useRef(0);
  const floatingTextId = useRef(0);

  // Calculate stats
  const getClickPower = useCallback(() => {
    let power = 1;
    UPGRADES.filter(u => u.type === 'click').forEach(upgrade => {
      const count = upgrades[upgrade.id] || 0;
      power += upgrade.basePower * count;
    });
    return power;
  }, [upgrades]);

  const getPassiveIncome = useCallback(() => {
    let income = 0;
    UPGRADES.filter(u => u.type === 'passive').forEach(upgrade => {
      const count = upgrades[upgrade.id] || 0;
      income += upgrade.basePower * count;
    });
    return income;
  }, [upgrades]);

  const getMultiplier = useCallback(() => {
    let mult = 1;
    UPGRADES.filter(u => u.type === 'multiplier').forEach(upgrade => {
      const count = upgrades[upgrade.id] || 0;
      mult *= Math.pow(upgrade.basePower, count);
    });
    
    // Realm multiplier
    const currentRealm = REALMS.find(r => totalEnergy >= r.minEnergy) || REALMS[0];
    return mult * currentRealm.multiplier;
  }, [upgrades, totalEnergy]);

  const getUpgradeCost = (upgrade) => {
    const count = upgrades[upgrade.id] || 0;
    return Math.floor(upgrade.baseCost * Math.pow(1.15, count));
  };

  // Get current realm
  const currentRealm = REALMS.find(r => totalEnergy >= r.minEnergy) || REALMS[0];

  // Load game from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cosmicClickerSave');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          setEnergy(data.energy || 0);
          setTotalEnergy(data.totalEnergy || 0);
          setUpgrades(data.upgrades || {});
          setLastSaved(data.lastSaved);
        } catch (e) {
          console.error('Failed to load save:', e);
        }
      }
    }
  }, []);

  // Save game to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && lastSaved !== null) {
      const data = {
        energy,
        totalEnergy,
        upgrades,
        lastSaved: Date.now(),
      };
      localStorage.setItem('cosmicClickerSave', JSON.stringify(data));
    }
  }, [energy, totalEnergy, upgrades, lastSaved]);

  // Passive income tick
  useEffect(() => {
    const interval = setInterval(() => {
      const passive = getPassiveIncome();
      if (passive > 0) {
        const mult = getMultiplier();
        const gain = passive * mult;
        setEnergy(e => e + gain);
        setTotalEnergy(t => t + gain);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [getPassiveIncome, getMultiplier]);

  // Click handler
  const handleClick = (e) => {
    const clickPower = getClickPower();
    const mult = getMultiplier();
    const gain = Math.floor(clickPower * mult);
    
    setEnergy(prev => prev + gain);
    setTotalEnergy(prev => prev + gain);

    // Orb pulse animation
    setOrbPulse(true);
    setTimeout(() => setOrbPulse(false), 100);

    // Create particle burst
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Floating text
    const ftId = floatingTextId.current++;
    setFloatingTexts(prev => [...prev, {
      id: ftId,
      x,
      y,
      value: gain,
      key: ftId
    }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(f => f.id !== ftId));
    }, 1000);

    // Particles
    const newParticles = [];
    for (let i = 0; i < 8; i++) {
      const pId = particleId.current++;
      const angle = (Math.PI * 2 / 8) * i;
      const speed = 3 + Math.random() * 3;
      newParticles.push({
        id: pId,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color: currentRealm.color,
        key: pId
      });
    }
    setParticles(prev => [...prev, ...newParticles]);

    // Click ripple
    const ceId = clickEffectId.current++;
    setClickEffects(prev => [...prev, { id: ceId, x, y, key: ceId }]);
    setTimeout(() => {
      setClickEffects(prev => prev.filter(c => c.id !== ceId));
    }, 600);
  };

  // Update particles
  useEffect(() => {
    if (particles.length === 0) return;
    
    const interval = setInterval(() => {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 0.03,
            vy: p.vy + 0.1
          }))
          .filter(p => p.life > 0)
      );
    }, 16);
    
    return () => clearInterval(interval);
  }, [particles.length]);

  // Purchase upgrade
  const buyUpgrade = (upgrade) => {
    const cost = getUpgradeCost(upgrade);
    if (energy >= cost) {
      setEnergy(prev => prev - cost);
      setUpgrades(prev => ({
        ...prev,
        [upgrade.id]: (prev[upgrade.id] || 0) + 1
      }));
    }
  };

  const formatNumber = (num) => {
    if (num >= 1e15) return (num / 1e15).toFixed(2) + 'Q';
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return Math.floor(num).toString();
  };

  return (
    <div className="game-container">
      {/* Animated Background */}
      <div className="stars">
        {stars.length > 0 && stars.map((star) => (
          <div 
            key={star.id} 
            className="star"
            style={{
              left: star.left,
              top: star.top,
              animationDelay: star.animationDelay,
              animationDuration: star.animationDuration
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="header">
        <div className="energy-display">
          <span className="energy-icon">✦</span>
          <span className="energy-value">{formatNumber(energy)}</span>
          <span className="energy-label">Cosmic Energy</span>
        </div>
        <div className="stats">
          <div className="stat">
            <span className="stat-value">{formatNumber(getClickPower())}</span>
            <span className="stat-label">per click</span>
          </div>
          <div className="stat">
            <span className="stat-value">{formatNumber(getPassiveIncome())}</span>
            <span className="stat-label">per second</span>
          </div>
          <div className="stat">
            <span className="stat-value">{getMultiplier().toFixed(1)}x</span>
            <span className="stat-label">multiplier</span>
          </div>
        </div>
      </header>

      {/* Realm Badge */}
      <div className="realm-badge" style={{ borderColor: currentRealm.color, boxShadow: `0 0 20px ${currentRealm.color}40` }}>
        <span className="realm-name" style={{ color: currentRealm.color }}>{currentRealm.name}</span>
        <span className="realm-multiplier">{currentRealm.multiplier}x Multiplier</span>
      </div>

      {/* Main Game Area */}
      <main className="main-area">
        {/* Click Area */}
        <div className="click-area">
          <div 
            className={`cosmic-orb ${orbPulse ? 'pulse' : ''}`}
            style={{
              '--realm-color': currentRealm.color,
              boxShadow: `0 0 60px ${currentRealm.color}, 0 0 120px ${currentRealm.color}60, inset 0 0 60px ${currentRealm.color}40`
            }}
            onClick={handleClick}
          >
            <div className="orb-core" />
            <div className="orb-glow" />
            <div className="orb-rings">
              <div className="ring ring-1" />
              <div className="ring ring-2" />
              <div className="ring ring-3" />
            </div>
            
            {/* Particles */}
            {particles.map(p => (
              <div
                key={p.key}
                className="particle"
                style={{
                  left: p.x,
                  top: p.y,
                  opacity: p.life,
                  backgroundColor: p.color,
                  transform: `scale(${p.life})`
                }}
              />
            ))}

            {/* Click Effects */}
            {clickEffects.map(ce => (
              <div
                key={ce.key}
                className="click-effect"
                style={{ left: ce.x, top: ce.y }}
              />
            ))}

            {/* Floating Texts */}
            {floatingTexts.map(ft => (
              <div
                key={ft.key}
                className="floating-text"
                style={{ left: ft.x, top: ft.y }}
              >
                +{formatNumber(ft.value)}
              </div>
            ))}
          </div>
          
          <p className="click-hint">Click the orb to collect energy!</p>
        </div>

        {/* Upgrades Panel */}
        <aside className="upgrades-panel">
          <h2 className="panel-title">Upgrades</h2>
          <div className="upgrades-list">
            {UPGRADES.map(upgrade => {
              const cost = getUpgradeCost(upgrade);
              const canAfford = energy >= cost;
              const count = upgrades[upgrade.id] || 0;
              
              return (
                <button
                  key={upgrade.id}
                  className={`upgrade-card ${canAfford ? 'affordable' : ''}`}
                  onClick={() => buyUpgrade(upgrade)}
                  disabled={!canAfford}
                >
                  <div className="upgrade-info">
                    <span className="upgrade-name">{upgrade.name}</span>
                    <span className="upgrade-desc">{upgrade.description}</span>
                  </div>
                  <div className="upgrade-cost">
                    <span className="cost-value">{formatNumber(cost)}</span>
                    <span className="cost-label">✦</span>
                  </div>
                  <div className="upgrade-count">×{count}</div>
                </button>
              );
            })}
          </div>
        </aside>
      </main>

      {/* Realms Progress */}
      <div className="realms-progress">
        <h3 className="progress-title">Realm Progression</h3>
        <div className="realms-list">
          {REALMS.map((realm, index) => {
            const isUnlocked = totalEnergy >= realm.minEnergy;
            const nextRealm = REALMS[index + 1];
            const progress = nextRealm 
              ? Math.min(100, ((totalEnergy - realm.minEnergy) / (nextRealm.minEnergy - realm.minEnergy)) * 100)
              : 100;
            
            return (
              <div 
                key={realm.id} 
                className={`realm-item ${isUnlocked ? 'unlocked' : ''}`}
              >
                <div className="realm-icon" style={{ backgroundColor: realm.color }}>
                  {isUnlocked ? '✦' : '?'}
                </div>
                <div className="realm-details">
                  <span className="realm-title">{realm.name}</span>
                  <span className="realm-requirement">
                    {isUnlocked ? `${realm.multiplier}x` : `${formatNumber(realm.minEnergy)} ✦`}
                  </span>
                  {!isUnlocked && nextRealm && (
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${progress}%`, backgroundColor: realm.color }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
