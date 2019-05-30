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
    /*get all ni je potreban
     * single get sa svim kartama, vec radi preko repo...
     * nema delete passengera
     * prilagoditi put
     * 
         */
    public class PassengersController : ApiController
    { 
        public IUnitOfWork Db { get; set; }

        public PassengersController(IUnitOfWork db)
        {
            Db = db;
        }

        // GET: api/Passengers
        public IQueryable<Passenger> GetUsers()
        {
            return Db.PassengerRepository.GetAll().AsQueryable();
        }

        // GET: api/Passengers/5
        [ResponseType(typeof(Passenger))]
        public IHttpActionResult GetPassenger(string id)
        {
            Passenger passenger = Db.PassengerRepository.Get(id);
            if (passenger == null)
            {
                return NotFound();
            }

            return Ok(passenger);
        }

        // PUT: api/Passengers/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutPassenger(string id, Passenger passenger)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != passenger.Id)
            {
                return BadRequest();
            }

            if (PassengerExists(id))
            {
                Db.PassengerRepository.Update(passenger);
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
                if (!PassengerExists(id))
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

        // POST: api/Passengers
        [ResponseType(typeof(Passenger))]
        public IHttpActionResult PostPassenger(Passenger passenger)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (!PassengerExists(passenger.Id))
            {
                Db.PassengerRepository.Add(passenger);
            }

            try
            {
                Db.Complete();
            }
            catch (DbUpdateException dbEx)
            {
                if (PassengerExists(passenger.Id))
                {
                    return Conflict();
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

            return CreatedAtRoute("DefaultApi", new { id = passenger.Id }, passenger);
        }

        // DELETE: api/Passengers/5
        [ResponseType(typeof(Passenger))]
        public IHttpActionResult DeletePassenger(string id)
        {
            Passenger passenger = Db.PassengerRepository.Get(id);
            if (passenger == null)
            {
                return NotFound();
            }

            Db.PassengerRepository.Remove(passenger);

            try
            {
                Db.Complete();
            }
            catch (Exception e)
            {
                throw e;
            }

            return Ok(passenger);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                Db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool PassengerExists(string id)
        {
            return Db.PassengerRepository.Get(id) != null;
        }
    }
}