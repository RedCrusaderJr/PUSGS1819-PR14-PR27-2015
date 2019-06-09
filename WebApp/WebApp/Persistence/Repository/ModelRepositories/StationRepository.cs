using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WebApp.Models;

namespace WebApp.Persistence.Repository.ModelRepositories
{
    public class StationRepository : Repository<Station, int>, IStationRepository
    {
        public StationRepository(DbContext context) : base(context)
        {
        }

        public override IEnumerable<Station> GetAll()
        {
            return context.Set<Station>();
        }

        public override Station Get(int id)
        {
            return context.Set<Station>().SingleOrDefault(c => c.StationId.Equals(id));
        }
    }
}