using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Timers;
using System.Web;
using WebApp.Models;
using WebApp.Persistence.UnitOfWork;

namespace WebApp.Hubs
{

    [HubName("busLocation")]
    public class BusLocationHub : Hub
    {
        private static IHubContext hubContext = GlobalHost.ConnectionManager.GetHubContext<BusLocationHub>();
        private static Timer timer = new Timer();
        IUnitOfWork Db { get; set; }

        
        public BusLocationHub(IUnitOfWork db)
        {
            Db = db;
            timer.Interval = 1000;
            timer.Start();
            timer.Elapsed += OnTimedEvent;
        }

        private void OnTimedEvent(object source, ElapsedEventArgs e)
        {
            


            List<Autobus> autobuses = Db.AutobusRepository.GetAll().ToList();
            List<Autobus> autobusesToAdd = new List<Autobus>();
            List<Autobus> autobusesToMove = new List<Autobus>();
            List<Autobus> autobusesToDelete = new List<Autobus>();
            

            foreach(Autobus autobus in autobuses)
            {
                if (autobus.LineId == null)
                {
                    //ubaci u listu za brisanje
                    autobusesToDelete.Add(autobus);

                    Db.AutobusRepository.Remove(autobus);
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
                            autobusesToDelete.Add(autobus);
                            Db.AutobusRepository.Remove(autobus);
                        }
                        else
                        {
                            //ubaci u listu za pomeranje
                            autobus.Position = coordinates[i];
                            autobusesToMove.Add(autobus);
                            Db.AutobusRepository.Update(autobus);
                        }
                        findCoordinates = true;
                        break;
                    }

                    if (findCoordinates == false)
                    {
                        //ubaci u listu za brisanje
                        autobusesToDelete.Add(autobus);
                        Db.AutobusRepository.Remove(autobus);
                    }
                }
            }
            //ako postoje novi polasci
            List<TimetableEntry> timetableEntries = Db.TimetableEntryRepository.GetAll().ToList();
            foreach(TimetableEntry timetableEntry in timetableEntries)
            {
                string[] departures = timetableEntry.TimeOfDeparture.Split(',');
                DateTime now = DateTime.Now;

                foreach(string departure in departures)
                {
                    DateTime dtDeparture = DateTime.Parse(departure);
                    if (now.Hour == dtDeparture.Hour && now.Minute == dtDeparture.Minute)
                    {
                        string coordinate = timetableEntry.Line.Path.Split('|')[0];
                        Autobus autobus = Db.AutobusRepository.Add(new Autobus() { LineId = timetableEntry.LineId, Position = coordinate});

                        //ubaci u listu za dodavanje
                        autobusesToAdd.Add(autobus);
                    }
                }
            }

            Db.Complete();

            Clients.All.addAutobuses(autobusesToAdd);
            Clients.All.moveAutobuses(autobusesToMove);
            Clients.All.deleteAutobuses(autobusesToDelete);
        }

    }
}