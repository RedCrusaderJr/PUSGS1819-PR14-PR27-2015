using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using WebApp.Models;
using WebApp.Persistence;
using WebApp.Persistence.UnitOfWork;

namespace WebApp.Controllers
{
    public class LinesController : ApiController
    {
        IUnitOfWork Db { get; set; }
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

        // PUT: api/Lines/5
        [ResponseType(typeof(void))]
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
                lineDb.IsUrban = line.IsUrban;
                lineDb.Path = line.Path;

                for (int i = 0; i < lineDb.Stations.Count; i++)
                {
                    bool stationContainedInModifiedLine = false;
                    stationContainedInModifiedLine = line.Stations.Any(s => s.StationId.Equals(lineDb.Stations[i].StationId));

                    if(!stationContainedInModifiedLine)
                    {
                        lineDb.Stations.Remove(lineDb.Stations[i]);
                    }
                }

                for (int i = 0; i < line.Stations.Count; i++)
                {
                    bool stationContainedInDbLine = false;
                    stationContainedInDbLine = lineDb.Stations.Any(s => s.StationId.Equals(line.Stations[i].StationId));

                    if (!stationContainedInDbLine)
                    {
                        lineDb.Stations.Add(line.Stations[i]);
                    }
                }

                foreach(Station dbStation in lineDb.Stations)
                {
                    foreach(Station station in line.Stations)
                    {
                        if(dbStation.Name == station.Name)
                        {
                            dbStation.Address = station.Address;
                            dbStation.Longitude = station.Longitude;
                            dbStation.Latitude = station.Latitude;
                            dbStation.LineOrderNumber = station.LineOrderNumber;
                        }
                    }
                }

                Db.LineRepository.Update(lineDb);
            }
            else
            {
                return NotFound();
            }

            try
            {
                Db.Complete();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LineExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Lines
        [ResponseType(typeof(Line))]
        public IHttpActionResult PostLine(Line line)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            if(LineExists(line.OrderNumber))
            {
                return Content(HttpStatusCode.Conflict, $"Line with OrderNumber: {line.OrderNumber} already exists.");
            }


            List<Station> dbStations = Db.StationRepository.GetAll().ToList();
            foreach(Station station in line.Stations)
            {
                if(dbStations.Any(s => s.Name.Equals(station.Name)))
                {
                    return Content(HttpStatusCode.Conflict, $"Station with Name: {station.Name} already exists.");
                }
            }

            Db.LineRepository.Add(line);

            try
            {
                Db.Complete();
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }

            return CreatedAtRoute("DefaultApi", new { id = line.OrderNumber }, line);
        }

        // DELETE: api/Lines/5
        [ResponseType(typeof(Line))]
        public IHttpActionResult DeleteLine(string id)
        {
            Line line = Db.LineRepository.Get(id);
            if (line == null)
            {
                return NotFound();
            }

            try
            {
                for(int i = 0; i < line.Stations.Count; i++)
                {
                    string name = line.Stations[i].Name;
                    Station dbStation = Db.StationRepository.Find(s => s.Name.Equals(name)).FirstOrDefault();
                    Db.StationRepository.Remove(dbStation);
                }
              
                Db.LineRepository.Remove(line);
                Db.Complete();
            }
            catch(Exception e)
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