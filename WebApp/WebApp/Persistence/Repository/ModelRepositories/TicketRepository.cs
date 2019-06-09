using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WebApp.Models;

namespace WebApp.Persistence.Repository.ModelRepositories
{
    public class TicketRepository : Repository<Ticket, int>, ITicketRepository
    {
        public TicketRepository(DbContext context) : base(context)
        {
        }

        public override IEnumerable<Ticket> GetAll()
        {
            //TODO: mozda je potreban dublji include
            return context.Set<Ticket>().Include(c => c.Price);
        }

        public override Ticket Get(int id)
        {
            //TODO: mozda je potreban dublji include
            return context.Set<Ticket>().Include(c => c.Price).Include(c => c.Price.TicketType).SingleOrDefault(c => c.TicketId.Equals(id));
        }
    }
}