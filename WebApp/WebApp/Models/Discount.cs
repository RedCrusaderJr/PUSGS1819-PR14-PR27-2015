using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebApp.Models
{
    public class Discount
    {
        [Key]
        //STUDENT, SENIOR, REGULAR
        public string DiscountTypeName { get; set; }
        public double DiscountCoeficient { get; set; }

        public Discount() { }
    }
}