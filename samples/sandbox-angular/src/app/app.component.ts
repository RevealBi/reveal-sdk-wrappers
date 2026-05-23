import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RevealViewComponent } from 'reveal-sdk-wrappers-angular';
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

// RevealSdkSettings.setBaseUrl('https://samples.revealbi.io/upmedia-backend/reveal-api/');
RevealSdkSettings.setBaseUrl("https://localhost:44380/");

interface LogEntry {
  time: string;
  event: string;
  detail: string;
  type: 'info' | 'action' | 'warning';
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RevealViewComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild('rv') rvRef!: RevealViewComponent;

  // ── Feature 1: Dashboard Switching ─────────────────────────
  dashboard = 'Sales';
  readonly dashboards = ['Sales', 'Marketing', 'Campaigns'];

  // ── Feature 2: Theme Switching ──────────────────────────────
  selectedTheme = 'mountain-light';
  readonly themes = [
    { value: 'mountain-light', label: 'Mountain Light' },
    { value: 'mountain-dark',  label: 'Mountain Dark'  },
    { value: 'ocean-light',    label: 'Ocean Light'    },
    { value: 'ocean-dark',     label: 'Ocean Dark'     },
  ];

  // ── Toggle states ───────────────────────────────────────────
  customColors      = false;  // Feature 6
  suppressTooltips  = false;  // Feature 7
  addCustomMenuItems = false; // Feature 8

  // ── UI state ────────────────────────────────────────────────
  isEditMode = false;
  eventLog: LogEntry[] = [];

  // ── RevealView options ──────────────────────────────────────
  options: RevealViewOptions = {
    canEdit: true,
    canSave: true,
    canCancel: true,
    header: {
      menu: {
        items: [
          {
            title: 'Log Dashboard Info',
            click: () => this.log('action', 'Header Menu', '"Log Dashboard Info" clicked'),
          },
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
  };

  // ── Feature 2: Apply theme ──────────────────────────────────
  onThemeChange(): void {
    const themeMap: Record<string, InstanceType<typeof MountainLightTheme>> = {
      'mountain-light': new MountainLightTheme(),
      'mountain-dark':  new MountainDarkTheme(),
      'ocean-light':    new OceanLightTheme(),
      'ocean-dark':     new OceanDarkTheme(),
    };
    RevealSdkSettings.theme = themeMap[this.selectedTheme];
    this.rvRef?.refreshTheme();
    this.log('action', 'Theme Changed', this.selectedTheme);
  }

  // ── Feature 3: Edit Mode ────────────────────────────────────
  toggleEditMode(): void {
    if (this.isEditMode) {
      this.rvRef?.exitEditMode(false);
    } else {
      this.rvRef?.enterEditMode();
    }
  }

  applyEditChanges(): void {
    this.rvRef?.exitEditMode(true);
  }

  // ── Feature 4: Exports ──────────────────────────────────────
  exportImage():  void { this.rvRef?.exportToImage(); }
  exportExcel():  void { this.rvRef?.exportToExcel(); }
  exportPdf():    void { this.rvRef?.exportToPdf(); }
  exportPpt():    void { this.rvRef?.exportToPowerPoint(); }

  // ── Refresh ─────────────────────────────────────────────────
  refreshData(): void {
    this.rvRef?.refreshData();
    this.log('action', 'Refresh', 'Data refresh triggered');
  }

  // ── Callbacks ───────────────────────────────────────────────

  // Feature 1 bonus – Initialized
  onInitialized = () => {
    this.log('info', 'Initialized', `"${this.dashboard}" dashboard ready`);
  };

  // Feature 3 – Edit mode state sync
  onEditModeEntered = (args: EditModeEnteredArgs) => {
    this.isEditMode = true;
    this.log('action', 'Edit Mode Entered', args.dashboard?.title ?? '');
  };

  onEditModeExited = (args: EditModeExitedArgs) => {
    this.isEditMode = false;
    this.log('action', 'Edit Mode Exited', args.dashboard?.title ?? '');
  };

  // Feature 5 – Data point click → event log
  onDataPointClicked = (args: DataPointClickedArgs) => {
    const viz = args.visualization?.title ?? 'Unknown';
    const val = args.cell?.formattedValue ?? args.cell?.value ?? '–';
    this.log('info', 'Data Point Clicked', `[${viz}] ${val}`);
  };

  // Feature 6 – Custom series colors (toggleable)
  onToggleCustomColors(): void {
    // Colors are only computed at render time — force a re-draw so the change is visible immediately.
    this.rvRef?.refreshData();
    this.log('action', 'Custom Colors', this.customColors ? 'enabled' : 'disabled');
  }

  onSeriesColorRequested = (args: SeriesColorRequestedArgs): string => {
    if (!this.customColors) return args.defaultColor;
    // Named overrides for well-known fields
    const namedPalette: Record<string, string> = {
      'New Sales':  '#4caf50',
      'Total Opportunities': '#f44336',
      'Renewal Sales':  '#2196f3',
      'Revenue':            '#ff9800',
      'Quota':              '#9c27b0',
    };
    if (namedPalette[args.fieldName]) return namedPalette[args.fieldName];
    // Fallback: deterministic colour derived from the field name so any field gets a visible custom colour
    const fallback = ['#e91e63', '#00bcd4', '#8bc34a', '#ff5722', '#607d8b', '#ab47bc'];
    let hash = 0;
    for (const ch of args.fieldName) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffff;
    return fallback[hash % fallback.length];
  };

  // Feature 7 – Tooltip suppression (toggleable)
  onTooltipShowing = (args: TooltipShowingArgs) => {
    if (this.suppressTooltips) {
      args.cancel = true;
    }
  };

  // Feature 8 – Custom context-menu items per visualization (toggleable)
  onMenuOpening = (args: MenuOpeningArgs) => {
    this.log('info', 'Menu Opening', `viz="${args.visualization?.title ?? '(dashboard)'}" items=${args.menuItems.length}`);
    if (!this.addCustomMenuItems) return;
    // Only inject into visualization menus (not the dashboard-level header menu)
    if (args.visualization == null) return;
    const vizTitle = args.visualization.title || 'this visualization';
    const item = new RVMenuItem(`Alert: "${vizTitle}"`);
    item.action = () => alert(`Clicked on: ${vizTitle}`);
    args.menuItems.push(new RVMenuSeparatorItem(), item);
  };

  // Feature 9 – Save handler (client-side intercept)
  onSaving = (args: SavingArgs) => {
    this.log('action', 'Dashboard Saving', `"${args.name}" — isNew=${args.isNew}, saveAs=${args.saveAs}`);
    // Dismiss the save dialog without server round-trip
    args.saveFinished();
  };

  // Feature 10 – Fields initializing: inspect data source fields
  onFieldsInitializing = (args: FieldsInitializingArgs) => {
    const ds = args.dataSourceItem?.title ?? 'unknown';
    this.log('info', 'Fields Initializing', `${args.fields?.length ?? 0} fields from "${ds}"`);
  };

  // ── Event log helpers ───────────────────────────────────────
  clearLog(): void {
    this.eventLog = [];
  }

  private log(type: LogEntry['type'], event: string, detail: string): void {
    const time = new Date().toLocaleTimeString('en-US', {
      hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
    this.eventLog.unshift({ time, event, detail, type });
    if (this.eventLog.length > 100) this.eventLog.pop();
  }
}
