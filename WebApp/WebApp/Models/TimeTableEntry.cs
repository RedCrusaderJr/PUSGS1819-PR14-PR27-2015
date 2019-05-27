using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApp.Models
{
    public class TimeTableEntry
    {
        public DayOfWeek Day { get; set; }
        public List<DateTime> Departments { get; set; }
        public Line Line { get; set; }

        public TimeTableEntry()
        {
            
        }
    }
}