using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
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
        public IHttpActionResult GetTimetableEntry(int id)
        {
            TimetableEntry timetableEntry = Db.TimetableEntryRepository.Get(id);
            if (timetableEntry == null)
            {
                return NotFound();
            }

            return Ok(timetableEntry);
        }

        // PUT: api/TimetableEntries/5
        [Route("api/PutTimetableEntries")]
        [Authorize(Roles = "Admin")]
        [HttpPut]
        public IHttpActionResult PutTimetableEntry(TimetableEntryBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Line line = Db.LineRepository.Get(model.LineId);

            if (line == null)
            {
                return BadRequest("Line doesn't exists.");
            }


            try
            {
                PopulateDepartures(model.Departures, line, model.Day);
                
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
          


            try
            {
                Db.Complete();
            }
            catch(Exception e)
            {
                return InternalServerError(e);
            }
            

            return StatusCode(HttpStatusCode.NoContent);
        }

        private void PopulateDepartures(string departuresForDay, Line l, DayType dayType)
        {
            if (departuresForDay != "")
            {
                List<string> departures = departuresForDay.Split(',').ToList();

                List<DateTime> dateTimeDepartures = new List<DateTime>();
                foreach (string departure in departures)
                {
                    try
                    {
                        if (departure == "")
                        {
                            continue;
                        }
                        dateTimeDepartures.Add(DateTime.Parse(departure));
                    }
                    catch (Exception e)
                    {
                        throw e;
                    }
                }


                dateTimeDepartures = dateTimeDepartures.OrderBy(d => d).ToList();
                StringBuilder sb = new StringBuilder();

                foreach (DateTime date in dateTimeDepartures)
                {
                    sb.Append($"{date.Hour}:{date.Minute},");

                }
                sb.Remove(sb.Length - 1, 1);

                string sdeparture = sb.ToString();

                TimetableEntry timetableEntry = Db.TimetableEntryRepository.Find(t => t.LineId == l.OrderNumber && t.Day == dayType).FirstOrDefault();

                if (timetableEntry == null)
                {
                    //add
                    TimetableEntry timetableEntryToAdd = new TimetableEntry() {Day = dayType, LineId = l.OrderNumber, TimetableId = l.IsUrban, TimeOfDeparture = sdeparture };
                    Db.TimetableEntryRepository.Add(timetableEntryToAdd);


                }
                else
                {
                    timetableEntry.TimeOfDeparture = sdeparture;
                    Db.TimetableEntryRepository.Update(timetableEntry);
                }
            }
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

            

            if (!TimetableEntryExists(timetableEntry.Id))
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
                if (TimetableEntryExists(timetableEntry.Id))
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

            return CreatedAtRoute("DefaultApi", new { id = timetableEntry.Id }, timetableEntry);
        }

        // DELETE: api/TimetableEntries/5
        [ResponseType(typeof(TimetableEntry))]
        public IHttpActionResult DeleteTimetableEntry(int id)
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

        private bool TimetableEntryExists(int id)
        {
            return Db.TimetableEntryRepository.Get(id) != null;
        }
    }
}