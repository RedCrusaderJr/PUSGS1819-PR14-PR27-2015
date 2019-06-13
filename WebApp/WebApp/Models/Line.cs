using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace WebApp.Models
{
    public class Line
    {
        //CONTROLLER
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public string OrderNumber { get; set; }
        public int Version { get; set; }
        

        public bool IsUrban { get; set; } 

        public List<Station> Stations { get; set; }


        public string Path { get; set; }
    }
}