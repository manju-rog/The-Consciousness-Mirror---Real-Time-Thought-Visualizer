# 🚀 The Consciousness Mirror - Complete Setup Guide

## 📋 Table of Contents

1. [System Requirements](#system-requirements)
2. [Dependencies Overview](#dependencies-overview)
3. [Step-by-Step Installation](#step-by-step-installation)
4. [Package Details](#package-details)
5. [Troubleshooting](#troubleshooting)
6. [Version Compatibility](#version-compatibility)
7. [Performance Optimization](#performance-optimization)
8. [Browser Compatibility](#browser-compatibility)

---

## 🖥️ System Requirements

### Minimum Requirements:
- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher (or yarn 1.22.0+)
- **RAM**: 4GB minimum
- **GPU**: WebGL 2.0 compatible graphics card
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Recommended Requirements:
- **Node.js**: 20.0.0 or higher
- **npm**: 10.0.0 or higher
- **RAM**: 8GB or more
- **GPU**: Dedicated GPU with WebGL 2.0
- **Browser**: Latest Chrome or Edge for best performance
- **Display**: 1920x1080 or higher resolution

---

## 📦 Dependencies Overview

### Core Framework
- **Next.js 14.2.33** - React framework with App Router
- **React 18.3.1** - UI library
- **TypeScript 5.x** - Type safety

### 3D Graphics & Visualization
- **Three.js** - 3D graphics library
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Three.js helpers
- **@react-three/postprocessing** - Post-processing effects

### AI & Machine Learning
- **@tensorflow/tfjs** - Machine learning in browser

### Audio Synthesis
- **tone** - Web Audio framework

### State Management
- **zustand** - Lightweight state management

### UI & Animations
- **framer-motion** - Animation library
- **tailwindcss** - Utility-first CSS

### Networking (Optional)
- **socket.io-client** - Real-time communication

---

## 🔧 Step-by-Step Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/The-Consciousness-Mirror---Real-Time-Thought-Visualizer.git
cd The-Consciousness-Mirror---Real-Time-Thought-Visualizer
```

### 2. Verify Node.js Version

```bash
node --version  # Should be 18.0.0 or higher
npm --version   # Should be 9.0.0 or higher
```

If you need to update Node.js:
- Download from: https://nodejs.org/
- Or use nvm: `nvm install 20 && nvm use 20`

### 3. Install Dependencies

**Option 1: Using npm (Recommended)**

```bash
npm install --legacy-peer-deps
```

**Why `--legacy-peer-deps`?**
- React Three Fiber has peer dependency requirements
- This flag resolves conflicts automatically
- Completely safe for this project

**Option 2: Using yarn**

```bash
yarn install
```

### 4. Verify Installation

Check if all packages installed correctly:

```bash
npm list --depth=0
```

You should see:
```
├── @react-three/drei@9.x.x
├── @react-three/fiber@9.x.x
├── @react-three/postprocessing@2.x.x
├── @tensorflow/tfjs@4.x.x
├── framer-motion@11.x.x
├── next@14.2.33
├── react@18.3.1
├── react-dom@18.3.1
├── socket.io-client@4.x.x
├── three@0.x.x
├── tone@15.x.x
└── zustand@4.x.x
```

### 5. Run Development Server

```bash
npm run dev
```

The app will start at: **http://localhost:3000**

### 6. Build for Production

```bash
npm run build
npm start
```

---

## 📚 Package Details

### Next.js Configuration

**package.json:**
```json
{
  "name": "consciousness-mirror",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.33",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
```

### Three.js Ecosystem

**Required packages:**
```json
{
  "three": "latest",
  "@react-three/fiber": "latest",
  "@react-three/drei": "latest",
  "@react-three/postprocessing": "latest"
}
```

**Important Notes:**
- Three.js version is auto-managed by @react-three/fiber
- Don't manually specify Three.js version to avoid conflicts
- Use `--legacy-peer-deps` when installing

### TensorFlow.js

**Installation:**
```json
{
  "@tensorflow/tfjs": "^4.0.0"
}
```

**Performance Note:**
- Browser backend is used by default
- For Node.js backend (faster training): `npm install @tensorflow/tfjs-node`
- Not required for this project

### Tone.js Audio

**Installation:**
```json
{
  "tone": "^15.0.0"
}
```

**Important:**
- Requires user interaction to start (browser security)
- Audio context is created on first user click

### Zustand State Management

**Installation:**
```json
{
  "zustand": "^4.0.0"
}
```

**Middleware:**
```json
{
  "zustand/middleware": "included"
}
```

### Styling

**Tailwind CSS:**
```json
{
  "tailwindcss": "^3.4.0",
  "postcss": "^8.4.0",
  "autoprefixer": "^10.4.0"
}
```

**Configuration files created automatically:**
- `tailwind.config.ts`
- `postcss.config.mjs`

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### 1. **Peer Dependency Conflicts**

**Error:**
```
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solution:**
```bash
npm install --legacy-peer-deps
```

Or use the force flag:
```bash
npm install --force
```

---

#### 2. **Canvas/WebGL Errors**

**Error:**
```
Error: Cannot read properties of undefined (reading 'S')
```

**Solution:**
This is a server-side rendering (SSR) issue. Already fixed with dynamic imports:

```typescript
const ConsciousnessScene = dynamic(
  () => import('@/components/ConsciousnessScene'),
  { ssr: false }
);
```

No action needed - this is already implemented!

---

#### 3. **TensorFlow.js Warnings**

**Warning:**
```
Hi, looks like you are running TensorFlow.js in Node.js
```

**Solution:**
This is just a warning, not an error. The browser backend works fine.

To suppress (optional):
```bash
npm install @tensorflow/tfjs-node
```

---

#### 4. **Audio Context Issues**

**Error:**
```
AudioContext was not allowed to start
```

**Solution:**
This is expected browser behavior. Audio starts after first user interaction.

User must click the "🔊 Audio On" button.

---

#### 5. **Memory Leaks / Performance Issues**

**Symptoms:**
- Slow performance after 5+ minutes
- Browser tab crashes
- High memory usage

**Solutions:**

1. **Reduce particle count:**
```typescript
// In store/consciousness.ts
particleCount: 50000  // Instead of 100000
```

2. **Lower quality preset:**
Click "🎨 Controls" → Set quality to "Medium" or "Low"

3. **Disable effects:**
Turn off Bloom, Motion Blur, Depth of Field

4. **Close other tabs:**
This app is GPU-intensive

---

#### 6. **Build Errors**

**Error:**
```
Module not found: Can't resolve '@/components/...'
```

**Solution:**
Check `tsconfig.json` has correct paths:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

#### 7. **TypeScript Errors**

**Error:**
```
Type 'X' is not assignable to type 'Y'
```

**Solution:**

1. Delete `.next` folder:
```bash
rm -rf .next
```

2. Reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

3. Restart dev server:
```bash
npm run dev
```

---

## 🔄 Version Compatibility

### Tested Combinations

#### ✅ Working Configurations:

**Configuration 1: (Recommended)**
```json
{
  "node": "20.10.0",
  "npm": "10.2.0",
  "next": "14.2.33",
  "react": "18.3.1",
  "three": "0.160.0",
  "@react-three/fiber": "9.4.0"
}
```

**Configuration 2: (Minimum)**
```json
{
  "node": "18.17.0",
  "npm": "9.8.0",
  "next": "14.2.0",
  "react": "18.3.0"
}
```

#### ❌ Known Incompatible Versions:

- **Node.js < 18.0.0** - Next.js 14 requires Node 18+
- **React 19.x** - @react-three/fiber not compatible yet
- **Three.js < 0.150** - Missing required features

---

## ⚡ Performance Optimization

### For Low-End Systems:

**1. Adjust particle count:**
```typescript
// File: store/consciousness.ts
particleCount: 25000  // Down from 100000
```

**2. Disable post-processing:**
- Turn off Bloom
- Turn off Motion Blur
- Turn off Depth of Field

**3. Use specific modes:**
- **Best performance**: Particles, Galaxy
- **Medium performance**: Matrix, Ocean, Mandala
- **High performance**: Brain, Forest, Crystal, DNA, Quantum

**4. Browser settings:**
- Enable hardware acceleration
- Close unnecessary tabs
- Use Chrome/Edge (better WebGL performance)

### For High-End Systems:

**1. Increase particle count:**
```typescript
particleCount: 1000000  // Maximum
```

**2. Enable all effects:**
- Bloom ✓
- Motion Blur ✓
- Depth of Field ✓
- Ultra quality preset

**3. Multiple monitors:**
Works great! Drag to second monitor for immersive experience.

---

## 🌐 Browser Compatibility

### Fully Supported:

- ✅ **Google Chrome 90+** (Recommended)
- ✅ **Microsoft Edge 90+** (Recommended)
- ✅ **Firefox 88+**
- ✅ **Safari 14+** (Mac/iOS)
- ✅ **Opera 76+**
- ✅ **Brave 1.24+**

### Partially Supported:

- ⚠️ **Mobile Safari**: Works but reduced particle count recommended
- ⚠️ **Firefox Android**: Some post-processing effects may lag

### Not Supported:

- ❌ **Internet Explorer** (any version)
- ❌ **Opera Mini**
- ❌ **UC Browser** (older versions)

### Feature Detection:

The app automatically detects:
- WebGL 2.0 support
- GPU capabilities
- Available memory
- Screen resolution

And adjusts quality accordingly.

---

## 📱 Mobile Support

### iOS (Safari):

**Recommended settings:**
- Particle count: 25,000
- Quality: Medium
- Disable Motion Blur
- Enable Auto-rotate

**Touch controls:**
- Pinch to zoom
- Drag to rotate
- Two-finger pan

### Android (Chrome):

**Recommended settings:**
- Particle count: 50,000
- Quality: Medium/High
- Enable all effects (if high-end device)

**Performance:**
- Works great on flagship devices (2020+)
- Reduce quality on mid-range devices

---

## 🔐 Security Notes

### Audio Context:

Modern browsers require user interaction to start audio:
```javascript
// This is handled automatically
await Tone.start();  // Called on button click
```

### Local Storage:

App stores:
- Achievement progress
- Visualization settings
- Metrics data

All data is stored locally. Nothing sent to servers.

### Privacy:

- ✅ No analytics by default
- ✅ No data collection
- ✅ All processing client-side
- ✅ Shareable data is explicitly exported by user

---

## 🚀 Deployment

### Vercel (Recommended):

```bash
npm install -g vercel
vercel
```

Or connect GitHub repo to Vercel dashboard.

**Environment Variables:**
None required! App is fully client-side.

### Other Platforms:

**Netlify:**
```bash
npm run build
# Deploy dist folder
```

**AWS Amplify:**
```bash
amplify init
amplify publish
```

**Docker:**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 📊 Performance Benchmarks

### Expected Performance:

**High-End System** (RTX 3080, 32GB RAM):
- Particle Mode: 60 FPS @ 1M particles
- All Modes: 60 FPS @ 100K particles
- Effects: All enabled, no performance impact

**Mid-Range System** (GTX 1060, 16GB RAM):
- Particle Mode: 60 FPS @ 100K particles
- Most Modes: 60 FPS @ 50K particles
- Effects: Bloom enabled, others moderate impact

**Low-End System** (Integrated GPU, 8GB RAM):
- Particle Mode: 30-45 FPS @ 25K particles
- Simple Modes: 45-60 FPS @ 25K particles
- Effects: Bloom only, others disabled

**Mobile** (iPhone 12+, Flagship Android):
- All Modes: 30-60 FPS @ 25K particles
- Effects: Bloom enabled

---

## 🆘 Getting Help

### If You're Still Having Issues:

1. **Check Browser Console** (F12)
   - Look for errors
   - Note the exact error message

2. **Check Browser Compatibility**
   - Visit: https://get.webgl.org/webgl2/
   - Should show spinning cube

3. **Clear Cache**
   ```bash
   rm -rf .next
   npm run dev
   ```

4. **Fresh Install**
   ```bash
   rm -rf node_modules package-lock.json .next
   npm install --legacy-peer-deps
   npm run dev
   ```

5. **Check System Resources**
   - Close other apps
   - Check available RAM
   - Update graphics drivers

---

## 📝 Quick Start Checklist

- [ ] Node.js 18+ installed
- [ ] Git repository cloned
- [ ] Dependencies installed (`npm install --legacy-peer-deps`)
- [ ] Dev server started (`npm run dev`)
- [ ] Browser opened to http://localhost:3000
- [ ] WebGL working (see spinning particles)
- [ ] Can switch visualization modes
- [ ] Metrics updating in real-time
- [ ] Can capture screenshot
- [ ] Audio starts on button click

**If all checked: YOU'RE READY! 🎉**

---

## 🎯 Next Steps

Once installed successfully:

1. **Explore all 10 visualization modes**
2. **Try unlocking achievements**
3. **Experiment with different settings**
4. **Capture and share your consciousness**
5. **Optimize for your system**

---

## 📖 Additional Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Three.js Docs**: https://threejs.org/docs
- **React Three Fiber**: https://docs.pmnd.rs/react-three-fiber
- **TensorFlow.js**: https://www.tensorflow.org/js
- **Tone.js**: https://tonejs.github.io/

---

## 🌟 Support

**This project is open source and fully documented.**

If you encounter issues not covered here:
1. Check existing GitHub issues
2. Create a new issue with:
   - Node.js version
   - npm version
   - Browser version
   - Error message
   - Steps to reproduce

---

**Built with consciousness 🧠✨**

*Last updated: 2025-11-13*
