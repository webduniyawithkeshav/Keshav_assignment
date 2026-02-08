# Distribution Logic - Complete Implementation Guide

## 🎯 Overview

Complete task distribution algorithm matching **PROMPT 6** requirements with all edge cases handled.

---

## ✅ Implementation Status

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Exactly 5 agents | ✅ Complete | Enforced with error |
| Distribute items equally | ✅ Complete | Math.floor(total/5) |
| Remainder distribution | ✅ Complete | Sequential to first N agents |
| Example: 26 items → 6,5,5,5,5 | ✅ Complete | Verified |
| Reusable function | ✅ Complete | `distributeRecords()` |
| Assign items to agents | ✅ Complete | MongoDB reference |
| Save in MongoDB | ✅ Complete | Transaction-based |
| Item references agent | ✅ Complete | `assignedAgent` field |

**Edge Cases Handled:**
- ✅ Less than 5 agents → Error with clear message
- ✅ Less than 5 items → Correct distribution
- ✅ Empty file → Caught in validation
- ✅ Uneven distribution → Remainder to first N agents

---

## 📁 Implementation File

**Location:** [distributor.js](file:///c:/Users/kesha/OneDrive/Desktop/Assignmentcsinfo/backend/src/utils/distributor.js)

---

## 🧮 Distribution Algorithm Explanation

### Mathematical Formula

```javascript
totalRecords = 26  // Example

baseRecordsPerAgent = Math.floor(26 / 5) = 5
remainder = 26 % 5 = 1

// Distribution:
// First 'remainder' agents get baseRecordsPerAgent + 1
// Remaining agents get baseRecordsPerAgent

Agent 1: 5 + 1 = 6  ✅ (index 0 < remainder 1)
Agent 2: 5 + 0 = 5  ✅ (index 1 >= remainder 1)
Agent 3: 5 + 0 = 5  ✅
Agent 4: 5 + 0 = 5  ✅
Agent 5: 5 + 0 = 5  ✅

Total: 6 + 5 + 5 + 5 + 5 = 26 ✅
```

### Algorithm Steps

**Step 1: Fetch Exactly 5 Active Agents**
```javascript
const agents = await Agent.find({ status: 'active' })
  .limit(5)
  .sort({ assignedRecordsCount: 1 })  // Least loaded first (load balancing)
  .session(session);
```

**Step 2: Validate Agent Count**
```javascript
if (agents.length < 5) {
  throw new Error(
    `Need exactly 5 active agents. Currently ${agents.length} found.`
  );
}
```

**Step 3: Calculate Distribution**
```javascript
const totalRecords = records.length;
const baseRecordsPerAgent = Math.floor(totalRecords / 5);
const remainder = totalRecords % 5;

const distribution = agents.map((agent, index) => ({
  agentId: agent._id,
  agentName: agent.name,
  agentEmail: agent.email,
  count: baseRecordsPerAgent + (index < remainder ? 1 : 0),
}));
```

**Step 4: Create Record Documents**
```javascript
const recordDocs = [];
let recordIndex = 0;

distribution.forEach(({ agentId, count }) => {
  for (let i = 0; i < count; i++) {
    recordDocs.push({
      batchId,
      assignedAgent: agentId,  // ← Agent reference
      data: new Map(Object.entries(records[recordIndex])),
      uploadedBy,
      uploadedAt: new Date(),
      status: 'pending',
    });
    recordIndex++;
  }
});
```

**Step 5: Save to MongoDB (Transaction)**
```javascript
await Record.insertMany(recordDocs, { session });

// Update agent counts
for (const { agentId, count } of distribution) {
  await Agent.findByIdAndUpdate(
    agentId,
    { $inc: { assignedRecordsCount: count } },
    { session }
  );
}

await session.commitTransaction();
```

---

## 💻 Code Implementation

### Complete Function

```javascript
const mongoose = require('mongoose');
const Agent = require('../models/Agent');
const Record = require('../models/Record');

/**
 * Distribute records equally among exactly 5 active agents
 * @param {Array} records - Parsed records from CSV/XLSX
 * @param {String} uploadedBy - Admin ObjectId
 * @returns {Promise<Object>} Distribution result
 */
const distributeRecords = async (records, uploadedBy) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // STEP 1: Fetch exactly 5 active agents
    const agents = await Agent.find({ status: 'active' })
      .limit(5)
      .sort({ assignedRecordsCount: 1 })  // Load balancing
      .session(session);

    // EDGE CASE: Less than 5 agents
    if (agents.length < 5) {
      throw new Error(
        `Need exactly 5 active agents for distribution. ` +
        `Currently ${agents.length} active agent(s) found. ` +
        `Please add ${5 - agents.length} more agent(s).`
      );
    }

    const totalRecords = records.length;
    const baseRecordsPerAgent = Math.floor(totalRecords / 5);
    const remainder = totalRecords % 5;

    // STEP 2: Calculate distribution
    const distribution = agents.map((agent, index) => ({
      agentId: agent._id,
      agentName: agent.name,
      agentEmail: agent.email,
      count: baseRecordsPerAgent + (index < remainder ? 1 : 0),
    }));

    // STEP 3: Generate unique batch ID
    const batchId = `batch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // STEP 4: Create Record documents
    const recordDocs = [];
    let recordIndex = 0;

    distribution.forEach(({ agentId, count }) => {
      for (let i = 0; i < count; i++) {
        recordDocs.push({
          batchId,
          assignedAgent: agentId,  // Agent reference
          data: new Map(Object.entries(records[recordIndex])),
          uploadedBy,
          uploadedAt: new Date(),
          status: 'pending',
        });
        recordIndex++;
      }
    });

    // STEP 5: Insert all records (atomic transaction)
    await Record.insertMany(recordDocs, { session });

    // STEP 6: Update agent assigned counts
    for (const { agentId, count } of distribution) {
      await Agent.findByIdAndUpdate(
        agentId,
        { $inc: { assignedRecordsCount: count } },
        { session }
      );
    }

    // Commit transaction
    await session.commitTransaction();

    console.log(`✅ Distributed ${totalRecords} records across 5 agents`);

    return {
      success: true,
      batchId,
      totalRecords,
      distribution: distribution.map((d) => ({
        agentId: d.agentId,
        agentName: d.agentName,
        agentEmail: d.agentEmail,
        assignedCount: d.count,
      })),
    };
  } catch (error) {
    // Rollback transaction on error
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

module.exports = { distributeRecords };
```

---

## 📊 Distribution Examples

### Example 1: 26 Items (Your Example)
```javascript
Total: 26 items, 5 agents

base = Math.floor(26 / 5) = 5
remainder = 26 % 5 = 1

Agent 1 (index 0): 5 + 1 = 6  ✅
Agent 2 (index 1): 5 + 0 = 5
Agent 3 (index 2): 5 + 0 = 5
Agent 4 (index 3): 5 + 0 = 5
Agent 5 (index 4): 5 + 0 = 5

Total: 6 + 5 + 5 + 5 + 5 = 26 ✅
```

### Example 2: 100 Items (Even Distribution)
```javascript
Total: 100 items, 5 agents

base = Math.floor(100 / 5) = 20
remainder = 100 % 5 = 0

Agent 1: 20 + 0 = 20
Agent 2: 20 + 0 = 20
Agent 3: 20 + 0 = 20
Agent 4: 20 + 0 = 20
Agent 5: 20 + 0 = 20

Total: 20 + 20 + 20 + 20 + 20 = 100 ✅
```

### Example 3: 47 Items
```javascript
Total: 47 items, 5 agents

base = Math.floor(47 / 5) = 9
remainder = 47 % 5 = 2

Agent 1 (index 0): 9 + 1 = 10  ✅
Agent 2 (index 1): 9 + 1 = 10  ✅
Agent 3 (index 2): 9 + 0 = 9
Agent 4 (index 3): 9 + 0 = 9
Agent 5 (index 4): 9 + 0 = 9

Total: 10 + 10 + 9 + 9 + 9 = 47 ✅
```

### Example 4: 3 Items (Less than 5)
```javascript
Total: 3 items, 5 agents

base = Math.floor(3 / 5) = 0
remainder = 3 % 5 = 3

Agent 1 (index 0): 0 + 1 = 1  ✅
Agent 2 (index 1): 0 + 1 = 1  ✅
Agent 3 (index 2): 0 + 1 = 1  ✅
Agent 4 (index 3): 0 + 0 = 0
Agent 5 (index 4): 0 + 0 = 0

Total: 1 + 1 + 1 + 0 + 0 = 3 ✅
```

### Example 5: 1 Item (Minimum)
```javascript
Total: 1 item, 5 agents

base = Math.floor(1 / 5) = 0
remainder = 1 % 5 = 1

Agent 1 (index 0): 0 + 1 = 1  ✅
Agent 2 (index 1): 0 + 0 = 0
Agent 3 (index 2): 0 + 0 = 0
Agent 4 (index 3): 0 + 0 = 0
Agent 5 (index 4): 0 + 0 = 0

Total: 1 + 0 + 0 + 0 + 0 = 1 ✅
```

---

## ⚠️ Edge Case Handling

### 1. Less Than 5 Agents

**Scenario:** Only 3 agents in system

**Response:**
```json
{
  "success": false,
  "error": "Need exactly 5 active agents for distribution. Currently 3 active agent(s) found. Please add 2 more agent(s)."
}
```

**Handled:** Lines 22-28 in distributor.js

---

### 2. Less Than 5 Items

**Scenario:** Upload file with 3 records

**Distribution:**
- Agent 1: 1 record
- Agent 2: 1 record
- Agent 3: 1 record
- Agent 4: 0 records
- Agent 5: 0 records

**Handled:** Algorithm naturally handles this

---

### 3. Empty File

**Scenario:** CSV with only headers, no data

**Response:**
```json
{
  "success": false,
  "error": "File validation failed",
  "details": ["File is empty or contains no valid data"]
}
```

**Handled:** In CSV validation (before distribution)

---

### 4. Uneven Distribution

**Scenario:** 47 records (not divisible by 5)

**Distribution:** 10, 10, 9, 9, 9 (first 2 agents get +1)

**Handled:** Lines 30-42 in distributor.js

---

## 🔒 Transaction Safety

**Why Transactions:**
- Ensures all-or-nothing operation
- If any step fails, entire operation rolls back
- Data consistency guaranteed

**What Gets Rolled Back:**
- Record insertions
- Agent count updates

```javascript
try {
  await Record.insertMany(recordDocs, { session });
  await Agent.findByIdAndUpdate(..., { session });
  await session.commitTransaction();  // ✅ Success
} catch (error) {
  await session.abortTransaction();    // ❌ Rollback everything
  throw error;
}
```

---

## 📦 MongoDB Schema Design

### Record Document Example
```javascript
{
  _id: ObjectId("65dc67890abcdef012345678"),
  batchId: "batch-1707310555000-abc123",
  assignedAgent: ObjectId("65dc56789abcdef012345678"),  // ← Agent reference
  data: {
    FirstName: "John Doe",
    Phone: "1234567890",
    Notes: "First customer"
  },
  uploadedBy: ObjectId("65dc34567abcdef012345678"),
  uploadedAt: ISODate("2026-02-07T10:45:00.000Z"),
  status: "pending",
  createdAt: ISODate("2026-02-07T10:45:00.000Z"),
  updatedAt: ISODate("2026-02-07T10:45:00.000Z")
}
```

**Key Points:**
- ✅ `assignedAgent` references Agent document
- ✅ `batchId` groups records from same upload
- ✅ `data` stored as Map (flexible for any CSV columns)

---

## 🚀 Usage Example

```javascript
const { distributeRecords } = require('../utils/distributor');

// After parsing and validating CSV
const records = [
  { FirstName: "John", Phone: 1234567890, Notes: "Note 1" },
  { FirstName: "Jane", Phone: 9876543210, Notes: "Note 2" },
  // ... 24 more records (26 total)
];

const result = await distributeRecords(records, adminId);

console.log(result);
// Output:
// {
//   success: true,
//   batchId: "batch-1707310555000-abc123",
//   totalRecords: 26,
//   distribution: [
//     { agentId: "...", agentName: "Agent 1", assignedCount: 6 },
//     { agentId: "...", agentName: "Agent 2", assignedCount: 5 },
//     { agentId: "...", agentName: "Agent 3", assignedCount: 5 },
//     { agentId: "...", agentName: "Agent 4", assignedCount: 5 },
//     { agentId: "...", agentName: "Agent 5", assignedCount: 5 }
//   ]
// }
```

---

## 📊 Verification Query

**Check distribution in MongoDB:**
```javascript
// Count records per agent
db.records.aggregate([
  {
    $group: {
      _id: "$assignedAgent",
      count: { $sum: 1 }
    }
  }
])

// Result:
// { _id: ObjectId("..."), count: 6 }  // Agent 1
// { _id: ObjectId("..."), count: 5 }  // Agent 2
// { _id: ObjectId("..."), count: 5 }  // Agent 3
// { _id: ObjectId("..."), count: 5 }  // Agent 4
// { _id: ObjectId("..."), count: 5 }  // Agent 5
```

---

## ✅ Summary

**All PROMPT 6 requirements implemented:**

- [x] Exactly 5 agents enforced
- [x] Equal distribution logic
- [x] Remainder distributed sequentially
- [x] Example (26 → 6,5,5,5,5) works correctly
- [x] Reusable `distributeRecords()` function
- [x] Items assigned to agents via `assignedAgent` field
- [x] Saved in MongoDB with transactions
- [x] Each item references assigned agent

**Edge cases handled:**
- [x] Less than 5 agents → Clear error
- [x] Less than 5 items → Correct distribution
- [x] Empty file → Validation catches it
- [x] Uneven distribution → First N agents get +1

**Status:** 🚀 **PRODUCTION-READY**
