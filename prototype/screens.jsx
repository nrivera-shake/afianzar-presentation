// ─────────────────────────────────────────────────────────────
// Phone shell + status bar + bottom nav
// ─────────────────────────────────────────────────────────────

function StatusBar() {
  return (
    <div className="statusbar">
      <span>9:41</span>
      <div className="icons">
        <svg width="18" height="11" viewBox="0 0 18 11" fill="currentColor"><circle cx="2.5" cy="8.5" r="2" /><circle cx="8.5" cy="6" r="2" /><circle cx="15" cy="3" r="2" /></svg>
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M9 1.5C5.5 1.5 2.5 3 1 5l1.2 1.2c2-1.6 4.3-2.4 6.8-2.4s4.8.8 6.8 2.4L17 5C15.5 3 12.5 1.5 9 1.5z" /><circle cx="9" cy="9" r="1.2" fill="currentColor" /></svg>
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none"><rect x="0.5" y="0.5" width="22" height="11" rx="3" stroke="currentColor" opacity="0.4" /><rect x="2" y="2" width="16" height="8" rx="1.5" fill="currentColor" /><rect x="23.5" y="3.5" width="1.5" height="5" rx="0.6" fill="currentColor" opacity="0.4" /></svg>
      </div>
    </div>);

}

function BottomNav({ active, onNav }) {
  const items = [
  { id: 'home', label: 'Dashboard', Ico: IcHome },
  { id: 'new', label: 'New', Ico: IcPlus },
  { id: 'notif', label: 'Notifications', Ico: IcBell, badge: 3 },
  { id: 'profile', label: 'Profile', Ico: IcUser }];

  return (
    <div className="bottomnav">
      {items.map(({ id, label, Ico, badge }) =>
      <button key={id}
      className={'nav-item ' + (active === id ? 'active' : '')}
      onClick={() => onNav && onNav(id)}>
          <div style={{ position: 'relative' }}>
            <Ico size={22} />
            {badge ? <span style={{
            position: 'absolute', top: -4, right: -8,
            background: '#DC2626', color: 'white',
            fontSize: 9, fontWeight: 700,
            minWidth: 14, height: 14, borderRadius: 7,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 4px', border: '1.5px solid white'
          }}>{badge}</span> : null}
          </div>
          <span>{label}</span>
        </button>
      )}
    </div>);

}

function Phone({ children, focus, nav, onNav, label, n, note }) {
  return (
    <div className="phone-cell">
      <div className="phone-label">
        <span className="n">{n}</span>
        <span className="name">{label}</span>
      </div>
      <div className={'phone ' + (focus ? 'focus' : '')} data-screen-label={`0${n} ${label}`}>
        <StatusBar />
        <div className="screen">
          {children}
        </div>
        {nav && <BottomNav active={nav} onNav={onNav} />}
      </div>
      {note && <div className="flow-note">{note}</div>}
    </div>);

}

// ─────────────────────────────────────────────────────────────
// SCREEN 1 — Dashboard
// ─────────────────────────────────────────────────────────────

const SAMPLE_CASES = {
  pending: [
  { id: 'p1', tenant: 'Camila Restrepo', prop: 'Cra 25 #18-04, Pasto', days: 0, hrs: 3, stage: 'Tenant uploading — 3 left' },
  { id: 'p2', tenant: 'Mauricio Lozano', prop: 'Cl 20 #32-11, Pasto', days: 1, hrs: 0, stage: 'Tenant uploading — 1 left', amber: true }],

  review: [
  { id: 'r1', tenant: 'Daniela Ortiz', prop: 'Av Panamericana #6-72', days: 0, hrs: 2, stage: 'Study in progress', progress: 0.55 },
  { id: 'r2', tenant: 'Pacific Holdings S.A.S.', prop: 'Cra 32 #15-29, San Juan de Pasto', days: 1, hrs: 4, stage: 'Manual review', progress: 0.7, amber: true }],

  ready: [
  { id: 'd1', tenant: 'Sebastián Erazo', prop: 'Cl 16 #28-50', days: 0, hrs: 5, stage: 'Approved · Send contract', result: 'approved' }]

};

