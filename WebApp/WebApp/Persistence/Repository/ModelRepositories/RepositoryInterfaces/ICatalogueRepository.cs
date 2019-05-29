using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebApp.Models;

namespace WebApp.Persistence.Repository.ModelRepositories
{
    public interface ICatalogueRepository : IRepository<Catalogue, int>
    {
    }
}