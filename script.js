
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const authorSection = document.getElementById('author-section');
const newQuoteBtn = document.getElementById('new-quote-btn');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.querySelector('.theme-icon');

// Gamification system
let userProgress = {
  level: parseInt(localStorage.getItem('userLevel')) || 1,
  xp: parseInt(localStorage.getItem('userXP')) || 0,
  quotesRead: parseInt(localStorage.getItem('quotesRead')) || 0,
  streak: parseInt(localStorage.getItem('streak')) || 1,
  lastVisit: localStorage.getItem('lastVisit') || new Date().toDateString(),
  favorites: JSON.parse(localStorage.getItem('favorites')) || [],
  achievements: JSON.parse(localStorage.getItem('achievements')) || [],
  dailyChallengeProgress: parseInt(localStorage.getItem('dailyChallengeProgress')) || 0,
  totalDays: parseInt(localStorage.getItem('totalDays')) || 1,
  unlockedThemes: JSON.parse(localStorage.getItem('unlockedThemes')) || ['default', 'dark']
};

// Achievement system
const achievements = [
  { id: 'first_quote', name: 'First Steps', description: 'Read your first quote!', icon: '🌟', xp: 10 },
  { id: 'quote_5', name: 'Getting Started', description: 'Read 5 quotes!', icon: '📚', xp: 25 },
  { id: 'quote_25', name: 'Wisdom Seeker', description: 'Read 25 quotes!', icon: '🔍', xp: 50 },
  { id: 'quote_100', name: 'Quote Master', description: 'Read 100 quotes!', icon: '🎓', xp: 100 },
  { id: 'streak_7', name: 'Week Warrior', description: '7-day streak!', icon: '🔥', xp: 75 },
  { id: 'streak_30', name: 'Monthly Master', description: '30-day streak!', icon: '💪', xp: 200 },
  { id: 'favorite_10', name: 'Collector', description: 'Save 10 favorites!', icon: '❤️', xp: 50 },
  { id: 'daily_challenge', name: 'Daily Hero', description: 'Complete daily challenge!', icon: '🏆', xp: 75 },
  { id: 'theme_unlock', name: 'Style Master', description: 'Unlock 3 themes!', icon: '🎨', xp: 60 },
  { id: 'speed_reader', name: 'Speed Reader', description: 'Read 10 quotes in one session!', icon: '⚡', xp: 40 }
];

// Level system - XP needed for each level
const levelRequirements = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200, 4000];

// Theme system
const themes = [
  { id: 'default', name: 'Ocean Breeze', unlockLevel: 1 },
  { id: 'dark', name: 'Midnight', unlockLevel: 1 },
  { id: 'sunset', name: 'Golden Sunset', unlockLevel: 3 },
  { id: 'forest', name: 'Mystic Forest', unlockLevel: 5 },
  { id: 'space', name: 'Cosmic Voyage', unlockLevel: 8 },
  { id: 'rainbow', name: 'Rainbow Dreams', unlockLevel: 10 }
];

let sessionQuotes = 0;
let comboCounter = 0;