function CaseCard({ c, onClick, kind }) {
  const amber = c.amber;
  return (
    <div className={'case-card ' + (amber ? 'amber' : '')} onClick={onClick}>
      <div className="case-card-row">
        <div>
          <div className="case-tenant">{c.tenant}</div>
          <div className="case-prop">{c.prop}</div>
        </div>
        <div className={'case-days ' + (amber ? 'amber' : '')}>
          {c.days > 0 ? `${c.days}d ${c.hrs}h` : `${c.hrs}h ago`}
        </div>
      </div>
      {kind === 'review' &&
      <div className="progress"><i style={{ width: c.progress * 100 + '%' }} /></div>
      }
      <div className="case-stage">
        <span className={'dot ' + (kind === 'ready' ? 'green' : amber ? 'amber' : kind === 'pending' ? 'idle' : '')}></span>
        <span>{c.stage}</span>
        {kind === 'review' && <span style={{ marginLeft: 'auto', color: 'var(--teal-700)', fontWeight: 600 }}>{Math.round(c.progress * 100)}%</span>}
        {kind === 'ready' && (
          <button
            onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
            style={{
              marginLeft: 'auto', background: 'var(--green)', color: 'white',
              border: 0, borderRadius: 999, padding: '5px 10px',
              fontSize: 11, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'inherit', textTransform: 'none', letterSpacing: 0,
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
            Send contract <IcArrowRight size={11} sw={2.6} />
          </button>
        )}
      </div>
    </div>);

}

function Dashboard({ go, nav }) {
  const [showNudge, setShowNudge] = React.useState(true);
  return (
    <>
      <div className="topbar flush">
        <div className="topbar-row">
          <div className="logo">
            <span className="mark"><span>A</span></span>
            <div>
              <div>Afianzar</div>
              <div className="sub">Inmobiliaria de Nariño</div>
            </div>
          </div>
          <button className="cta-pill" onClick={() => go('profile')}>
            <IcPlus size={14} sw={2.4} />
            <span>New</span>
          </button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--ink-60)', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Approved this month</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--navy)', marginTop: 2, letterSpacing: '-0.01em' }}>
              234 <span style={{ color: 'var(--ink-40)', fontWeight: 500, fontSize: 14 }}>/ 250</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'var(--ink-60)', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Avg. time</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--teal-700)', marginTop: 2, letterSpacing: '-0.01em' }}>4h <span style={{ color: 'var(--ink-40)', fontWeight: 500, fontSize: 14 }}>12m</span></div>
          </div>
        </div>
      </div>

      <div className="screen-scroll">
        {showNudge &&
        <div className="nudge" style={{ marginTop: 16 }}>
            <div className="ico"><IcSparkle size={16} sw={2} /></div>
            <p>
              Send the upload link to your tenant as soon as the application is created — the sooner they start, the sooner you get a result.
            </p>
            <button className="x" onClick={() => setShowNudge(false)}>×</button>
          </div>
        }

        <div className="col-head">
          <h3>Pending submission</h3>
          <span className="count">{SAMPLE_CASES.pending.length}</span>
        </div>
        <div className="p-20 stack">
          {SAMPLE_CASES.pending.map((c) =>
          <CaseCard key={c.id} c={c} kind="pending" onClick={() => go('checklist')} />
          )}
        </div>

        <div className="col-head">
          <h3>In review at Afianzar</h3>
          <span className="count">{SAMPLE_CASES.review.length}</span>
        </div>
        <div className="p-20 stack">
          {SAMPLE_CASES.review.map((c) =>
          <CaseCard key={c.id} c={c} kind="review" onClick={() => go('detail')} />
          )}
        </div>

        <div className="col-head">
          <h3>Results ready</h3>
          <span className="count">{SAMPLE_CASES.ready.length}</span>
        </div>
        <div className="p-20 stack" style={{ paddingBottom: 24 }}>
          {SAMPLE_CASES.ready.map((c) =>
          <CaseCard key={c.id} c={c} kind="ready" onClick={() => go('result')} />
          )}
        </div>
      </div>
    </>);

}

// ─────────────────────────────────────────────────────────────
// SCREEN 2 — Profile selection (Step 1 of 4)
// ─────────────────────────────────────────────────────────────

const PROFILES = [
{ id: 'employed', label: 'Employed', sublabel: 'Formal salaried', Ico: IcBriefcase,
  desc: 'ID, last 3 payslips, employment letter, certificate of income, bank statement.' },
{ id: 'self', label: 'Self-Employed', sublabel: 'Independent worker', Ico: IcSelfemp,
  desc: 'ID, RUT, 6 months of bank statements, last income tax return, references.' },
{ id: 'freelance', label: 'Freelance', sublabel: 'Service contracts', Ico: IcFreelance,
  desc: 'ID, RUT, active service contracts, last 6 invoices, bank statements.' },
{ id: 'corporate', label: 'Corporate', sublabel: 'Company tenant', Ico: IcBuilding,
  desc: 'Cámara de Comercio, RUT, financial statements, legal rep ID, board minutes.' }];


