# 車輛管理系統 (Vehicle Management System)

一個使用 React Native 和 Expo 開發的車輛管理行動應用，支援車輛資訊的增刪改查和狀態管理。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Expo](https://img.shields.io/badge/Expo-~54.0-000020.svg?style=flat&logo=expo)
![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB.svg?style=flat&logo=react)

## 📱 功能特性

- ✅ **新增車輛** - 錄入車主姓名、車牌號、電話、新增日期
- 🔍 **搜尋查詢** - 根據車牌號快速查找車輛
- 📄 **查看詳情** - 完整顯示車輛資訊和當前狀態
- ✏️ **編輯資訊** - 修改車輛的基本資訊
- 🗑️ **刪除車輛** - 移除不需要的車輛記錄
- 🚗 **狀態管理** - 即時更新車輛進出狀態 (IN/OUT)
- 💾 **本地儲存** - 資料儲存在本機 JSON 檔案，無需設定資料庫
- 🎨 **精美介面** - 現代化 UI 設計，流暢的動畫效果

## 🎥 應用截圖

主介面包含：
- 搜尋頁面 - 車輛查詢和列表展示
- 新增頁面 - 新增車輛資訊
- 詳細頁面 - 查看和管理車輛狀態
- 編輯頁面 - 修改車輛資訊

## 📋 系統要求

在開始之前，請確保您的電腦已安裝以下軟體：

- **Node.js** (v20.0 或更高版本) - [下載地址](https://nodejs.org/)
- **npm** (v9.0 或更高版本) - 隨 Node.js 一起安裝
- **Git** (可選) - [下載地址](https://git-scm.com/)

### 行動裝置要求

- **Android**: Android 5.0 (API 21) 或更高版本
- **iOS**: iOS 13.4 或更高版本
- **Expo Go 應用**: 從 App Store 或 Google Play 下載

## 🚀 快速開始

### 1. 克隆或下載專案

**選項 A：使用 Git 克隆**
```bash
git clone https://github.com/CongSon01/React-Vehicle-Management.git
cd React-Vehicle-Management
```

**選項 B：下載 ZIP**
1. 點擊頁面右上角的 "Code" 按鈕
2. 選擇 "Download ZIP"
3. 解壓到您想要的位置

### 2. 安裝相依套件

打開終端（命令提示字元/PowerShell/Terminal），進入專案目錄：

```bash
cd path/to/React-Vehicle-Management
npm install
```

**注意**：首次安裝可能需要 2-5 分鐘，請耐心等候。

### 3. 啟動開發伺服器

```bash
npm start
```

啟動成功後，您會看到：
- QR 碼
- Metro Bundler 正在運行的提示
- 多個運行選項

### 4. 在裝置上執行應用

#### 方法 1：使用 Expo Go（建議初學者）

1. 在手機上安裝 **Expo Go** 應用
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. 確保手機和電腦連接到**同一個 Wi-Fi 網路**

3. 打開 Expo Go 應用：
   - **Android**: 使用應用內的掃描功能掃描終端中的 QR 碼
   - **iOS**: 打開相機應用掃描 QR 碼，點擊通知打開 Expo Go

#### 方法 2：使用 Android 模擬器

```bash
npm run android
```

前提：已安裝並配置 Android Studio 和模擬器

#### 方法 3：使用 iOS 模擬器 (僅 Mac)

```bash
npm run ios
```

前提：已安裝 Xcode

#### 方法 4：在 Web 瀏覽器中運行

```bash
npm run web
```

或在啟動後按 `w` 鍵

## 📦 專案結構

```
Vehicle-management/
├── app/                      # 應用主目錄
│   ├── (tabs)/              # Tab 導覽頁面
│   │   ├── search.tsx       # 搜尋頁面（首頁）
│   │   └── add.tsx          # 新增車輛頁面
│   ├── screens/             # 其他畫面
│   │   ├── detail.tsx       # 車輛詳情頁面
│   │   └── edit.tsx         # 編輯頁面
│   ├── _layout.tsx          # 路由配置
   └── index.tsx            # 進入點
├── components/              # 可重複使用的元件
│   └── common/
│       ├── Button.tsx       # 按鈕元件
│       ├── InputField.tsx   # 輸入框元件
│       └── VehicleCard.tsx  # 車輛卡片元件
├── services/                # 服務層
│   └── storageService.ts    # 資料儲存服務
├── types/                   # TypeScript 型別定義
│   └── vehicle.ts           # 車輛型別
├── utils/                   # 工具函式
│   └── dateUtils.ts         # 日期處理
├── constants/               # 常數配置
│   └── theme.ts            # 主題配置
└── package.json            # 專案相依套件

```

## 🔧 可用命令

| 命令 | 說明 |
|------|------|
| `npm start` | 啟動 Expo 開發伺服器 |
| `npm run android` | 在 Android 裝置/模擬器上運行 |
| `npm run ios` | 在 iOS 裝置/模擬器上運行 (僅 Mac) |
| `npm run web` | 在瀏覽器中運行 |
| `npm run lint` | 檢查程式碼風格 |

### 開發伺服器快捷鍵

在開發伺服器運行時，可以使用以下快捷鍵：

- `r` - 重新載入應用
- `m` - 切換選單
- `j` - 打開偵錯器
- `a` - 在 Android 上開啟
- `i` - 在 iOS 上開啟
- `w` - 在 Web 上開啟

## 💾 資料儲存

應用使用 Expo File System 將資料儲存在裝置的本機檔案系統中：

- 資料檔案：`vehicles.json`
- 位置：應用的文件目錄
- 格式：JSON

**資料結構範例**：
```json
{
  "vehicles": [
    {
      "id": "1234567890",
      "name": "張三",
      "licensePlate": "京A12345",
      "phone": "13800138000",
      "dateAdded": "2025/12/26",
      "status": "OUT"
    }
  ]
}
```

## 🎨 技術棧

- **React Native** - 跨平台行動應用框架
- **Expo** (~54.0) - React Native 開發工具和服務
- **Expo Router** - 檔案系統路由
- **TypeScript** - 型別安全的 JavaScript
- **Expo File System** - 本機檔案儲存
- **Expo Linear Gradient** - 漸變效果
- **React Navigation** - 導航管理

## 🐛 常見問題

### 1. 安裝相依套件時出錯

```bash
# 清除快取後重新安裝
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 2. Metro Bundler 啟動失敗

```bash
# 重置 Metro 快取
npx expo start -c
```

### 3. QR 碼掃描後無法連線

- 確保手機和電腦在同一個 Wi-Fi 網路
- 關閉 VPN 或代理
- 檢查防火牆設定

### 4. 在 Expo Go 中看不到更新

在終端按 `r` 鍵重新載入應用

### 5. Node.js 版本過低

確保使用 Node.js v20 或更高版本：
```bash
node --version
```

## 📝 開發說明

### 新增功能

1. 在 `app/screens/` 或 `app/(tabs)/` 中建立新頁面
2. 在 `app/_layout.tsx` 中註冊路由（如需要）
3. 更新 `services/storageService.ts` 新增資料操作

### 修改主題

主要顏色在元件的 StyleSheet 中定義：
- 主色：`#5FCCC4` (青綠色)
- 輔助色：`#FF8B9A` (粉紅色)
- 背景色：`#F8F9FA`

### 測試應用

1. 在真機上測試以獲得最佳效能
2. 測試不同的螢幕尺寸
3. 檢查資料持久化是否正常

## 📄 許可證

MIT License - 詳見 [LICENSE](LICENSE) 檔案

## 👥 貢獻

歡迎貢獻程式碼！如果您想改進這個專案：

1. Fork 這個倉庫
2. 建立您的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟一個 Pull Request

## 📞 聯絡方式

如有問題或建議，請：
- 提交 Issue
- 發送 Pull Request
- 聯絡專案維護者

## 🙏 致謝

- [Expo](https://expo.dev/) - 優秀的 React Native 開發平台
- [React Native](https://reactnative.dev/) - 跨平台行動開發框架
- 所有貢獻者和使用者

---

**祝您使用愉快！** 🎉
# 车辆管理系统 (Vehicle Management System)

一个使用 React Native 和 Expo 开发的车辆管理移动应用，支持车辆信息的增删改查和状态管理。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Expo](https://img.shields.io/badge/Expo-~54.0-000020.svg?style=flat&logo=expo)
![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB.svg?style=flat&logo=react)

## 📱 功能特性

- ✅ **添加车辆** - 录入车主姓名、车牌号、电话、添加日期
- 🔍 **搜索查询** - 根据车牌号快速查找车辆
- 📄 **查看详情** - 完整显示车辆信息和当前状态
- ✏️ **编辑信息** - 修改车辆的基本信息
- 🗑️ **删除车辆** - 移除不需要的车辆记录
- 🚗 **状态管理** - 实时更新车辆进出状态 (IN/OUT)
- 💾 **本地存储** - 数据存储在本地 JSON 文件，无需配置数据库
- 🎨 **精美界面** - 现代化 UI 设计，流畅的动画效果

## 🎥 应用截图

主界面包含：
- 搜索页面 - 车辆查询和列表展示
- 添加页面 - 新增车辆信息
- 详情页面 - 查看和管理车辆状态
- 编辑页面 - 修改车辆信息

## 📋 系统要求

在开始之前，请确保您的计算机已安装以下软件：

- **Node.js** (v20.0 或更高版本) - [下载地址](https://nodejs.org/)
- **npm** (v9.0 或更高版本) - 随 Node.js 一起安装
- **Git** (可选) - [下载地址](https://git-scm.com/)

### 移动设备要求

- **Android**: Android 5.0 (API 21) 或更高版本
- **iOS**: iOS 13.4 或更高版本
- **Expo Go 应用**: 从 App Store 或 Google Play 下载

## 🚀 快速开始

### 1. 克隆或下载项目

**选项 A: 使用 Git 克隆**
```bash
git clone https://github.com/CongSon01/React-Vehicle-Management.git
cd React-Vehicle-Management
```

**选项 B: 下载 ZIP**
1. 点击页面右上角的 "Code" 按钮
2. 选择 "Download ZIP"
3. 解压到您想要的位置

### 2. 安装依赖

打开终端（命令提示符/PowerShell/Terminal），进入项目目录：

````markdown
# 車輛管理系統 (Vehicle Management System)

一個使用 React Native 和 Expo 開發的車輛管理行動應用，支援車輛資訊的增刪改查和狀態管理。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Expo](https://img.shields.io/badge/Expo-~54.0-000020.svg?style=flat&logo=expo)
![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB.svg?style=flat&logo=react)

## 📱 功能特性

- ✅ **新增車輛** - 錄入車主姓名、車牌號、電話、新增日期
- 🔍 **搜尋查詢** - 根據車牌號快速查找車輛
- 📄 **查看詳情** - 完整顯示車輛資訊和當前狀態
- ✏️ **編輯資訊** - 修改車輛的基本資訊
- 🗑️ **刪除車輛** - 移除不需要的車輛記錄
- 🚗 **狀態管理** - 即時更新車輛進出狀態 (IN/OUT)
- 💾 **本地儲存** - 資料儲存在本機 JSON 檔案，無需設定資料庫
- 🎨 **精美介面** - 現代化 UI 設計，流暢的動畫效果

## 🎥 應用截圖

主介面包含：
- 搜尋頁面 - 車輛查詢和列表展示
- 新增頁面 - 新增車輛資訊
- 詳細頁面 - 查看和管理車輛狀態
- 編輯頁面 - 修改車輛資訊

## 📋 系統要求

在開始之前，請確保您的電腦已安裝以下軟體：

- **Node.js** (v20.0 或更高版本) - [下載地址](https://nodejs.org/)
- **npm** (v9.0 或更高版本) - 隨 Node.js 一起安裝
- **Git** (可選) - [下載地址](https://git-scm.com/)

### 行動裝置要求

- **Android**: Android 5.0 (API 21) 或更高版本
- **iOS**: iOS 13.4 或更高版本
- **Expo Go 應用**: 從 App Store 或 Google Play 下載

## 🚀 快速開始

### 1. 克隆或下載專案

**選項 A：使用 Git 克隆**
```bash
git clone https://github.com/CongSon01/React-Vehicle-Management.git
cd React-Vehicle-Management
```

**選項 B：下載 ZIP**
1. 點擊頁面右上角的 "Code" 按鈕
2. 選擇 "Download ZIP"
3. 解壓到您想要的位置

### 2. 安裝相依套件

打開終端（命令提示字元/PowerShell/Terminal），進入專案目錄：

```bash
cd path/to/React-Vehicle-Management
npm install
```

**注意**：首次安裝可能需要 2-5 分鐘，請耐心等候。

### 3. 啟動開發伺服器

```bash
npm start
```

啟動成功後，您會看到：
- QR 碼
- Metro Bundler 正在運行的提示
- 多個運行選項

### 4. 在裝置上執行應用

#### 方法 1：使用 Expo Go（建議初學者）

1. 在手機上安裝 **Expo Go** 應用
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. 確保手機和電腦連接到**同一個 Wi-Fi 網路**

3. 打開 Expo Go 應用：
   - **Android**: 使用應用內的掃描功能掃描終端中的 QR 碼
   - **iOS**: 打開相機應用掃描 QR 碼，點擊通知打開 Expo Go

#### 方法 2：使用 Android 模擬器

```bash
npm run android
```

前提：已安裝並配置 Android Studio 和模擬器

#### 方法 3：使用 iOS 模擬器 (僅 Mac)

```bash
npm run ios
```

前提：已安裝 Xcode

#### 方法 4：在 Web 瀏覽器中運行

```bash
npm run web
```

或在啟動後按 `w` 鍵

## 📦 專案結構

```
Vehicle-management/
├── app/                      # 應用主目錄
│   ├── (tabs)/              # Tab 導覽頁面
│   │   ├── search.tsx       # 搜尋頁面（首頁）
│   │   └── add.tsx          # 新增車輛頁面
│   ├── screens/             # 其他畫面
│   │   ├── detail.tsx       # 車輛詳情頁面
│   │   └── edit.tsx         # 編輯頁面
│   ├── _layout.tsx          # 路由配置
│   └── index.tsx            # 進入點
├── components/              # 可重複使用的元件
│   └── common/
│       ├── Button.tsx       # 按鈕元件
│       ├── InputField.tsx   # 輸入框元件
│       └── VehicleCard.tsx  # 車輛卡片元件
├── services/                # 服務層
│   └── storageService.ts    # 資料儲存服務
├── types/                   # TypeScript 型別定義
│   └── vehicle.ts           # 車輛型別
├── utils/                   # 工具函式
│   └── dateUtils.ts         # 日期處理
├── constants/               # 常數配置
│   └── theme.ts            # 主題配置
└── package.json            # 專案相依套件

```

## 🔧 可用命令

| 命令 | 說明 |
|------|------|
| `npm start` | 啟動 Expo 開發伺服器 |
| `npm run android` | 在 Android 裝置/模擬器上運行 |
| `npm run ios` | 在 iOS 裝置/模擬器上運行 (僅 Mac) |
| `npm run web` | 在瀏覽器中運行 |
| `npm run lint` | 檢查程式碼風格 |

### 開發伺服器快捷鍵

在開發伺服器運行時，可以使用以下快捷鍵：

- `r` - 重新載入應用
- `m` - 切換選單
- `j` - 打開偵錯器
- `a` - 在 Android 上開啟
- `i` - 在 iOS 上開啟
- `w` - 在 Web 上開啟

## 💾 資料儲存

應用使用 Expo File System 將資料儲存在裝置的本機檔案系統中：

- 資料檔案：`vehicles.json`
- 位置：應用的文件目錄
- 格式：JSON

**資料結構範例**：
```json
{
  "vehicles": [
    {
      "id": "1234567890",
      "name": "張三",
      "licensePlate": "京A12345",
      "phone": "13800138000",
      "dateAdded": "2025/12/26",
      "status": "OUT"
    }
  ]
}
```

## 🎨 技術棧

- **React Native** - 跨平台行動應用框架
- **Expo** (~54.0) - React Native 開發工具和服務
- **Expo Router** - 檔案系統路由
- **TypeScript** - 型別安全的 JavaScript
- **Expo File System** - 本機檔案儲存
- **Expo Linear Gradient** - 漸變效果
- **React Navigation** - 導航管理

## 🐛 常見問題

### 1. 安裝相依套件時出錯

```bash
# 清除快取後重新安裝
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 2. Metro Bundler 啟動失敗

```bash
# 重置 Metro 快取
npx expo start -c
```

### 3. QR 碼掃描後無法連線

- 確保手機和電腦在同一個 Wi-Fi 網路
- 關閉 VPN 或代理
- 檢查防火牆設定

### 4. 在 Expo Go 中看不到更新

在終端按 `r` 鍵重新載入應用

### 5. Node.js 版本過低

確保使用 Node.js v20 或更高版本：
```bash
node --version
```

## 📝 開發說明

### 新增功能

1. 在 `app/screens/` 或 `app/(tabs)/` 中建立新頁面
2. 在 `app/_layout.tsx` 中註冊路由（如需要）
3. 更新 `services/storageService.ts` 新增資料操作

### 修改主題

主要顏色在元件的 StyleSheet 中定義：
- 主色：`#5FCCC4` (青綠色)
- 輔助色：`#FF8B9A` (粉紅色)
- 背景色：`#F8F9FA`

### 測試應用

1. 在真機上測試以獲得最佳效能
2. 測試不同的螢幕尺寸
3. 檢查資料持久化是否正常

## 📄 許可證

MIT License - 詳見 [LICENSE](LICENSE) 檔案

## 👥 貢獻

歡迎貢獻程式碼！如果您想改進這個專案：

1. Fork 這個倉庫
2. 建立您的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟一個 Pull Request

## 📞 聯絡方式

如有問題或建議，請：
- 提交 Issue
- 發送 Pull Request
- 聯絡專案維護者

## 🙏 致謝

- [Expo](https://expo.dev/) - 優秀的 React Native 開發平台
- [React Native](https://reactnative.dev/) - 跨平台行動開發框架
- 所有貢獻者和使用者

---

**祝您使用愉快！** 🎉

````
