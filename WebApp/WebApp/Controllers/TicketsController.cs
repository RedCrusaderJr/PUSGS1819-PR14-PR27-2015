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
    /*
     * validacija karte DONE
     * specifican put autorizovan za rolu kontrolera, proglasava kartu nevalidnom DONE
     * autorizovanje posta na rolu passenger-a, slati ID passengera, VM za post DONE no VM required, id ide preko url-a
     * delete autorizovan na passengera DONE
     */

    public class TicketsController : ApiController
    {

        public IUnitOfWork Db { get; set; }

        public TicketsController(IUnitOfWork db)
        {
            Db = db;
        }
        // GET: api/Tickets
        public IQueryable<Ticket> GetTickets()
        {
            return Db.TicketRepository.GetAll().AsQueryable();
        }

        // GET: api/Tickets/5
        [ResponseType(typeof(Ticket))]
        public IHttpActionResult GetTicket(int id)
        {
            Ticket ticket = Db.TicketRepository.Get(id);
            if (ticket == null)
            {
                return NotFound();
            }

            return Ok(ticket);
        }

        //[Authorize(Roles ="Controller")]
        [Route("api/Ticket/GetIsTicketValid")]
        [ResponseType(typeof(bool))]
        public IHttpActionResult GetIsTicketValid(int id)
        {
            bool isValid = false;

            Ticket ticket = Db.TicketRepository.Get(id);
            if(ticket == null)
            {
                return Ok(isValid);
            }

            DateTime now = DateTime.Now;
            
            switch(ticket.Price.TicketType.TicketTypeName)
            {
                case ("Hour") :
                    DateTime hourCheck = new DateTime(ticket.DateOfIssue.Year, ticket.DateOfIssue.Month, ticket.DateOfIssue.Day, ticket.DateOfIssue.Hour + 1, 0, 0);
                    isValid = DateTime.Compare(now, hourCheck) < 0;
                    break;

                case ("Day") :
                    DateTime dayCheck = new DateTime(ticket.DateOfIssue.Year, ticket.DateOfIssue.Month, ticket.DateOfIssue.Day + 1);
                    isValid = DateTime.Compare(now, dayCheck) < 0;
                    break;

                case ("Month") :
                    DateTime monthCheck = new DateTime(ticket.DateOfIssue.Year, ticket.DateOfIssue.Month + 1, 1);
                    isValid = DateTime.Compare(now, monthCheck) < 0;
                    break;

                case ("Year") :
                    DateTime yearCheck = new DateTime(ticket.DateOfIssue.Year + 1, 1, 1);
                    isValid = DateTime.Compare(now, yearCheck) < 0;
                    break;
            }

            return Ok(isValid);
        }

        // PUT: api/Tickets/5
        //[Authorize(Roles ="Controller")]
        [Route("api/Ticket/PutChangeValidityOfTicket")]
        [ResponseType(typeof(bool))]
        public IHttpActionResult PutChangeValidityOfTicket(int id, Ticket ticket)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != ticket.TicketId)
            {
                
                return BadRequest();
            }

            if (TicketExists(id))
            {
                ticket.IsValid = !ticket.IsValid;
                Db.TicketRepository.Update(ticket);
            }
            

            try
            {
                Db.Complete();
            }
            catch (DbUpdateConcurrencyException dbEx)
            {
                if (!TicketExists(id))
                {
                    return NotFound();
                }
                else
                {
                    return InternalServerError(dbEx);
                }
            }
            catch(Exception e)
            {
                return InternalServerError(e);
            }

            return Ok(ticket.IsValid);
        }

        // POST: api/Tickets
        //[Authorize(Roles = "AppUser")]
        [ResponseType(typeof(Ticket))]
        public IHttpActionResult PostTicket(string passengerId, Ticket ticket)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Passenger foundPassenger;
            if (!TicketExists(ticket.TicketId) && (foundPassenger = Db.PassengerRepository.Get(passengerId)) != null)
            {
                foundPassenger.Tickets.Add(ticket);
                //potencijalan konflikt u EF
                //Db.TicketRepository.Add(ticket);
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
                return InternalServerError(e);
            }
            
            return CreatedAtRoute("DefaultApi", new { id = ticket.TicketId }, ticket);
        }

        // DELETE: api/Tickets/5
        //[Authorize(Roles = "AppUser")]
        [ResponseType(typeof(Ticket))]
        public IHttpActionResult DeleteTicket(int id)
        {
            Ticket ticket = Db.TicketRepository.Get(id);
            if (ticket == null)
            {
                return NotFound();
            }

            Db.TicketRepository.Remove(ticket);

            try
            {
                Db.Complete();
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }

            return Ok(ticket);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                Db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool TicketExists(int id)
        {
            return Db.TicketRepository.Get(id) != null;
        }


    }
}