function StepIndicator({ step, total = 4, label }) {
  return (
    <div className="stepper-top">
      <div className="stepper-row">
        {Array.from({ length: total }).map((_, i) =>
        <div key={i} className={'seg ' + (i + 1 < step ? 'done' : i + 1 === step ? 'active' : '')} />
        )}
      </div>
      <div className="stepper-label">
        <span><strong>Step {step}</strong> of {total}</span>
        <span>{label}</span>
      </div>
    </div>);

}

function ProfileSelection({ go }) {
  const [picked, setPicked] = React.useState('employed');
  return (
    <>
      <div className="back-row">
        <button className="back-btn" onClick={() => go('home')}>
          <IcArrowLeft size={18} sw={1.8} /> Back
        </button>
        <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--ink-60)', fontFamily: 'JetBrains Mono, monospace' }}>
          NEW · APP-2418
        </div>
      </div>

      <StepIndicator step={1} total={3} label="Tenant profile" />

      <div className="screen-scroll">
        <div className="p-20" style={{ paddingTop: 20 }}>
          <h2 className="h-title">What type of employment does the tenant have?</h2>
          <p className="h-title-sub">We adapt the document checklist to the profile you select — so you only collect what Afianzar needs.</p>

          <div className="gap-10">
            {PROFILES.map((p) => {
              const { Ico } = p;
              const isSel = picked === p.id;
              return (
                <button key={p.id}
                className={'pcard ' + (isSel ? 'selected' : '')}
                onClick={() => setPicked(p.id)}>
                  <div className="ico"><Ico size={22} /></div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <h4>{p.label}</h4>
                    <p style={{ marginBottom: 4 }}>{p.sublabel}</p>
                    {isSel && <p style={{ marginTop: 6, fontSize: 11, color: 'var(--teal-700)' }}>{p.desc}</p>}
                  </div>
                  <div className="radio" />
                </button>);

            })}
          </div>

          <p style={{ fontSize: 11.5, color: 'var(--ink-60)', textAlign: 'center', marginTop: 16, lineHeight: 1.45 }}>
            The document checklist adapts automatically to the profile you select.
          </p>
        </div>
      </div>

      <div className="sticky-submit">
        <button className="btn btn-primary btn-block" onClick={() => go('details')}>
          Continue <IcArrowRight size={16} sw={2} />
        </button>
      </div>
    </>);

}

// ─────────────────────────────────────────────────────────────
// SCREEN 3 — Tenant & property details (Step 2 of 4)
// ─────────────────────────────────────────────────────────────

