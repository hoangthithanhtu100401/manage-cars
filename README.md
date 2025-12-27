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

```bash
cd path/to/React-Vehicle-Management
npm install
```

**注意**: 首次安装可能需要 2-5 分钟，请耐心等待。

### 3. 启动开发服务器

```bash
npm start
```

启动成功后，您会看到：
- QR 码
- Metro Bundler 正在运行的提示
- 多个运行选项

### 4. 在设备上运行应用

#### 方法 1: 使用 Expo Go (推荐初学者)

1. 在手机上安装 **Expo Go** 应用
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. 确保手机和电脑连接到**同一个 Wi-Fi 网络**

3. 打开 Expo Go 应用：
   - **Android**: 使用应用内的扫描功能扫描终端中的 QR 码
   - **iOS**: 打开相机应用扫描 QR 码，点击通知打开 Expo Go

#### 方法 2: 使用 Android 模拟器

```bash
npm run android
```

前提：已安装并配置 Android Studio 和模拟器

#### 方法 3: 使用 iOS 模拟器 (仅 Mac)

```bash
npm run ios
```

前提：已安装 Xcode

#### 方法 4: 在 Web 浏览器中运行

```bash
npm run web
```

或在启动后按 `w` 键

## 📦 项目结构

```
Vehicle-management/
├── app/                      # 应用主目录
│   ├── (tabs)/              # Tab 导航页面
│   │   ├── search.tsx       # 搜索页面 (首页)
│   │   └── add.tsx          # 添加车辆页面
│   ├── screens/             # 其他屏幕
│   │   ├── detail.tsx       # 车辆详情页面
│   │   └── edit.tsx         # 编辑页面
│   ├── _layout.tsx          # 路由配置
│   └── index.tsx            # 入口文件
├── components/              # 可复用组件
│   └── common/
│       ├── Button.tsx       # 按钮组件
│       ├── InputField.tsx   # 输入框组件
│       └── VehicleCard.tsx  # 车辆卡片组件
├── services/                # 服务层
│   └── storageService.ts    # 数据存储服务
├── types/                   # TypeScript 类型定义
│   └── vehicle.ts           # 车辆类型
├── utils/                   # 工具函数
│   └── dateUtils.ts         # 日期处理
├── constants/               # 常量配置
│   └── theme.ts            # 主题配置
└── package.json            # 项目依赖

```

## 🔧 可用命令

| 命令 | 说明 |
|------|------|
| `npm start` | 启动 Expo 开发服务器 |
| `npm run android` | 在 Android 设备/模拟器上运行 |
| `npm run ios` | 在 iOS 设备/模拟器上运行 (仅 Mac) |
| `npm run web` | 在浏览器中运行 |
| `npm run lint` | 检查代码风格 |

### 开发服务器快捷键

在开发服务器运行时，可以使用以下快捷键：

- `r` - 重新加载应用
- `m` - 切换菜单
- `j` - 打开调试器
- `a` - 在 Android 上打开
- `i` - 在 iOS 上打开
- `w` - 在 Web 上打开

## 💾 数据存储

应用使用 Expo File System 将数据存储在设备的本地文件系统中：

- 数据文件：`vehicles.json`
- 位置：应用的文档目录
- 格式：JSON

**数据结构示例**：
```json
{
  "vehicles": [
    {
      "id": "1234567890",
      "name": "张三",
      "licensePlate": "京A12345",
      "phone": "13800138000",
      "dateAdded": "2025/12/26",
      "status": "OUT"
    }
  ]
}
```

## 🎨 技术栈

- **React Native** - 跨平台移动应用框架
- **Expo** (~54.0) - React Native 开发工具和服务
- **Expo Router** - 文件系统路由
- **TypeScript** - 类型安全的 JavaScript
- **Expo File System** - 本地文件存储
- **Expo Linear Gradient** - 渐变效果
- **React Navigation** - 导航管理

## 🐛 常见问题

### 1. 安装依赖时出错

```bash
# 清除缓存后重新安装
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 2. Metro Bundler 启动失败

```bash
# 重置 Metro 缓存
npx expo start -c
```

### 3. QR 码扫描后无法连接

- 确保手机和电脑在同一个 Wi-Fi 网络
- 关闭 VPN 或代理
- 检查防火墙设置

### 4. Expo Go 中看不到更新

在终端按 `r` 键重新加载应用

### 5. Node.js 版本过低

确保使用 Node.js v20 或更高版本：
```bash
node --version
```

## 📝 开发说明

### 添加新功能

1. 在 `app/screens/` 或 `app/(tabs)/` 中创建新页面
2. 在 `app/_layout.tsx` 中注册路由（如需要）
3. 更新 `services/storageService.ts` 添加数据操作

### 修改主题

主要颜色在组件的 StyleSheet 中定义：
- 主色：`#5FCCC4` (青绿色)
- 辅助色：`#FF8B9A` (粉红色)
- 背景色：`#F8F9FA`

### 测试应用

1. 在真机上测试以获得最佳性能
2. 测试不同的屏幕尺寸
3. 检查数据持久化是否正常

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 👥 贡献

欢迎贡献代码！如果您想改进这个项目：

1. Fork 这个仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📞 联系方式

如有问题或建议，请：
- 提交 Issue
- 发送 Pull Request
- 联系项目维护者

## 🙏 致谢

- [Expo](https://expo.dev/) - 优秀的 React Native 开发平台
- [React Native](https://reactnative.dev/) - 跨平台移动开发框架
- 所有贡献者和用户

---

**祝您使用愉快！** 🎉
