# 🎬 Complete Demo Guide - Step by Step

## ✅ Step 1: View Dashboard (You are here!)

**What you should see:**
- Welcome message at the top
- 3 statistics cards showing:
  - **Active Agents: 0/5** (with orange warning - need 5 agents)
  - **Total Records: 0**
  - **Agents with Records: 0**
- 3 action cards below:
  - 👥 Add Agent
  - 📤 Upload CSV
  - 📊 View Distribution

**Take note:** The dashboard shows you need 5 agents before uploading files.

---

## ✅ Step 2: Create 5 Agents

### Agent 1:
1. **Click** the "Add Agent" card (or click "Add Agent" in the navigation bar)
2. **Fill in the form:**
   - **Name:** `Agent One`
   - **Email:** `agent1@example.com`
   - **Phone:** `1234567890`
3. **Click** "Create Agent"
4. **You should see:** Success message
5. **Navigate back** to Dashboard (click "Dashboard" in nav bar)
6. **Verify:** Active Agents should now show **1/5**

### Agent 2:
1. **Click** "Add Agent" again
2. **Fill in:**
   - **Name:** `Agent Two`
   - **Email:** `agent2@example.com`
   - **Phone:** `2345678901`
3. **Click** "Create Agent"
4. **Return** to Dashboard → Should show **2/5**

### Agent 3:
1. **Click** "Add Agent"
2. **Fill in:**
   - **Name:** `Agent Three`
   - **Email:** `agent3@example.com`
   - **Phone:** `3456789012`
3. **Click** "Create Agent"
4. **Return** to Dashboard → Should show **3/5**

### Agent 4:
1. **Click** "Add Agent"
2. **Fill in:**
   - **Name:** `Agent Four`
   - **Email:** `agent4@example.com`
   - **Phone:** `4567890123`
3. **Click** "Create Agent"
4. **Return** to Dashboard → Should show **4/5**

### Agent 5:
1. **Click** "Add Agent"
2. **Fill in:**
   - **Name:** `Agent Five`
   - **Email:** `agent5@example.com`
   - **Phone:** `5678901234`
3. **Click** "Create Agent"
4. **Return** to Dashboard → Should show **5/5** ✅ (GREEN!)

**✅ Checkpoint:** Dashboard now shows "You have exactly 5 active agents" in green

---

## ✅ Step 3: Upload CSV File

1. **Click** "Upload CSV" (from dashboard or navigation)

2. **You should see:**
   - **Agent count badge:** "Active Agents: 5/5" (GREEN ✅)
   - **Message:** "You have exactly 5 active agents. Ready for distribution!"
   - **File requirements** section listing:
     - Accepted formats: CSV, XLSX, XLS
     - Required columns: FirstName, Phone, Notes
     - Phone: 10-15 digits
     - Max file size: 10MB
     - Exactly 5 active agents required ✅

3. **Click** "Choose File" button

4. **Select** the file:
   - Navigate to: `C:\Users\kesha\OneDrive\Desktop\Assignmentcsinfo\sample.csv`
   - **Click** "Open"

5. **You should see:**
   - File name displayed: "sample.csv"

6. **Click** "Upload & Distribute" button

