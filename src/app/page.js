'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// Game Data
const REALMS = [
  { id: 'starter', name: 'Starter Realm', minEnergy: 0, multiplier: 1, color: '#4fc3f7', icon: '🌟' },
  { id: 'nebula', name: 'Nebula Realm', minEnergy: 50000, multiplier: 2, color: '#ba68c8', icon: '🌌' },
  { id: 'supernova', name: 'Supernova Realm', minEnergy: 500000, multiplier: 3, color: '#ff7043', icon: '💥' },
  { id: 'blackhole', name: 'Black Hole Realm', minEnergy: 5000000, multiplier: 5, color: '#7c4dff', icon: '🕳️' },
  { id: 'multiverse', name: 'Multiverse Realm', minEnergy: 50000000, multiplier: 10, color: '#00e5ff', icon: '🌈' },
];

const UPGRADES = [
  // Click Power Upgrades
  { id: 'click1', name: 'Cosmic Touch', type: 'click', baseCost: 15, basePower: 1, description: '+1 per click', icon: '👆' },
  { id: 'click2', name: 'Stellar Power', type: 'click', baseCost: 150, basePower: 5, description: '+5 per click', icon: '⭐' },
  { id: 'click3', name: 'Galactic Force', type: 'click', baseCost: 1000, basePower: 20, description: '+20 per click', icon: '🌌' },
  { id: 'click4', name: 'Universal Might', type: 'click', baseCost: 8000, basePower: 100, description: '+100 per click', icon: '🌍' },
  { id: 'click5', name: 'Cosmic Emperor', type: 'click', baseCost: 50000, basePower: 500, description: '+500 per click', icon: '👑' },
  
  // Passive Income Upgrades
  { id: 'passive1', name: 'Cosmic Rift', type: 'passive', baseCost: 100, basePower: 1, description: '+1 per second', icon: '🌀' },
  { id: 'passive2', name: 'Star Stream', type: 'passive', baseCost: 500, basePower: 5, description: '+5 per second', icon: '💫' },
  { id: 'passive3', name: 'Galaxy Flow', type: 'passive', baseCost: 3000, basePower: 20, description: '+20 per second', icon: '🌊' },
  { id: 'passive4', name: 'Quantum Current', type: 'passive', baseCost: 15000, basePower: 80, description: '+80 per second', icon: '⚡' },
  { id: 'passive5', name: 'Dimensional Rift', type: 'passive', baseCost: 100000, basePower: 300, description: '+300 per second', icon: '🌀' },
  
  // Multiplier Upgrades
  { id: 'mult1', name: 'Energy Amplifier', type: 'multiplier', baseCost: 2000, basePower: 1.5, description: '1.5x all energy', icon: '🔮' },
  { id: 'mult2', name: 'Reality Warper', type: 'multiplier', baseCost: 15000, basePower: 2, description: '2x all energy', icon: '🔯' },
  { id: 'mult3', name: 'Cosmic Fortune', type: 'multiplier', baseCost: 80000, basePower: 2.5, description: '2.5x all energy', icon: '🍀' },
  
  // Critical Hit Upgrades
  { id: 'crit1', name: 'Lucky Star', type: 'crit', baseCost: 5000, basePower: 5, description: '5% crit chance', icon: '🍀' },
  { id: 'crit2', name: 'Fortune Crystal', type: 'crit', baseCost: 25000, basePower: 10, description: '10% crit chance', icon: '💎' },
  { id: 'crit3', name: 'Destiny Gem', type: 'crit', baseCost: 150000, basePower: 20, description: '20% crit chance', icon: '💠' },
];

const ACHIEVEMENTS = [
  { id: 'first_click', name: 'First Steps', description: 'Click 10 times', requirement: 10, icon: '👆' },
  { id: 'hundred_clicks', name: 'Getting Started', description: 'Click 100 times', requirement: 100, icon: '✋' },
  { id: 'thousand_clicks', name: 'Dedicated Clicker', description: 'Click 1000 times', requirement: 1000, icon: '🖐️' },
  { id: 'ten_k', name: 'Energy Hunter', description: 'Reach 10K total energy', requirement: 10000, icon: '⚡' },
  { id: 'hundred_k', name: 'Cosmic Collector', description: 'Reach 100K total energy', requirement: 100000, icon: '💎' },
  { id: 'million', name: 'Universal Power', description: 'Reach 1M total energy', requirement: 1000000, icon: '🌟' },
  { id: 'upgrade_10', name: 'Upgrader', description: 'Buy 10 upgrades', requirement: 10, icon: '⬆️' },
  { id: 'upgrade_50', name: 'Power Seeker', description: 'Buy 50 upgrades', requirement: 50, icon: '🚀' },
];

