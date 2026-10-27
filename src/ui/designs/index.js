import { VuBody } from './vu.js';
import { ChartBody } from './chart.js';
import { SwissBody } from './swiss.js';

/** Instrument bodies, keyed by design id. */
export const BODIES = {
  vu: VuBody,
  chart: ChartBody,
  swiss: SwissBody,
};
