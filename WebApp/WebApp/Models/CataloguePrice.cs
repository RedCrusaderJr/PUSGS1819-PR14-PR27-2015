using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace WebApp.Models
{
    public class CataloguePrice
    {
        

        public string CataloguePriceId
        {
            get;
            private set; 
        }



        private int _catalogueId;
        [ForeignKey("Catalogue")]
        public int CatalogueId
        {
            get
            {
                return _catalogueId;
            }
            set
            {
                _catalogueId = value;
                CataloguePriceId = $"{CatalogueId.ToString()}|{TicketTypeId}";
            }
        }
        public Catalogue Catalogue { get; set; }


        private string _ticketTypeId;
        [ForeignKey("TicketType")]
        public string TicketTypeId
        {
            get
            {
                return _ticketTypeId;
            }
            set
            {
                _ticketTypeId = value;
                CataloguePriceId = $"{CatalogueId.ToString()}|{TicketTypeId}";
            }
        }
        public TicketType TicketType { get; set; }

        public double Price { get; set; }
    }
}