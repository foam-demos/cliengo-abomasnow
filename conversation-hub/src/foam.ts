import * as foam from '@foam-ai/node-opentelemetry';
import { FOAM_API_KEY, NODE_ENV } from './config';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import type { InstrumentationBase } from '@opentelemetry/instrumentation';

foam.init({
  serviceName: 'conversation-hub',
  isProduction: NODE_ENV === 'production',
  apiKey: `Bearer ${FOAM_API_KEY}`,
  additionalInstrumentations: [new ExpressInstrumentation({}) as unknown as InstrumentationBase],
});

export default foam;