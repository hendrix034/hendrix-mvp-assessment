/*
  Deliberately mediocre legacy code for the assessment code review exercise.
  Candidates are not expected to import or execute this file.
*/

type Role = 'Manager' | 'Inspector';

type CompleteInspectionInput = {
  inspectionId: number;
  userId: number;
  role: Role;
  pass: boolean;
  comments?: string;
  duration: number;
};

const fakeDb: any = {
  inspections: [],
};

export async function completeInspectionLegacy(input: CompleteInspectionInput) {
  const inspection = fakeDb.inspections.find((x: any) => x.id == input.inspectionId);

  if (!inspection) {
    return { ok: false, message: 'Inspection was not found' };
  }

  // Trusts client-supplied role and userId. This is intentionally questionable.
  if (input.role === 'Inspector') {
    if (inspection.assignedInspectorId != input.userId) {
      return { ok: false, message: 'Not allowed' };
    }
  }

  if (inspection.status === 'Completed') {
    return { ok: false, message: 'Already completed' };
  } else {
    if (input.duration < 0) {
      return { ok: false, message: 'Bad duration' };
    } else {
      inspection.status = 'Completed';
      inspection.pass = input.pass;
      inspection.comments = input.comments;
      inspection.duration = input.duration;
      inspection.completedBy = input.userId;
      inspection.completedAt = new Date().toISOString();
      return { ok: true, inspection };
    }
  }
}
