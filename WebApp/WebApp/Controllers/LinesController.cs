﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using WebApp.Hubs;
using WebApp.Models;
using WebApp.Persistence;
using WebApp.Persistence.UnitOfWork;

namespace WebApp.Controllers
{
    public class LinesController : ApiController
    {
        IUnitOfWork Db { get; set; }
        BusLocationHub BusLocationHub { get; set; }
        public LinesController(IUnitOfWork db)
        {
           
            Db = db;
            
        }

        // GET: api/Lines
        public IEnumerable<Line> GetLines()
        {
            var result = Db.LineRepository.GetAll().ToList();
            return result;
        }

        // GET: api/Lines/5
        [ResponseType(typeof(Line))]
        public IHttpActionResult GetLine(string id)
        {
            Line line = Db.LineRepository.Get(id);
            if (line == null)
            {
                return NotFound();
            }

            return Ok(line);
        }


        //[Route("api/Lines/StartHub")]
        //[HttpGet]
        //public IHttpActionResult StartHub()
        //{
        //    if (BusLocationHub.timer.Enabled == false)
        //    {
        //        BusLocationHub.TimerServerUpdate();
        //    }

        //    return Ok();
        //}

        // PUT: api/Lines/5
        [ResponseType(typeof(void))]
        [Authorize(Roles = "Admin")]
        public IHttpActionResult PutLine(string id, Line line)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != line.OrderNumber)
            {
                return BadRequest();
            }

            Line lineDb = Db.LineRepository.Get(id);
            if(lineDb != null)
            {
                if(lineDb.Version > line.Version)
                {
                    return Content(HttpStatusCode.Conflict, $"[Concurrency WARNING] You are trying to edit a Line (OrderNumber: {lineDb.OrderNumber}) that has been changed recently. Try again. [REFRESH]");
                }

                lineDb.IsUrban = line.IsUrban;
                lineDb.Path = line.Path;

                foreach(Station dbStation in lineDb.Stations)
                {
                    foreach(Station station in line.Stations)
                    {
                        if(dbStation.Name == station.Name)
                        {
                            Station foundStation = Db.StationRepository.Find(s => dbStation.Name.Equals(s.Name)).SingleOrDefault();
                            if(foundStation != null)
                            {
                                if(foundStation.Version > station.Version)
                                {
                                    return Content(HttpStatusCode.Conflict, $"[Concurrency WARNING] You are trying to edit a Station (Name: {foundStation.Name}) that has been changed recently. Try again. [REFRESH]");
                                }

                                foundStation.Address = station.Address;
                                foundStation.Longitude = station.Longitude;
                                foundStation.Latitude = station.Latitude;
                                foundStation.LineOrderNumber = station.LineOrderNumber;
                                foundStation.Version++;
                                Db.StationRepository.Update(foundStation);
                            }
                            else
                            {
                                return Content(HttpStatusCode.NotFound, $"[Concurrency WARNING] You are trying to edit a Station (Name: {station.Name}) that either do not exist or has been deleted. [REFRESH]");
                            }
                        }
                    }
                }

                try
                {
                    Db.Complete();
                }
                catch (DbUpdateConcurrencyException ex)
                {
                    return Content(HttpStatusCode.Conflict, ex);
                }
                catch (Exception e)
                {
                    return InternalServerError(e);
                }

                for (int i = 0; i < lineDb.Stations.Count; i++)
                {
                    bool stationContainedInModifiedLine = false;
                    stationContainedInModifiedLine = line.Stations.Any(s => s.Name.Equals(lineDb.Stations[i].Name));

                    if(!stationContainedInModifiedLine)
                    {
                        lineDb.Stations.Remove(lineDb.Stations[i]);
                    }
                }

                for (int i = 0; i < line.Stations.Count; i++)
                {
                    bool stationContainedInDbLine = false;
                    stationContainedInDbLine = lineDb.Stations.Any(s => s.Name.Equals(line.Stations[i].Name));

                    if (!stationContainedInDbLine)
                    {
                        line.Stations[i].Version = 0;
                        lineDb.Stations.Add(line.Stations[i]);
                    }
                }

                lineDb.Version++;
                Db.LineRepository.Update(lineDb);
            }
            else
            {
                return Content(HttpStatusCode.NotFound, $"[Concurrency WARNING] You are trying to edit a Line (OrderNumber: {line.OrderNumber}) that either do not exist or has been deleted. [REFRESH]");
            }

            try
            {
                Db.Complete();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Content(HttpStatusCode.Conflict, ex);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
            //catch (DbUpdateConcurrencyException)
            //{
            //    if (!LineExists(id))
            //    {
            //        return NotFound();
            //    }
            //    else
            //    {
            //        throw;
            //    }
            //}

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Lines
        [Authorize(Roles = "Admin")]
        [ResponseType(typeof(Line))]
        public IHttpActionResult PostLine(Line line)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            if(LineExists(line.OrderNumber))
            {
                return Content(HttpStatusCode.Conflict, $"[Conflict WARNING] Line with OrderNumber: {line.OrderNumber} already exists.");
            }

            if(line.Version != 0)
            {
                line.Version = 0;
                //return BadRequest($"[WARNING] You are posting Line with RowVersion: {line.Version} (has to be 0) [REFRESH]");
            }


            List<Station> dbStations = Db.StationRepository.GetAll().ToList();
            foreach(Station station in line.Stations)
            {
                if(dbStations.Any(s => s.Name.Equals(station.Name)))
                {
                    return Content(HttpStatusCode.Conflict, $"[Conflict WARNING] Station with Name: {station.Name} already exists.");
                }
                else
                {
                    station.Version = 0;
                }
            }

            Db.LineRepository.Add(line);

            try
            {
                Db.Complete();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Content(HttpStatusCode.Conflict, ex);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }

            return CreatedAtRoute("DefaultApi", new { id = line.OrderNumber }, line);
        }

        // DELETE: api/Lines/5
        [Authorize(Roles = "Admin")]
        [ResponseType(typeof(Line))]
        public IHttpActionResult DeleteLine(string id)
        {
            Line line = Db.LineRepository.Get(id);
            if (line == null)
            {
                return Content(HttpStatusCode.NotFound, "[Concurrency WARNING] Line that you are trying to delete either do not exist or was previously deleted by another user. [REFRESH]");
            }

            //if(line.Version > version)
            //{
            //    return Content(HttpStatusCode.NotFound, "[Concurrency WARNING] Line that you are trying to delete has been changed recently. Try again. [REFRESH]");
            //}

            try
            {
                for(int i = 0; i < line.Stations.Count; i++)
                {
                    string name = line.Stations[i].Name;
                    Station dbStation = Db.StationRepository.Find(s => s.Name.Equals(name)).FirstOrDefault();
                    Db.StationRepository.Remove(dbStation);
                }

                List<TimetableEntry> timetableEntries = Db.TimetableEntryRepository.Find(tt => tt.LineId == line.OrderNumber).ToList();
                foreach (TimetableEntry timetableEntry in timetableEntries)
                {
                    bool isUrban = timetableEntry.Line.IsUrban;
                    timetableEntry.LineId = null;

                    Timetable timetable = Db.TimetableRepository.Get(isUrban);
                    timetable.TimetableEntries.Remove(timetableEntry);

                    Db.TimetableEntryRepository.Remove(timetableEntry);
                    
                }
              
                Db.LineRepository.Remove(line);
                Db.Complete();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Content(HttpStatusCode.Conflict, ex);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }

            return Ok(line);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                Db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool LineExists(string id)
        {
            return Db.LineRepository.Get(id) != null;
        }
    }
}