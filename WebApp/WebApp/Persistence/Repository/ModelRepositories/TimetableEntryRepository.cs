using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WebApp.Models;

namespace WebApp.Persistence.Repository.ModelRepositories
{
    public class TimetableEntryRepository : Repository<TimetableEntry, string>, ITimetableEntryRepository
    {
        public TimetableEntryRepository(DbContext context) : base(context)
        {
        }

        public override IEnumerable<TimetableEntry> GetAll()
        {
            return context.Set<TimetableEntry>().Include(c => c.Line);
        }

        public override TimetableEntry Get(string id)
        {
            return context.Set<TimetableEntry>().Include(c => c.Line).SingleOrDefault(c => c.TimetableEntryId.Equals(id));
        }
    }
}