using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using System.Timers;
using System.Web;
using WebApp.Models;
using WebApp.Persistence;
using WebApp.Persistence.UnitOfWork;
using System.Data.Entity;

namespace WebApp.Hubs
{
    public static class UserHandler
    {
        public static HashSet<string> ConnectedIds = new HashSet<string>();
    }

    [HubName("busLocation")]
    public class BusLocationHub : Hub
    {
        private static IHubContext hubContext = GlobalHost.ConnectionManager.GetHubContext<BusLocationHub>();
        public static Timer timer = new Timer();
        private IUnitOfWork Db { get; set; }

        
        public BusLocationHub(IUnitOfWork db)
        {            
            Db = db;

            //if (BusLocationHub.timer.Enabled == false)
            //{
            //    TimerServerUpdate();
            //}

        }

        public void TimerServerUpdate()
        {
            timer.Interval = 1000;
            timer.Start();
            timer.Elapsed += OnTimedEvent;
        }
        

        public void TimerServerStop()
        {
            timer.Stop();
        }
        

        public void OnTimedEvent(object source, ElapsedEventArgs e)
        {
            using (ApplicationDbContext context = new ApplicationDbContext())
            {
                List<Autobus> autobuses = context.Set<Autobus>().Include(a => a.BusLine).ToList();
                List<TimetableEntry> timetableEntries = context.Set<TimetableEntry>().Include(c => c.Line).ToList();
                List<Autobus> autobusesToAdd = new List<Autobus>();
                List<Autobus> autobusesToMove = new List<Autobus>();
                List<Autobus> autobusesToDelete = new List<Autobus>();


                foreach (Autobus autobus in autobuses)
                {
                    if (autobus.LineId == null)
                    {
                        //ubaci u listu za brisanje
                        autobusesToDelete.Add(autobus);

                        context.Set<Autobus>().Remove(autobus);
                    }

                    string[] coordinates = autobus.BusLine.Path.Split('|');

                    bool findCoordinates = false;
                    for (int i = 0; i < coordinates.Length; i++)
                    {
                        if (coordinates[i] == autobus.Position)
                        {
                            if (i + 1 == coordinates.Length)
                            {
                                //ubaci u listu za brisanje
                                autobusesToDelete.Remove(autobus);
                                context.Set<Autobus>().Remove(autobus);
                            }
                            else
                            {
                                //ubaci u listu za pomeranje
                                autobus.Position = coordinates[i];
                                autobusesToMove.Add(autobus);
                                context.Set<Autobus>().Attach(autobus);
                                context.Entry(autobus).State = EntityState.Modified;
                            }
                            findCoordinates = true;
                            break;
                        }

                        if (findCoordinates == false)
                        {
                            //ubaci u listu za brisanje
                            autobusesToDelete.Remove(autobus);
                            context.Set<Autobus>().Remove(autobus);
                        }
                    }
                }
                //Db.Complete();
                context.SaveChanges();
                //ako postoje novi polasci

                foreach (TimetableEntry timetableEntry in timetableEntries)
                {
                    string[] departures = timetableEntry.TimeOfDeparture.Split(',');
                    DateTime now = DateTime.Now;

                    foreach (string departure in departures)
                    {
                        DateTime dtDeparture = DateTime.Parse(departure);
                        if (now.Hour == dtDeparture.Hour && now.Minute == dtDeparture.Minute)
                        {
                            string coordinate = timetableEntry.Line.Path.Split('|')[0];
                            Autobus autobus = context.Set<Autobus>().Add(new Autobus() { LineId = timetableEntry.LineId, Position = coordinate });

                            //ubaci u listu za dodavanje
                            autobusesToAdd.Add(autobus);
                        }
                    }
                }

                context.SaveChanges();


                Clients.All.addAutobuses(autobusesToAdd);
                Clients.All.moveAutobuses(autobusesToMove);
                Clients.All.deleteAutobuses(autobusesToDelete);
            }


        }

        public override Task OnConnected()
        {

            if (Context.User.IsInRole("Admin"))
            {
                Groups.Add(Context.ConnectionId, "Admins");
            }
            //TimerServerUpdate();
            UserHandler.ConnectedIds.Add(Context.ConnectionId);

            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            if (Context.User.IsInRole("Admin"))
            {
                Groups.Remove(Context.ConnectionId, "Admins");
            }

            
            UserHandler.ConnectedIds.Remove(Context.ConnectionId);

            return base.OnDisconnected(stopCalled);
        }

    }
}