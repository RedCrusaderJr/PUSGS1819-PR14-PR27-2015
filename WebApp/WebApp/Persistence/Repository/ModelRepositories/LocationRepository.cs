using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WebApp.Models;

namespace WebApp.Persistence.Repository.ModelRepositories
{
    public class LocationRepository : Repository<Location, string>, ILocationRepository
    {
        public LocationRepository(DbContext context) : base(context)
        {
        }
    }
}