function Field({ label, children, required, hint, half }) {
  return (
    <div className="form-group" style={{ flex: half ? 1 : 'initial', minWidth: 0 }}>
      <div className="label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {label}{required && <span style={{ color: 'var(--coral)' }}>*</span>}
      </div>
      {children}
      {hint && <div style={{ fontSize: 10.5, color: 'var(--ink-40)', marginTop: 2, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.02em' }}>{hint}</div>}
    </div>);

}

function TextInput({ value, onChange, placeholder, type = 'text', prefix, suffix }) {
  return (
    <div className="input" style={{ padding: '10px 12px' }}>
      {prefix && <span style={{ color: 'var(--ink-40)', fontSize: 13, fontFamily: 'JetBrains Mono, monospace' }}>{prefix}</span>}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type={type}
        style={{ flex: 1, border: 0, outline: 'none', font: 'inherit', color: 'var(--navy)', fontSize: 14, background: 'transparent', minWidth: 0 }} />
      {suffix && <span style={{ color: 'var(--ink-40)', fontSize: 12 }}>{suffix}</span>}
    </div>);
}

function SelectInput({ value, onChange, options }) {
  return (
    <div className="input" style={{ padding: '10px 12px', position: 'relative' }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          flex: 1, border: 0, outline: 'none', font: 'inherit',
          color: 'var(--navy)', fontSize: 14, background: 'transparent',
          appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer',
        }}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <IcChevDown size={14} />
    </div>);
}

function TenantPropertyDetails({ go }) {
  const [tenant, setTenant] = React.useState({
    firstName: 'Camila',
    lastName: 'Restrepo Bermúdez',
    docType: 'cc',
    docNumber: '1.085.342.711',
    email: 'camila.restrepo@gmail.com',
    phone: '300 412 8855',
  });
  const [prop, setProp] = React.useState({
    street: 'Cra 25 #18-04',
    unit: 'Apto 502',
    city: 'San Juan de Pasto',
    rent: '1850000',
    admin: '180000',
    leaseMonths: '12',
  });

  const set = (obj, fn) => (k) => (v) => fn({ ...obj, [k]: v });
  const setT = (k) => (v) => setTenant({ ...tenant, [k]: v });
  const setP = (k) => (v) => setProp({ ...prop, [k]: v });

  // Light validation: required fields all filled
  const requiredFilled =
    tenant.firstName && tenant.lastName && tenant.docNumber && tenant.email && tenant.phone &&
    prop.street && prop.city && prop.rent;

  const fmtRent = (n) => {
    const num = parseInt(String(n).replace(/\D/g, ''), 10);
    if (!num) return '—';
    return 'COP ' + num.toLocaleString('en-US');
  };

  return (
    <>
      <div className="back-row">
        <button className="back-btn" onClick={() => go('profile')}>
          <IcArrowLeft size={18} sw={1.8} /> Back
        </button>
        <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--ink-60)', fontFamily: 'JetBrains Mono, monospace' }}>
          NEW · APP-2418
        </div>
      </div>

      <StepIndicator step={2} total={3} label="Tenant & property" />

      <div className="screen-scroll">
        <div className="p-20" style={{ paddingTop: 16, paddingBottom: 16 }}>
          <h2 className="h-title">Tenant & property details</h2>
          <p className="h-title-sub">We use this to pre-fill the policy and contract. You can update it later from the case detail.</p>

          {/* Tenant section */}
          <div className="card" style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--teal-50)', color: 'var(--teal-700)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <IcUser size={16} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)' }}>About the tenant</div>
            </div>

            <div className="gap-10">
              <div style={{ display: 'flex', gap: 10 }}>
                <Field label="First name" required half>
                  <TextInput value={tenant.firstName} onChange={setT('firstName')} placeholder="María" />
                </Field>
                <Field label="Last name(s)" required half>
                  <TextInput value={tenant.lastName} onChange={setT('lastName')} placeholder="López" />
                </Field>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <Field label="Doc. type" required half>
                  <SelectInput
                    value={tenant.docType}
                    onChange={setT('docType')}
                    options={[
                      { value: 'cc', label: 'Cédula (CC)' },
                      { value: 'ce', label: 'Cédula Ext. (CE)' },
                      { value: 'pp', label: 'Passport' },
                      { value: 'nit', label: 'NIT' },
                    ]} />
                </Field>
                <Field label="Document number" required half>
                  <TextInput value={tenant.docNumber} onChange={setT('docNumber')} placeholder="1.000.000.000" />
                </Field>
              </div>

              <Field label="Email" required hint="WE'LL SEND DOCUMENT REMINDERS HERE">
                <TextInput value={tenant.email} onChange={setT('email')} placeholder="name@email.com" type="email" />
              </Field>

              <Field label="Phone" required hint="WHATSAPP REMINDERS · COLOMBIA +57">
                <TextInput value={tenant.phone} onChange={setT('phone')} placeholder="300 000 0000" prefix="+57" />
              </Field>
            </div>
          </div>

          {/* Property section */}
          <div className="card" style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--teal-50)', color: 'var(--teal-700)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <IcBuilding size={16} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)' }}>The property</div>
            </div>

            <div className="gap-10">
              <Field label="Street address" required>
                <TextInput value={prop.street} onChange={setP('street')} placeholder="Cra 25 #18-04" />
              </Field>
              <div style={{ display: 'flex', gap: 10 }}>
                <Field label="Apt / Unit" half>
                  <TextInput value={prop.unit} onChange={setP('unit')} placeholder="Apto 502" />
                </Field>
                <Field label="City" required half>
                  <TextInput value={prop.city} onChange={setP('city')} placeholder="Pasto" />
                </Field>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <Field label="Monthly rent" required half>
                  <TextInput value={prop.rent} onChange={setP('rent')} placeholder="1,500,000" prefix="$" />
                </Field>
                <Field label="Admin fee" half hint="MONTHLY · OPTIONAL">
                  <TextInput value={prop.admin} onChange={setP('admin')} placeholder="0" prefix="$" />
                </Field>
              </div>

              <Field label="Lease term" required hint="MONTHS · STANDARD COLOMBIAN LEASE IS 12">
                <TextInput value={prop.leaseMonths} onChange={setP('leaseMonths')} placeholder="12" suffix="months" />
              </Field>
            </div>
          </div>

          {/* Computed total nudge */}
          <div className="banner teal" style={{ marginBottom: 4 }}>
            <div className="ico"><IcShield size={14} sw={2} /></div>
            <div>
              <h4>Policy coverage preview</h4>
              <p>
                Rent <strong>{fmtRent(prop.rent)}</strong>{prop.admin && parseInt(prop.admin, 10) ? <> + admin <strong>{fmtRent(prop.admin)}</strong></> : null} ·
                Term <strong>{prop.leaseMonths || '—'} months</strong>.
                Coverage applies the moment the policy is issued.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky-submit">
        {!requiredFilled && <p className="submit-helper">↑ Complete the required (*) fields to continue</p>}
        <button
          className={'btn btn-primary btn-block ' + (requiredFilled ? '' : 'is-disabled')}
          disabled={!requiredFilled}
          onClick={() => requiredFilled && go('confirm')}>
          Continue to review <IcArrowRight size={16} sw={2} />
        </button>
      </div>
    </>);

}

