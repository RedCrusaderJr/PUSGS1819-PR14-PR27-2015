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
        IUnitOfWork UnitOfWork { get; set; }
        public LinesController(IUnitOfWork unitOfWork)
        {
            UnitOfWork = unitOfWork;
        }

        // GET: api/Lines
        public IQueryable<Line> GetLines()
        {
            return UnitOfWork.LineRepository.GetAll().AsQueryable();
        }

        // GET: api/Lines/5
        [ResponseType(typeof(Line))]
        public IHttpActionResult GetLine(string id)
        {
            Line line = UnitOfWork.LineRepository.Get(id);
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

            if (LineExists(id))
            {
                UnitOfWork.LineRepository.Update(line);
            }


            try
            {
                UnitOfWork.Complete();
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

            UnitOfWork.LineRepository.Add(line);
            try
            {
                UnitOfWork.Complete();
            }
            catch (DbUpdateException)
            {
                if (LineExists(line.OrderNumber))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = line.OrderNumber }, line);
        }

        // DELETE: api/Lines/5
        [ResponseType(typeof(Line))]
        public IHttpActionResult DeleteLine(string id)
        {
            Line line = UnitOfWork.LineRepository.Get(id);
            if (line == null)
            {
                return NotFound();
            }

            UnitOfWork.LineRepository.Remove(line);

            try
            {
                UnitOfWork.Complete();
            }
            catch(Exception)
            {
                return InternalServerError();
            }

            return Ok(line);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                UnitOfWork.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool LineExists(string id)
        {
            return UnitOfWork.LineRepository.Get(id) != null;
        }
    }
}