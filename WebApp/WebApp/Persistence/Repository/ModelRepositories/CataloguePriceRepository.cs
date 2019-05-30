using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WebApp.Models;

namespace WebApp.Persistence.Repository.ModelRepositories
{
    public class CataloguePriceRepository : Repository<CataloguePrice, string>, ICataloguePriceRepository
    {
        public CataloguePriceRepository(DbContext context) : base(context)
        {
        }

        public override IEnumerable<CataloguePrice> GetAll()
        {
            return context.Set<CataloguePrice>().Include(c => c.Catalogue)
                                                .Include(c => c.TicketType);
        }

        public override CataloguePrice Get(string id)
        {
            return context.Set<CataloguePrice>().Include(c => c.Catalogue)
                                                .Include(c => c.TicketType).SingleOrDefault(c => c.CatalogueId.Equals(id));
        }
    }
}