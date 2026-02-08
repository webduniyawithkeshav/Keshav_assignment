# Demo Video Recording Checklist

## 📋 Pre-Recording Setup

### Environment Preparation
- [ ] Close unnecessary browser tabs and applications
- [ ] Clear browser history and cache
- [ ] Set browser zoom to 100%
- [ ] Hide personal bookmarks/extensions
- [ ] Use incognito/private window (optional)
- [ ] Prepare desktop background (clean, professional)

### Application Preparation
- [ ] MongoDB is running
- [ ] Backend server started (`npm run dev`)
- [ ] Frontend server started (`npm run dev`)
- [ ] Backend logs visible in Terminal 1
- [ ] Frontend logs visible in Terminal 2
- [ ] Admin account created and credentials noted
- [ ] Sample CSV file ready (26 records recommended)

### Recording Setup
- [ ] Recording software installed (OBS, Loom, QuickTime, etc.)
- [ ] Microphone tested (optional, for narration)
- [ ] Screen resolution set to 1920x1080 or 1280x720
- [ ] Recording area selected (full screen or browser only)
- [ ] Audio levels checked (if using narration)

---

## 🎬 Demo Recording Flow

### Part 1: Introduction (30 seconds)
- [ ] Show project folder structure briefly
- [ ] Show both terminals running (backend + frontend)
- [ ] Show MongoDB running (optional)

**Script:**
> "This is a full-stack MERN application for agent management with automatic CSV distribution. Backend runs on port 5000, frontend on 5173."

---

### Part 2: Login & Authentication (30 seconds)
- [ ] Open `http://localhost:5173` in browser
- [ ] Show login page design
- [ ] Enter admin credentials
- [ ] Click "Login"
- [ ] Show successful redirect to dashboard

**Script:**
> "Starting with admin authentication. The system uses JWT tokens stored in localStorage. After successful login, we're redirected to the dashboard."

---

### Part 3: Dashboard Overview (30 seconds)
- [ ] Show dashboard statistics
- [ ] Point out "Active Agents: 0/5" warning
- [ ] Show quick action cards
- [ ] Hover over action cards to show interaction

**Script:**
> "The dashboard shows key statistics. Notice we need exactly 5 active agents for distribution. Let's create them."

---

### Part 4: Create Agents (2 minutes)
- [ ] Click "Add Agent" card or navigation link
- [ ] Fill in first agent details:
  - Name: Agent One
  - Email: agent1@example.com
  - Phone: 1234567890
- [ ] Click "Create Agent"
- [ ] Show success message
- [ ] Return to dashboard (show agent count: 1/5)
- [ ] Repeat for agents 2-5 (you can speed up video for agents 3-5)

**Optional: Show validation**
- [ ] Try creating duplicate email (show error)
- [ ] Try invalid phone number (show error)

**Script:**
> "Creating agents with name, email, and phone. Email must be unique, phone must be 10-15 digits. Creating 5 agents total..."

---

### Part 5: Upload CSV (1.5 minutes)
- [ ] Return to dashboard (show agent count: 5/5 - green)
- [ ] Click "Upload CSV"
- [ ] Show agent count badge (5/5 ✅)
- [ ] Show file requirements section
- [ ] Click "Choose File"
- [ ] Select sample.csv (26 records)
- [ ] Show file name displayed
- [ ] Click "Upload & Distribute"
- [ ] Show loading state
- [ ] Show distribution results:
  - Total: 26 records
  - Agent 1: 6 records
  - Agent 2-5: 5 records each

**Script:**
> "Uploading a CSV with 26 records. The system validates file type, size, and required columns. Notice the distribution: first agent gets 6, others get 5. This is the equal distribution algorithm."

---

