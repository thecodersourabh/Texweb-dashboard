# Build & Dependency Resolution Guide

## Issue: React-Leaflet Dependency Conflict

### Problem
The original project was using `react-leaflet@5.0.0` which requires React 19, but the project uses React 18.3.1, causing ERESOLVE dependency conflicts during `npm install` and CI/CD builds.

### Solution
Downgraded `react-leaflet` from version `5.0.0` to `4.2.1` which is compatible with React 18.

### Changes Made

1. **Updated package.json**:
   ```json
   {
     "dependencies": {
       "react-leaflet": "^4.2.1"  // Changed from "^5.0.0"
     }
   }
   ```

2. **Added .npmrc** for consistent dependency resolution:
   ```
   legacy-peer-deps=true
   engine-strict=true
   save-exact=true
   ```

3. **Added helpful npm scripts**:
   ```json
   {
     "scripts": {
       "install:clean": "rm -rf node_modules package-lock.json && npm install",
       "install:legacy": "npm install --legacy-peer-deps"
     }
   }
   ```

4. **Added engine requirements**:
   ```json
   {
     "engines": {
       "node": ">=18.0.0",
       "npm": ">=9.0.0"
     }
   }
   ```

## Build Commands

### Local Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npx cap sync
```

### CI/CD Environments
If you encounter dependency issues in CI/CD, use:
```bash
npm run install:legacy
npm run build
```

### Clean Install
If you need to reset dependencies:
```bash
npm run install:clean
```

## Capacitor Mobile Build

### Android
```bash
npm run cap:android
```

### iOS
```bash
npm run cap:ios
```

## Compatibility Matrix

| Package | Version | React Compatibility |
|---------|---------|-------------------|
| react | 18.3.1 | ✅ Current |
| react-leaflet | 4.2.1 | ✅ React 18 |
| @ionic/react | 8.7.1 | ✅ React 18+ |
| @capacitor/geolocation | 7.1.4 | ✅ All versions |

## Troubleshooting

### ERESOLVE Errors
If you encounter ERESOLVE errors:
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install --legacy-peer-deps`
3. Or use the provided script: `npm run install:legacy`

### Missing Dependencies
Make sure all peer dependencies are installed:
```bash
npm install leaflet @types/leaflet --save-dev
```

### Capacitor Sync Issues
After dependency changes, always run:
```bash
npx cap sync
```

## Future Upgrades

When React 19 becomes stable and all dependencies support it:
1. Upgrade React to v19
2. Upgrade react-leaflet back to v5.x
3. Update .npmrc if needed
4. Test thoroughly across all platforms
