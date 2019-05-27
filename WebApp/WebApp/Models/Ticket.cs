using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebApp.Models
{
    public class Ticket
    {
        [Key]
        public int TicketID { get; private set; }
        public double TotalPrice { get; set; }
        public TicketType Type { get; set; }
        public ApplicationUser Owner { get; set; }


        public Ticket() { }

        public Ticket(bool firstTime=false)
        {
            if(firstTime)
            {
                TicketID = this.GetHashCode();
            }
        }
    }
}