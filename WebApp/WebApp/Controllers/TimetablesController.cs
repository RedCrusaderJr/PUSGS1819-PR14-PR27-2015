using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Diagnostics;
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

    /*sve osim getAll, get single za korisnike je autorizovano na admina vidi JGSP sajt
     post - obsolite
     delte - obsolite
     sve se seeduje na startu
     put - dodavanje entrija kroz odabir linije, i forma slicna putu entrija
     */
    public class TimetablesController : ApiController
    {
        IUnitOfWork Db { get; set; }

        public TimetablesController(IUnitOfWork db)
        {
            
            Db = db;
        }

        // GET: api/Timetables
        public IEnumerable<Timetable> GetTimetables()
        {
            return Db.TimetableRepository.GetAll().ToList();
        }

        // GET: api/Timetables/5
        [ResponseType(typeof(Timetable))]
        public IHttpActionResult GetTimetable(bool id)
        {
            Timetable timetable = Db.TimetableRepository.Get(id);
            if (timetable == null)
            {
                return NotFound();
            }

            return Ok(timetable);
        }

        // PUT: api/Timetables/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutTimetable(bool id, Timetable timetable)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != timetable.IsUrban)
            {
                return BadRequest();
            }

            if (TimetableExists(id))
            {
                Db.TimetableRepository.Update(timetable);
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
            //    if (!TimetableExists(id))
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

        // POST: api/Timetables
        [ResponseType(typeof(Timetable))]
        public IHttpActionResult PostTimetable(Timetable timetable)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Db.TimetableRepository.Add(timetable);

            try
            {
                Db.Complete();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Content(HttpStatusCode.Conflict, ex);
            }
            catch (DbUpdateException)
            {
                if (TimetableExists(timetable.IsUrban))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }

            return CreatedAtRoute("DefaultApi", new { id = timetable.IsUrban }, timetable);
        }

        // DELETE: api/Timetables/5
        [ResponseType(typeof(Timetable))]
        public IHttpActionResult DeleteTimetable(bool id)
        {
            Timetable timetable = Db.TimetableRepository.Get(id);
            if (timetable == null)
            {
                return NotFound();
            }

            Db.TimetableRepository.Remove(timetable);

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

            return Ok(timetable);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                Db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool TimetableExists(bool id)
        {
            return Db.TimetableRepository.Get(id) != null;
        }
    }
}