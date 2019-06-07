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
                                                .Include(c => c.TicketType).Where(c => c.CataloguePriceId.Equals(id)).FirstOrDefault() ;
        }

        public void Delete(CataloguePrice cataloguePrice)
        {
            using(ApplicationDbContext appDbContext = new ApplicationDbContext())
            {
                bool oldValidateOnSaveEnabled = appDbContext.Configuration.ValidateOnSaveEnabled;
                appDbContext.Configuration.ValidateOnSaveEnabled = false;
                string typeid = cataloguePrice.TicketTypeId;
                appDbContext.CataloguePrices.Attach(cataloguePrice);
                appDbContext.Entry(cataloguePrice).State = EntityState.Deleted;

                appDbContext.Configuration.ValidateOnSaveEnabled = oldValidateOnSaveEnabled;
                cataloguePrice.TicketTypeId = typeid;

                appDbContext.SaveChanges();
            }
        }
    }
}