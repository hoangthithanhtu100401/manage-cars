# 🚗 Vehicle Management Mobile App

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Expo](https://img.shields.io/badge/Expo-~54.0-000020.svg?style=flat&logo=expo)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB.svg?style=flat&logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/)

A mobile vehicle management application built with **React Native** and **Expo**, supporting vehicle information management, entry/exit status tracking, and synchronization with backend API.

---

## ✨ Key Features

- 🔐 **User Authentication** - Login/Register with JWT token
- ➕ **Add Vehicle** - Input owner name, license plate, phone, driving license
- 🔍 **Search & Filter** - Search vehicles by license plate, filter by status
- 📋 **Vehicle List** - Display all vehicles with card interface
- 📄 **Vehicle Details** - View complete information and entry/exit history
- ✏️ **Edit Information** - Update vehicle information
- 🗑️ **Delete Vehicle** - Remove vehicles from system
- 🚦 **Status Updates** - Mark vehicle IN/OUT in real-time
- 📱 **Responsive UI** - User-friendly, smooth design
- 🔄 **API Sync** - Integration with Spring Boot backend

---

## 📋 System Requirements

### Required Software

- **Node.js**: v20.0 or higher → [Download](https://nodejs.org/)
- **npm**: v9.0 or higher (comes with Node.js)
- **Git**: (Optional) → [Download](https://git-scm.com/)

### Mobile Devices

- **Android**: Android 5.0 (API 21) or higher
- **iOS**: iOS 13.4 or higher
- **Expo Go App**: Download from [App Store](https://apps.apple.com/app/expo-go/id982107779) or [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

---

## 🚀 Installation & Setup

### 1. Clone the project

```bash
git clone <repository-url>
cd manage-cars
```

### 2. Install dependencies

```bash
npm install
```

*First-time installation may take 2-5 minutes.*

### 3. Configure API

Update backend address in [`constants/config.ts`](constants/config.ts):

```typescript
export const API_BASE_URL = "http://<YOUR_IP>:8084"; // Replace with backend server IP
```

**Important Notes**: 
- Use actual machine IP, not `localhost` or `127.0.0.1`
- Ensure computer and mobile device are on the same WiFi network
- Backend must be running on port 8084

### 4. Start the application

```bash
npm start
```

After starting, you will see:
- QR code to scan
- Platform selection menu (a: Android, i: iOS, w: Web)

### 5. Run on device

#### ✅ **Method 1: Using Expo Go (Recommended)**

1. Install **Expo Go** on your phone
2. Ensure phone and computer are on **same WiFi network**
3. Scan QR code:
   - **Android**: Use Expo Go app to scan
   - **iOS**: Use Camera app, then open with Expo Go

#### 📱 **Method 2: Android Emulator**

```bash
npm run android
```

*Requires: Android Studio and Android Emulator installed*

#### 🍎 **Method 3: iOS Simulator (macOS only)**

```bash
npm run ios
```

*Requires: Xcode installed*

#### 🌐 **Method 4: Web Browser**

```bash
npm run web
```

Or press `w` after running `npm start`

---

## 📁 Project Structure

```
manage-cars/
├── app/                          # Main application directory
│   ├── (tabs)/                   # Tab navigation screens
│   │   ├── index.tsx            # Home / Vehicle list
│   │   ├── search.tsx           # Search vehicles
│   │   ├── add.tsx              # Add new vehicle
│   │   └── explore.tsx          # Explore
│   ├── screens/                 # Individual screens
│   │   ├── detail.tsx           # Vehicle details
│   │   ├── edit.tsx             # Edit vehicle info
│   │   ├── add.tsx              # Add vehicle
│   │   └── search.tsx           # Search
│   ├── login.tsx                # Login screen
│   ├── register.tsx             # Register screen
│   ├── index.tsx                # Entry point
│   └── _layout.tsx              # Root layout & navigation
│
├── components/                   # Reusable components
│   ├── common/
│   │   ├── Button.tsx           # Custom button component
│   │   ├── InputField.tsx       # Input field component
│   │   └── VehicleCard.tsx      # Vehicle info card
│   └── ui/                      # UI components (icons, etc.)
│
├── services/                     # Service layer for API handling
│   ├── apiClient.ts             # Axios client configuration
│   ├── authService.ts           # Authentication service
│   ├── vehicleService.ts        # Vehicle management service
│   ├── storageService.ts        # Local storage
│   ├── token.ts                 # Token management
│   └── session.ts               # Session management
│
├── types/                        # TypeScript type definitions
│   └── vehicle.ts               # Vehicle types
│
├── constants/                    # Constants and configuration
│   ├── config.ts                # API config
│   └── theme.ts                 # Theme colors
│
├── utils/                        # Utility functions
│   └── dateUtils.ts             # Date formatting helpers
│
├── hooks/                        # Custom React hooks
│   ├── use-color-scheme.ts
│   └── use-theme-color.ts
│
└── assets/                       # Static assets (images, fonts)
```

---

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run android` | Run on Android emulator/device |
| `npm run ios` | Run on iOS simulator/device |
| `npm run web` | Run on web browser |
| `npm run lint` | Check code style with ESLint |

### Dev Server Shortcuts

- `r` - Reload app
- `m` - Toggle menu
- `j` - Open debugger
- `a` - Open on Android
- `i` - Open on iOS
- `w` - Open on Web

---

## 🔌 API Integration

The app connects to Spring Boot backend via RESTful API.

### API Configuration

File: [`constants/config.ts`](constants/config.ts)

```typescript
export const API_BASE_URL = "http://192.168.0.133:8084";
```

### API Endpoints Used

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/login` | POST | User login |
| `/api/v1/vehicle` | GET | Get vehicle list |
| `/api/v1/vehicle` | POST | Add new vehicle |
| `/api/v1/vehicle/{id}` | GET | Get vehicle details |
| `/api/v1/vehicle/{id}` | PUT | Update vehicle info |
| `/api/v1/vehicle` | DELETE | Delete vehicle |
| `/api/v1/vehicle/status` | POST | Update IN/OUT status |

### Service Architecture

```typescript
// apiClient.ts - Configure axios with interceptors
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// authService.ts - Handle authentication
export const authService = {
  login(username, password),
  register(userData),
  logout(),
  getToken(),
};

// vehicleService.ts - Vehicle CRUD management
export const vehicleService = {
  getVehicles(),
  getVehicleById(id),
  createVehicle(data),
  updateVehicle(id, data),
  deleteVehicle(id),
  updateStatus(vehicleId, employeeId, status),
};
```

---

## 🎨 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React Native** | 0.81.5 | Cross-platform mobile framework |
| **Expo** | ~54.0 | Development platform & tools |
| **TypeScript** | ~5.9 | Type-safe JavaScript |
| **Expo Router** | ~6.0 | File-based routing |
| **React Navigation** | ^7.1 | Navigation management |
| **Axios** | - | HTTP client |
| **Expo Secure Store** | ~15.0 | Secure token storage |
| **Expo File System** | ~19.0 | File operations |
| **Expo Linear Gradient** | ~15.0 | Gradient effects |

---

## 🔒 Authentication & Security

### JWT Token Flow

1. **Login**: User sends username/password → Backend returns JWT token
2. **Storage**: Token stored securely in Expo SecureStore
3. **Authorization**: All requests include `Authorization: Bearer <token>`
4. **Refresh**: Token expires → Auto refresh or re-login required

### Token Structure

```typescript
interface AuthResponse {
  token: string;           // JWT access token
  refreshToken: string;    // Refresh token
  expiresIn: number;       // Token expiry time
}
```

---

## 🐛 Troubleshooting

### 1. Error installing dependencies

```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 2. Metro Bundler won't start

```bash
# Reset Metro cache
npx expo start -c
```

### 3. Cannot connect to backend

- ✅ Check backend is running (`http://<IP>:8084`)
- ✅ Update correct IP in `constants/config.ts`
- ✅ Ensure computer and phone on same WiFi
- ✅ Disable VPN/Proxy
- ✅ Check firewall settings

### 4. "Network request failed" error

```typescript
// Check API_BASE_URL
console.log(API_BASE_URL); // Must be actual IP, not localhost

// Test backend first
curl http://<YOUR_IP>:8084/api/v1/vehicle
```

### 5. QR code won't scan

- Ensure same WiFi network
- Try manual connection: `exp://<IP>:8081`
- Check port 8081 not blocked

### 6. Expo Go doesn't show updates

- Press `r` in terminal to reload
- Shake device → Reload
- Remove app from background and reopen

---

## 📝 Development Guide

### Adding New Screen

1. Create file in `app/screens/` or `app/(tabs)/`
2. Define component with TypeScript
3. Update navigation in `_layout.tsx` if needed
4. Add types to `types/` if new data

### Adding New API Endpoint

1. Update service in `services/vehicleService.ts`
2. Add TypeScript types in `types/`
3. Handle error and loading states
4. Update UI components

### Customizing Theme

Edit [`constants/theme.ts`](constants/theme.ts):

```typescript
export const Colors = {
  primary: '#5FCCC4',      // Teal
  secondary: '#FF8B9A',    // Pink
  background: '#F8F9FA',
  text: '#333333',
  // ...
};
```

---

## 📦 Production Build

### Android APK

```bash
# Build APK
eas build --platform android --profile production

# Build AAB (Google Play)
eas build --platform android --profile production:aab
```

### iOS IPA

```bash
eas build --platform ios --profile production
```

*Requires: Expo account and EAS Build configuration*

---

## 🤝 Contributing

All contributions are welcome! 

1. Fork repository
2. Create branch: `git checkout -b feature/FeatureName`
3. Commit changes: `git commit -m 'Add feature X'`
4. Push to branch: `git push origin feature/FeatureName`
5. Open Pull Request

---

## 📄 License

This project is distributed under the MIT License. See [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **GitHub**: [CongSon01](https://github.com/CongSon01)
- **Project**: Vehicle Management System

---

## 🙏 Acknowledgments

- [Expo](https://expo.dev/) - Excellent React Native development platform
- [React Native](https://reactnative.dev/) - Cross-platform mobile framework
- [Spring Boot](https://spring.io/projects/spring-boot) - Backend framework

---

**Happy Coding! 🎉**
