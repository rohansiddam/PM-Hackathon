import { DeconstructedTaskPlan, TaskStep, WorkingModeState } from '../types/domain';

const makeStep = (index: number, label: string, estimatedMinutes = 2): TaskStep => ({
  id: `micro-${index + 1}`,
  label,
  done: false,
  estimatedMinutes
});

const parseWordTarget = (description: string): number | null => {
  const match = description.match(/(\d{1,3}(?:,\d{3})*|\d+)\s*[- ]?word/i);
  if (!match) {
    return null;
  }

  const parsed = Number(match[1].replace(/,/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
};

const buildResearchPaperSteps = (description: string): TaskStep[] => {
  const wordTarget = parseWordTarget(description);
  const sentenceGoal = wordTarget ? Math.max(8, Math.round(wordTarget / 30)) : 10;

  const labels = [
    'Open Google Docs',
    'Name the file and add today\'s date',
    'Write one messy sentence about your topic',
    'Write three rough bullet ideas',
    'Choose one bullet as your thesis candidate',
    'Paste one source link into the doc',
    'Write one sentence from that source in your own words',
    'Set a 5-minute timer and write two more messy sentences',
    `Create a mini target: ${sentenceGoal} total sentences`,
    'Draft the first paragraph without editing',
    'Take a 2-minute reset break',
    'Draft the second paragraph with simple wording',
    'Highlight one sentence to revise later',
    'Add one citation placeholder',
    'Submit or schedule the next focus block'
  ];

  return labels.map((label, index) => makeStep(index, label));
};

const buildGenericSteps = (description: string): TaskStep[] => {
  const labels = [
    'Open the assignment instructions',
    `Copy the task title: "${description.slice(0, 40)}${description.length > 40 ? '...' : ''}"`,
    'Create one new working document or note',
    'Write one messy starter sentence',
    'List two tiny things you can finish in 10 minutes',
    'Complete the first tiny thing only',
    'Mark progress and stop for a short break'
  ];

  return labels.map((label, index) => makeStep(index, label));
};

export const taskDeconstructorService = {
  deconstruct: (description: string): DeconstructedTaskPlan => {
    const clean = description.trim();
    const looksLikePaper = /paper|essay|research|report/i.test(clean);

    const steps = looksLikePaper ? buildResearchPaperSteps(clean) : buildGenericSteps(clean);

    return {
      id: `plan-${Date.now()}`,
      sourceDescription: clean,
      createdAt: new Date().toISOString(),
      steps
    };
  },

  createWorkingMode: (plan: DeconstructedTaskPlan): WorkingModeState => ({
    plan,
    activeStepIndex: 0,
    timer: {
      isRunning: false,
      accumulatedSeconds: 0
    }
  })
};
