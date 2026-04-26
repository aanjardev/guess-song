# 🎵 Guess the Song

A dark-themed, vibrant music guessing game based on artists! Test your knowledge of your favorite artists' songs.

## 🎮 How to Play

1. **Choose an Artist**: Search and select your favorite artist
2. **Listen to Preview**: Play a 7-second song preview
3. **Guess the Title**: Choose from 3 song options
4. **Score Points**: Correct answers = +1 point
5. **Complete 10 Rounds**: Finish all rounds to see your final result!

## ✨ Features

- 🎨 **Dark & Vibrant Theme**: Dark background with blue and purple accents
- 🎵 **Song Previews**: Listen to 7-second previews from iTunes
- 📊 **Scoring System**: Track points and rounds in real-time
- 🎯 **Multiple Choice**: 3 answer options per question
- ⏱️ **Timer**: Track how long you take to complete the game
- 📈 **Progress Bar**: Visual progress indicator for rounds
- 🏆 **Result Screen**: Get personalized feedback based on your score
- 🎭 **Dynamic Feedback**: Animated responses for correct/incorrect answers
- 📱 **Responsive**: Works on all devices
- 🔄 **Replay Options**: Play again or try different artists
- 🏷️ **Watermark**: Subtle "aanjar" watermark in bottom-right corner

## 🎯 Scoring System

- **True Fan** (7-10/10): Amazing! You're a real fan!
- **Good Job** (5-6/10): Not bad! You know your songs well!
- **Keep Learning** (0-4/10): Time to listen to more music!

## 📊 Game Statistics

After completing 10 rounds, you'll see:

- Final score and accuracy percentage
- Time taken to complete the game
- Personalized feedback based on performance
- Options to replay or try different artists

## 🚀 Running the Project

### Requirements

- Node.js 18+
- npm or yarn

### Installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 🛠️ Technologies

- **Next.js 16** - React framework
- **Tailwind CSS 4** - Utility-first CSS framework
- **iTunes API** - Music data source

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styling and components
│   ├── layout.js            # App layout
│   ├── page.js              # Home page (artist search)
│   ├── game/
│   │   └── page.js          # Game page (10 rounds with timer)
│   ├── result/
│   │   └── page.js          # Results page with statistics
│   └── api/itunes/search/
│       └── route.js         # iTunes API endpoint
└── lib/
    └── itunes.js            # iTunes API helper (placeholder)
```

## 🎨 Design Theme

- **Background**: Dark gradient from gray to blue-black
- **Primary Colors**: Blue and black as base colors
- **Accents**: Purple and green for interactive elements
- **Effects**: Blur, gradients, and smooth animations

## 📝 License

This project is created for educational and entertainment purposes.
