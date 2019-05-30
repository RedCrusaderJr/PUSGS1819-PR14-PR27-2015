using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace WebApp.Models
{
    public class Passenger : ApplicationUser
    {
        //CONTROLLER
        [ForeignKey("Discount")]
        public string Type { get; set; }

        public Discount Discount { get; set; }


        public List<Ticket> Tickets { get; set; }
    }
}