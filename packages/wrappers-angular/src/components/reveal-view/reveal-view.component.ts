import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { defineRevealSdkWrappers, RvRevealView } from 'reveal-sdk-wrappers';
defineRevealSdkWrappers(RvRevealView);

@Component({
  selector: 'rva-reveal-view',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<p>reveal-view works!</p>`,
  styleUrl: './reveal-view.component.scss',
})
export class RevealViewComponent {}
