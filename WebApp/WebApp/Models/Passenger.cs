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

        public string Name { get; set; }

        public string Surname { get; set; }

        public string ImageUrl { get; set; }

        public DateTime DateOfBirth { get; set; }

        public string DateOfBirthString { get; set; }

        public ProcessingPhase ProcessingPhase { get; set; } = ProcessingPhase.PENDING;

        public List<Ticket> Tickets { get; set; }
    }
}