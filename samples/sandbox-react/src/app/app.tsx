import { useCallback, useRef, useState } from 'react';
import { RvRevealView, RvRevealViewRef } from 'reveal-sdk-wrappers-react';
import {
  DataPointClickedArgs,
  EditModeEnteredArgs,
  EditModeExitedArgs,
  FieldsInitializingArgs,
  MenuOpeningArgs,
  RevealViewOptions,
  SavingArgs,
  SeriesColorRequestedArgs,
  TooltipShowingArgs,
} from 'reveal-sdk-wrappers';
import {
  MountainDarkTheme,
  MountainLightTheme,
  OceanDarkTheme,
  OceanLightTheme,
  RevealSdkSettings,
  RVMenuItem,
  RVMenuSeparatorItem,
} from 'reveal-sdk';
import './app.css';

// RevealSdkSettings.setBaseUrl('https://samples.revealbi.io/upmedia-backend/reveal-api/');
RevealSdkSettings.setBaseUrl('https://localhost:44380/');

interface LogEntry {
  time: string;
  event: string;
  detail: string;
  type: 'info' | 'action' | 'warning';
}

const DASHBOARDS = ['Sales', 'Marketing', 'Campaigns'];
const THEMES = [
  { value: 'mountain-light', label: 'Mountain Light' },
  { value: 'mountain-dark',  label: 'Mountain Dark'  },
  { value: 'ocean-light',    label: 'Ocean Light'    },
  { value: 'ocean-dark',     label: 'Ocean Dark'     },
];

const NAMED_PALETTE: Record<string, string> = {
  'New Sales':            '#4caf50',
  'Total Opportunities':  '#f44336',
  'Renewal Sales':        '#2196f3',
  'Revenue':              '#ff9800',
  'Quota':                '#9c27b0',
};

const FALLBACK_COLORS = ['#e91e63', '#00bcd4', '#8bc34a', '#ff5722', '#607d8b', '#ab47bc'];

