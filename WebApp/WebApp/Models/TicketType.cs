using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebApp.Models
{
    public class TicketType
    {
        //SEED
        [Key]
        //HOUR, DAY, MONTH, YEAR
        public string TicketTypeName { get; set; }

        public TicketType() { }
    }
}