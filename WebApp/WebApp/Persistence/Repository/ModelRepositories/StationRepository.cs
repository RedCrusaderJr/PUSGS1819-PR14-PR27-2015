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
            return context.Set<Station>().Include(c => c.StationLocation)
                                                .Include(c => c.Lines);
        }

        public override Station Get(int id)
        {
            return context.Set<Station>().Include(c => c.StationLocation)
                                                .Include(c => c.Lines).SingleOrDefault(c => c.StationId.Equals(id));
        }
    }
}