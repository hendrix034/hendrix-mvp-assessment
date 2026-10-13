import React, { useEffect, useState } from 'react';
import {
  assignInspection,
  AuthUser,
  completeInspection,
  createInspection,
  Inspection,
  InspectionResult,
  listInspections,
  listInspectors,
} from './api/client';

type Ref = { id: number; name: string };

const fmtDate = (iso: string | null) => (iso ? new Date(iso).toLocaleString() : '');

// Value for <input type="datetime-local"> in the browser's local time, e.g. "2026-10-14T09:30".
function toLocalInputValue(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function Inspections({ user, locations }: { user: AuthUser; locations: Ref[] }) {
  const isManager = user.role === 'Manager';
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [inspectors, setInspectors] = useState<Ref[]>([]);
  const [error, setError] = useState('');
  const [completing, setCompleting] = useState<Inspection | null>(null);

  async function reload() {
    try {
      setInspections(await listInspections());
    } catch (e) {
      setError((e as Error).message);
    }
  }

  useEffect(() => {
    reload();
    if (isManager) listInspectors().then(setInspectors).catch(e => setError(e.message));
  }, [isManager]);

  // Wraps an action: clears old errors, shows new ones, refreshes the list on success.
  async function run(action: () => Promise<unknown>) {
    setError('');
    try {
      await action();
      await reload();
      return true;
    } catch (e) {
      setError((e as Error).message);
      return false;
    }
  }

  return <>
    {error && <div className="alert alert-danger" role="alert">{error}</div>}

    {isManager && <CreateForm onCreate={title => run(() => createInspection(title))} />}

    {completing && (
      <CompleteForm
        inspection={completing}
        locations={locations}
        onCancel={() => setCompleting(null)}
        onSubmit={async input => {
          if (await run(() => completeInspection(completing.id, input))) setCompleting(null);
        }}
      />
    )}

    <div className="card">
      <div className="card-header">{isManager ? 'All inspections' : 'My assigned inspections'}</div>
      {inspections.length === 0 ? (
        <div className="card-body text-muted">No inspections yet.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-sm align-middle mb-0">
            <thead>
              <tr>
                <th>#</th><th>Title</th><th>Status</th><th>Inspector</th><th>Location</th>
                <th>Started</th><th>Duration (min)</th><th>Result</th><th>Comments</th><th></th>
              </tr>
            </thead>
            <tbody>
              {inspections.map(i => (
                <tr key={i.id}>
                  <td>{i.id}</td>
                  <td>{i.title}</td>
                  <td>
                    <span className={`badge ${i.status === 'Completed' ? 'bg-success' : 'bg-secondary'}`}>{i.status}</span>
                  </td>
                  <td>{i.assignedInspector?.name ?? <span className="text-muted">Unassigned</span>}</td>
                  <td>{i.location?.name}</td>
                  <td>{fmtDate(i.startedAt)}</td>
                  <td>{i.durationMinutes}</td>
                  <td>
                    {i.result && <span className={`badge ${i.result === 'Pass' ? 'bg-success' : 'bg-danger'}`}>{i.result}</span>}
                  </td>
                  <td style={{ maxWidth: 240 }} className="text-break">{i.comments}</td>
                  <td className="text-nowrap">
                    {i.status === 'Yet to Start' && isManager && (
                      <AssignControl
                        inspection={i}
                        inspectors={inspectors}
                        onAssign={inspectorId => run(() => assignInspection(i.id, inspectorId))}
                      />
                    )}
                    {i.status === 'Yet to Start' && !isManager && (
                      <button className="btn btn-sm btn-primary" onClick={() => { setError(''); setCompleting(i); }}>
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </>;
}

function CreateForm({ onCreate }: { onCreate: (title: string) => Promise<boolean> }) {
  const [title, setTitle] = useState('');
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (await onCreate(title)) setTitle('');
  }
  return (
    <form className="card card-body mb-4" onSubmit={submit}>
      <label className="form-label" htmlFor="new-title">New inspection</label>
      <div className="input-group">
        <input
          id="new-title"
          className="form-control"
          placeholder="e.g. Monthly fire extinguisher check"
          value={title}
          maxLength={200}
          required
          onChange={e => setTitle(e.target.value)}
        />
        <button className="btn btn-primary">Create</button>
      </div>
    </form>
  );
}

function AssignControl({ inspection, inspectors, onAssign }: {
  inspection: Inspection;
  inspectors: Ref[];
  onAssign: (inspectorId: number) => void;
}) {
  const [selected, setSelected] = useState(inspection.assignedInspector?.id ?? 0);
  const unchanged = selected === (inspection.assignedInspector?.id ?? 0);
  return (
    <div className="input-group input-group-sm flex-nowrap">
      <select
        style={{ minWidth: 150 }}
        className="form-select form-select-sm"
        aria-label="Inspector"
        value={selected}
        onChange={e => setSelected(Number(e.target.value))}
      >
        <option value={0} disabled>Choose inspector…</option>
        {inspectors.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
      </select>
      <button className="btn btn-outline-primary" disabled={!selected || unchanged} onClick={() => onAssign(selected)}>
        {inspection.assignedInspector ? 'Reassign' : 'Assign'}
      </button>
    </div>
  );
}

function CompleteForm({ inspection, locations, onSubmit, onCancel }: {
  inspection: Inspection;
  locations: Ref[];
  onSubmit: (input: { locationId: number; startedAt: string; durationMinutes: number; result: InspectionResult; comments: string }) => void;
  onCancel: () => void;
}) {
  const [locationId, setLocationId] = useState(0);
  const [startedAt, setStartedAt] = useState(toLocalInputValue(new Date()));
  const [duration, setDuration] = useState('');
  const [result, setResult] = useState<InspectionResult | ''>('');
  const [comments, setComments] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!result) return;
    onSubmit({
      locationId,
      // datetime-local has no time zone; new Date() reads it as browser-local time, then we send UTC ISO.
      startedAt: new Date(startedAt).toISOString(),
      durationMinutes: Number(duration),
      result,
      comments,
    });
  }

  return (
    <form className="card mb-4 border-primary" onSubmit={submit}>
      <div className="card-header">Complete inspection #{inspection.id}: {inspection.title}</div>
      <div className="card-body row g-3">
        <div className="col-md-4">
          <label className="form-label" htmlFor="c-location">Location</label>
          <select id="c-location" className="form-select" required value={locationId} onChange={e => setLocationId(Number(e.target.value))}>
            <option value={0} disabled>Choose location…</option>
            {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="c-start">Start date and time</label>
          <input id="c-start" type="datetime-local" className="form-control" required
            max={toLocalInputValue(new Date())} value={startedAt} onChange={e => setStartedAt(e.target.value)} />
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="c-duration">Duration (minutes)</label>
          <input id="c-duration" type="number" className="form-control" required min={1} max={1440} step={1}
            value={duration} onChange={e => setDuration(e.target.value)} />
        </div>
        <div className="col-12">
          <span className="form-label d-block">Result</span>
          {(['Pass', 'Fail'] as const).map(r => (
            <div className="form-check form-check-inline" key={r}>
              <input className="form-check-input" type="radio" name="result" id={`r-${r}`} required
                checked={result === r} onChange={() => setResult(r)} />
              <label className="form-check-label" htmlFor={`r-${r}`}>{r}</label>
            </div>
          ))}
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor="c-comments">Comments</label>
          <textarea id="c-comments" className="form-control" rows={3} required maxLength={2000}
            value={comments} onChange={e => setComments(e.target.value)} />
        </div>
        <div className="col-12 d-flex gap-2">
          <button className="btn btn-primary">Mark as completed</button>
          <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </form>
  );
}
