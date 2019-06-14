using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebApp.Models
{
    public class CataloguePriceBindingModel
    {
        [Required]
        public DateTime Begin { get; set; }

        [Required]
        public DateTime End { get; set; }

        [Required]
        public double HourPrice { get; set; }

        [Required]
        public double DayPrice { get; set; }

        [Required]
        public double MonthPrice { get; set; }

        [Required]
        public double YearPrice { get; set; }

        public string HourId { get; set; }
        public string DayId { get; set; }
        public string MonthId { get; set; }
        public string YearId { get; set; }


        [Required]
        public int CatalogueVersion { get; set; }
        [Required]
        public int HourPriceVersion { get; set; }
        [Required]
        public int DayPriceVersion { get; set; }
        [Required]
        public int MonthPriceVersion { get; set; }
        [Required]
        public int YearPriceVersion { get; set; }

    }
}