using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WebApp.Models;

namespace WebApp.Persistence.Repository.ModelRepositories
{
    public class PassengerRepository : Repository<Passenger, PassengerType>, IPassengerRepository
    {
        public PassengerRepository(DbContext context) : base(context)
        {
        }
    }
}