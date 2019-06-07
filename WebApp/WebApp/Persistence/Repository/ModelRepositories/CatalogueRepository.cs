using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WebApp.Models;

namespace WebApp.Persistence.Repository.ModelRepositories
{
    public class CatalogueRepository : Repository<Catalogue, int>, ICatalogueRepository
    {
        public CatalogueRepository(DbContext context) : base(context)
        {

        }

        public void Delete(Catalogue catalogue)
        {
            using (ApplicationDbContext appDbContext = new ApplicationDbContext())
            {
                bool oldValidateOnSaveEnabled = appDbContext.Configuration.ValidateOnSaveEnabled;
                appDbContext.Configuration.ValidateOnSaveEnabled = false;
                
                appDbContext.Catalogues.Attach(catalogue);
                appDbContext.Entry(catalogue).State = EntityState.Deleted;

                appDbContext.Configuration.ValidateOnSaveEnabled = oldValidateOnSaveEnabled;
                //catalogue.TicketTypeId = typeid;

                appDbContext.SaveChanges();
            }
        }
    }
}