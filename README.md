# Chronos-Logistics Orchestrator (MVP)

Offline-first mobile orchestration for commuter students who need minimal-friction transit and academic task support.

## Tech Stack
- Frontend: React Native with Expo + TypeScript + NativeWind (Tailwind styling)
- Backend: Node.js Firebase Cloud Functions + Firestore
- APIs integrated in MVP service layer: UTA Transit API, Google Maps, Canvas LMS (mocked adapters with standardized errors)

## ADHD-Friendly UX Principles in this MVP
- One dominant "next step" card to prevent decision paralysis.
- Large tap targets and low-density action layout.
- Explicit offline status with automatic sync queue.
- Task decomposition into tiny actions (1 to 10 minutes).
- Reset-day action for fast recovery after interruptions.
- Working Mode shows only one micro-step at a time.

## Phase B: Micro-Step Task Deconstructor
- Input: free-text complex assignment (example: "2,000-word research paper").
- Logic: rule-based task decomposition into "embarrassingly small" sub-steps.
- Output: a persisted working session with one active step and progress state.
- Working Mode includes a background-safe timer based on timestamps, so elapsed time keeps tracking across app background/resume.

## Offline-First Architecture
- Local-first writes through AsyncStorage.
- All mutating events are captured as sync actions in a local queue.
- Network listener auto-flushes queue when connection returns.
- App remains fully usable without internet for core task and transit workflows.

## Run Frontend
```bash
npm install
npm run start
```

## Run Backend Functions
```bash
cd backend/functions
npm install
npm run build
npm run serve
```

## Folder Guide
- `App.tsx`: Root shell and flow composition.
- `src/hooks/useOrchestrator.ts`: Primary state orchestration for transit, deconstructor, working mode, and sync.
- `src/services/taskDeconstructorService.ts`: Micro-step generation logic.
- `src/services/workingModeService.ts`: Working mode persistence, timer handling, and step progression.
- `src/services/`: Domain services and API adapters.
- `src/lib/`: Shared local persistence, network, and error normalization.
- `backend/functions/`: Firebase sync endpoint stub.

## Standardized API Error Policy
All API adapters normalize failures into one of:
- `network`
- `timeout`
- `unauthorized`
- `unknown`

Each maps to calm, user-safe copy that confirms local progress is preserved.
