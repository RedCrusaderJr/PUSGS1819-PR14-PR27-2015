using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebApp.Models
{
    public class Timetable
    {
        //CONTROLLER
        [Key]
        public bool IsUrban { get; set; }
        public List<TimetableEntry> TimetableEntries { get; set; }

        public Timetable()
        {
                
        }
    }
}