// Enhanced fallback quotes with categories
const fallbackQuotes = [
  { content: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "motivation" },
  { content: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs", category: "leadership" },
  { content: "Life is what happens to you while you're busy making other plans.", author: "John Lennon", category: "wisdom" },
  { content: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", category: "inspiration" },
  { content: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle", category: "resilience" },
  { content: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", category: "perseverance" },
  { content: "The only impossible journey is the one you never begin.", author: "Tony Robbins", category: "motivation" },
  { content: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", category: "wisdom" },
  { content: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "confidence" },
  { content: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt", category: "mindset" },
  { content: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson", category: "persistence" },
  { content: "Keep your face always toward the sunshine—and shadows will fall behind you.", author: "Walt Whitman", category: "positivity" },
  { content: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb", category: "action" },
  { content: "Your limitation—it's only your imagination.", author: "Unknown", category: "potential" },
  { content: "Great things never come from comfort zones.", author: "Unknown", category: "growth" },
  { content: "Dream big and dare to fail.", author: "Norman Vaughan", category: "courage" },
  { content: "The way to get started is to quit talking and begin doing.", author: "Walt Disney", category: "action" },
  { content: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller", category: "excellence" },
  { content: "If you really look closely, most overnight successes took a long time.", author: "Steve Jobs", category: "patience" },
  { content: "The real test is not whether you avoid this failure, because you won't. It's whether you let it harden or shame you into inaction, or whether you learn from it; whether you choose to persevere.", author: "Barack Obama", category: "resilience" }
];

// Theme management
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'default';
  applyTheme(savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const availableThemes = userProgress.unlockedThemes;
  const currentTheme = localStorage.getItem('theme') || 'default';
  const currentIndex = availableThemes.indexOf(currentTheme);
  const nextIndex = (currentIndex + 1) % availableThemes.length;
  const newTheme = availableThemes[nextIndex];
  
  applyTheme(newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
  
  // Add theme switch animation
  themeToggle.style.transform = 'scale(0.9) rotate(180deg)';
  setTimeout(() => {
    themeToggle.style.transform = '';
  }, 200);
  
  showFloatingText(`🎨 ${themes.find(t => t.id === newTheme)?.name || 'Theme'} activated!`);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  
  // Apply special theme effects
  switch(theme) {
    case 'sunset':
      document.documentElement.style.setProperty('--bg-gradient', 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 50%, #ff6b6b 100%)');
      break;
    case 'forest':
      document.documentElement.style.setProperty('--bg-gradient', 'linear-gradient(135deg, #134e5e 0%, #71b280 50%, #a8e6cf 100%)');
      break;
    case 'space':
      document.documentElement.style.setProperty('--bg-gradient', 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)');
      break;
    case 'rainbow':
      document.documentElement.style.setProperty('--bg-gradient', 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 25%, #fecfef 50%, #96e6a1 75%, #d299c2 100%)');
      break;
  }
}

function updateThemeIcon(theme) {
  const icons = {
    'default': '🌊',
    'dark': '🌙',
    'sunset': '🌅',
    'forest': '🌲',
    'space': '🚀',
    'rainbow': '🌈'
  };
  themeIcon.textContent = icons[theme] || '🌊';
}

// XP and Level system
function addXP(amount, reason = '') {
  userProgress.xp += amount;
  updateProgressDisplay();
  showFloatingText(`+${amount} XP${reason ? ': ' + reason : ''}`, 'xp');
  
  // Check for level up
  const newLevel = calculateLevel(userProgress.xp);
  if (newLevel > userProgress.level) {
    levelUp(newLevel);
  }
  
  saveProgress();
}

function calculateLevel(xp) {
  for (let i = levelRequirements.length - 1; i >= 0; i--) {
    if (xp >= levelRequirements[i]) {
      return i + 1;
    }
  }
  return 1;
}

function levelUp(newLevel) {
  const oldLevel = userProgress.level;
  userProgress.level = newLevel;
  
  // Show level up animation
  showLevelUpPopup(newLevel);
  
  // Unlock new themes
  const newThemes = themes.filter(theme => 
    theme.unlockLevel === newLevel && 
    !userProgress.unlockedThemes.includes(theme.id)
  );
  
  newThemes.forEach(theme => {
    userProgress.unlockedThemes.push(theme.id);
    showFloatingText(`🎨 New theme unlocked: ${theme.name}!`);
  });
  
  // Check for theme unlock achievement
  if (userProgress.unlockedThemes.length >= 3) {
    checkAchievement('theme_unlock');
  }
  
  // Level rewards
  addXP(newLevel * 10, 'Level bonus');
}

function updateProgressDisplay() {
  const currentLevel = userProgress.level;
  const currentXP = userProgress.xp;
  const currentLevelXP = levelRequirements[currentLevel - 1] || 0;
  const nextLevelXP = levelRequirements[currentLevel] || levelRequirements[levelRequirements.length - 1];
  const progressPercent = ((currentXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  
  document.getElementById('current-xp').textContent = currentXP - currentLevelXP;
  document.getElementById('next-level-xp').textContent = nextLevelXP - currentLevelXP;
  document.getElementById('level-display-text').textContent = currentLevel;
  document.getElementById('current-level').textContent = currentLevel;
  document.getElementById('xp-fill').style.width = Math.min(progressPercent, 100) + '%';
  
  // Update stats
  document.getElementById('quote-count').textContent = userProgress.quotesRead;
  document.getElementById('streak-count').textContent = userProgress.streak;
  document.getElementById('achievement-count').textContent = userProgress.achievements.length;
}

// Achievement system
function checkAchievement(achievementId) {
  if (userProgress.achievements.includes(achievementId)) return;
  
  const achievement = achievements.find(a => a.id === achievementId);
  if (!achievement) return;
  
  let earned = false;
  
  switch(achievementId) {
    case 'first_quote':
      earned = userProgress.quotesRead >= 1;
      break;
    case 'quote_5':
      earned = userProgress.quotesRead >= 5;
      break;
    case 'quote_25':
      earned = userProgress.quotesRead >= 25;
      break;
    case 'quote_100':
      earned = userProgress.quotesRead >= 100;
      break;
    case 'streak_7':
      earned = userProgress.streak >= 7;
      break;
    case 'streak_30':
      earned = userProgress.streak >= 30;
      break;
    case 'favorite_10':
      earned = userProgress.favorites.length >= 10;
      break;
    case 'daily_challenge':
      earned = userProgress.dailyChallengeProgress >= 10;
      break;
    case 'theme_unlock':
      earned = userProgress.unlockedThemes.length >= 3;
      break;
    case 'speed_reader':
      earned = sessionQuotes >= 10;
      break;
    default:
      earned = true;
  }
  
  if (earned) {
    userProgress.achievements.push(achievementId);
    showAchievementPopup(achievement);
    addXP(achievement.xp, 'Achievement');
    saveProgress();
  }
}

// Animation and feedback systems
function showFloatingText(text, type = 'normal') {
  const floating = document.createElement('div');
  floating.className = `floating-text floating-${type}`;
  floating.textContent = text;
  
  // Position randomly around the quote display
  const container = document.querySelector('.quote-display');
  const rect = container.getBoundingClientRect();
  floating.style.left = (rect.left + Math.random() * rect.width) + 'px';
  floating.style.top = (rect.top + Math.random() * 100) + 'px';
  
  document.body.appendChild(floating);
  
  setTimeout(() => {
    floating.remove();
  }, 2000);
}

function showAchievementPopup(achievement) {
  const popup = document.getElementById('achievement-popup');
  document.getElementById('achievement-title').textContent = achievement.name;
  document.getElementById('achievement-description').textContent = achievement.description;
  
  popup.classList.remove('hidden');
  setTimeout(() => {
    popup.classList.add('hidden');
  }, 3000);
}

function showLevelUpPopup(newLevel) {
  const popup = document.getElementById('level-up-popup');
  document.getElementById('new-level-number').textContent = newLevel;
  document.getElementById('level-reward').textContent = `You're getting stronger!`;
  
  popup.classList.remove('hidden');
  setTimeout(() => {
    popup.classList.add('hidden');
  }, 4000);
}

// Enhanced quote fetching with combo system
function typewriterEffect(text, element, callback) {
  element.textContent = '';
  element.classList.add('typing');
  
  let i = 0;
  const timer = setInterval(() => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(timer);
      element.classList.remove('typing');
      element.classList.add('typing-complete');
      
      setTimeout(() => {
        authorSection.style.opacity = '1';
        if (callback) callback();
      }, 300);
    }
  }, 30);
}

function getRandomFallbackQuote() {
  const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
  return fallbackQuotes[randomIndex];
}

async function fetchRandomQuote() {
  try {
    const buttonSpan = newQuoteBtn.querySelector('span');
    buttonSpan.textContent = '🔄 Loading...';
    newQuoteBtn.disabled = true;
    
    authorSection.style.opacity = '0';
    
    console.log('Attempting to fetch quote from API...');
    
    const response = await fetch('https://api.quotable.io/random', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Received data:', data);
    
    typewriterEffect(data.content, quoteText, () => {
      quoteAuthor.textContent = data.author;
      completeQuoteRead();
      
      buttonSpan.textContent = '✨ Inspire Me';
      newQuoteBtn.disabled = false;
    });
    
  } catch (error) {
    console.log('API unavailable, using fallback quote');
    
    const fallbackQuote = getRandomFallbackQuote();
    
    typewriterEffect(fallbackQuote.content, quoteText, () => {
      quoteAuthor.textContent = fallbackQuote.author;
      completeQuoteRead();
      
      const buttonSpan = newQuoteBtn.querySelector('span');
      buttonSpan.textContent = '✨ Inspire Me';
      newQuoteBtn.disabled = false;
    });
  }
}

function completeQuoteRead() {
  userProgress.quotesRead++;
  sessionQuotes++;
  comboCounter++;
  
  // Base XP for reading a quote
  let xpGain = 5;
  
  // Combo multiplier
  if (comboCounter > 1) {
    xpGain += Math.min(comboCounter, 10); // Max 15 XP per quote
    showFloatingText(`${comboCounter}x COMBO!`, 'combo');
  }
  
  addXP(xpGain, 'Quote read');
  
  // Update daily challenge
  updateDailyChallenge();
  
  // Check achievements
  checkAchievement('first_quote');
  checkAchievement('quote_5');
  checkAchievement('quote_25');
  checkAchievement('quote_100');
  checkAchievement('speed_reader');
  
  updateProgressDisplay();
  saveProgress();
}

function updateDailyChallenge() {
  userProgress.dailyChallengeProgress++;
  const progress = Math.min(userProgress.dailyChallengeProgress, 10);
  const progressPercent = (progress / 10) * 100;
  
  document.getElementById('challenge-progress').style.width = progressPercent + '%';
  document.getElementById('challenge-counter').textContent = `${progress}/10 completed`;
  
  if (progress === 10 && !userProgress.achievements.includes('daily_challenge')) {
    checkAchievement('daily_challenge');
    addXP(50, 'Daily challenge complete!');
  }
}

// Button effects and interactions
function addButtonEffects() {
  newQuoteBtn.addEventListener('mouseenter', () => {
    if (!newQuoteBtn.disabled) {
      newQuoteBtn.style.transform = 'translateY(-3px) scale(1.02)';
    }
  });
  
  newQuoteBtn.addEventListener('mouseleave', () => {
    if (!newQuoteBtn.disabled) {
      newQuoteBtn.style.transform = '';
    }
  });
  
  newQuoteBtn.addEventListener('mousedown', () => {
    if (!newQuoteBtn.disabled) {
      newQuoteBtn.style.transform = 'translateY(-1px) scale(0.98)';
    }
  });
  
  newQuoteBtn.addEventListener('mouseup', () => {
    if (!newQuoteBtn.disabled) {
      newQuoteBtn.style.transform = 'translateY(-3px) scale(1.02)';
    }
  });
}

// Quote actions
