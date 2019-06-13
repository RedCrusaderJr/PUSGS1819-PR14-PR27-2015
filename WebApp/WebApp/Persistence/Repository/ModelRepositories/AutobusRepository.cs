using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WebApp.Models;

namespace WebApp.Persistence.Repository.ModelRepositories
{
    public class AutobusRepository : Repository<Autobus, int>, IAutobusRepository
    {
        public AutobusRepository(DbContext context) : base(context)
        {

        }

        public override IEnumerable<Autobus> GetAll()
        {
            return context.Set<Autobus>().Include(a => a.BusLine).ToList();
        }

        public override Autobus Get(int id)
        {
            return context.Set<Autobus>().Include(a => a.BusLine).Where(a => a.AutobusId == id).FirstOrDefault();
        }
    }
}