### Part 6: View Distribution (1.5 minutes)
- [ ] Click "View Distribution" or navigation link
- [ ] Show records table with all data
- [ ] Point out columns: FirstName, Phone, Notes, Assigned Agent, Status
- [ ] Use "Filter by Agent" dropdown
- [ ] Select "Agent One"
- [ ] Show only Agent One's records (6 records)
- [ ] Reset filter to "All Agents"
- [ ] Use "Filter by Status" dropdown
- [ ] Select "Pending"
- [ ] Show pagination controls (if applicable)

**Script:**
> "The distribution view shows all records. We can filter by agent to see individual assignments. Agent One has 6 records as expected. We can also filter by status and use pagination for large datasets."

---

### Part 7: Additional Features (1 minute)
- [ ] Navigate back to Dashboard
- [ ] Show updated statistics (records count)
- [ ] Show agent breakdown section (if available)
- [ ] Click on user name in navbar
- [ ] Click "Logout"
- [ ] Show redirect to login page
- [ ] Try accessing `/dashboard` directly (show auto-redirect to login)

**Script:**
> "Dashboard now shows updated statistics. Logging out clears the JWT token. Protected routes automatically redirect to login."

---

### Part 8: Backend Validation (Optional, 1 minute)
- [ ] Open browser DevTools (F12)
- [ ] Go to Network tab
- [ ] Login again
- [ ] Show `/auth/login` request/response (with token)
- [ ] Navigate to Upload page
- [ ] Show `/agents/count` request (with Authorization header)
- [ ] Upload CSV
- [ ] Show `/records/upload` request (multipart/form-data)

**Script:**
> "Looking at network requests, we see JWT tokens in Authorization headers. All protected endpoints require authentication."

---

### Part 9: Conclusion (30 seconds)
- [ ] Show both terminals still running
- [ ] Show MongoDB Compass (optional, to show data)
- [ ] Show project folder structure briefly

**Script:**
> "This completes the demo. The application handles authentication, agent management, file upload, and equal distribution across exactly 5 agents. All requirements from the assignment have been implemented."

---

## ⏱️ Total Recording Time: 7-9 minutes

---

## 🎥 Recording Tips

### Do's ✅
- **Speak clearly** (if adding narration)
- **Move cursor slowly** to show where you're clicking
- **Pause briefly** after each action to show results
- **Show validation errors** (duplicate email, invalid data)
- **Keep a steady pace** - not too fast, not too slow
- **Show console logs** briefly to prove backend is working
- **Highlight key features** (equal distribution, JWT, validation)

### Don'ts ❌
- **Don't rush** through important features
- **Don't show errors** unless intentional (for validation demo)
- **Don't switch tabs** unnecessarily
- **Don't edit video** excessively (simple cuts are fine)
- **Don't include personal information** in screen recording
- **Don't exceed 10 minutes** total length

---

## 🎬 Alternative Quick Demo (5 minutes)

If time is limited, focus on:
1. **Login** (30s)
2. **Create 2 agents quickly** (1m)
3. **Show "Need 5 agents" error on upload** (30s)
4. **Create remaining 3 agents** (1m)
5. **Upload CSV and show distribution** (1m)
6. **View distribution with one filter** (1m)

---

## 📝 Post-Recording Checklist

- [ ] Review entire recording for clarity
- [ ] Check audio levels (if narrated)
- [ ] Verify all features were demonstrated
- [ ] Ensure no sensitive information visible
- [ ] Trim beginning/end if needed
- [ ] Export in MP4/WebM format
- [ ] Test playback before submission
- [ ] Upload to appropriate platform (YouTube, Drive, etc.)
- [ ] Set video to unlisted/public as required
- [ ] Include video link in submission

---

## 🎯 Key Features to Emphasize

1. **Distribution Algorithm** - Show 26 → 6,5,5,5,5
2. **Exactly 5 Agents** - Show error with <5 agents
3. **JWT Authentication** - Show protected routes
4. **File Validation** - Show CSV requirements
5. **Responsive UI** - Show clean, professional design
6. **Error Handling** - Show validation errors
7. **Real-time Stats** - Show dashboard updates

---

**Good luck with your demo! 🎬**
