using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using WebApp.Models;
using WebApp.Persistence;
using WebApp.Persistence.UnitOfWork;

namespace WebApp.Controllers
{

    /*TODO: novi get: dozvole brisanja i modify DONE
    provere pri brisanju i modify DONE
    autorizacije admin: getAll(pravi), brise i modify i posebni get DONE
    passenger: getuje trenutne DONE
    */

    public class CataloguePricesController : ApiController
    {
        //TODO: Slozen objekat (za put, post)
        IUnitOfWork Db { get; set; }
        public CataloguePricesController(IUnitOfWork unitOfWork)
        {
            Db = unitOfWork;
        }

        //[Authorize(Roles = "AppUser")]
        [Route("api/CataloguePrices/GetPassengerCataloguePrices")]
        public IEnumerable<CataloguePrice> GetPassengerCataloguePrices()
        {
            //TODO: sadrzaj filtrirati sa DateTime.Now
            DateTime now = DateTime.Now;

            return Db.CataloguePriceRepository.GetAll().Where(c => DateTime.Compare(now, c.Catalogue.Begin) > 0 && 
                                                                           DateTime.Compare(now, c.Catalogue.End) < 0);
        }


        //[Authorize(Roles ="Admin")]
        [Route("api/CataloguePrice/GetAdminCataloguePrices")]
        public IEnumerable<CataloguePrice> GetAdminCataloguePrices()
        {
            DateTime now = DateTime.Now;
            return Db.CataloguePriceRepository.GetAll().Where(c => DateTime.Compare(now, c.Catalogue.Begin) < 0);
        }

        // GET: api/CataloguePrices/5
        [ResponseType(typeof(CataloguePrice))]
        public IHttpActionResult GetCataloguePrice(string id)
        {
            CataloguePrice cataloguePrice = Db.CataloguePriceRepository.Get(id);
            if (cataloguePrice == null)
            {
                return NotFound();
            }

            return Ok(cataloguePrice);
        }

        // PUT: api/CataloguePrices/5
        //[Authorize(Roles ="Admin")]
        [ResponseType(typeof(void))]
        public IHttpActionResult PutCataloguePrice(string id, CataloguePrice cataloguePrice)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != cataloguePrice.CataloguePriceId)
            {
                return BadRequest();
            }

            DateTime now = DateTime.Now;
            if (CataloguePriceExists(id) && DateTime.Compare(now, cataloguePrice.Catalogue.Begin) < 0)
            {
                Db.CataloguePriceRepository.Update(cataloguePrice);
            }

            try
            {
                Db.Complete();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CataloguePriceExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/CataloguePrices
        //[Authorize(Roles = "Admin")]
        [ResponseType(typeof(CataloguePrice))]
        public IHttpActionResult PostCataloguePrice(CataloguePrice cataloguePrice)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            
            Db.CataloguePriceRepository.Add(cataloguePrice);

            try
            {
                Db.Complete();
            }
            catch (DbUpdateException)
            {
                if (CataloguePriceExists(cataloguePrice.CataloguePriceId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = cataloguePrice.CataloguePriceId }, cataloguePrice);
        }

        // DELETE: api/CataloguePrices/5
        //[Authorize("Admin")]
        [ResponseType(typeof(CataloguePrice))]
        public IHttpActionResult DeleteCataloguePrice(string id)
        {
            CataloguePrice cataloguePrice = Db.CataloguePriceRepository.Get(id);
            if (cataloguePrice == null)
            {
                return NotFound();
            }
            DateTime now = DateTime.Now;
            if (DateTime.Compare(now, cataloguePrice.Catalogue.Begin) < 0)
            {
                Db.CataloguePriceRepository.Remove(cataloguePrice);
            }
            try
            {
                Db.Complete();
            }
            catch (Exception)
            {
                return InternalServerError();
            }

            return Ok(cataloguePrice);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                Db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CataloguePriceExists(string id)
        {
            return Db.CataloguePriceRepository.Get(id) != null;
        }
    }
}