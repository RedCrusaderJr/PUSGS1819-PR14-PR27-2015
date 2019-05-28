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
    }
}