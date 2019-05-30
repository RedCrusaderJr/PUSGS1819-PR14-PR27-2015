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
    public class StationsController : ApiController
    {
        public IUnitOfWork Db { get; set; }

        public StationsController(IUnitOfWork db)
        {
            Db = db;
        }


        // GET: api/Stations
        public IQueryable<Station> GetStations()
        {
            return Db.StationRepository.GetAll().AsQueryable();
        }

        // GET: api/Stations/5
        [ResponseType(typeof(Station))]
        public IHttpActionResult GetStation(int id)
        {
            Station station = Db.StationRepository.Get(id);
            if (station == null)
            {
                return NotFound();
            }

            return Ok(station);
        }

        // PUT: api/Stations/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutStation(int id, Station station)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != station.StationId)
            {
                return BadRequest();
            }

            if(StationExists(id))
            {
                Db.StationRepository.Update(station);
            }
            else
            {
                return NotFound();
            }

            try
            {
                Db.Complete();
            }
            catch (DbUpdateConcurrencyException dbEx)
            {
                if (!StationExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw dbEx;
                }
            }
            catch(Exception e)
            {
                throw e;
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Stations
        [ResponseType(typeof(Station))]
        public IHttpActionResult PostStation(Station station)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if(!StationExists(station.StationId))
            {
                Db.StationRepository.Add(station);
            }
            else
            {
                return Conflict();
            }

            try
            {
                Db.Complete();
            }
            catch(Exception e)
            {
                throw e;
            }

            return CreatedAtRoute("DefaultApi", new { id = station.StationId }, station);
        }

        // DELETE: api/Stations/5
        [ResponseType(typeof(Station))]
        public IHttpActionResult DeleteStation(int id)
        {
            Station station = Db.StationRepository.Get(id);
            if (station == null)
            {
                return NotFound();
            }

            Db.StationRepository.Remove(station);

            try
            {
                Db.Complete();
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }

            return Ok(station);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                Db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool StationExists(int id)
        {
            return Db.StationRepository.Get(id) != null;
        }
    }
}