// ─────────────────────────────────────────────────────────────
// SCREEN 4 — Document checklist (Step 3 of 4)
// ─────────────────────────────────────────────────────────────

const INITIAL_DOCS = [
{ id: 'id', name: 'National ID — both sides', meta: 'PDF or photo · max 5MB', uploaded: true },
{ id: 'pay', name: 'Last 3 payslips', meta: 'Within last 30 days', uploaded: true, dated: true },
{ id: 'letter', name: 'Employment letter', meta: 'Issued within last 30 days', uploaded: true, dated: true },
{ id: 'bank', name: 'Last 3 bank statements', meta: 'PDF · digitally signed if possible', uploaded: false },
{ id: 'cert', name: 'Income certificate', meta: 'Signed by employer', uploaded: false },
{ id: 'ref', name: 'Reference letter', meta: 'Personal or commercial', uploaded: false }];


function DocChecklist({ go }) {
  // Read-only view — the tenant uploads documents from their own link.
  // The agency monitors here. No upload actions.
  const docs = INITIAL_DOCS;
  const uploadedCount = docs.filter((d) => d.uploaded).length;
  const total = docs.length;
  const complete = uploadedCount === total;
  const pct = uploadedCount / total;

  return (
    <>
      <div className="back-row">
        <button className="back-btn" onClick={() => go('detail')}>
          <IcArrowLeft size={18} sw={1.8} /> Case
        </button>
        <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--ink-60)', fontFamily: 'JetBrains Mono, monospace' }}>
          CASE · AF-7821
        </div>
      </div>

      <div className="screen-scroll">
        <div className="p-20" style={{ paddingTop: 18, paddingBottom: 16 }}>
          <h2 className="h-title">Documents from your tenant</h2>
          <p className="h-title-sub"><strong>Camila Restrepo</strong> is uploading the documents required for the <strong>Employed (formal)</strong> profile. You'll be notified each time something is uploaded.</p>

          <div className="card" style={{ background: complete ? 'linear-gradient(180deg, var(--green-50), white)' : 'white', borderColor: complete ? 'rgba(5,150,105,0.25)' : 'var(--line)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>{uploadedCount} of {total} uploaded by tenant</div>
                <div style={{ fontSize: 11, color: 'var(--ink-60)', marginTop: 2 }}>
                  {complete ? 'All documents in — sent to Afianzar automatically' : `${total - uploadedCount} pending · last reminder sent 2h ago`}
                </div>
              </div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 18, fontWeight: 700, color: complete ? 'var(--green)' : 'var(--teal)' }}>
                {Math.round(pct * 100)}%
              </div>
            </div>
            <div className={'progress ' + (complete ? 'green' : '')}>
              <i style={{ width: pct * 100 + '%' }} />
            </div>
          </div>

          <div className="gap-10" style={{ marginTop: 14 }}>
            {docs.map((d) =>
            <div key={d.id} className={'doc-row ' + (d.uploaded ? 'uploaded' : '')}>
                <div className={'doc-check ' + (d.uploaded ? 'done' : '')}>
                  {d.uploaded ? <IcCheck size={16} sw={2.4} /> : <IcClock size={16} />}
                </div>
                <div className="doc-info">
                  <div className="name">{d.name}</div>
                  <div className="meta">
                    {d.uploaded
                      ? <span style={{ color: 'var(--green)', fontWeight: 600 }}>Uploaded by tenant</span>
                      : 'Waiting on tenant'}
                  </div>
                </div>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5,
                  color: 'var(--ink-40)', textTransform: 'uppercase', letterSpacing: '0.04em',
                  whiteSpace: 'nowrap', paddingLeft: 8,
                }}>
                  {d.uploaded ? '9:38 AM' : '—'}
                </span>
              </div>
            )}
          </div>

          {!complete && (
            <div className="banner teal" style={{ marginTop: 16 }}>
              <div className="ico"><IcBell size={14} sw={2} /></div>
              <div>
                <h4>Tenant reminders are automatic</h4>
                <p>We chase your tenant by email and WhatsApp at the 24h and 2h marks before the deadline you set.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="sticky-submit">
        <button className="btn btn-secondary btn-block" onClick={() => go('detail')}>
          Back to case
        </button>
      </div>
    </>);

}

