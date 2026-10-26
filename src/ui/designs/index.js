import { BenchBody } from './bench.js';
import { VuBody } from './vu.js';
import { AltimeterBody } from './altimeter.js';
import { SignalBody } from './signal.js';
import { ChartBody } from './chart.js';
import { SwissBody } from './swiss.js';
import { CompassBody } from './compass.js';

/** Instrument bodies, keyed by design id. */
export const BODIES = {
  bench: BenchBody,
  vu: VuBody,
  altimeter: AltimeterBody,
  signal: SignalBody,
  chart: ChartBody,
  swiss: SwissBody,
  compass: CompassBody,
};
