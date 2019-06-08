using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebApp.Models
{
    public class TicketUnregistratedBindingModel
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string CataloguePriceId { get; set; }

        
    }

    public class AddTicketBindingModel
    {
        [Required]
        public string PriceId { get; set; }
        
        [Required]
        public string PassengerType { get; set; }
    }
}