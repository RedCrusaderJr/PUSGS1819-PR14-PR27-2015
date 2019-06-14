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
                return Content(HttpStatusCode.NotFound, $"[Concurrency WARNING] Line (OrderNumber: {line.OrderNumber}) either do not exist or has been deleted. [REFRESH]");
            }

            if(line.Version > model.LineVersion)
            {
                return Content(HttpStatusCode.Conflict, $"[Concurrency WARNING] Line (OrderNumber: {line.OrderNumber}) has been changed recently. Try again. [REFRESH]");
            }

            try
            {
                if (model.Departures != "")
                {
                    List<string> departures = model.Departures.Split(',').ToList();

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

                    TimetableEntry timetableEntry = Db.TimetableEntryRepository.Find(t => t.LineId == line.OrderNumber && t.Day == model.Day).FirstOrDefault();

                    if (timetableEntry == null)
                    {
                        //add
                        TimetableEntry timetableEntryToAdd = new TimetableEntry() { Day = model.Day, LineId = line.OrderNumber, TimetableId = line.IsUrban, TimeOfDeparture = sdeparture, Version = 0 };
                        Db.TimetableEntryRepository.Add(timetableEntryToAdd);
                    }
                    else
                    {
                        if (timetableEntry.Version > model.TimetableEntryVersion)
                        {
                            return Content(HttpStatusCode.Conflict, $"[Concurrency WARNING] TimetableEntry (ID: {timetableEntry.Id}) has been changed recently. Try again. [REFRESH]");
                        }

                        timetableEntry.TimeOfDeparture = sdeparture;

                        timetableEntry.Version++;

                        Db.TimetableEntryRepository.Update(timetableEntry);
                    }
                }
            }
            catch (Exception e)
            {
                return InternalServerError(e);
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
            

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/TimetableEntries
        [Authorize (Roles = "Admin")]
        [ResponseType(typeof(TimetableEntry))]
        public IHttpActionResult PostTimetableEntry(TimetableEntry timetableEntry)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (!TimetableEntryExists(timetableEntry.Id))
            {
                timetableEntry.Version = 0;
                Db.TimetableEntryRepository.Add(timetableEntry);
            }
            else
            {
                return Content(HttpStatusCode.Conflict, $"[Conflict WARNING] TimetableEntry with Id: {timetableEntry.Id} already exists.");
            }

            try
            {
                Db.Complete();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Content(HttpStatusCode.Conflict, ex);
            }
            catch (DbUpdateException dbEx)
            {
                if (TimetableEntryExists(timetableEntry.Id))
                {
                    return Content(HttpStatusCode.Conflict, $"[Conflict WARNING] TimetableEntry with Id: {timetableEntry.Id} already exists.");
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
        [Authorize(Roles = "Admin")]
        [ResponseType(typeof(TimetableEntry))]
        public IHttpActionResult DeleteTimetableEntry(int id)
        {
            TimetableEntry timetableEntry = Db.TimetableEntryRepository.Get(id);
            if (timetableEntry == null)
            {
                return Content(HttpStatusCode.NotFound, $"[Concurrency WARNING] TimetableEntry (ID: {id}) that you are trying to delete either do not exist or was previously deleted by another user. [REFRESH]");
            }
            
            //if(timetableEntry.Version > version)
            //{
            //    return Content(HttpStatusCode.Conflict, $"[Concurrency WARNING] You are trying to delete a TimetableEntry (ID: {timetableEntry.Id}) that has been changed recently. Try again. [REFRESH]");
            //}

            Db.TimetableEntryRepository.Remove(timetableEntry);

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