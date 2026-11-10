# SOLUTION.md

## Technical Assessment — Full-Stack Developer

**Database:** MongoDB only  
**Backend:** Node.js and Express

---

## Problem 1: Doctor Slot Booking

### Root cause and prevention strategy

The duplicate appointments occurred because the API treated each incoming request as a new booking and did not enforce idempotency, while concurrent requests could both check that a slot was free before either saved its booking. I will make `requestId` idempotent by enforcing a unique database index and returning the original booking for a repeated request, and prevent double-booking with a unique compound index on `{ doctorId, slotTime }` so MongoDB allows only one booking for a doctor's slot. The booking endpoint will handle duplicate-key errors and return a clear `409 Conflict` response when another patient has already booked the slot.

### API contract

**Endpoint:** `POST /api/appointments/book`

**Request body:**

```json
{
  "requestId": "req_abc123",
  "patientPhone": "+19876543210",
  "doctorId": "doc_101",
  "slotTime": "2026-10-25T10:00:00Z"
}
```

### Design choices

- Store appointments in MongoDB using a Mongoose model.
- Add a unique index on `requestId` to prevent the same logical request from creating multiple records.
- Add a unique compound index on `{ doctorId, slotTime }` to guarantee that one doctor cannot have two bookings for the same slot.
- Use the database indexes as the final concurrency safeguard. A separate “check slot, then insert” sequence alone is not safe because two concurrent requests can both pass the check.
- Validate all required fields and parse `slotTime` as a valid date before attempting the insert.
- If a request with the same `requestId` is received again, return the already-created appointment rather than inserting another one.
- Return `201 Created` when a new appointment is successfully created.

### Suggested MongoDB document

```json
{
  "_id": "MongoDB-generated ObjectId",
  "requestId": "req_abc123",
  "patientPhone": "+19876543210",
  "doctorId": "doc_101",
  "slotTime": "2026-10-25T10:00:00.000Z",
  "status": "BOOKED",
  "createdAt": "MongoDB-generated timestamp",
  "updatedAt": "MongoDB-generated timestamp"
}
```

### Expected responses

**New booking — `201 Created`**

```json
{
  "success": true,
  "message": "Appointment booked successfully.",
  "appointment": {
    "requestId": "req_abc123",
    "patientPhone": "+19876543210",
    "doctorId": "doc_101",
    "slotTime": "2026-10-25T10:00:00.000Z",
    "status": "BOOKED"
  }
}
```

**Repeated request with the same `requestId` — return the existing booking**

Return the existing appointment instead of creating a second record. The response can use `200 OK` and indicate that the request was already processed.

**Slot already booked by another request — `409 Conflict`**

```json
{
  "success": false,
  "message": "This doctor slot is already booked."
}
```

### Important implementation note

The unique indexes must be created successfully in MongoDB before the API is relied on in production. The application should distinguish a duplicate `requestId` from a duplicate `{ doctorId, slotTime }` key when handling MongoDB duplicate-key errors.

---

## Problem 2

The supplied assessment document available for this submission contains the instructions and Problem 1 only. The description and deliverables for Problem 2 were not present in the provided file, so this section is intentionally left pending rather than inventing requirements.

**To complete:** Add the Problem 2 requirement, root-cause analysis, design decisions, implementation summary, and relevant API/UI details after receiving its full prompt.

---

## Problem 3

The supplied assessment document available for this submission contains the instructions and Problem 1 only. The description and deliverables for Problem 3 were not present in the provided file, so this section is intentionally left pending rather than inventing requirements.

**To complete:** Add the Problem 3 requirement, root-cause analysis, design decisions, implementation summary, and relevant API/UI details after receiving its full prompt.

---

## Running the project

Update this section with the actual project commands and environment variables used by the implementation before submission.

Typical commands for a Node.js backend are:

```bash
npm install
npm run dev
```

Do not commit `.env` files, database credentials, API keys, or other secrets. Provide an `.env.example` file containing placeholder values only.
