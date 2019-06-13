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
            if(!timer.Enabled)
            {
                timer.Interval = 5000;
                timer.Start();
                timer.Elapsed += OnTimedEvent;
            }
            
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

                //prolazak kroz sve autobuse
                for (int i = 0; i < autobuses.Count; i++)
                {
                    //nema liniju, brisi ga
                    if (autobuses[i].BusLine == null)
                    {
                        //ubaci u listu za brisanje
                        autobusesToDelete.Add(autobuses[i]);

                        context.Set<Autobus>().Remove(autobuses[i]);
                        continue;

                    }

                    //izdvoj koordinate
                    string[] coordinates = autobuses[i].BusLine.Path.Split('|');

                    bool findCoordinates = false;
                    for (int j = 0; j < coordinates.Length; j++)
                    {
                        if (coordinates[j] == autobuses[i].Position)
                        {
                            //trenutna koordinata je krajnja, brisi
                            if (j == coordinates.Length - 1)
                            {
                                //ubaci u listu za brisanje
                                break;
                            }

                            //inace, ubaci u listu za pomeranje
                            autobuses[i].Position = coordinates[j + 1];
                            autobusesToMove.Add(autobuses[i]);
                            context.Set<Autobus>().Attach(autobuses[i]);
                            context.Entry(autobuses[i]).State = EntityState.Modified;

                            findCoordinates = true;
                            break;
                        }

                        
                    }

                    if (findCoordinates == false)
                    {
                        //ubaci u listu za brisanje
                        autobusesToDelete.Add(autobuses[i]);

                        context.Set<Autobus>().Remove(autobuses[i]);
                        continue;
                    }
                }
                //Db.Complete();
                context.SaveChanges();
                //ako postoje novi polasci
                
                foreach (TimetableEntry timetableEntry in timetableEntries)
                {
                    //prolaz kroz sve polaske datokg ttentryja
                    string[] departures = timetableEntry.TimeOfDeparture.Split(',');
                    DateTime now = DateTime.Now;

                    foreach (string departure in departures)
                    {
                        DateTime dtDeparture = DateTime.Parse(departure);
                        //trenutno je toliko sati
                        if (now.Hour == dtDeparture.Hour && now.Minute == dtDeparture.Minute)
                        {
                            //ne postoji autobus koji je dodat u ovoliko sati
                            if(!autobuses.Any(a => a.AddedAt.Hour == now.Hour && a.AddedAt.Minute == now.Minute))
                            {
                                string coordinate = timetableEntry.Line.Path.Split('|')[0];

                                Autobus autobus = context.Set<Autobus>().Add(new Autobus() { LineId = timetableEntry.LineId, Position = coordinate, AddedAt = now });

                                //ubaci u listu za dodavanje
                                autobusesToAdd.Add(autobus);
                            }
                            //postoji autobus koji je dodat u ovoliko sati, ali nije ista linija
                            else if (!autobuses.Any(a => a.LineId == timetableEntry.LineId))
                            {
                                string coordinate = timetableEntry.Line.Path.Split('|')[0];

                                Autobus autobus = context.Set<Autobus>().Add(new Autobus() { LineId = timetableEntry.LineId, Position = coordinate, AddedAt = now });

                                //ubaci u listu za dodavanje
                                autobusesToAdd.Add(autobus);
                            }

                            break;
                            
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