// ─────────────────────────────────────────────────────────────
// SCREEN 5 — Review & Confirm (Step 4 of 4)
// ─────────────────────────────────────────────────────────────

function ReviewConfirm({ go }) {
  const [date, setDate] = React.useState('Tomorrow, 12:00');
  return (
    <>
      <div className="back-row">
        <button className="back-btn" onClick={() => go('details')}>
          <IcArrowLeft size={18} sw={1.8} /> Back
        </button>
        <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--ink-60)', fontFamily: 'JetBrains Mono, monospace' }}>
          NEW · APP-2418
        </div>
      </div>

      <StepIndicator step={3} total={3} label="Review & send" />

      <div className="screen-scroll">
        <div className="p-20" style={{ paddingTop: 16, paddingBottom: 16 }}>
          <h2 className="h-title">Review and send to tenant</h2>
          <p className="h-title-sub">Your tenant will receive a personalised link to upload the required documents. Set a deadline to keep things on track.</p>

          <div className="card" style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-60)' }}>Application summary</div>
              <span className="chip" style={{ background: 'var(--teal-50)', color: 'var(--teal-700)', borderColor: 'rgba(2,128,144,0.25)' }}>
                <IcUser size={12} sw={2.2} /> Ready to send
              </span>
            </div>
            <div className="summary-row"><span className="k">Tenant</span><span className="v">Camila Restrepo</span></div>
            <div className="summary-row"><span className="k">Email</span><span className="v" style={{ fontWeight: 500 }}>camila.restrepo@gmail.com</span></div>
            <div className="summary-row"><span className="k">Phone</span><span className="v" style={{ fontWeight: 500 }}>+57 300 412 8855</span></div>
            <div className="summary-row"><span className="k">Property</span><span className="v" style={{ maxWidth: 200 }}>Cra 25 #18-04<br /><span style={{ fontWeight: 500, fontSize: 11, color: 'var(--ink-60)' }}>San Juan de Pasto</span></span></div>
            <div className="summary-row"><span className="k">Profile</span><span className="v">Employed (formal)</span></div>
            <div className="summary-row"><span className="k">Documents to upload</span><span className="v">6</span></div>
            <div className="summary-row"><span className="k">Monthly rent</span><span className="v">COP 1,850,000</span></div>
          </div>

          <div style={{ marginTop: 4, marginBottom: 14 }}>
            <div className="label" style={{ marginBottom: 8 }}>Deadline commitment</div>
            <div className="card" style={{ padding: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)', marginBottom: 2 }}>Document delivery deadline</div>
              <div style={{ fontSize: 12, color: 'var(--ink-60)', marginBottom: 12 }}>The date your tenant agreed to have all documents uploaded by. We'll send automatic reminders.</div>

              <div className="input" style={{ marginBottom: 10 }}>
                <IcCalendar size={16} />
                <input value={date} onChange={(e) => setDate(e.target.value)}
                style={{ flex: 1, border: 0, outline: 'none', font: 'inherit', color: 'var(--navy)' }} />
                <IcChevDown size={14} />
              </div>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 11.5, color: 'var(--ink-60)' }}>
                <IcBell size={12} />
                <span>Auto-reminders sent at <strong style={{ color: 'var(--navy)' }}>24h</strong> and <strong style={{ color: 'var(--navy)' }}>2h</strong> before deadline</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky-submit">
        <button className="btn btn-primary btn-block" onClick={() => go('detail')}>
          <IcMessage size={16} sw={2} /> Send to tenant
        </button>
        <p className="smallprint">
          <span>The application is only submitted to Afianzar once your tenant has uploaded all required documents.</span>
        </p>
      </div>
    </>);

}

// ─────────────────────────────────────────────────────────────
// SCREEN 5 — Case Detail (with correction state)
// ─────────────────────────────────────────────────────────────

