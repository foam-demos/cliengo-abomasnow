package com.cliengo.analytics

import com.foam.FoamTracer
import play.api.ApplicationLoader.Context
import play.api._

class FoamInitializer extends ApplicationLoader {
  def load(context: Context): Application = {
    LoggerConfigurator(context.environment.classLoader).foreach {
      _.configure(context.environment)
    }
    FoamTracer.init(
      serviceName = "analytics-service",
      environment = context.environment.mode.toString,
      apiKey = sys.env.getOrElse("FOAM_API_KEY", "")
    )
    new BuiltInComponentsFromContext(context).application
  }
}