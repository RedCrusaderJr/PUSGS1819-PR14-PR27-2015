using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WebApp.Models;

namespace WebApp.Persistence.Repository.ModelRepositories
{
    public class TimetableEntryRepository : Repository<TimetableEntry, int>, ITimetableEntryRepository
    {
        public TimetableEntryRepository(DbContext context) : base(context)
        {
        }

        public override IEnumerable<TimetableEntry> GetAll()
        {
            return context.Set<TimetableEntry>().Include(c => c.Line);
        }

        public override TimetableEntry Get(int id)
        {
            return context.Set<TimetableEntry>().Include(c => c.Line).SingleOrDefault(c => c.Id.Equals(id));
        }
    }
}