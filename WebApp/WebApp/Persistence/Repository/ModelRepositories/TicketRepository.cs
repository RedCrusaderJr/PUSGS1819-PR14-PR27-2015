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
            return context.Set<Ticket>().Include(c => c.Price);
        }

        public override Ticket Get(int id)
        {
            return context.Set<Ticket>().Include(c => c.Price).SingleOrDefault(c => c.TicketId.Equals(id));
        }
    }
}