function CaseDetail({ go, correction, setCorrection }) {
  const submittedAt = '9:41 AM today';
  const receivedAt = '9:43 AM today';
  return (
    <>
      <div className="back-row">
        <button className="back-btn" onClick={() => go('home')}>
          <IcArrowLeft size={18} sw={1.8} /> Dashboard
        </button>
        <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--ink-60)', fontFamily: 'JetBrains Mono, monospace' }}>
          CASE · AF-7821
        </div>
      </div>

      <div className="screen-scroll case-detail">
        <div style={{ padding: '16px 20px 10px', background: 'white', borderBottom: '1px solid var(--line)' }}>
          <div style={{ fontSize: 11, color: 'var(--ink-60)', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tenant</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--navy)', marginTop: 2, letterSpacing: '-0.01em' }}>Camila Restrepo</div>
          <div style={{ fontSize: 12.5, color: 'var(--ink-60)', marginTop: 2 }}>Cra 25 #18-04 · San Juan de Pasto</div>
          <div style={{ display: 'flex', gap: 14, marginTop: 12, fontSize: 11, color: 'var(--ink-60)', fontFamily: 'JetBrains Mono, monospace' }}>
            <span>SUBMITTED <strong style={{ color: 'var(--navy)' }}>{submittedAt}</strong></span>
          </div>
        </div>

        <div className="p-20" style={{ paddingTop: 18, paddingBottom: 20 }}>
          <p className="quote-line">"We'll notify you the moment your result is ready."</p>

          {correction &&
          <div className="banner amber" style={{ marginBottom: 16 }}>
              <div className="ico"><IcWarn size={14} sw={2.2} /></div>
              <div style={{ flex: 1 }}>
                <h4>1 additional document requested from tenant</h4>
                <p>The bank statement Camila uploaded is dated 38 days ago. We've automatically requested an updated one from her. <strong>Estimated impact: +1–2 days to your result.</strong></p>
              </div>
            </div>
          }

          <div className="label" style={{ marginBottom: 14 }}>Live status</div>
          <div className="tracker">
            <Step done label="Submitted" meta={submittedAt} />
            <Step done label="Received by Afianzar" meta={receivedAt} />
            <Step
              active={!correction}
              done={correction}
              label="Study in progress"
              meta={correction ? '⏸ Paused — waiting on tenant' : 'Est. completion 1:23 PM today'}
              eta={!correction} />

            <Step last muted label="Result ready" meta="—" />
          </div>

          <div className="label" style={{ marginTop: 24, marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Activity</span>
            <button
              onClick={() => go('checklist')}
              style={{
                background: 'transparent', border: 0, cursor: 'pointer',
                fontSize: 11, color: 'var(--teal-700)', fontWeight: 700,
                fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.04em',
                textTransform: 'uppercase', padding: 0,
              }}>
              View documents →
            </button>
          </div>

          <div className="msg-thread">
            <ActivityItem
              kind="system"
              who="System"
              time="9:43 AM"
              text="Application received. Automated study started — typical completion in ~4h." />
            <ActivityItem
              kind="tenant"
              who="Upload from Camila"
              time="9:38 AM"
              text="National ID (both sides) · Last 3 payslips · Employment letter — uploaded." />
            {correction &&
              <ActivityItem
                kind="alert"
                who="Sent to tenant"
                time="10:12 AM"
                text="Camila, the bank statement you uploaded is dated 38 days ago. Please send one dated within the last 30 days." />
            }
            {correction &&
              <ActivityItem
                kind="system"
                who="System"
                time="10:12 AM"
                text="Study paused — waiting on updated bank statement from tenant." />
            }
          </div>

          {!correction &&
          <button className="btn btn-secondary btn-block" style={{ marginTop: 18 }} onClick={() => setCorrection(true)}>
              Simulate: tenant uploads outdated document
            </button>
          }
        </div>
      </div>
    </>);

}

function ActivityItem({ kind, who, time, text }) {
  const palette = {
    system: { bg: 'var(--bg)', dot: 'var(--ink-40)', who: 'var(--ink-60)' },
    tenant: { bg: 'var(--teal-50)', dot: 'var(--teal)', who: 'var(--teal-700)' },
    alert:  { bg: 'var(--amber-50)', dot: 'var(--amber)', who: 'var(--amber)' },
  }[kind] || { bg: 'var(--bg)', dot: 'var(--ink-40)', who: 'var(--ink-60)' };
  return (
    <div style={{
      background: palette.bg, borderRadius: 12, padding: '10px 12px',
      border: '1px solid rgba(0,0,0,0.04)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: palette.dot, display: 'inline-block' }}></span>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.05em',
          textTransform: 'uppercase', color: palette.who,
          fontFamily: 'JetBrains Mono, monospace',
        }}>{who}</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--ink-40)', fontFamily: 'JetBrains Mono, monospace' }}>{time}</span>
      </div>
      <div style={{ fontSize: 12.5, color: 'var(--navy)', lineHeight: 1.4 }}>{text}</div>
    </div>
  );
}

function Step({ done, active, muted, last, label, meta, eta }) {
  return (
    <div className="tr-step">
      <div className="tr-stem">
        <div className={'tr-bullet ' + (done ? 'done' : active ? 'active' : '')} style={{ position: 'relative' }}>
          {done ? <IcCheck size={13} sw={2.6} /> : active ? <IcRefresh size={13} sw={2.2} /> : ''}
        </div>
        {!last && <div className={'tr-line ' + (done ? 'done' : '')} />}
      </div>
      <div className="tr-body">
        <div className={'tr-title ' + (muted ? 'muted' : '')}>{label}</div>
        <div className={'tr-meta ' + (eta ? 'eta' : '')}>{meta}</div>
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────────────
// SCREEN 6 — Result (Approved / Correction Required)
// ─────────────────────────────────────────────────────────────

function ResultApproved({ go }) {
  return (
    <>
      <div className="back-row">
        <button className="back-btn" onClick={() => go('home')}>
          <IcArrowLeft size={18} sw={1.8} /> Dashboard
        </button>
        <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--ink-60)', fontFamily: 'JetBrains Mono, monospace' }}>
          CASE · AF-7821
        </div>
      </div>
      <div className="screen-scroll">
        <div className="result-hero">
          <div className="result-circle green">
            <IcCheck size={44} sw={2.4} />
          </div>
          <h1 className="result-title">Approved</h1>
          <p className="result-sub">Camila Restrepo — Cra 25 #18-04, Pasto<br /><span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--ink-40)', letterSpacing: '0.04em' }}>POLICY AF-7821-A</span></p>
        </div>

        <div className="p-20">
          <div className="banner green" style={{ marginBottom: 18 }}>
            <div className="ico"><IcShield size={14} sw={2} /></div>
            <div>
              <h4>Policy is ready</h4>
              <p>Contracts have been generated and are ready to be sent to <strong>Camila Restrepo</strong> for digital signature.</p>
            </div>
          </div>

          <div className="label mb-10">Next steps</div>
          <ol className="num-list">
            <li>
              <span className="n">1</span>
              <div><strong>Send contracts to the tenant for signature</strong><span>Policy + lease bundle sent via secure link</span></div>
            </li>
            <li>
              <span className="n">2</span>
              <div><strong>Tenant signs digitally</strong><span>You'll be notified the moment all parties have signed</span></div>
            </li>
            <li>
              <span className="n">3</span>
              <div><strong>Coverage activates automatically</strong><span>No manual confirmation needed — the case closes</span></div>
            </li>
          </ol>
        </div>
      </div>
      <div className="sticky-submit">
        <button className="btn btn-primary btn-block">
          <IcMessage size={16} sw={2} /> Send contracts for signature
        </button>
      </div>
    </>);

}

function ResultCorrection({ go }) {
  return (
    <>
      <div className="back-row">
        <button className="back-btn" onClick={() => go('detail')}>
          <IcArrowLeft size={18} sw={1.8} /> Case
        </button>
        <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--ink-60)', fontFamily: 'JetBrains Mono, monospace' }}>
          CASE · AF-7821
        </div>
      </div>
      <div className="screen-scroll">
        <div className="result-hero">
          <div className="result-circle amber">
            <IcWarn size={40} sw={2} />
          </div>
          <h1 className="result-title">Additional document required</h1>
          <p className="result-sub">Camila Restrepo — Cra 25 #18-04, Pasto</p>
        </div>

        <div className="p-20">
          <div className="card" style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: 'var(--ink-60)', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>What's missing</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--navy)', marginBottom: 6 }}>Bank statement — last 30 days</div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-60)', lineHeight: 1.45 }}>
              The statement you uploaded is dated 38 days ago. Afianzar requires bank statements no older than 30 days.
            </div>
          </div>

          <div className="banner amber" style={{ marginBottom: 14 }}>
            <div className="ico"><IcClock size={14} sw={2.2} /></div>
            <div>
              <h4>Same-day window closing</h4>
              <p>Responding within <strong>2 hours</strong> keeps your same-day result window open. After that, expect <strong>+1–2 days</strong>.</p>
            </div>
          </div>

          <div className="card" style={{ background: 'var(--teal-50)', borderColor: 'rgba(2,128,144,0.2)' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <IcMessage size={18} stroke="var(--teal-700)" />
              <div style={{ fontSize: 12.5, color: 'var(--navy)' }}>
                <strong>Quick reply available</strong> in the case thread.
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="sticky-submit">
        <button className="btn btn-primary btn-block" onClick={() => go('detail')}>
          <IcUpload size={16} sw={2} /> Upload now
        </button>
      </div>
    </>);

}

Object.assign(window, {
  Phone, Dashboard, ProfileSelection, TenantPropertyDetails, DocChecklist, ReviewConfirm, CaseDetail, ResultApproved, ResultCorrection
});