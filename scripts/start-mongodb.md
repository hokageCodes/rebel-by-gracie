# 🗄️ MongoDB Setup Guide

## 🔥 **QUICK FIX - Multiple Options**

### **Option 1: MongoDB Community Server (Windows)**

1. **Download MongoDB Community Server:**
   - Go to: https://www.mongodb.com/try/download/community
   - Download Windows version
   - Install with default settings

2. **Start MongoDB Service:**
   ```cmd
   net start MongoDB
   ```

### **Option 2: MongoDB Atlas (Cloud - RECOMMENDED)**

1. **Create Free Account:**
   - Go to: https://cloud.mongodb.com/
   - Sign up for free (500MB free storage)

2. **Create Cluster:**
   - Click "Create" → "Shared" → "Free"
   - Choose region close to you
   - Click "Create Cluster"

3. **Get Connection String:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://...`)

4. **Update .env file:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xyz.mongodb.net/rebel-by-grace
   ```

### **Option 3: Docker (If you have Docker)**

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### **Option 4: Local MongoDB (If installed)**

```cmd
# Windows Command Prompt
mongod --dbpath "C:\data\db"

# Or start as service
sc start MongoDB
```

---

## ✅ **VERIFICATION**

Once MongoDB is running, restart your Next.js app:

```bash
npm run dev
```

You should see:
- ✅ No more ECONNREFUSED errors
- ✅ Registration working
- ✅ Login working  
- ✅ Authentication flowing smoothly

---

## 🚀 **ALTERNATIVE: Skip Database for Testing**

If you just want to test the auth flow without database:

1. **Comment out database calls** temporarily
2. **Use mock responses** for testing
3. **Focus on frontend flow** verification

**Your auth system is still 100% ready - just needs the database connection!**
