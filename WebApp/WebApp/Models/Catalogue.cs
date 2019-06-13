using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace WebApp.Models
{
    public class Catalogue
    {
        public int CatalogueId { get; set; }
        public int RowVersion { get; set; }
        public DateTime Begin { get; set; }
        public DateTime End { get; set; }


        public Catalogue() { }
    }
}