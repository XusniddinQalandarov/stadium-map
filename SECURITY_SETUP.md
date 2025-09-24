# Security Setup for Stadium Map

## 🔒 **CRITICAL: Credential Security**

### **Files Structure:**
- `src/app/config/app.config.ts` - **SAFE TO COMMIT** (contains placeholders)
- `src/app/config/app.config.local.ts` - **NEVER COMMIT** (contains real credentials)
- `.env` - **NEVER COMMIT** (contains real credentials)

### **How It Works:**

1. **Development**: Uses `app.config.local.ts` (not tracked by Git)
2. **Production**: Uses environment variables or build-time replacement
3. **Fallback**: Uses placeholder values from `app.config.ts`

### **Setup Instructions:**

#### **For Development:**
1. Copy `src/app/config/app.config.local.ts` 
2. Add your real credentials to the local config file
3. The app will automatically use local config if available

#### **For Production:**
1. Set environment variables in your deployment platform
2. Use build-time replacement to inject credentials
3. Never commit real credentials to Git

### **Security Checklist:**
- ✅ Real credentials only in `.env` and `app.config.local.ts`
- ✅ Both files are in `.gitignore`
- ✅ Main config file has placeholder values
- ✅ No sensitive data in tracked files

### **If Credentials Are Exposed:**
1. **Immediately change** the actual credentials
2. **Clean Git history** to remove exposed secrets
3. **Update** `.env` and `app.config.local.ts` with new values
4. **Force push** to update remote repository

### **Files to NEVER Commit:**
- `.env`
- `src/app/config/app.config.local.ts`
- Any file containing real credentials

### **Safe to Commit:**
- `src/app/config/app.config.ts` (has placeholders)
- `.env.example` (template file)
- All other source files
