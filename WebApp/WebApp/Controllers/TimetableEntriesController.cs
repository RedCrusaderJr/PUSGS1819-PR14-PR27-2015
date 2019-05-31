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
    /*nema get all, nema get
     * put preko forme
     * post ide preko time table-a
     * 
     */
    public class TimetableEntriesController : ApiController
    {
        IUnitOfWork Db { get; set; }
        public TimetableEntriesController(IUnitOfWork db)
        {
            Db = db;
        }

        // GET: api/TimetableEntries
        public IQueryable<TimetableEntry> GetTimetableEntries()
        {
            return Db.TimetableEntryRepository.GetAll().AsQueryable();
        }

        // GET: api/TimetableEntries/5
        [ResponseType(typeof(TimetableEntry))]
        public IHttpActionResult GetTimetableEntry(string id)
        {
            TimetableEntry timetableEntry = Db.TimetableEntryRepository.Get(id);
            if (timetableEntry == null)
            {
                return NotFound();
            }

            return Ok(timetableEntry);
        }

        // PUT: api/TimetableEntries/5
        //[Authorize(Roles = "Admin")]
        [ResponseType(typeof(void))]
        public IHttpActionResult PutTimetableEntry(string id, TimetableEntry timetableEntry)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != timetableEntry.TimetableEntryId)
            {
                return BadRequest();
            }

            if (TimetableEntryExists(id))
            {
                Db.TimetableEntryRepository.Update(timetableEntry);
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
                if (!TimetableEntryExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw dbEx;
                }
            }
            catch (Exception e)
            {
                throw e;
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/TimetableEntries
        //[Authorize (Roles = "Admin")]
        [ResponseType(typeof(TimetableEntry))]
        public IHttpActionResult PostTimetableEntry(TimetableEntry timetableEntry)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (!TimetableEntryExists(timetableEntry.TimetableEntryId))
            {
                Db.TimetableEntryRepository.Add(timetableEntry);
            }
            else
            {
                return Conflict();
            }

            try
            {
                Db.Complete();
            }
            catch (DbUpdateException dbEx)
            {
                if (TimetableEntryExists(timetableEntry.TimetableEntryId))
                {
                    return Conflict();
                }
                else
                {
                    return InternalServerError(dbEx);
                }
            }
            catch(Exception e)
            {
                InternalServerError(e);
            }

            return CreatedAtRoute("DefaultApi", new { id = timetableEntry.TimetableEntryId }, timetableEntry);
        }

        // DELETE: api/TimetableEntries/5
        [ResponseType(typeof(TimetableEntry))]
        public IHttpActionResult DeleteTimetableEntry(string id)
        {
            TimetableEntry timetableEntry = Db.TimetableEntryRepository.Get(id);
            if (timetableEntry == null)
            {
                return NotFound();
            }

            Db.TimetableEntryRepository.Remove(timetableEntry);

            try
            {
                Db.Complete();
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }

            return Ok(timetableEntry);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                Db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool TimetableEntryExists(string id)
        {
            return Db.TimetableEntryRepository.Get(id) != null;
        }
    }
}