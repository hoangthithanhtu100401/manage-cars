# 车辆管理系统 (Vehicle Management System)

## 功能概述

这是一个使用 React Native 和 Expo 开发的车辆管理应用，具有以下功能：

### 主要功能
- **添加车辆** - 添加新车辆信息（车主姓名、车牌号、电话、添加日期）
- **查询车辆** - 根据车牌号搜索车辆
- **查看详情** - 查看车辆的详细信息
- **编辑信息** - 修改车辆信息
- **删除车辆** - 删除不需要的车辆记录
- **状态管理** - 更新车辆状态（IN/OUT）

### 数据存储
- 所有数据存储在本地 JSON 文件中
- 使用 Expo File System 管理数据持久化
- 无需配置数据库

## 项目结构

```
Vehicle-management/
├── app/
│   ├── _layout.tsx              # 主布局配置
│   ├── index.tsx                # 入口文件（重定向到 home）
│   └── screens/
│       ├── home.tsx             # 首页（查询/添加按钮）
│       ├── add.tsx              # 添加车辆页面
│       ├── search.tsx           # 搜索车辆页面
│       ├── detail.tsx           # 车辆详情页面
│       └── edit.tsx             # 编辑车辆页面
├── components/
│   └── common/
│       ├── Button.tsx           # 按钮组件
│       ├── InputField.tsx       # 输入框组件
│       └── VehicleCard.tsx      # 车辆卡片组件
├── services/
│   └── storageService.ts        # 数据存储服务
├── types/
│   └── vehicle.ts               # TypeScript 类型定义
└── utils/
    └── dateUtils.ts             # 日期工具函数

```

## 如何运行

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm start
```

### 3. 在设备上运行
- **Android**: 按 `a` 或使用 Expo Go 应用扫描 QR 码
- **iOS**: 按 `i` 或使用相机应用扫描 QR 码  
- **Web**: 按 `w` 在浏览器中打开

## 主要技术栈

- **React Native** - 跨平台移动应用框架
- **Expo** - React Native 开发工具和服务
- **Expo Router** - 基于文件的路由系统
- **TypeScript** - 类型安全的 JavaScript
- **Expo File System** - 本地文件存储
- **Expo Linear Gradient** - 渐变效果

## 界面语言

所有界面文本均使用中文（简体）

## 开发者说明

### 添加新功能
1. 在 `app/screens/` 中创建新页面
2. 在 `app/_layout.tsx` 中注册路由
3. 更新 `services/storageService.ts` 添加数据操作逻辑

### 修改样式
- 所有样式都在各自组件的 StyleSheet 中定义
- 主色调：#5FCCC4（青绿色）
- 辅助色：#FF8B9A（粉红色）

### 数据结构
```typescript
interface Vehicle {
  id: string;
  name: string;
  licensePlate: string;
  phone: string;
  dateAdded: string;
  status: 'IN' | 'OUT';
}
```

## 版本
1.0.0

## License
MIT
