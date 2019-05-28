using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebApp.Models
{
    public class Location
    {
        #region Field
        private string _xCoordinate = string.Empty;
        private string _yCoordinate = string.Empty;
        #endregion

        [Key]
        public string LocationId { get; private set; }

        #region Propertie
        public string XCoordinate
        {
            get
            {
                return _xCoordinate;
            }

            private set
            {
                _xCoordinate = value;
                LocationId = $"{XCoordinate}|{YCoordinate}";
            }
        }

        public string YCoordinate
        {
            get
            {
                return _yCoordinate;
            }

            private set
            {
                _yCoordinate = value;
                LocationId = $"{XCoordinate}|{YCoordinate}";
            }
        }

        public string StreetName { get; set; }
        public string StreetNumber { get; set; }
        public string City { get; set; }
        public string ZipCode { get; set; }

        public string Address
        {
            get
            {
                return $"{StreetName} {StreetNumber}{Environment.NewLine}{City} {ZipCode}";
            }
        }
        #endregion

        public Location() { }

        public Location(string x, string y)
        {
            XCoordinate = x;
            YCoordinate = y;
        }

        public override string ToString()
        {
            return $"{Address}{Environment.NewLine}{XCoordinate}, {YCoordinate}";
        }
    }
}