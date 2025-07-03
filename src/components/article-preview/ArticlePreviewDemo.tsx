import React from 'react';

import { Box } from '@mui/material';

/**
 * Demo component to showcase the full article preview with injected HTML content
 */
export const ArticlePreviewDemo: React.FC = () => {
  // HTML content from aa.html (body content only)
  const articleHtmlContent = `
    <div class="max-w-4xl mx-auto px-4 py-8 bg-white min-h-screen">
      <!-- Header Section -->
      <header class="mb-12">
        <div class="flex items-center text-sm text-purple-600 mb-3 font-medium">
        </div>
        <h1 class="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
          The Best Free Mobile Games to Play in 2025
        </h1>

        <div class="flex items-center text-gray-600 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-1">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>Read time: 12 minutes</span>
        </div>
      </header>

      <!-- Table of Contents -->
      <section class="mb-8 bg-purple-50 rounded-lg p-5">
        <div class="flex items-center mb-4 text-purple-800">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 mr-2">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
          <h2 class="text-lg font-semibold">Table of Contents</h2>
        </div>
        <nav>
          <ul class="space-y-2">
            <li class="font-medium list-none">
              <a href="#introduction" class="text-purple-700 hover:text-purple-900 transition-colors">
                Introduction
              </a>
            </li>
            <li class="font-medium list-none">
              <a href="#top-5-free-mobile-games-in-2025" class="text-purple-700 hover:text-purple-900 transition-colors">
                Top 5 Free Mobile Games in 2025
              </a>
            </li>
            <li class="list-disc list-inside text-purple-700">
              <span>
                <a href="#game-1:-realm-of-eternia:-tactics" class="text-purple-700 hover:text-purple-900 transition-colors">
                  Game 1: Realm of Eternia: Tactics
                </a>
              </span>
            </li>
            <li class="list-disc list-inside text-purple-700">
              <span>
                <a href="#game-2:-cosmic-crusaders" class="text-purple-700 hover:text-purple-900 transition-colors">
                  Game 2: Cosmic Crusaders
                </a>
              </span>
            </li>
            <li class="list-disc list-inside text-purple-700">
              <span>
                <a href="#game-3:-pocket-pet-paradise" class="text-purple-700 hover:text-purple-900 transition-colors">
                  Game 3: Pocket Pet Paradise
                </a>
              </span>
            </li>
            <li class="list-disc list-inside text-purple-700">
              <span>
                <a href="#game-4:-cyberpunk-city-racer" class="text-purple-700 hover:text-purple-900 transition-colors">
                  Game 4: Cyberpunk City Racer
                </a>
              </span>
            </li>
            <li class="list-disc list-inside text-purple-700">
              <span>
                <a href="#game-5:-mystic-match-mania" class="text-purple-700 hover:text-purple-900 transition-colors">
                  Game 5: Mystic Match Mania
                </a>
              </span>
            </li>
            <li class="font-medium list-none">
              <a href="#gameplay-tips-for-casual-gaming" class="text-purple-700 hover:text-purple-900 transition-colors">
                Gameplay Tips for Casual Gaming
              </a>
            </li>
            <li class="font-medium list-none">
              <a href="#understanding-free-to-play-monetization" class="text-purple-700 hover:text-purple-900 transition-colors">
                Understanding Free-to-Play Monetization
              </a>
            </li>
            <li class="list-disc list-inside text-purple-700">
              <span>
                <a href="#in-app-purchases" class="text-purple-700 hover:text-purple-900 transition-colors">
                  In-App Purchases
                </a>
              </span>
            </li>
            <li class="list-disc list-inside text-purple-700">
              <span>
                <a href="#advertising-models" class="text-purple-700 hover:text-purple-900 transition-colors">
                  Advertising Models
                </a>
              </span>
            </li>
            <li class="list-disc list-inside text-purple-700">
              <span>
                <a href="#ethical-considerations" class="text-purple-700 hover:text-purple-900 transition-colors">
                  Ethical Considerations
                </a>
              </span>
            </li>
            <li class="font-medium list-none">
              <a href="#future-trends-in-mobile-games" class="text-purple-700 hover:text-purple-900 transition-colors">
                Future Trends in Mobile Games
              </a>
            </li>
            <li class="font-medium list-none">
              <a href="#conclusion" class="text-purple-700 hover:text-purple-900 transition-colors">
                Conclusion
              </a>
            </li>
          </ul>
        </nav>
      </section>

      <!-- Article Sections -->
      <section id="Introduction">
        <h2 class="text-2xl font-bold mb-4 text-gray-800">Introduction</h2>
        <p class="mb-4 text-gray-700 leading-relaxed">The mobile gaming landscape is constantly evolving, and 2025 promises to be a banner year for free-to-play titles. With advanced graphics, innovative gameplay mechanics, and engaging social features, today's mobile games offer experiences that rival traditional console and PC games. Whether you're a casual player looking for quick entertainment during commutes or a dedicated gamer seeking deep, immersive experiences, the world of free mobile games has something extraordinary to offer.</p>
      </section>

      <section id="top-5-free-mobile-games">
        <h2 class="text-2xl font-bold mb-4 text-gray-800">Top 5 Free Mobile Games in 2025</h2>
        <p class="mb-4 text-gray-700 leading-relaxed">The mobile gaming market continues to explode with innovative titles that push the boundaries of what's possible on smartphones and tablets. After extensive research and community feedback, we've compiled the definitive list of the best free mobile games that are dominating 2025. These games represent the pinnacle of mobile gaming excellence, offering compelling gameplay, stunning visuals, and engaging progression systems that keep players coming back for more.</p>

        <h3 class="text-xl font-semibold mb-3 text-gray-800">Game 1: Realm of Eternia: Tactics</h3>
        <p class="mb-4 text-gray-700 leading-relaxed">This strategic RPG combines classic turn-based combat with modern mobile conveniences. Players build teams of heroes, each with unique abilities and backstories, to tackle challenging dungeons and PvP battles. The game's generous free-to-play model ensures that skill and strategy matter more than spending money.</p>

        <h3 class="text-xl font-semibold mb-3 text-gray-800">Game 2: Cosmic Crusaders</h3>
        <p class="mb-4 text-gray-700 leading-relaxed">An action-packed space shooter that brings console-quality graphics to mobile devices. With intuitive touch controls and an engaging storyline spanning multiple galaxies, Cosmic Crusaders offers both single-player campaigns and competitive multiplayer modes.</p>

        <h3 class="text-xl font-semibold mb-3 text-gray-800">Game 3: Pocket Pet Paradise</h3>
        <p class="mb-4 text-gray-700 leading-relaxed">Perfect for casual gamers, this adorable pet simulation game lets players collect, care for, and train virtual pets. The game's relaxing gameplay and charming art style make it ideal for stress relief and short gaming sessions.</p>

        <h3 class="text-xl font-semibold mb-3 text-gray-800">Game 4: Cyberpunk City Racer</h3>
        <p class="mb-4 text-gray-700 leading-relaxed">Experience high-speed racing in a neon-lit cyberpunk world. With customizable vehicles, dynamic weather systems, and both street racing and official tournaments, this game delivers adrenaline-pumping action with stunning visual effects.</p>

        <h3 class="text-xl font-semibold mb-3 text-gray-800">Game 5: Mystic Match Mania</h3>
        <p class="mb-4 text-gray-700 leading-relaxed">A puzzle game that revolutionizes the match-3 genre with magical elements and strategic depth. Players combine gems to cast spells, defeat monsters, and progress through an enchanting fantasy world filled with challenging puzzles and epic boss battles.</p>
      </section>

      <section id="gameplay-tips-for-casual-gaming">
        <h2 class="text-2xl font-bold mb-4 text-gray-800">Gameplay Tips for Casual Gaming</h2>
        <p class="mb-4 text-gray-700 leading-relaxed">Casual mobile gaming offers a fantastic escape from daily stress while providing entertainment that fits into busy schedules. To maximize your enjoyment and progress in free mobile games, consider these essential strategies that experienced players swear by.</p>

        <div class="mb-4">
          <h3 class="text-lg font-semibold mb-2 text-gray-800">Time Management Strategies</h3>
          <ul class="list-disc list-inside text-gray-700 space-y-2">
            <li>Set specific gaming windows to avoid endless scrolling</li>
            <li>Use daily login bonuses to your advantage</li>
            <li>Focus on games with offline progression systems</li>
            <li>Prioritize energy-based games during natural breaks</li>
          </ul>
        </div>

        <div class="mb-4">
          <h3 class="text-lg font-semibold mb-2 text-gray-800">Resource Management</h3>
          <ul class="list-disc list-inside text-gray-700 space-y-2">
            <li>Save premium currency for essential upgrades</li>
            <li>Complete daily quests for consistent rewards</li>
            <li>Join active guilds or communities for bonus resources</li>
            <li>Plan your upgrades based on long-term goals</li>
          </ul>
        </div>
      </section>

      <section id="understanding-free-to-play-monetization">
        <h2 class="text-2xl font-bold mb-4 text-gray-800">Understanding Free-to-Play Monetization</h2>
        <p class="mb-4 text-gray-700 leading-relaxed">Free-to-play games employ various monetization strategies to generate revenue while keeping the core experience accessible to all players. Understanding these models helps you make informed decisions about your gaming experience and spending habits.</p>

        <h3 class="text-xl font-semibold mb-3 text-gray-800">In-App Purchases</h3>
        <p class="mb-4 text-gray-700 leading-relaxed">Most free mobile games offer optional purchases that can enhance your experience. These typically include cosmetic items, convenience features, or progression boosters. The key is distinguishing between pay-to-win mechanics and fair monetization that respects player choice.</p>

        <h3 class="text-xl font-semibold mb-3 text-gray-800">Advertising Models</h3>
        <p class="mb-4 text-gray-700 leading-relaxed">Many games incorporate rewarded video ads that provide in-game benefits in exchange for watching short advertisements. This model allows players to progress without spending money while supporting the developers through ad revenue.</p>

        <h3 class="text-xl font-semibold mb-3 text-gray-800">Ethical Considerations</h3>
        <p class="mb-4 text-gray-700 leading-relaxed">Responsible gaming involves setting personal spending limits and being aware of psychological tactics designed to encourage purchases. Look for games that offer clear value propositions and avoid those with predatory practices targeting vulnerable players.</p>
      </section>

      <section id="future-trends-in-mobile-games">
        <h2 class="text-2xl font-bold mb-4 text-gray-800">Future Trends in Mobile Games</h2>
        <p class="mb-4 text-gray-700 leading-relaxed">The mobile gaming industry continues to evolve rapidly, with emerging technologies and changing player preferences shaping the future landscape. Cloud gaming, augmented reality integration, and cross-platform play are just a few innovations transforming how we experience mobile games.</p>

        <div class="mb-4">
          <h3 class="text-lg font-semibold mb-2 text-gray-800">Technological Advancements</h3>
          <ul class="list-disc list-inside text-gray-700 space-y-2">
            <li>5G connectivity enabling more complex multiplayer experiences</li>
            <li>AI-powered personalization and dynamic content generation</li>
            <li>Advanced haptic feedback for more immersive gameplay</li>
            <li>Integration with wearable devices and IoT ecosystems</li>
          </ul>
        </div>

        <div class="mb-4">
          <h3 class="text-lg font-semibold mb-2 text-gray-800">Social and Community Features</h3>
          <ul class="list-disc list-inside text-gray-700 space-y-2">
            <li>Enhanced guild systems and community building tools</li>
            <li>Live streaming integration and social sharing features</li>
            <li>Cross-platform progression and friend systems</li>
            <li>User-generated content and modding support</li>
          </ul>
        </div>
      </section>

      <section id="Conclusion">
        <h2 class="text-2xl font-bold mb-4 text-gray-800">Conclusion</h2>
        <p class="mb-4 text-gray-700 leading-relaxed">The mobile gaming landscape in 2025 offers a wealth of free and engaging experiences that cater to every type of player. From strategic RPGs to casual puzzle games, the quality and variety of free mobile games continue to reach new heights. By understanding monetization models, implementing smart gaming strategies, and staying informed about industry trends, players can maximize their enjoyment while making responsible choices about their gaming habits.</p>

        <p class="mb-4 text-gray-700 leading-relaxed">Whether you're just starting your mobile gaming journey or you're a seasoned player looking for your next favorite title, the games and strategies outlined in this guide provide a solid foundation for discovering amazing free gaming experiences. Remember that the best mobile game is the one that brings you joy and fits seamlessly into your lifestyle.</p>
      </section>

      <!-- FAQ Section -->
      <section id="faq" class="mb-12">
        <div class="flex items-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 mr-2 text-purple-600">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <path d="M12 17h.01"></path>
          </svg>
          <h2 class="text-2xl font-bold text-gray-800">Frequently Asked Questions</h2>
        </div>
        <div class="border rounded-lg">
          <details class="group px-4 py-3 border-b">
            <summary class="flex items-center justify-between cursor-pointer list-none text-left hover:text-purple-700 font-medium">
              Are free mobile games in 2025 safe to download?
              <svg class="w-5 h-5 ml-2 transform group-open:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div class="mt-3 text-gray-700">
              Most games from official stores like Google Play and App Store are safe, but always check reviews and permissions before installing.
            </div>
          </details>

          <details class="group px-4 py-3 border-b">
            <summary class="flex items-center justify-between cursor-pointer list-none text-left hover:text-purple-700 font-medium">
              Do free mobile games really stay free?
              <svg class="w-5 h-5 ml-2 transform group-open:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div class="mt-3 text-gray-700">
              Generally, yes, but many include optional in-app purchases or ads to support development.
            </div>
          </details>
        </div>
      </section>

      <!-- External Links Section -->
      <section class="rounded-lg border p-6 bg-gray-50 mb-12">
        <div class="flex items-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
               class="h-6 w-6 mr-2 text-purple-600">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
          <h2 class="text-2xl font-bold text-gray-800">External Resources</h2>
        </div>

        <div class="space-y-5">
          <div class="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
            <a
              href="https://www.statista.com/topics/1906/mobile-gaming/"
              target="_blank"
              rel="noopener noreferrer"
              class="text-lg font-medium text-purple-700 hover:text-purple-900 transition-colors flex items-center"
            >
              Statista: Mobile Gaming Market
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                   class="ml-1 h-4 w-4">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </div>

          <div class="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
            <a
              href="https://play.google.com/store/apps/category/GAME"
              target="_blank"
              rel="noopener noreferrer"
              class="text-lg font-medium text-purple-700 hover:text-purple-900 transition-colors flex items-center"
            >
              Google Play Free Games Ranking
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                   class="ml-1 h-4 w-4">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  `;

  return (
    <Box sx={{
      p: 0,
      minHeight: '100vh',
      bgcolor: 'background.paper',
      '& a': {
        color: '#1a73e8 !important',
        textDecoration: 'underline !important'
      }
    }}>
      {/* Article Content with Tailwind Styles */}
      <Box
        dangerouslySetInnerHTML={{ __html: articleHtmlContent }}
        sx={{
          '& *': {
            fontFamily: 'inherit !important'
          },
          // Purple color overrides for theme compatibility
          '& .text-purple-600': {
            color: '#9333ea !important'
          },
          '& .text-purple-700': {
            color: '#7c3aed !important'
          },
          '& .text-purple-800': {
            color: '#6b21a8 !important'
          },
          '& .text-purple-900': {
            color: '#581c87 !important'
          },
          '& .bg-purple-50': {
            backgroundColor: '#faf5ff !important'
          },
          '& .border-purple-600': {
            borderColor: '#9333ea !important'
          },
          // Ensure proper spacing and typography
          '& .max-w-4xl': {
            maxWidth: '56rem !important'
          },
          '& .mx-auto': {
            marginLeft: 'auto !important',
            marginRight: 'auto !important'
          },
          '& .px-4': {
            paddingLeft: '1rem !important',
            paddingRight: '1rem !important'
          },
          '& .py-8': {
            paddingTop: '2rem !important',
            paddingBottom: '2rem !important'
          }
        }}
      />
    </Box>
  );
};
