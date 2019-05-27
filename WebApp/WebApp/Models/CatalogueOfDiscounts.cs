using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebApp.Models
{
    public class CatalogueOfDiscounts
    {
        [Key]
        public PassengerType ID { get; set; }
        public double Discount { get; set; }

        public CatalogueOfDiscounts() { }
    }
}