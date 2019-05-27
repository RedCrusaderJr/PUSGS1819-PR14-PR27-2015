using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace WebApp.Models
{
    public class Station
    {
        [Key]
        public object StationID { get; set; }
        [Index(IsUnique =true)]
        public string Name { get; set; }
        public Location StationLocation { get; set; }
        public List<Line> Lines { get; set; }

        public Station()
        {

        }

    }
}