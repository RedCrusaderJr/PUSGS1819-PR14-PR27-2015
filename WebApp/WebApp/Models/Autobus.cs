using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace WebApp.Models
{
    public class Autobus
    {
        public int AutobusId { get; set; }

        public string Position { get; set; }


        [ForeignKey("BusLine")]
        public string LineId { get; set; }

        public Line BusLine { get; set; }

        public DateTime AddedAt { get; set; }

    }
}