using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WebApp.Models;

namespace WebApp.Persistence.Repository.ModelRepositories
{
    public class PassengerRepository : Repository<Passenger, string>, IPassengerRepository
    {
        public PassengerRepository(DbContext context) : base(context)
        {
        }

        public override IEnumerable<Passenger> GetAll()
        {
            return context.Set<Passenger>().Include(c => c.Tickets)
                                                .Include(c => c.Discount);
        }

        public override Passenger Get(string id)
        {
            return context.Set<Passenger>().Include(c => c.Tickets)
                                                .Include(c => c.Discount).SingleOrDefault(c => c.Id.Equals(id));
        }
    }
}