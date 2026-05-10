import { signal } from '@angular/core';
import { observationSubmissionDTO } from '../app/home/control-panel/dtos/control-panel.dto';

export const observationSubmissionSignal = signal<observationSubmissionDTO | null>(null);