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

        public override IEnumerable<Timetable> GetAll()
        {
            return context.Set<Timetable>().Include(c => c.TimetableEntries);
        }

        public override Timetable Get(bool id)
        {
            return context.Set<Timetable>().Include(c => c.TimetableEntries).SingleOrDefault(c => c.IsUrban.Equals(id));
        }
    }
}