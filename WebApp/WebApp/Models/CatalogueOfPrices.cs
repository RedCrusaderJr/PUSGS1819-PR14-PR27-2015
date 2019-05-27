using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebApp.Models
{
    public class CatalogueOfPrices
    {
        [Key]
        public TicketType ID { get; set; }
        public double Price { get; set; }
        public DateTime DateOfCreation { get; set; }

        public CatalogueOfPrices() { }
    }
}