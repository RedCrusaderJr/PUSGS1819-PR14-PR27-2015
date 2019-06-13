using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNet.SignalR;
using Microsoft.Owin;
using Microsoft.Owin.Cors;
using Owin;
using WebApp.Hubs;
using WebApp.Persistence.UnitOfWork;
using WebApp.Persistence;

[assembly: OwinStartup(typeof(WebApp.Startup))]

namespace WebApp
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.UseCors(CorsOptions.AllowAll);
            ConfigureAuth(app);
            app.MapSignalR();
        }
    }
}
