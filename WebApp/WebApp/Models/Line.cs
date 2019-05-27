using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebApp.Models
{
    public class Line
    {
        [Key]
        //public object LineID { get; private set; }
        public int OrderNumber { get; set; }
        public List<Station> Stations { get; set; }

    }
}