const DAILY_CHALLENGES = [
  { id: 'click_100', name: 'Click Frenzy', description: 'Click 100 times today', target: 100, reward: 1000, icon: '👆' },
  { id: 'earn_10k', name: 'Energy Rush', description: 'Earn 10,000 energy today', target: 10000, reward: 5000, icon: '⚡' },
  { id: 'buy_upgrade', name: 'Power Up', description: 'Buy any upgrade today', target: 1, reward: 500, icon: '⬆️' },
];

export default function CosmicClicker() {
  // Game State
  const [energy, setEnergy] = useState(0);
  const [totalEnergy, setTotalEnergy] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [upgrades, setUpgrades] = useState({});
  const [particles, setParticles] = useState([]);
  const [clickEffects, setClickEffects] = useState([]);
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [orbPulse, setOrbPulse] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [showAchievement, setShowAchievement] = useState(null);
  const [critFlash, setCritFlash] = useState(false);
  const [dailyProgress, setDailyProgress] = useState({});
  const [claimedRewards, setClaimedRewards] = useState([]);
  const [stars, setStars] = useState([]);
  const [activeTab, setActiveTab] = useState('upgrades');
  
  const particleId = useRef(0);
  const clickEffectId = useRef(0);
  const floatingTextId = useRef(0);

  // Generate stars on client only
  useEffect(() => {
    const generatedStars = [...Array(150)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${2 + Math.random() * 3}s`,
      size: Math.random() * 2 + 1
    }));
    setStars(generatedStars);
  }, []);

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

  const getCritChance = useCallback(() => {
    let chance = 0;
    UPGRADES.filter(u => u.type === 'crit').forEach(upgrade => {
      const count = upgrades[upgrade.id] || 0;
      chance += upgrade.basePower * count;
    });
    return Math.min(chance, 50); // Max 50% crit chance
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

  const getTotalUpgrades = useCallback(() => {
    return Object.values(upgrades).reduce((sum, count) => sum + count, 0);
  }, [upgrades]);

  const getUpgradeCost = (upgrade) => {
    const count = upgrades[upgrade.id] || 0;
    return Math.floor(upgrade.baseCost * Math.pow(1.18, count));
  };

  // Get current realm
  const currentRealm = REALMS.find(r => totalEnergy >= r.minEnergy) || REALMS[0];

  // Check achievements
  const checkAchievements = useCallback(() => {
    const newAchievements = [];
    
    ACHIEVEMENTS.forEach(achievement => {
      let progress = 0;
      if (achievement.id.includes('click')) {
        progress = totalClicks;
      } else if (achievement.id.includes('energy') || achievement.id.includes('ten_k') || achievement.id.includes('hundred_k') || achievement.id.includes('million')) {
        progress = totalEnergy;
      } else if (achievement.id.includes('upgrade')) {
        progress = getTotalUpgrades();
      }
      
      if (progress >= achievement.requirement) {
        newAchievements.push(achievement);
      }
    });
    
    // Show first unshown achievement
    if (newAchievements.length > 0) {
      const firstNew = newAchievements.find(a => !upgrades[`achievement_${a.id}`]);
      if (firstNew) {
        setShowAchievement(firstNew);
        setUpgrades(prev => ({ ...prev, [`achievement_${firstNew.id}`]: true }));
        setTimeout(() => setShowAchievement(null), 3000);
      }
    }
  }, [totalClicks, totalEnergy, getTotalUpgrades, upgrades]);

  // Load game from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cosmicClickerSave');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          setEnergy(data.energy || 0);
          setTotalEnergy(data.totalEnergy || 0);
          setTotalClicks(data.totalClicks || 0);
          setUpgrades(data.upgrades || {});
          setDailyProgress(data.dailyProgress || {});
          setClaimedRewards(data.claimedRewards || []);
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
        totalClicks,
        upgrades,
        dailyProgress,
        claimedRewards,
        lastSaved: Date.now(),
      };
      localStorage.setItem('cosmicClickerSave', JSON.stringify(data));
    }
  }, [energy, totalEnergy, totalClicks, upgrades, dailyProgress, claimedRewards, lastSaved]);

  // Passive income tick
  useEffect(() => {
    const interval = setInterval(() => {
      const passive = getPassiveIncome();
      if (passive > 0) {
        const mult = getMultiplier();
        const gain = passive * mult;
        setEnergy(e => e + gain);
        setTotalEnergy(t => t + gain);
        
        // Daily progress
        setDailyProgress(prev => ({
          ...prev,
          dailyEnergy: (prev.dailyEnergy || 0) + gain
        }));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [getPassiveIncome, getMultiplier]);

  // Achievement checker interval
  useEffect(() => {
    const interval = setInterval(() => {
      checkAchievements();
    }, 5000);
    return () => clearInterval(interval);
  }, [checkAchievements]);

  // Click handler
  const handleClick = (e) => {
    const clickPower = getClickPower();
    const mult = getMultiplier();
    const critChance = getCritChance();
    
    // Check for critical hit
    const isCrit = Math.random() * 100 < critChance;
    const critMultiplier = isCrit ? 5 : 1;
    
    const gain = Math.floor(clickPower * mult * critMultiplier);
    
    setEnergy(prev => prev + gain);
    setTotalEnergy(prev => prev + gain);
    setTotalClicks(prev => prev + 1);

    // Daily progress
    setDailyProgress(prev => ({
      ...prev,
      dailyClicks: (prev.dailyClicks || 0) + 1,
      dailyEnergy: (prev.dailyEnergy || 0) + gain
    }));

    // Critical hit effect
    if (isCrit) {
      setCritFlash(true);
      setTimeout(() => setCritFlash(false), 200);
    }

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
      isCrit,
      key: ftId
    }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(f => f.id !== ftId));
    }, 1000);

    // Particles
    const newParticles = [];
    const particleCount = isCrit ? 16 : 8;
    for (let i = 0; i < particleCount; i++) {
      const pId = particleId.current++;
      const angle = (Math.PI * 2 / particleCount) * i;
      const speed = (isCrit ? 5 : 3) + Math.random() * 3;
      newParticles.push({
        id: pId,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color: isCrit ? '#ffeb3b' : currentRealm.color,
        isCrit,
        key: pId
      });
    }
    setParticles(prev => [...prev, ...newParticles]);

    // Click ripple
    const ceId = clickEffectId.current++;
    setClickEffects(prev => [...prev, { id: ceId, x, y, isCrit, key: ceId }]);
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
            life: p.life - 0.025,
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
      
      // Daily progress
      setDailyProgress(prev => ({
        ...prev,
        dailyUpgrades: (prev.dailyUpgrades || 0) + 1
      }));
    }
  };

  // Claim daily reward
  const claimDailyReward = (challenge) => {
    const today = new Date().toDateString();
    if (!claimedRewards.includes(`${challenge.id}_${today}`)) {
      setEnergy(prev => prev + challenge.reward);
      setClaimedRewards(prev => [...prev, `${challenge.id}_${today}`]);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1e18) return (num / 1e18).toFixed(2) + 'E';
    if (num >= 1e15) return (num / 1e15).toFixed(2) + 'Q';
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return Math.floor(num).toString();
  };

  // Get unlocked achievements
  const unlockedAchievements = ACHIEVEMENTS.filter(a => upgrades[`achievement_${a.id}`]);

  return (
    <div className={`game-container ${critFlash ? 'crit-flash' : ''}`}>
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
              animationDuration: star.animationDuration,
              width: star.size,
              height: star.size
            }}
          />
        ))}
      </div>

      {/* Achievement Popup */}
      {showAchievement && (
        <div className="achievement-popup">
          <div className="achievement-icon">{showAchievement.icon}</div>
          <div className="achievement-text">
            <span className="achievement-title">Achievement Unlocked!</span>
            <span className="achievement-name">{showAchievement.name}</span>
          </div>
        </div>
      )}

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
          <div className="stat">
            <span className="stat-value">{getCritChance().toFixed(0)}%</span>
            <span className="stat-label">crit chance</span>
          </div>
        </div>
      </header>

      {/* Realm Badge */}
      <div className="realm-badge" style={{ borderColor: currentRealm.color, boxShadow: `0 0 20px ${currentRealm.color}40` }}>
        <span className="realm-icon">{currentRealm.icon}</span>
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
                className={`particle ${p.isCrit ? 'crit-particle' : ''}`}
                style={{
                  left: p.x,
                  top: p.y,
                  opacity: p.life,
                  backgroundColor: p.color,
                  transform: `scale(${p.life})`,
                  boxShadow: p.isCrit ? `0 0 15px ${p.color}` : 'none'
                }}
              />
            ))}

            {/* Click Effects */}
            {clickEffects.map(ce => (
              <div
                key={ce.key}
                className={`click-effect ${ce.isCrit ? 'crit-effect' : ''}`}
                style={{ left: ce.x, top: ce.y }}
              />
            ))}

            {/* Floating Texts */}
            {floatingTexts.map(ft => (
              <div
                key={ft.key}
                className={`floating-text ${ft.isCrit ? 'crit-text' : ''}`}
                style={{ left: ft.x, top: ft.y }}
              >
                {ft.isCrit && <span className="crit-label">CRIT! </span>}
                +{formatNumber(ft.value)}
              </div>
            ))}
          </div>
          
          <p className="click-hint">Click the orb to collect energy!</p>
          
          {/* Total Stats */}
          <div className="total-stats">
            <span>Total Clicks: {formatNumber(totalClicks)}</span>
            <span>Total Earned: {formatNumber(totalEnergy)}</span>
          </div>
        </div>

        {/* Side Panel with Tabs */}
        <aside className="side-panel">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'upgrades' ? 'active' : ''}`}
              onClick={() => setActiveTab('upgrades')}
            >
              Upgrades
            </button>
            <button 
              className={`tab ${activeTab === 'achievements' ? 'active' : ''}`}
              onClick={() => setActiveTab('achievements')}
            >
              Achievements
            </button>
            <button 
              className={`tab ${activeTab === 'challenges' ? 'active' : ''}`}
              onClick={() => setActiveTab('challenges')}
            >
              Daily
            </button>
          </div>

          {/* Upgrades Tab */}
          {activeTab === 'upgrades' && (
            <div className="upgrades-panel">
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
                      <span className="upgrade-icon">{upgrade.icon}</span>
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
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="achievements-panel">
              <div className="achievements-list">
                {ACHIEVEMENTS.map(achievement => {
                  const isUnlocked = upgrades[`achievement_${achievement.id}`];
                  let progress = 0;
                  if (achievement.id.includes('click')) {
                    progress = totalClicks;
                  } else if (achievement.id.includes('energy') || achievement.id.includes('ten_k') || achievement.id.includes('hundred_k') || achievement.id.includes('million')) {
                    progress = totalEnergy;
                  } else if (achievement.id.includes('upgrade')) {
                    progress = getTotalUpgrades();
                  }
                  
                  return (
                    <div 
                      key={achievement.id} 
                      className={`achievement-card ${isUnlocked ? 'unlocked' : ''}`}
                    >
                      <span className="achievement-icon">{achievement.icon}</span>
                      <div className="achievement-info">
                        <span className="achievement-name">{achievement.name}</span>
                        <span className="achievement-desc">{achievement.description}</span>
                        {!isUnlocked && (
                          <div className="achievement-progress">
                            <div 
                              className="achievement-progress-fill"
                              style={{ width: `${Math.min(100, (progress / achievement.requirement) * 100)}%` }}
                            />
                          </div>
                        )}
                      </div>
                      {isUnlocked && <span className="achievement-check">✓</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Daily Challenges Tab */}
          {activeTab === 'challenges' && (
            <div className="challenges-panel">
              <h3 className="panel-subtitle">Daily Challenges</h3>
              <div className="challenges-list">
                {DAILY_CHALLENGES.map(challenge => {
                  const today = new Date().toDateString();
                  const isClaimed = claimedRewards.includes(`${challenge.id}_${today}`);
                  let progress = 0;
                  if (challenge.id.includes('click')) {
                    progress = dailyProgress.dailyClicks || 0;
                  } else if (challenge.id.includes('earn')) {
                    progress = dailyProgress.dailyEnergy || 0;
                  } else if (challenge.id.includes('upgrade')) {
                    progress = dailyProgress.dailyUpgrades || 0;
                  }
                  const canClaim = progress >= challenge.target && !isClaimed;
                  
                  return (
                    <div 
                      key={challenge.id} 
                      className={`challenge-card ${canClaim ? 'claimable' : ''} ${isClaimed ? 'claimed' : ''}`}
                    >
                      <span className="challenge-icon">{challenge.icon}</span>
                      <div className="challenge-info">
                        <span className="challenge-name">{challenge.name}</span>
                        <span className="challenge-desc">{challenge.description}</span>
                        <div className="challenge-progress">
                          <div 
                            className="challenge-progress-fill"
                            style={{ width: `${Math.min(100, (progress / challenge.target) * 100)}%` }}
                          />
                        </div>
                        <span className="challenge-reward">Reward: {formatNumber(challenge.reward)} ✦</span>
                      </div>
                      {canClaim ? (
                        <button 
                          className="claim-button"
                          onClick={() => claimDailyReward(challenge)}
                        >
                          Claim!
                        </button>
                      ) : isClaimed ? (
                        <span className="claimed-badge">✓</span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
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
                <div className="realm-icon-box" style={{ backgroundColor: isUnlocked ? realm.color : 'rgba(255,255,255,0.1)' }}>
                  {realm.icon}
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
