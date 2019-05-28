using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebApp.Models
{
    public class Timetable
    {
        [Key]
        public bool IsUrban { get; set; }
        List<TimetableEntry> TimetableEntries { get; set; }

        public Timetable()
        {
                
        }
    }
}