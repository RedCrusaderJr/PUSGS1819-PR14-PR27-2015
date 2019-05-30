using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace WebApp.Models
{
    public class Ticket
    {
        public int TicketId { get; set; }

        [ForeignKey("Price")]
        public string PriceId { get; set; }
        public CataloguePrice Price { get; set; }

        public bool IsValid { get; set; } = true;



        public Ticket() { }
    }
}