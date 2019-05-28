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
    }
}