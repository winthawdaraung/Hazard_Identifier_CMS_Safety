# CMS Safety Team - Simple HazID Generator Guide

## 🎯 **Your Role**

You maintain the HazID Generator and distribute it to other CMS teams.

## 🚀 **Super Simple Workflow**

### **After Updating Excel Data:**
1. **Edit files** in `data/excel/`:
   - `CMS_Safety-List_Preventive_Protective_Measures.xlsx`
   - `TSO Recommendation Info.xlsx`

2. **Build new version**:
   - Windows: Double-click `rebuild-app.bat`
   - Linux/Mac: Run `./rebuild-app.sh`

3. **Share with teams**:
   - Zip `release-builds/HazID Generator-win32-x64/`
   - Send to any CMS team

### **After Code Updates (from developer):**
1. **Test**: `npm start`
2. **Build**: Double-click `rebuild-app.bat`
3. **Share**: Zip and distribute the folder

## 📁 **What You Manage**

```
Your Work:
├── rebuild-app.bat          # ← Double-click to build
├── data/excel/             # ← Edit Excel files here
└── release-builds/         # ← Share this folder

What Teams Get:
└── HazID Generator-win32-x64/  # ← Everything they need
    ├── HazID Generator.exe      # ← They run this
    ├── data/excel/             # ← Your Excel data (read-only for them)
    └── [support files]         # ← Electron framework
```

## 👥 **For All Teams**

### **Distribution:**
- **Same app for everyone** (your team + other teams)
- **Zip and share** the `HazID Generator-win32-x64` folder
- **Recipients extract and run** `HazID Generator.exe`

### **Usage:**
- **Your team**: Can edit Excel files → changes appear immediately
- **Other teams**: Just use the app, Excel files are read-only for them

## ✅ **Benefits**

- ✅ **One simple build** for everyone
- ✅ **Always works** - no complexity
- ✅ **Easy to support** - same version everywhere
- ✅ **Quick updates** - just rebuild and reshare

## 🔧 **Prerequisites**

- **Node.js** installed (https://nodejs.org/)
- **This source code folder**

## 🚨 **Troubleshooting**

### **Build Fails:**
- Close any running HazID Generator apps
- Make sure Excel files aren't open in Excel
- Try `npm install` first

### **App Won't Start for Recipients:**
- Make sure they extract the ENTIRE folder
- Don't just copy the .exe file
- Check Windows security warnings

## 💡 **Tips**

1. **Test before sharing**: Always run the built app once
2. **Clear file names**: Use dates like `HazID-Generator-2024-12-15.zip`
3. **Keep backups**: Save working Excel files
4. **Tell recipients**: Extract everything, then run the .exe

## 📞 **Support**

- **Technical Issues**: Win Thawdar Aung (Developer)
- **Data Questions**: CMS Safety Team Lead

---

**Simple is better! One build, everyone happy.** 🎉