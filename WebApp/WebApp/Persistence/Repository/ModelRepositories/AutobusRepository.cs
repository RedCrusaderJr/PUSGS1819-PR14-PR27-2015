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
    }
}