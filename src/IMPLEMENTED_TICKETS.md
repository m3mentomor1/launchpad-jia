# Implemented Tickets Documentation

## Overview

This document provides comprehensive documentation for all implemented tickets in the Jia Recruiter Portal career management system. All tickets have been successfully implemented and tested.

You can access the app here (Hosted & Deployed on Vercel):

## Table of Contents

### Tickets

1. [Ticket 1: Setup Development Environment (1 SP)](#ticket-1-setup-development-environment-1-sp)
   - [Environment Configuration](#environment-configuration)
   - [Database Structure](#database-structure)
2. [Ticket 2: Segmented Career Form with Save Progress (2 SP)](#ticket-2-segmented-career-form-with-save-progress-2-sp)
   - [Form Structure](#form-structure)
   - [Save Progress Features](#save-progress-features)
   - [Files Modified](#files-modified)
   - [MongoDB Schema Updates](#mongodb-schema-updates)
3. [Ticket 3: XSS Protection for Add Career Endpoint (1 SP)](#ticket-3-xss-protection-for-add-career-endpoint-1-sp)
   - [Security Library](#security-library)
   - [API Endpoint Protection](#api-endpoint-protection)
   - [Dependencies Added](#dependencies-added)
4. [Ticket 4: Pre-Screening Questions (3 SP)](#ticket-4-pre-screening-questions-3-sp)
   - [Recruiter Side - Question Management](#recruiter-side---question-management)
   - [Applicant Side - Question Answering](#applicant-side---question-answering)
   - [Recruiter View - Answer Review](#recruiter-view---answer-review)

### Reference

- [Summary of All Files](#summary-of-all-files)
- [Testing Checklist](#testing-checklist)
- [Known Limitations](#known-limitations)
- [Future Enhancements](#future-enhancements)
- [Technical Notes](#technical-notes)
- [Deployment Notes](#deployment-notes)
- [Support & Maintenance](#support--maintenance)
- [Version History](#version-history)

---

## Ticket 1: Setup Development Environment (1 SP)

### Status: ✅ COMPLETED

### Requirements

- Fork the repository
- Setup all dependencies (Firebase, MongoDB, OpenAI)
- Ensure a working build
- Use CORE API URL: https://jia-jvx-1a0eba0de6d.herokuapp.com

### Git Branch

All feature implementations are developed in the `feature` branch.

```bash
# Switch to feature branch
git checkout feature

# View all changes
git log --oneline
```

### Implementation Details

#### Environment Configuration

**New File (Not available in repo):** `.env`

Created new accounts on the following:

# MongoDB:

1. Sign in or create new account here: https://account.mongodb.com/account/login

2. Create a new cluster to get the value for the following:

```env
MONGODB_URI=<your-mongodb-connection-string>
```

4. Create the following collections:

**Database:** `jia-db`

**Collections:**

- `affiliations` - User affiliations with organizations
- `applicants` - Job applicants data
- `careers` - Job postings/career opportunities
- `interview-history` - Interview activity logs
- `interviews` - Interview records
- `members` - Organization members
- `organizations` - Organization details

# Firebase:

1. Sign in or create new account here: https://console.firebase.google.com/

2. Create new project to get the values for the following:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=<your-firebase-api-key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<your-firebase-auth-domain>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<your-firebase-project-id>

NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<your-firebase-storage-bucket>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<your-firebase-messaging-sender-id>
NEXT_PUBLIC_FIREBASE_APP_ID=<your-firebase-app-id>
```

3. Enable `Google` as `Sign-in Method` in `Authentication`.

# OpenAI (Excluded since this needs a paid plan)

1. Keep the following variable blank:

```env
OPENAI_API_KEY=<your-openai-api-key>
```

# Core API

2. Set the value of the variable to the following:

```env
CORE_API_URL=https://jia-jvx-1a0eba0de6d.herokuapp.com
```

#### Files Involved

- `.env` - Environment configuration
- `src/lib/mongoDB/mongoDB.ts` - MongoDB connection setup
- `package.json` - Dependencies configuration

## Ticket 2: Segmented Career Form with Save Progress (2 SP)

### Status: ✅ COMPLETED

### Requirements

- Update career form to be a segmented form
- User must be able to save current progress and return to last step
- Pipeline builder is NOT included in this ticket

### Implementation Details

#### Form Structure

The career form has been restructured into 4 distinct steps:

1. **Career Details & Team Access**

   - Basic information (Job Title, Employment Type, Work Setup)
   - Location details (Country, Province, City)
   - Salary information (Min/Max salary, Currency, Negotiable toggle)
   - Job Description (Rich text editor)
   - Team member access management

2. **CV Review & Pre-screening**

   - CV screening settings
   - CV Secret Prompt (optional)
   - Pre-screening questions management

3. **AI Interview Setup**

   - AI interview screening settings
   - Video requirement toggle
   - AI Secret Prompt (optional)
   - Interview questions by category

4. **Review Career**
   - Summary of all entered information
   - Edit buttons for each section
   - Collapsible sections for better readability

#### Save Progress Features

**Auto-Save to LocalStorage:**

- Form data automatically saved to localStorage on every step change
- Storage key: `career_form_draft`
- Saved data includes: `formData` and current `step`

**Draft Management:**

- Draft automatically loaded on component mount for new careers
- "[Draft]" indicator shown in header when draft exists
- "Clear Draft" functionality with confirmation dialog
- Draft cleared upon successful career creation

**Navigation Controls:**

- "Save and Continue" - Validates current step before proceeding
- "Save as Unpublished" - Saves career with `status: "inactive"`
- "Publish" - Saves career with `status: "active"` (final step only)
- Step indicator allows clicking on completed steps

**Validation:**

- Step 1: Requires Job Title, Employment Type, Work Setup, Province, City, Min/Max Salary, Description
- Step 2: Requires at least 1 pre-screening question with valid data
- Step 3: Requires at least 5 interview questions
- Step 4: No validation (review only)

#### Files Modified

**Main Component:**

- `src/lib/components/CareerComponents/SegmentedCareerForm.tsx` - Core form logic with step management

**Step Components:**

- `src/lib/components/CareerComponents/CareerFormSteps/CareerDetailsStep.tsx` - Step 1 implementation
- `src/lib/components/CareerComponents/CareerFormSteps/CVReviewStep.tsx` - Step 2 implementation
- `src/lib/components/CareerComponents/CareerFormSteps/AIInterviewStep.tsx` - Step 3 implementation
- `src/lib/components/CareerComponents/CareerFormSteps/ReviewCareerStep.tsx` - Step 4 implementation

**New Component:**

- `src/lib/components/CareerComponents/CareerFormSteps/StepIndicator.tsx` - Visual step progress indicator

**Supporting Components:**

- `src/lib/components/CareerComponents/RichTextEditor.tsx` - Rich text editor for job description
- `src/lib/components/CareerComponents/CustomDropdown.tsx` - Custom dropdown component

#### MongoDB Schema Updates

**Collection:** `careers`

New/Updated fields:

```javascript
{
  // Existing fields...
  cvSecretPrompt: String,              // Optional CV evaluation prompt
  preScreeningQuestions: Array,        // Pre-screening questions (Ticket 4)
  aiSecretPrompt: String,              // Optional AI interview prompt
  teamMembers: Array,                  // Team access members
  lastActivityAt: Date,                // Last activity timestamp

  // Pre-screening question structure:
  preScreeningQuestions: [
    {
      id: String,                      // Unique question ID
      question: String,                // Question text
      type: String,                    // "dropdown" | "text" | "range"
      options: [String],               // For dropdown type
      rangeMin: String,                // For range type
      rangeMax: String                 // For range type
    }
  ]
}
```

---

## Ticket 3: XSS Protection for Add Career Endpoint (1 SP)

### Status: ✅ COMPLETED

### Requirements

- Add validation and sanitize input in add career API
- Protect against XSS scripts and invalid HTML

### Implementation Details

#### Security Library

**New File:** `src/lib/security/sanitize.ts`

Implements comprehensive input sanitization:

**1. HTML Sanitization (`sanitizeHTML`)**

- Uses DOMPurify library for robust XSS protection
- Allowed HTML tags: p, br, strong, em, u, h1-h6, ul, ol, li, a, div, span, blockquote, code, pre
- Allowed attributes: href, target, rel, class
- Data attributes disabled for security
- Applied to: Job description field

**2. Text Sanitization (`sanitizeText`)**

- Uses validator.escape() to escape HTML entities
- Converts special characters to HTML entities
- Applied to: All text fields except description

**3. Email Validation (`sanitizeEmail`)**

- Validates email format using validator.isEmail()
- Trims and converts to lowercase
- Returns empty string if invalid

**4. URL Validation (`sanitizeURL`)**

- Validates URL format using validator.isURL()
- Requires protocol (http/https)
- Returns empty string if invalid

**5. Recursive Object Sanitization (`sanitizeObject`)**

- Recursively sanitizes all object properties
- Handles arrays and nested objects
- Applies appropriate sanitization based on field name
- Accepts whitelist of HTML-allowed fields

**6. Data Validation (`validateCareerData`)**

- Validates required fields presence and types
- Validates salary ranges (positive numbers)
- Validates email formats
- Returns validation result with error messages

#### API Endpoint Protection

**File Modified:** `src/app/api/add-career/route.tsx`

Security measures implemented:

1. **Input Validation**

   ```javascript
   const validation = validateCareerData(rawData);
   if (!validation.valid) {
     return NextResponse.json(
       { error: "Validation failed", details: validation.errors },
       { status: 400 }
     );
   }
   ```

2. **Input Sanitization**

   ```javascript
   // Sanitize all input data - description allows HTML, others are plain text
   const sanitizedData = sanitizeObject(rawData, ["description"]);
   ```

3. **Security Headers**
   All responses include:

   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: DENY`
   - `X-XSS-Protection: 1; mode=block`

4. **Error Handling**

   - Generic error messages to prevent information leakage
   - Detailed errors logged server-side only
   - No internal error details exposed to client

5. **Sensitive Data Protection**
   - Secret prompts excluded from API responses
   - Only safe career data returned to client

#### Dependencies Added

```json
{
  "isomorphic-dompurify": "^2.31.0",
  "validator": "^13.15.20"
}
```

#### Files Involved

**New Files:**

- `src/lib/security/sanitize.ts` - Sanitization and validation library
- `src/lib/security/README.md` - Security documentation

**Modified Files:**

- `src/app/api/add-career/route.tsx` - Add career endpoint with XSS protection
- `src/app/api/update-career/route.tsx` - Update career endpoint (similar protection)

---

## Ticket 4: Pre-Screening Questions (3 SP)

### Status: ✅ COMPLETED

### Requirements

- Update career form to add and edit pre-screening questions
- New applicants must answer questions to proceed with application

### Implementation Details

#### Recruiter Side - Question Management

**Location:** Step 2 of Segmented Career Form (CV Review & Pre-screening)

**Features:**

1. **Question Types**

   - **Dropdown:** Multiple choice with custom options
   - **Text:** Free-form text input
   - **Range:** Numeric range (min/max) for salary expectations

2. **Question Management**

   - Add custom questions manually
   - Add from suggested questions (Notice Period, Work Setup, Asking Salary)
   - Drag-and-drop reordering of questions
   - Edit question text inline
   - Delete questions with confirmation

3. **Dropdown Options Management**

   - Add multiple options
   - Drag-and-drop reordering of options
   - Edit option text
   - Delete individual options
   - Numbered options for clarity

4. **Validation**

   - At least 1 pre-screening question required
   - Question text cannot be empty
   - Dropdown questions must have at least one non-empty option
   - Validation errors displayed inline with red borders
   - Error messages shown below invalid fields

5. **Suggested Questions**
   - Pre-defined common questions
   - One-click add functionality
   - "Added" badge shown for already-added questions
   - Hidden when 10+ questions exist

#### Applicant Side - Question Answering

**Location:** Job Application Flow (After CV Upload)

**Flow:**

1. Applicant uploads CV
2. System checks if career has pre-screening questions
3. If yes, displays "Quick Pre-screening" step
4. If no, proceeds directly to CV screening

**Features:**

1. **Question Display**

   - Clean, card-based UI
   - All questions marked as required (\*)
   - Question type-specific input fields

2. **Input Types**

   - **Text:** Multi-line textarea with placeholder
   - **Dropdown:** Select dropdown with "Select an option..." placeholder
   - **Range:** Two number inputs (Minimum/Maximum) with PHP currency indicator

3. **Validation**

   - All questions must be answered before proceeding
   - Alert shown if validation fails
   - Answers saved to interview record

4. **Answer Storage**
   - Answers saved via `/api/update-interview` endpoint
   - Stored in `preScreeningAnswers` field
   - Format: `{ [questionId]: answer }`
   - For range type: `{ [questionId]: { min: value, max: value } }`

#### Recruiter View - Answer Review

**Location:** Candidate Menu

**Features:**

- Pre-screening answers section displayed if answers exist
- Collapsible section with icon
- Question-answer pairs displayed clearly
- Accessible to recruiters reviewing candidates

#### Files Modified

**Recruiter Side:**

- `src/lib/components/CareerComponents/CareerFormSteps/CVReviewStep.tsx` - Question management UI
- `src/lib/components/CareerComponents/SegmentedCareerForm.tsx` - Form state management
- `src/lib/components/CareerComponents/CareerFormSteps/ReviewCareerStep.tsx` - Display questions in review

**Applicant Side:**

- `src/lib/components/screens/UploadCV.tsx` - Question answering UI and flow
- `src/lib/components/screen/UploadCV.tsx` - Alternative implementation

**Recruiter View:**

- `src/lib/components/CareerComponents/CandidateMenu.tsx` - Display answers to recruiters

**API:**

- `src/app/api/add-career/route.tsx` - Save pre-screening questions
- `src/app/api/update-career/route.tsx` - Update pre-screening questions
- `src/app/api/update-interview/route.tsx` - Save applicant answers

**Styling:**

- `src/lib/styles/globals.scss` - Drag-and-drop styles and form styling

#### MongoDB Schema Updates

**Collection:** `careers`

```javascript
{
  preScreeningQuestions: [
    {
      id: String, // Unique identifier (timestamp-based)
      question: String, // Question text (required)
      type: String, // "dropdown" | "text" | "range"
      options: [String], // Array of options (for dropdown)
      rangeMin: String, // Minimum value (for range)
      rangeMax: String, // Maximum value (for range)
    },
  ];
}
```

**Collection:** `interviews`

```javascript
{
  preScreeningQuestions: Array,        // Copy of questions from career
  preScreeningAnswers: {               // Applicant's answers
    [questionId]: String | Object      // String for text/dropdown, Object for range
  }
}
```

Example answer formats:

```javascript
// Text/Dropdown answer
preScreeningAnswers: {
  "1699999999999": "Immediately"
}

// Range answer
preScreeningAnswers: {
  "1699999999999": {
    min: "50000",
    max: "80000"
  }
}
```

---

## Summary of All Files

### New Files Created

1. `src/lib/security/sanitize.ts` - XSS protection and validation library
2. `src/lib/security/README.md` - Security documentation
3. `src/lib/components/CareerComponents/CareerFormSteps/StepIndicator.tsx` - Step progress indicator
4. `src/IMPLEMENTED_TICKETS.md` - This documentation file

### Modified Files

#### Core Components

1. `src/lib/components/CareerComponents/SegmentedCareerForm.tsx` - Main form with step management and save progress
2. `src/lib/components/CareerComponents/CareerFormSteps/CareerDetailsStep.tsx` - Step 1 implementation
3. `src/lib/components/CareerComponents/CareerFormSteps/CVReviewStep.tsx` - Step 2 with pre-screening questions
4. `src/lib/components/CareerComponents/CareerFormSteps/AIInterviewStep.tsx` - Step 3 implementation
5. `src/lib/components/CareerComponents/CareerFormSteps/ReviewCareerStep.tsx` - Step 4 review summary

#### Supporting Components

6. `src/lib/components/CareerComponents/RichTextEditor.tsx` - Rich text editor for descriptions
7. `src/lib/components/CareerComponents/CustomDropdown.tsx` - Custom dropdown component
8. `src/lib/components/CareerComponents/CandidateMenu.tsx` - Display pre-screening answers

#### Applicant Components

9. `src/lib/components/screens/UploadCV.tsx` - Pre-screening questions for applicants
10. `src/lib/components/screen/UploadCV.tsx` - Alternative implementation
11. `src/lib/components/commonV2/Modal.tsx` - Pre-screening modal support

#### API Routes

12. `src/app/api/add-career/route.tsx` - XSS protection and pre-screening support
13. `src/app/api/update-career/route.tsx` - Career update with XSS protection
14. `src/app/api/update-interview/route.tsx` - Save pre-screening answers

#### Styling

15. `src/lib/styles/globals.scss` - Form styling and drag-and-drop styles

#### Configuration

16. `.env` - Environment variables setup
17. `package.json` - Dependencies (DOMPurify, validator)

---

## Testing Checklist

### Ticket 1: Development Environment

- [x] MongoDB connection successful
- [x] Firebase authentication working
- [x] Application builds without errors
- [x] Core API URL missing `/upload-cv` endpoint

### Ticket 2: Segmented Form

- [x] All 4 steps render correctly
- [x] Step validation works for each step
- [x] Draft saves to localStorage on step change
- [x] Draft loads on page refresh
- [x] "Save and Continue" validates before proceeding
- [x] "Save as Unpublished" works at any step
- [x] "Publish" button appears on final step
- [x] Step indicator shows current progress
- [x] Can navigate to completed steps
- [x] Clear draft functionality works

### Ticket 3: XSS Protection

- [x] HTML sanitization removes malicious scripts
- [x] Plain text fields escape HTML entities
- [x] Email validation works correctly
- [x] URL validation works correctly
- [x] Security headers present in responses
- [x] Error messages don't expose internal details
- [x] Validation errors return 400 status
- [x] Secret prompts excluded from responses

### Ticket 4: Pre-Screening Questions

- [x] Can add custom questions
- [x] Can add suggested questions
- [x] Drag-and-drop reordering works
- [x] Can edit question text
- [x] Can delete questions
- [x] Dropdown options can be added/edited/deleted
- [x] Dropdown options can be reordered
- [x] Range type shows min/max inputs
- [x] Validation requires at least 1 question
- [x] Validation checks question text not empty
- [x] Validation checks dropdown has options
- [x] Questions display to applicants
- [x] All questions marked as required
- [x] Applicants must answer all questions
- [x] Answers save to interview record
- [x] Recruiters can view answers
- [x] Questions included in career review step
- [x] CV uploaded doesn't work, seems to be on backend (CORE_API_URL). See problem in ticket #1

---

## Known Limitations

1. **Pipeline Builder:** Not included in current implementation (as per Ticket 2 requirements)
2. **Question Limit:** No hard limit on number of pre-screening questions (consider adding max 20)
3. **CV Upload:** Tested CV upload, it always throws an error saying CORE API URL doesn't have an `/upload-cv` endpoint.

---

## Future Enhancements

1. **Question Analytics:** Track which questions filter candidates most effectively
2. **Answer Validation:** Custom validation rules per question (regex, min/max length)
3. **Multi-language Support:** Questions and answers in multiple languages
4. **Question Scoring:** Assign scores to answers for automatic ranking

---

## Technical Notes

### LocalStorage Structure

```javascript
// Key: "career_form_draft"
{
  formData: {
    jobTitle: String,
    description: String,
    workSetup: String,
    workSetupRemarks: String,
    employmentType: String,
    country: String,
    province: String,
    city: String,
    salaryNegotiable: Boolean,
    minimumSalary: String,
    maximumSalary: String,
    currency: String,
    screeningSetting: String,
    requireVideo: Boolean,
    questions: Array,
    teamMembers: Array,
    cvSecretPrompt: String,
    preScreeningQuestions: Array,
    aiSecretPrompt: String
  },
  step: Number  // Current step (1-4)
}
```

### Security Best Practices Implemented

1. **Input Sanitization:** All user input sanitized before storage
2. **Output Encoding:** HTML properly escaped when displayed
3. **Validation:** Server-side validation for all inputs
4. **Error Handling:** Generic error messages to prevent information disclosure
5. **Security Headers:** Proper headers to prevent XSS, clickjacking
6. **Sensitive Data:** Secret prompts not exposed in API responses
7. **Type Checking:** Strict type validation for all fields

### Performance Considerations

1. **LocalStorage:** Draft data stored locally to reduce server load
2. **Lazy Loading:** Steps loaded only when accessed
3. **Debouncing:** Consider adding debounce for auto-save (future enhancement)
4. **Validation:** Client-side validation before server request
5. **Optimistic UI:** Immediate feedback for user actions

---

### Security Headers (Already Implemented)

All API responses include:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

---

# Best Practices & Code Organization

## Overview

This section outlines the best practices, code organization standards, and reusable structure patterns demonstrated in the implementation of **Tickets 2, 3, and 4**. These patterns ensure maintainability, scalability, and code quality.

---

## ✅ Implemented Best Practices

### 1. **Segmented Form Architecture (Ticket 2)**

- **Step-Based Components**: Form broken into 4 modular, reusable steps
- **Single Source of Truth**: Centralized state management in parent component
- **Progressive Disclosure**: Users see only relevant information per step
- **Draft Management**: LocalStorage integration for save/resume functionality
- **Step Validation**: Each step validates before allowing progression

### 2. **Security-First Approach (Ticket 3)**

- **Dedicated Security Module**: `src/lib/security/sanitize.ts` provides reusable XSS protection
- **Input Validation**: Comprehensive validation functions for all user inputs
- **Sanitization Functions**: Reusable sanitization for HTML, text, email, and URLs
- **Security Headers**: Consistent security headers across all API responses
- **Sensitive Data Protection**: Secret prompts excluded from API responses

### 3. **Dynamic Form Components (Ticket 4)**

- **Flexible Question Types**: Support for dropdown, text, and range inputs
- **Drag-and-Drop Reordering**: Intuitive question management
- **Validation Framework**: Inline validation with clear error messages
- **Data Flow**: Clean separation between recruiter input and applicant response

### 4. **Type Safety**

- **TypeScript Interfaces**: Clear interfaces for form data (`CareerFormData`)
- **Type Definitions**: Proper typing for all functions and components
- **Strict Validation**: Type checking at compile time and runtime

---

## 📋 Code Organization Standards

### Directory Structure Used

```
src/
├── app/
│   └── api/
│       ├── add-career/route.tsx        # Ticket 3: XSS-protected endpoint
│       ├── update-career/route.tsx     # Ticket 3: XSS-protected endpoint
│       └── update-interview/route.tsx  # Ticket 4: Save pre-screening answers
├── lib/
│   ├── components/
│   │   └── CareerComponents/
│   │       ├── SegmentedCareerForm.tsx              # Ticket 2: Main form
│   │       ├── CareerFormSteps/
│   │       │   ├── CareerDetailsStep.tsx            # Ticket 2: Step 1
│   │       │   ├── CVReviewStep.tsx                 # Ticket 2 & 4: Step 2
│   │       │   ├── AIInterviewStep.tsx              # Ticket 2: Step 3
│   │       │   ├── ReviewCareerStep.tsx             # Ticket 2: Step 4
│   │       │   └── StepIndicator.tsx                # Ticket 2: Progress UI
│   │       ├── RichTextEditor.tsx                   # Ticket 2: Job description
│   │       ├── CustomDropdown.tsx                   # Ticket 2: Dropdown UI
│   │       └── CandidateMenu.tsx                    # Ticket 4: View answers
│   ├── security/
│   │   ├── sanitize.ts                              # Ticket 3: Security functions
│   │   └── README.md                                # Ticket 3: Security docs
│   └── styles/
│       └── globals.scss                             # Ticket 4: Drag-drop styles
```

### Naming Conventions Applied

1. **Components**: PascalCase (e.g., `SegmentedCareerForm.tsx`, `CVReviewStep.tsx`)
2. **Utilities**: camelCase (e.g., `sanitizeHTML`, `validateCareerData`)
3. **Constants**: UPPER_SNAKE_CASE (e.g., `STORAGE_KEY`, `STEPS`)
4. **Types/Interfaces**: PascalCase (e.g., `CareerFormData`)
5. **Files**: Descriptive names indicating purpose (e.g., `StepIndicator.tsx`, `sanitize.ts`)

---

## 🔧 Reusable Patterns Implemented

### 1. LocalStorage Draft Management (Ticket 2)

**Pattern**: Save form progress to localStorage for resume functionality

**Implementation** (`src/lib/components/CareerComponents/SegmentedCareerForm.tsx`):

```typescript
const STORAGE_KEY = "career_form_draft";

// Save draft on step change
const saveDraft = () => {
  if (formType === "add") {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ formData, step: currentStep })
    );
  }
};

// Load draft on mount
useEffect(() => {
  if (formType === "add" && !career) {
    const savedDraft = localStorage.getItem(STORAGE_KEY);
    if (savedDraft) {
      const { formData: savedFormData, step } = JSON.parse(savedDraft);
      setFormData(savedFormData);
      setCurrentStep(step);
    }
  }
}, [formType, career]);

// Clear draft after successful save
localStorage.removeItem(STORAGE_KEY);
```

**Benefits**:

- Users don't lose work if they navigate away
- Reduces server load (no auto-save API calls)
- Simple implementation with browser APIs

### 2. Security Functions (Ticket 3)

**Location**: `src/lib/security/sanitize.ts`

**Implemented Functions**:

```typescript
import {
  sanitizeHTML, // For rich text content (job descriptions)
  sanitizeText, // For plain text fields
  sanitizeEmail, // For email validation
  sanitizeURL, // For URL validation
  sanitizeObject, // For recursive object sanitization
  validateCareerData, // For data validation
} from "@/lib/security/sanitize";
```

**Usage in API Routes** (`src/app/api/add-career/route.tsx`):

```typescript
export async function POST(request: NextRequest) {
  const rawData = await request.json();

  // 1. Validate data structure
  const validation = validateCareerData(rawData);
  if (!validation.valid) {
    return NextResponse.json(
      { error: "Validation failed", details: validation.errors },
      { status: 400 }
    );
  }

  // 2. Sanitize all input - description allows HTML, others are plain text
  const sanitizedData = sanitizeObject(rawData, ["description"]);

  // 3. Process sanitized data
  // ... save to database

  // 4. Return response with security headers
  return NextResponse.json(
    { success: true },
    {
      status: 200,
      headers: {
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block",
      },
    }
  );
}
```

**Key Principle**: Always validate first, then sanitize, then process

### 3. Step-Based Form Pattern (Ticket 2)

**Pattern**: Break complex forms into manageable steps with centralized state

**Implementation** (`src/lib/components/CareerComponents/SegmentedCareerForm.tsx`):

```typescript
// 1. Define steps
const STEPS = [
  { id: 1, name: "Career Details & Team Access", key: "details" },
  { id: 2, name: "CV Review & Pre-screening", key: "cv-review" },
  { id: 3, name: "AI Interview Setup", key: "interview" },
  { id: 4, name: "Review Career", key: "review" },
];

// 2. Centralized state management
const [formData, setFormData] = useState<CareerFormData>(initialData);
const [currentStep, setCurrentStep] = useState(1);

// 3. Update function passed to all steps
const updateFormData = (updates: Partial<CareerFormData>) => {
  setFormData((prev) => ({ ...prev, ...updates }));
};

// 4. Step validation
const isStepValid = (step: number): boolean => {
  switch (step) {
    case 1:
      return (
        formData.jobTitle.trim().length > 0 &&
        formData.description.trim().length > 0
      );
    case 2:
      return formData.preScreeningQuestions?.length > 0;
    // ... other steps
  }
};

// 5. Render current step
const renderStep = () => {
  switch (currentStep) {
    case 1:
      return (
        <CareerDetailsStep
          formData={formData}
          updateFormData={updateFormData}
          validationErrors={validationErrors}
        />
      );
    // ... other steps
  }
};
```

**Benefits**:

- Single source of truth for form state
- Easy to add/remove steps
- Reusable step components
- Centralized validation
- Better UX with progressive disclosure

### 4. Dynamic Question Management (Ticket 4)

**Pattern**: Flexible question builder with multiple input types

**Implementation** (`src/lib/components/CareerComponents/CareerFormSteps/CVReviewStep.tsx`):

```typescript
// Question structure
interface PreScreeningQuestion {
  id: string;
  question: string;
  type: "dropdown" | "text" | "range";
  options?: string[]; // For dropdown
  rangeMin?: string; // For range
  rangeMax?: string; // For range
}

// Add question
const addQuestion = (type: string) => {
  const newQuestion: PreScreeningQuestion = {
    id: Date.now().toString(),
    question: "",
    type: type as "dropdown" | "text" | "range",
    options: type === "dropdown" ? [""] : undefined,
  };
  updateFormData({
    preScreeningQuestions: [
      ...(formData.preScreeningQuestions || []),
      newQuestion,
    ],
  });
};

// Update question
const updateQuestion = (id: string, updates: Partial<PreScreeningQuestion>) => {
  const updated = formData.preScreeningQuestions?.map((q) =>
    q.id === id ? { ...q, ...updates } : q
  );
  updateFormData({ preScreeningQuestions: updated });
};

// Delete question
const deleteQuestion = (id: string) => {
  const filtered = formData.preScreeningQuestions?.filter((q) => q.id !== id);
  updateFormData({ preScreeningQuestions: filtered });
};
```

**Benefits**:

- Flexible question types
- Easy to extend with new types
- Clean data structure
- Reusable pattern for other forms

---

## 🚫 What NOT to Do (Stable Codebase)

### ❌ Avoid Unnecessary Refactors

1. **Don't Remove Base Modules**: The existing codebase has stable utilities and components
2. **Don't Rename Core Files**: Maintain consistency with existing naming conventions
3. **Don't Change Working Patterns**: Extend patterns (like the step-based form) rather than replace them
4. **Don't Duplicate Security Code**: Use `src/lib/security/sanitize.ts` for all sanitization needs

### ❌ Avoid Breaking Changes

1. **Don't Modify Shared Components**: Components like `RichTextEditor` and `CustomDropdown` are used across features
2. **Don't Change API Contracts**: The add-career and update-career endpoints have established contracts
3. **Don't Alter Database Schemas**: The `careers` and `interviews` collections have defined structures
4. **Don't Skip Validation**: Always validate and sanitize user input as demonstrated in Ticket 3

---

## ✅ Best Practices Checklist

### Before Adding New Features

- [ ] Review this document for similar patterns
- [ ] Check if step-based form pattern applies (Ticket 2)
- [ ] Identify if security sanitization is needed (Ticket 3)
- [ ] Plan component structure (separate steps if complex)
- [ ] Define TypeScript interfaces early

### During Development

- [ ] Follow the step-based form pattern for multi-step flows (Ticket 2)
- [ ] Use `sanitizeObject()` for all user input (Ticket 3)
- [ ] Implement localStorage for draft functionality when appropriate (Ticket 2)
- [ ] Add inline validation with clear error messages (Ticket 2 & 4)
- [ ] Use consistent naming conventions (PascalCase for components, camelCase for functions)
- [ ] Keep components focused (single responsibility)

### Code Quality

- [ ] TypeScript interfaces for all props and state (see `CareerFormData`)
- [ ] Consistent formatting and indentation
- [ ] Constants for magic strings (e.g., `STORAGE_KEY`, `STEPS`)
- [ ] Meaningful variable names (e.g., `preScreeningQuestions`, not `questions2`)
- [ ] Comments only for complex logic (most code should be self-documenting)

### Security (Ticket 3 Requirements)

- [ ] Sanitize all user inputs using `sanitizeObject()`
- [ ] Validate data structure using `validateCareerData()` or similar
- [ ] Add security headers to all API responses
- [ ] Never expose sensitive data (e.g., `cvSecretPrompt`, `aiSecretPrompt`)
- [ ] Validate on both client (UX) and server (security)

### User Experience

- [ ] Show validation errors inline with red borders (Ticket 2)
- [ ] Provide clear error messages (Ticket 2)
- [ ] Save progress automatically (localStorage pattern from Ticket 2)
- [ ] Allow users to navigate back to completed steps (Ticket 2)
- [ ] Show loading states during async operations (Ticket 2)

---

## 🎯 Key Principles

### 1. DRY (Don't Repeat Yourself)

- Security functions centralized in `src/lib/security/sanitize.ts` (Ticket 3)
- Step components reuse the same props interface (Ticket 2)
- Question management logic reusable for other forms (Ticket 4)

### 2. Single Responsibility

- Each step component handles only its section (Ticket 2)
- Security module only handles sanitization/validation (Ticket 3)
- Parent form manages state, children manage UI (Ticket 2)

### 3. Composition Over Inheritance

- Step-based form composed of smaller step components (Ticket 2)
- Question types composed with shared base structure (Ticket 4)

### 4. Fail Fast

- Validate before allowing step progression (Ticket 2)
- Validate API input before processing (Ticket 3)
- Show errors immediately to users (Ticket 2 & 4)

### 5. Progressive Enhancement

- Start with basic form, add steps incrementally (Ticket 2)
- Add question types one at a time (Ticket 4)
- Maintain backward compatibility with existing data

---

## 📊 Code Review Checklist

### Functionality

- [ ] Feature works as expected
- [ ] Edge cases handled (empty inputs, invalid data)
- [ ] Error states handled gracefully
- [ ] Loading states implemented

### Code Quality

- [ ] Follows step-based pattern (if applicable)
- [ ] Uses security functions from Ticket 3
- [ ] Proper TypeScript types
- [ ] Clear variable/function names
- [ ] No code duplication

### Security (Critical for Ticket 3)

- [ ] Input sanitization implemented
- [ ] Validation on client and server
- [ ] No sensitive data exposed
- [ ] Security headers present in API responses

### User Experience

- [ ] Validation errors shown inline
- [ ] Clear error messages
- [ ] Draft functionality (if applicable)
- [ ] Loading indicators during async operations

---

# Quick Reference Guide

## 🚀 Common Patterns

### Security Pattern (Ticket 3)

**Always Use in API Routes**:

```typescript
import { sanitizeObject, validateCareerData } from "@/lib/security/sanitize";

export async function POST(request: NextRequest) {
  const rawData = await request.json();

  // 1. Validate
  const validation = validateCareerData(rawData);
  if (!validation.valid) {
    return NextResponse.json(
      { error: "Validation failed", details: validation.errors },
      { status: 400 }
    );
  }

  // 2. Sanitize (description allows HTML, others are plain text)
  const sanitizedData = sanitizeObject(rawData, ["description"]);

  // 3. Process
  // ... save to database

  // 4. Return with security headers
  return NextResponse.json(
    { success: true },
    {
      status: 200,
      headers: {
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block",
      },
    }
  );
}
```

### Step Validation Pattern (Ticket 2)

```typescript
const isStepValid = (step: number): boolean => {
  switch (step) {
    case 1:
      return (
        formData.jobTitle.trim().length > 0 &&
        formData.description.trim().length > 0
      );
    case 2:
      return formData.preScreeningQuestions?.length > 0;
    case 3:
      const totalQuestions = formData.questions.reduce(
        (sum, q) => sum + q.questions.length,
        0
      );
      return totalQuestions >= 5;
    case 4:
      return true;
    default:
      return false;
  }
};
```

### LocalStorage Draft Pattern (Ticket 2)

```typescript
const STORAGE_KEY = "career_form_draft";

// Save draft
const saveDraft = () => {
  if (formType === "add") {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ formData, step: currentStep })
    );
  }
};

// Load draft
useEffect(() => {
  if (formType === "add" && !career) {
    const savedDraft = localStorage.getItem(STORAGE_KEY);
    if (savedDraft) {
      try {
        const { formData: savedFormData, step } = JSON.parse(savedDraft);
        setFormData(savedFormData);
        setCurrentStep(step);
      } catch (error) {
        console.error("Failed to load draft:", error);
      }
    }
  }
}, [formType, career]);

// Clear draft after successful save
localStorage.removeItem(STORAGE_KEY);
```

### Dynamic Question Management (Ticket 4)

```typescript
// Add question
const addQuestion = (type: "dropdown" | "text" | "range") => {
  const newQuestion = {
    id: Date.now().toString(),
    question: "",
    type: type,
    options: type === "dropdown" ? [""] : undefined,
    rangeMin: type === "range" ? "" : undefined,
    rangeMax: type === "range" ? "" : undefined,
  };

  updateFormData({
    preScreeningQuestions: [
      ...(formData.preScreeningQuestions || []),
      newQuestion,
    ],
  });
};

// Update question
const updateQuestionText = (id: string, text: string) => {
  const updated = formData.preScreeningQuestions?.map((q) =>
    q.id === id ? { ...q, question: text } : q
  );
  updateFormData({ preScreeningQuestions: updated });
};

// Delete question
const deleteQuestion = (id: string) => {
  if (confirm("Are you sure you want to delete this question?")) {
    const filtered = formData.preScreeningQuestions?.filter((q) => q.id !== id);
    updateFormData({ preScreeningQuestions: filtered });
  }
};
```

### Inline Validation Pattern (Ticket 2)

```typescript
const [showValidationErrors, setShowValidationErrors] = useState(false);
const [validationErrors, setValidationErrors] = useState<{
  [key: string]: string;
}>({});

const collectValidationErrors = (step: number) => {
  const errors: { [key: string]: string } = {};

  switch (step) {
    case 1:
      if (!formData.jobTitle.trim())
        errors.jobTitle = "This is a required field.";
      if (!formData.description.trim())
        errors.description = "This is a required field.";
      break;
    case 2:
      if (
        !formData.preScreeningQuestions ||
        formData.preScreeningQuestions.length === 0
      ) {
        errors.preScreeningQuestions =
          "Please add at least 1 pre-screening question";
      }
      break;
  }

  setValidationErrors(errors);
};

// Display in JSX
<input
  value={formData.jobTitle}
  onChange={(e) => updateFormData({ jobTitle: e.target.value })}
  style={{
    border:
      showValidationErrors && validationErrors.jobTitle
        ? "1px solid red"
        : "1px solid #D5D7DA",
  }}
/>;
{
  showValidationErrors && validationErrors.jobTitle && (
    <span style={{ color: "red", fontSize: "12px" }}>
      {validationErrors.jobTitle}
    </span>
  );
}
```

---

## 🎯 Common Tasks

### Adding a New Step to the Form

1. Add step to `STEPS` array
2. Create new step component in `CareerFormSteps/`
3. Add validation case in `isStepValid()`
4. Add render case in `renderStep()`
5. Update `collectValidationErrors()` if needed

### Adding a New Question Type

1. Update `PreScreeningQuestion` interface
2. Add type to question builder UI
3. Add validation logic for new type
4. Update applicant answer UI
5. Update answer storage logic

### Adding Security to New API Endpoint

1. Import `sanitizeObject` and `validateCareerData`
2. Validate input first
3. Sanitize input (specify HTML-allowed fields)
4. Process sanitized data
5. Return with security headers

---

## 🔍 Debugging Tips

### Common Issues

| Issue                  | Solution                                     |
| ---------------------- | -------------------------------------------- |
| Draft not loading      | Check localStorage key matches `STORAGE_KEY` |
| Validation not showing | Ensure `showValidationErrors` is true        |
| Step won't advance     | Check `isStepValid()` for current step       |
| API returns 400        | Check validation errors in response          |
| XSS not blocked        | Ensure using `sanitizeObject()`              |

### Check These First

1. Browser console for errors
2. Network tab for API failures
3. localStorage for draft data
4. Validation errors state
5. MongoDB connection

---

**Remember**: These patterns were proven effective in the implementation of Tickets 2, 3, and 4. When building new features, reference these implementations as examples of excellent code organization and reusable structure.