7. **Wait a moment** (you'll see "Uploading..." on the button)

8. **Success! You should see:**
   - Success message: "File uploaded and distributed successfully!"
   - **Distribution Results** section showing:
     ```
     Successfully distributed 26 records
     
     Agent One (agent1@example.com)    →  6 records  ← First agent gets the extra
     Agent Two (agent2@example.com)    →  5 records
     Agent Three (agent3@example.com)  →  5 records  
     Agent Four (agent4@example.com)   →  5 records
     Agent Five (agent5@example.com)   →  5 records
     
     Total: 6 + 5 + 5 + 5 + 5 = 26 ✅
     ```

**✅ Checkpoint:** Distribution shows 6, 5, 5, 5, 5 - proving equal distribution algorithm!

---

## ✅ Step 4: View Distribution List

1. **Click** "Distribution" (or "View Distribution") in navigation bar

2. **You should see:**
   - **Filter dropdowns at top:**
     - "Filter by Agent" (dropdown with all 5 agents)
     - "Filter by Status" (dropdown: All, Pending, In Progress, Completed, Failed)
   
   - **Records table** with columns:
     - FirstName
     - Phone
     - Notes
     - Assigned Agent
     - Status
     - Upload Date
   
   - **All 26 records displayed** in the table

3. **Test Filter by Agent:**
   - **Click** "Filter by Agent" dropdown
   - **Select** "Agent One (agent1@example.com)"
   - **You should see:** Only **6 records** in the table (all assigned to Agent One)
   - **Verify:** Each record shows "Agent One" in the "Assigned Agent" column

4. **Test another agent:**
   - **Click** "Filter by Agent" dropdown
   - **Select** "Agent Two (agent2@example.com)"
   - **You should see:** Only **5 records** (all assigned to Agent Two)

5. **Reset filter:**
   - **Click** "Filter by Agent" dropdown
   - **Select** "All Agents"
   - **You should see:** All **26 records** again

6. **Test Status Filter:**
   - **Click** "Filter by Status" dropdown
   - **Select** "Pending"
   - **You should see:** All 26 records (since all are pending by default)

7. **Pagination** (if you had more than 20 records):
   - Would see "Previous" and "Next" buttons at bottom
   - Current page info: "Page 1 of X"

**✅ Checkpoint:** You can filter records by agent and see the distribution!

---

## ✅ Step 5: Verify on Dashboard

1. **Click** "Dashboard" in navigation

2. **You should now see updated stats:**
   - **Active Agents: 5/5** ✅
   - **Total Records: 26** ✅
   - **Agents with Records: 5** ✅

3. **Scroll down** to see "Agent Statistics" section showing:
   - Each agent's name and email
   - Total assigned records per agent
   - Status breakdown (Pending/Completed)

**Example:**
```
Agent One (agent1@example.com)
  Total: 6  |  Pending: 6  |  Completed: 0

Agent Two (agent2@example.com)
  Total: 5  |  Pending: 5  |  Completed: 0

... (and so on for all 5 agents)
```

---

## 🎯 BONUS: Test Edge Cases (Optional)

### Test 1: Duplicate Email Prevention
1. Go to "Add Agent"
2. Try creating agent with email: `agent1@example.com` (already exists)
3. **Should see error:** "Email already registered" or similar

### Test 2: Invalid Phone Number
1. Go to "Add Agent"
2. Enter phone: `123` (too short)
3. **Should see error:** "Phone must be 10-15 digits"

### Test 3: Upload Without 5 Agents
*Already have 5, but conceptually:*
- If you had less than 5 agents
- Upload page would show red warning
- Upload button would be disabled

### Test 4: View Network Requests (Developer Mode)
1. **Press F12** to open browser DevTools
2. **Click** "Network" tab
3. **Navigate** to Upload page
4. **Watch** for API calls:
   - `/api/agents/count` - Gets agent count
5. **Upload** a file
6. **See** `/api/records/upload` with:
   - Request: multipart/form-data (file)
   - Response: distribution results
7. **Check** Authorization header has JWT token

---

## 🎬 Complete Demo Summary

**What you've demonstrated:**

1. ✅ **Authentication** - Logged in as admin with JWT
2. ✅ **Dashboard** - Viewed statistics and quick actions
3. ✅ **Agent Creation** - Created 5 agents with validation
4. ✅ **File Upload** - Uploaded 26-record CSV file
5. ✅ **Distribution Algorithm** - Saw 6, 5, 5, 5, 5 distribution
6. ✅ **View Records** - Filtered records by agent
7. ✅ **Protected Routes** - All pages required login

**Key Features Shown:**
- JWT authentication and protected routes
- Form validation (email, phone)
- File validation (type, size, columns)
- Equal distribution algorithm with remainder
- Agent-wise filtering
- Responsive UI with clean design
- Real-time statistics updates
- MongoDB integration
- MERN stack architecture

---

## 📸 What to Screenshot for Documentation

If recording/screenshotting:
1. Login page (purple gradient)
2. Dashboard with 5 agents and 26 records
3. Add Agent form
4. Upload page showing distribution results (6,5,5,5,5)
5. Distribution list filtered by Agent One (showing 6 records)
6. Browser DevTools showing API calls with JWT

---

**🎉 Congratulations! You've completed the full demo!**
