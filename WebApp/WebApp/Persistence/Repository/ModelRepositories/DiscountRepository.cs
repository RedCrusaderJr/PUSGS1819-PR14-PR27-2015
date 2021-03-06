﻿using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WebApp.Models;

namespace WebApp.Persistence.Repository.ModelRepositories
{
    public class DiscountRepository : Repository<Discount, string>, IDiscountRepository
    {
        public DiscountRepository(DbContext context) : base(context)
        {
        }
    }
}