using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WebApp.Models;

namespace WebApp.Persistence.Repository.ModelRepositories
{
    public class TimetableRepository : Repository<Timetable, bool>, ITimetableRepository
    {
        public TimetableRepository(DbContext context) : base(context)
        {
        }
    }
}