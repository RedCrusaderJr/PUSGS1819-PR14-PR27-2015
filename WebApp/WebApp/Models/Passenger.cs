using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApp.Models
{
    public class Passenger : ApplicationUser
    {
        //CONTROLLER
        public PassengerType Type { get; set; }
        public List<Ticket> Tickets { get; set; }
    }
}