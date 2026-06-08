const foam = require('@foam-ai/node-opentelemetry');
const { FOAM_API_KEY, NODE_ENV } = process.env;

foam.init({
  serviceName: 'whatsapp-connector',
  isProduction: NODE_ENV === 'production',
  apiKey: `Bearer ${FOAM_API_KEY}`,
  additionalInstrumentations: [],
});

module.exports = foam;