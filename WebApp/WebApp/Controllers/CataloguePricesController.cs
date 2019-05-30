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
    public class CataloguePricesController : ApiController
    {
        //TODO: Slozen objekat (za put, post)
        IUnitOfWork UnitOfWork { get; set; }
        public CataloguePricesController(IUnitOfWork unitOfWork)
        {
            UnitOfWork = unitOfWork;
        }

        // GET: api/CataloguePrices
        public IQueryable<CataloguePrice> GetCataloguePrices()
        {
            return UnitOfWork.CataloguePriceRepository.GetAll().AsQueryable();
        }

        // GET: api/CataloguePrices/5
        [ResponseType(typeof(CataloguePrice))]
        public IHttpActionResult GetCataloguePrice(string id)
        {
            CataloguePrice cataloguePrice = UnitOfWork.CataloguePriceRepository.Get(id);
            if (cataloguePrice == null)
            {
                return NotFound();
            }

            return Ok(cataloguePrice);
        }

        // PUT: api/CataloguePrices/5
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

            if (CataloguePriceExists(id))
            {
                UnitOfWork.CataloguePriceRepository.Update(cataloguePrice);
            }

            try
            {
                UnitOfWork.Complete();
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
        [ResponseType(typeof(CataloguePrice))]
        public IHttpActionResult PostCataloguePrice(CataloguePrice cataloguePrice)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            
            UnitOfWork.CataloguePriceRepository.Add(cataloguePrice);

            try
            {
                UnitOfWork.Complete();
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
        [ResponseType(typeof(CataloguePrice))]
        public IHttpActionResult DeleteCataloguePrice(string id)
        {
            CataloguePrice cataloguePrice = UnitOfWork.CataloguePriceRepository.Get(id);
            if (cataloguePrice == null)
            {
                return NotFound();
            }

            UnitOfWork.CataloguePriceRepository.Remove(cataloguePrice);
            try
            {
                UnitOfWork.Complete();
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
                UnitOfWork.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CataloguePriceExists(string id)
        {
            return UnitOfWork.CataloguePriceRepository.Get(id) != null;
        }
    }
}