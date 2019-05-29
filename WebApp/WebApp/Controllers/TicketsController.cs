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
    public class TicketsController : ApiController
    {

        public IUnitOfWork UnitOfWork { get; set; }

        public TicketsController(IUnitOfWork unitOfWork)
        {
            UnitOfWork = unitOfWork;
        }
        // GET: api/Tickets
        public IQueryable<Ticket> GetTickets()
        {
            return UnitOfWork.TicketRepository.GetAll().AsQueryable();
        }
        
        // GET: api/Tickets/5
        [ResponseType(typeof(Ticket))]
        public IHttpActionResult GetTicket(int id)
        {
            Ticket ticket = UnitOfWork.TicketRepository.Get(id);
            if (ticket == null)
            {
                return NotFound();
            }

            return Ok(ticket);
        }

        // PUT: api/Tickets/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutTicket(int id, Ticket ticket)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != ticket.TicketId)
            {
                return BadRequest();
            }
            //Ticket ticketDb = UnitOfWork.TicketRepository.Get(ticket.TicketId);
            //ticketDb.Price = ticket.Price;
            //ticketDb.PriceId = ticket.PriceId;

            if (UnitOfWork.TicketRepository.Get(id) != null)
            {
                UnitOfWork.TicketRepository.Update(ticket);
            }
            

            try
            {
                UnitOfWork.Complete();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TicketExists(id))
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

        // POST: api/Tickets
        [ResponseType(typeof(Ticket))]
        public IHttpActionResult PostTicket(Ticket ticket)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            UnitOfWork.TicketRepository.Add(ticket);
            UnitOfWork.Complete();

            return CreatedAtRoute("DefaultApi", new { id = ticket.TicketId }, ticket);
        }

        // DELETE: api/Tickets/5
        [ResponseType(typeof(Ticket))]
        public IHttpActionResult DeleteTicket(int id)
        {
            Ticket ticket = UnitOfWork.TicketRepository.Get(id);
            if (ticket == null)
            {
                return NotFound();
            }

            UnitOfWork.TicketRepository.Remove(ticket);
            UnitOfWork.Complete();

            return Ok(ticket);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                UnitOfWork.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool TicketExists(int id)
        {
            return UnitOfWork.TicketRepository.Get(id) != null;
        }
    }
}