// app.jsx — Afianzar onboarding prototype shell
// Renders the 6 screens in a side-by-side canvas, with a focus mode that
// lets the user step through the flow one phone at a time.

const SCREEN_ORDER = [
  { id: 'home',      n: 1, label: 'Dashboard',          comp: 'Dashboard',            nav: 'home',  note: 'Tap "+ New" →' },
  { id: 'profile',   n: 2, label: 'Profile Selection',  comp: 'ProfileSelection',     nav: 'new',   note: 'Pick profile · Continue →' },
  { id: 'details',   n: 3, label: 'Tenant & Property',  comp: 'TenantPropertyDetails',nav: 'new',   note: 'Fill basics →' },
  { id: 'confirm',   n: 4, label: 'Review & Send',      comp: 'ReviewConfirm',        nav: 'new',   note: 'Send link to tenant →' },
  { id: 'detail',    n: 5, label: 'Case Detail',        comp: 'CaseDetail',           nav: 'home',  note: 'Monitor · View docs →' },
  { id: 'checklist', n: 6, label: 'Documents View',     comp: 'DocChecklist',         nav: 'home',  note: 'Read-only · Back to case →' },
  { id: 'result',    n: 7, label: 'Result',             comp: 'ResultApproved',       nav: 'home',  note: 'Approved · Send contracts →' },
];

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "viewMode": "canvas",
  "showFlowHints": true,
  "resultState": "approved",
  "checklistComplete": false
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Focus mode: which screen is in the spotlight when not in canvas view
  const [focus, setFocus] = React.useState('home');
  const [correction, setCorrection] = React.useState(false);

  React.useEffect(() => {
    document.body.classList.toggle('solo', t.viewMode === 'focus');
  }, [t.viewMode]);

  // Cross-screen navigation
  const go = React.useCallback((target) => {
    // Special routing
    if (target === 'new') target = 'profile';
    if (target === 'notif' || target === 'profile-tab') target = 'home';

    if (target === 'result-correction') {
      setCorrection(true);
      setTweak('resultState', 'correction');
      setFocus('result');
      return;
    }
    if (target === 'result') {
      setFocus('result');
      return;
    }
    setFocus(target);
  }, [setTweak]);

  const renderScreen = (screen) => {
    const isResult = screen.id === 'result';
    const compName = isResult
      ? (t.resultState === 'correction' ? 'ResultCorrection' : 'ResultApproved')
      : screen.comp;
    const Comp = window[compName];
    return (
      <Comp
        go={go}
        correction={correction}
        setCorrection={setCorrection}
      />
    );
  };

  // Decide which screens to show
  const visibleScreens = t.viewMode === 'focus'
    ? SCREEN_ORDER.filter(s => s.id === focus)
    : SCREEN_ORDER;

  return (
    <>
      <div className="page">
        <div className="page-head">
          <div>
            <span className="crumb"><span className="dot"/>AFIANZAR · AGENCY ONBOARDING PROTOTYPE</span>
            <h1 style={{ marginTop: 10 }}>From email chains to a 4-hour result.</h1>
            <p style={{ margin: '4px 0 0', color: 'var(--ink-60)', fontSize: 13, maxWidth: 720 }}>
              End-to-end flow for the real-estate agency. Every step embeds a behavioural nudge —
              social norms, submission friction, deadline commitment, correction-cost visibility — to move the agency from a 4-day manual relay to a 4-hour structured result.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <FlowStepper focus={focus} onPick={setFocus} viewMode={t.viewMode} setViewMode={(v) => setTweak('viewMode', v)} />
          </div>
        </div>

        {t.viewMode === 'canvas' && t.showFlowHints && (
          <p className="flow-hint">
            Scroll through the flow left to right.
            Tap a phone label below to focus it, or use the <code>Focus mode</code> tweak to walk through one screen at a time.
            All CTAs are wired — try uploading the remaining docs on phone&nbsp;3 to unlock submission.
          </p>
        )}

        <div className="phones">
          {visibleScreens.map(screen => (
            <Phone
              key={screen.id}
              n={screen.n}
              label={screen.label}
              focus={focus === screen.id && t.viewMode === 'canvas'}
              nav={screen.nav}
              onNav={(id) => {
                if (id === 'home') go('home');
                else if (id === 'new') go('profile');
                else if (id === 'notif') setFocus(screen.id); // stay
              }}
              note={t.viewMode === 'canvas' && t.showFlowHints ? screen.note : null}>
              {renderScreen(screen)}
            </Phone>
          ))}
        </div>

        {t.viewMode === 'focus' && (
          <FocusControls
            focus={focus}
            setFocus={setFocus}
            resultState={t.resultState}
            setResultState={(v) => setTweak('resultState', v)}
            setCorrection={setCorrection}
          />
        )}
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="View">
          <TweakRadio
            label="Layout"
            value={t.viewMode}
            onChange={v => setTweak('viewMode', v)}
            options={[
              { value: 'canvas', label: 'Canvas' },
              { value: 'focus', label: 'Focus' },
            ]}
          />
          <TweakToggle
            label="Flow hints"
            value={t.showFlowHints}
            onChange={v => setTweak('showFlowHints', v)}
          />
        </TweakSection>
        <TweakSection label="Result state (Screen 7)">
          <TweakRadio
            label="State"
            value={t.resultState}
            onChange={v => setTweak('resultState', v)}
            options={[
              { value: 'approved', label: 'Approved' },
              { value: 'correction', label: 'Correction' },
            ]}
          />
        </TweakSection>
        <TweakSection label="Demo shortcuts">
          <TweakButton label="Jump to Case Detail" onClick={() => { setFocus('detail'); setTweak('viewMode', 'focus'); }} />
          <TweakButton label="Trigger correction loop" onClick={() => { setCorrection(true); setFocus('detail'); setTweak('viewMode', 'focus'); }} />
          <TweakButton label="Reset to Dashboard" onClick={() => { setCorrection(false); setFocus('home'); setTweak('resultState', 'approved'); }} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

function FlowStepper({ focus, onPick, viewMode, setViewMode }) {
  return (
    <div style={{
      display: 'flex', gap: 6, alignItems: 'center',
      background: 'white', padding: 4, borderRadius: 999,
      border: '1px solid var(--line)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      <button
        onClick={() => setViewMode(viewMode === 'canvas' ? 'focus' : 'canvas')}
        style={{
          background: viewMode === 'focus' ? 'var(--navy)' : 'transparent',
          color: viewMode === 'focus' ? 'white' : 'var(--navy)',
          border: 0, padding: '8px 14px', borderRadius: 999, cursor: 'pointer',
          fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
        }}>
        {viewMode === 'focus' ? '◉ Focus' : '◎ Focus'}
      </button>
      <div style={{ width: 1, height: 20, background: 'var(--line)' }} />
      <div style={{ display: 'flex', gap: 2, padding: '0 4px' }}>
        {SCREEN_ORDER.map(s => (
          <button key={s.id}
            onClick={() => onPick(s.id)}
            title={s.label}
            style={{
              width: 26, height: 26, borderRadius: 999,
              border: 0, cursor: 'pointer',
              background: focus === s.id ? 'var(--teal)' : 'var(--bg)',
              color: focus === s.id ? 'white' : 'var(--ink-60)',
              fontSize: 11, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace',
            }}>{s.n}</button>
        ))}
      </div>
    </div>
  );
}

function FocusControls({ focus, setFocus, resultState, setResultState, setCorrection }) {
  const idx = SCREEN_ORDER.findIndex(s => s.id === focus);
  const prev = idx > 0 ? SCREEN_ORDER[idx - 1] : null;
  const next = idx < SCREEN_ORDER.length - 1 ? SCREEN_ORDER[idx + 1] : null;
  return (
    <div style={{
      display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'center',
      marginTop: 24,
    }}>
      <button
        onClick={() => prev && setFocus(prev.id)}
        disabled={!prev}
        style={{
          background: 'white', border: '1px solid var(--line)',
          padding: '10px 16px', borderRadius: 999, cursor: prev ? 'pointer' : 'not-allowed',
          fontSize: 13, color: 'var(--navy)', fontFamily: 'inherit', fontWeight: 600,
          opacity: prev ? 1 : 0.4,
          display: 'inline-flex', gap: 6, alignItems: 'center',
        }}>
        ← {prev ? prev.label : 'Start'}
      </button>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
        color: 'var(--ink-60)', textTransform: 'uppercase', letterSpacing: '0.08em',
      }}>
        Screen {idx + 1} of {SCREEN_ORDER.length}
      </div>
      <button
        onClick={() => next && setFocus(next.id)}
        disabled={!next}
        style={{
          background: 'var(--navy)', border: 0, color: 'white',
          padding: '10px 18px', borderRadius: 999, cursor: next ? 'pointer' : 'not-allowed',
          fontSize: 13, fontFamily: 'inherit', fontWeight: 600,
          opacity: next ? 1 : 0.4,
          display: 'inline-flex', gap: 6, alignItems: 'center',
        }}>
        {next ? next.label : 'End'} →
      </button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
