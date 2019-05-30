using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WebApp.Models;

namespace WebApp.Persistence.Repository.ModelRepositories
{
    public class LineRepository : Repository<Line, string>, ILineRepository
    {
        public LineRepository(DbContext context) : base(context)
        {
        }
    }
}