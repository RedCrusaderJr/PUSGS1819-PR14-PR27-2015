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
        //CONTROLLER
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int StationId { get; set; }
        [Index(IsUnique =true)]
        [Column(TypeName = "VARCHAR")]
        [StringLength(300)]
        public string Name { get; set; }

        public double Longitude { get; set; }
        
        public double Latitude { get; set; }

        public string Address { get; set; }

        public string LineOrderNumber { get; set; }

        public Station()
        {

        }

    }
}