function timestamp(): string {
  return new Date().toLocaleTimeString('en-US', {
    hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

export function App() {
  const rvRef = useRef<RvRevealViewRef>(null);

  // ── Feature 1: Dashboard Switching ─────────────────────────
  const [dashboard, setDashboard] = useState('Sales');

  // ── Feature 2: Theme Switching ──────────────────────────────
  const [selectedTheme, setSelectedTheme] = useState('mountain-light');

  // ── Toggle states (refs for stable callbacks, state for UI) ──
  const customColorsRef     = useRef(false);
  const suppressTooltipsRef = useRef(false);
  const addCustomMenuRef    = useRef(false);
  const [customColors, setCustomColors]       = useState(false);
  const [suppressTooltips, setSuppressTooltips] = useState(false);
  const [addCustomMenu, setAddCustomMenu]     = useState(false);

  // ── UI state ────────────────────────────────────────────────
  const [isEditMode, setIsEditMode] = useState(false);
  const [eventLog, setEventLog]     = useState<LogEntry[]>([]);

  const log = useCallback((type: LogEntry['type'], event: string, detail: string) => {
    setEventLog(prev => {
      const entry: LogEntry = { time: timestamp(), event, detail, type };
      const next = [entry, ...prev];
      return next.length > 100 ? next.slice(0, 100) : next;
    });
  }, []);

  // ── RevealView options ──────────────────────────────────────
  const [options] = useState<RevealViewOptions>({
    canEdit: true,
    canSave: true,
    canCancel: true,
    header: {
      menu: {
        items: [
          { title: 'Log Dashboard Info', click: () => log('action', 'Header Menu', '"Log Dashboard Info" clicked') },
        ],
      },
    },
    filters: {
      interactiveFiltering: true,
      showFilters: true,
    },
    visualizations: {
      canMaximize: true,
      crosshairs: true,
      hoverTooltips: true,
      changeChartType: true,
    },
  });

  // ── Feature 2: Apply theme ──────────────────────────────────
  const onThemeChange = (value: string) => {
    setSelectedTheme(value);
    const themeMap: Record<string, InstanceType<typeof MountainLightTheme>> = {
      'mountain-light': new MountainLightTheme(),
      'mountain-dark':  new MountainDarkTheme(),
      'ocean-light':    new OceanLightTheme(),
      'ocean-dark':     new OceanDarkTheme(),
    };
    RevealSdkSettings.theme = themeMap[value];
    rvRef.current?.refreshTheme();
    log('action', 'Theme Changed', value);
  };

  // ── Feature 3: Edit Mode ────────────────────────────────────
  const toggleEditMode = () => {
    if (isEditMode) {
      rvRef.current?.exitEditMode(false);
    } else {
      rvRef.current?.enterEditMode();
    }
  };
  const applyEditChanges = () => rvRef.current?.exitEditMode(true);

  // ── Feature 4: Exports ──────────────────────────────────────
  const exportImage = () => rvRef.current?.exportToImage();
  const exportExcel = () => rvRef.current?.exportToExcel();
  const exportPdf   = () => rvRef.current?.exportToPdf();
  const exportPpt   = () => rvRef.current?.exportToPowerPoint();

  // ── Refresh ─────────────────────────────────────────────────
  const refreshData = () => {
    rvRef.current?.refreshData();
    log('action', 'Refresh', 'Data refresh triggered');
  };

  // ── Feature 6: Toggle Custom Colors ─────────────────────────
  const toggleCustomColors = () => {
    const next = !customColorsRef.current;
    customColorsRef.current = next;
    setCustomColors(next);
    rvRef.current?.refreshData();
    log('action', 'Custom Colors', next ? 'enabled' : 'disabled');
  };

  // ── Feature 7: Toggle Tooltip Suppression ───────────────────
  const toggleSuppressTooltips = () => {
    const next = !suppressTooltipsRef.current;
    suppressTooltipsRef.current = next;
    setSuppressTooltips(next);
  };

  // ── Feature 8: Toggle Custom Menu ───────────────────────────
  const toggleCustomMenu = () => {
    const next = !addCustomMenuRef.current;
    addCustomMenuRef.current = next;
    setAddCustomMenu(next);
  };

  // ── Callbacks ───────────────────────────────────────────────

  const onInitialized = useCallback(() => {
    log('info', 'Initialized', 'Dashboard ready');
  }, [log]);

  const onEditModeEntered = useCallback((args: EditModeEnteredArgs) => {
    setIsEditMode(true);
    log('action', 'Edit Mode Entered', args.dashboard?.title ?? '');
  }, [log]);

  const onEditModeExited = useCallback((args: EditModeExitedArgs) => {
    setIsEditMode(false);
    log('action', 'Edit Mode Exited', args.dashboard?.title ?? '');
  }, [log]);

  const onDataPointClicked = useCallback((args: DataPointClickedArgs) => {
    const viz = args.visualization?.title ?? 'Unknown';
    const val = args.cell?.formattedValue ?? args.cell?.value ?? '–';
    log('info', 'Data Point Clicked', `[${viz}] ${val}`);
  }, [log]);

  const onSeriesColorRequested = useCallback((args: SeriesColorRequestedArgs): string => {
    if (!customColorsRef.current) return args.defaultColor;
    if (NAMED_PALETTE[args.fieldName]) return NAMED_PALETTE[args.fieldName];
    let hash = 0;
    for (const ch of args.fieldName) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffff;
    return FALLBACK_COLORS[hash % FALLBACK_COLORS.length];
  }, []);

  const onTooltipShowing = useCallback((args: TooltipShowingArgs) => {
    if (suppressTooltipsRef.current) args.cancel = true;
  }, []);

  const onMenuOpening = useCallback((args: MenuOpeningArgs) => {
    log('info', 'Menu Opening', `viz="${args.visualization?.title ?? '(dashboard)'}" items=${args.menuItems.length}`);
    if (!addCustomMenuRef.current) return;
    if (args.visualization == null) return;
    const vizTitle = args.visualization.title || 'this visualization';
    const item = new RVMenuItem(`Alert: "${vizTitle}"`);
    item.action = () => alert(`Clicked on: ${vizTitle}`);
    args.menuItems.push(new RVMenuSeparatorItem(), item);
  }, [log]);

  const onSaving = useCallback((args: SavingArgs) => {
    log('action', 'Dashboard Saving', `"${args.name}" — isNew=${args.isNew}, saveAs=${args.saveAs}`);
    args.saveFinished();
  }, [log]);

  const onFieldsInitializing = useCallback((args: FieldsInitializingArgs) => {
    const ds = args.dataSourceItem?.title ?? 'unknown';
    log('info', 'Fields Initializing', `${args.fields?.length ?? 0} fields from "${ds}"`);
  }, [log]);

  const clearLog = () => setEventLog([]);

  return (
    <div className="shell">

      {/* ═══════════════════════ TOOLBAR ═══════════════════════ */}
      <header className="toolbar">

        {/* Feature 1: Dashboard Switching */}
        <div className="ctrl-group">
          <span className="label">Dashboard</span>
          <select value={dashboard} onChange={e => setDashboard(e.target.value)}>
            {DASHBOARDS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {/* Feature 2: Theme Switching */}
        <div className="ctrl-group">
          <span className="label">Theme</span>
          <select value={selectedTheme} onChange={e => onThemeChange(e.target.value)}>
            {THEMES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        <div className="sep" />

        {/* Feature 3: Edit Mode */}
        <div className="ctrl-group">
          <button className={`btn ${isEditMode ? 'active' : ''}`} onClick={toggleEditMode}>
            ✏️ {isEditMode ? 'Exit Edit' : 'Edit'}
          </button>
          {isEditMode && (
            <button className="btn success" onClick={applyEditChanges}>✔ Apply</button>
          )}
        </div>

        {/* Refresh */}
        <div className="ctrl-group">
          <button className="btn" onClick={refreshData}>↺ Refresh</button>
        </div>

        <div className="sep" />

        {/* Feature 4: Export */}
        <div className="ctrl-group">
          <span className="label">Export</span>
          <button className="btn" onClick={exportImage}>🖼 Image</button>
          <button className="btn" onClick={exportExcel}>📊 Excel</button>
          <button className="btn" onClick={exportPdf}>📄 PDF</button>
          <button className="btn" onClick={exportPpt}>📝 PPT</button>
        </div>

        <div className="sep" />

        {/* Features 6, 7, 8: Toggles */}
        <div className="ctrl-group">
          <label className="toggle" title="Feature 6 – Override chart series colours with a custom palette">
            <input type="checkbox" checked={customColors} onChange={toggleCustomColors} />
            <span>Custom Colors</span>
          </label>
          <label className="toggle" title="Feature 7 – Cancel all tooltip events before they render">
            <input type="checkbox" checked={suppressTooltips} onChange={toggleSuppressTooltips} />
            <span>No Tooltips</span>
          </label>
          <label className="toggle" title="Feature 8 – Inject a custom item into each visualization's context menu">
            <input type="checkbox" checked={addCustomMenu} onChange={toggleCustomMenu} />
            <span>Custom Menu</span>
          </label>
        </div>

      </header>

      {/* ═══════════════════════ MAIN ═════════════════════════ */}
      <div className="main">

        <RvRevealView
          ref={rvRef}
          className="reveal"
          dashboard={dashboard}
          options={options}
          initialized={onInitialized}
          editModeEntered={onEditModeEntered}
          editModeExited={onEditModeExited}
          dataPointClicked={onDataPointClicked}
          seriesColorRequested={onSeriesColorRequested}
          tooltipShowing={onTooltipShowing}
          menuOpening={onMenuOpening}
          saving={onSaving}
          fieldsInitializing={onFieldsInitializing}
        />

        {/* Event Log side panel */}
        <aside className="log-panel">
          <div className="log-header">
            <span>Event Log</span>
            <button className="btn-sm" onClick={clearLog}>Clear</button>
          </div>
          <ul className="log-list">
            {eventLog.map((e, i) => (
              <li key={i} className={`log-entry ${e.type}`}>
                <span className="log-time">{e.time}</span>
                <span className="log-event">{e.event}</span>
                <span className="log-detail">{e.detail}</span>
              </li>
            ))}
          </ul>
          <div className="log-legend">
            <span className="dot info" />info &nbsp;
            <span className="dot action" />action &nbsp;
            <span className="dot warning" />warning
          </div>
        </aside>

      </div>
    </div>
  );
}

export default App;