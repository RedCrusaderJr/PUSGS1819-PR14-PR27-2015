using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebApp.Models
{
    public class TimetableEntryBindingModel
    {

        public DayType Day { get; set; }
        public string Departures { get; set; }
        [Required]
        public string LineId { get; set; }

        [Required]
        public int TimetableEntryVersion { get; set; }
        [Required]
        public int LineVersion { get; set; }

    }
}