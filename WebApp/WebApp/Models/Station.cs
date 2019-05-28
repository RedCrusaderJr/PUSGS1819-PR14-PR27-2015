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
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int StationId { get; set; }
        [Index(IsUnique =true)]
        [Column(TypeName = "VARCHAR")]
        [StringLength(300)]
        public string Name { get; set; }

        [ForeignKey("StationLocation")]
        public string LocationId { get; set; }
        public Location StationLocation { get; set; }

        public List<Line> Lines { get; set; }

        public Station()
        {

        }

    }
}