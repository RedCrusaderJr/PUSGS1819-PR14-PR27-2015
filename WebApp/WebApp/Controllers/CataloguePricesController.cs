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


    [Authorize]
    public class CataloguePricesController : ApiController
    {
        //TODO: Slozen objekat (za put, post)
        IUnitOfWork Db { get; set; }
        public CataloguePricesController(IUnitOfWork unitOfWork)
        {
            Db = unitOfWork;
        }

        //[Authorize(Roles = "AppUser")]
        [AllowAnonymous]
        [Route("api/CataloguePrices/GetPassengerCataloguePrices")]
        public IEnumerable<CataloguePrice> GetPassengerCataloguePrices()
        {
            DateTime now = DateTime.Now;

            return Db.CataloguePriceRepository.GetAll().Where(c => DateTime.Compare(now, c.Catalogue.Begin) > 0 &&
                                                                           DateTime.Compare(now, c.Catalogue.End) < 0);
        }


        [Authorize(Roles = "Admin")]
        [Route("api/CataloguePrices/GetAdminCataloguePrices")]
        [HttpGet]
        public IEnumerable<CataloguePrice> GetAdminCataloguePrices()
        {
            DateTime now = DateTime.Now;
            return Db.CataloguePriceRepository.GetAll().Where(c => DateTime.Compare(now, c.Catalogue.Begin) < 0).OrderBy(a => a.Catalogue.Begin).ToList();
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


        [Authorize(Roles = "Admin")]
        [ResponseType(typeof(void))]
        [HttpPut]
        [Route("api/CataloguePrices/PutCataloguePrice")]
        public IHttpActionResult PutCataloguePrice(CataloguePriceBindingModel cataloguePrice)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            DateTime now = DateTime.Now;

            CataloguePrice hourPrice = Db.CataloguePriceRepository.Get(cataloguePrice.HourId);
            CataloguePrice dayPrice = Db.CataloguePriceRepository.Get(cataloguePrice.DayId);
            CataloguePrice monthPrice = Db.CataloguePriceRepository.Get(cataloguePrice.MonthId);
            CataloguePrice yearPrice = Db.CataloguePriceRepository.Get(cataloguePrice.YearId);

            if (hourPrice != null && dayPrice != null && monthPrice != null && yearPrice != null)
            {
                if (hourPrice.Version > cataloguePrice.HourPriceVersion || dayPrice.Version > cataloguePrice.DayPriceVersion || hourPrice.Version > cataloguePrice.MonthPriceVersion || hourPrice.Version > cataloguePrice.YearPriceVersion)
                {
                    string message = "";
                    if (hourPrice.Version > cataloguePrice.HourPriceVersion)
                    {
                        message += $"[Concurrency WARNING] You are trying to edit a Catalogue where HourPrice: {hourPrice.CataloguePriceId} has been changed recently. Try again. [REFRESH]";
                    }

                    if (dayPrice.Version > cataloguePrice.DayPriceVersion)
                    {
                        message += $"[Concurrency WARNING] You are trying to edit a Catalogue where DayPrice: {dayPrice.CataloguePriceId} has been changed recently. Try again. [REFRESH]";
                    }

                    if (hourPrice.Version > cataloguePrice.MonthPriceVersion)
                    {
                        message += $"[Concurrency WARNING] You are trying to edit a Catalogue where MonthPrice: {monthPrice.CataloguePriceId} has been changed recently. Try again. [REFRESH]";
                    }

                    if (hourPrice.Version > cataloguePrice.YearPriceVersion)
                    {
                        message += $"[Concurrency WARNING] You are trying to edit a SCatalogue where YearPrice: {yearPrice.CataloguePriceId} has been changed recently. Try again. [REFRESH]";
                    }

                    return Content(HttpStatusCode.Conflict, message);
                }


                if (hourPrice.Catalogue.Begin != cataloguePrice.Begin || hourPrice.Catalogue.End != cataloguePrice.End)
                {
                    if (cataloguePrice.Begin.CompareTo(cataloguePrice.End) > 0)
                    {
                        return BadRequest("[WARNING] Begin date is after end date.");
                    }
                    if (cataloguePrice.Begin.CompareTo(DateTime.Now) < 0)
                    {
                        return BadRequest("[WARNING] Begin date is before now.");

                    }

                    Catalogue catalogueDb = Db.CatalogueRepository.Find(cat => cat.Begin.Equals(hourPrice.Catalogue.Begin) && cat.End.Equals(hourPrice.Catalogue.End)).Last();
                    if(catalogueDb.Version > cataloguePrice.CatalogueVersion)
                    {
                        return Content(HttpStatusCode.Conflict, $"[Concurrency WARNING] You are trying to edit a Catalogue (Begining: {catalogueDb.Begin}, End: {catalogueDb.End}) that has been changed recently. Try again. [REFRESH]");
                    }

                    if (!IsItValid(cataloguePrice.Begin, cataloguePrice.End, catalogueDb))
                    {
                        return Content(HttpStatusCode.Conflict, $"[Conflict WARNING] Changes to Catalogue would result in conflict => Begining: {cataloguePrice.Begin}, End: {cataloguePrice.End} is in conflict with another catalogue's date.");
                    }

                    catalogueDb.Begin = cataloguePrice.Begin;
                    catalogueDb.End = cataloguePrice.End;

                    catalogueDb.Version++;

                    Db.CatalogueRepository.Update(catalogueDb);

                    try
                    {
                        Db.Complete();
                    }
                    catch (DbUpdateConcurrencyException ex)
                    {
                        return Content(HttpStatusCode.Conflict, ex);
                    }
                    catch (Exception e)
                    {
                        return InternalServerError(e);
                    }


                    hourPrice = Db.CataloguePriceRepository.Get(cataloguePrice.HourId);
                    dayPrice = Db.CataloguePriceRepository.Get(cataloguePrice.DayId);
                    monthPrice = Db.CataloguePriceRepository.Get(cataloguePrice.MonthId);
                    yearPrice = Db.CataloguePriceRepository.Get(cataloguePrice.YearId);
                }

                hourPrice.Price = cataloguePrice.HourPrice;
                dayPrice.Price = cataloguePrice.DayPrice;
                monthPrice.Price = cataloguePrice.MonthPrice;
                yearPrice.Price = cataloguePrice.YearPrice;

                hourPrice.Version++;
                dayPrice.Version++;
                monthPrice.Version++;
                yearPrice.Version++;

                Db.CataloguePriceRepository.Update(hourPrice);
                Db.CataloguePriceRepository.Update(dayPrice);
                Db.CataloguePriceRepository.Update(monthPrice);
                Db.CataloguePriceRepository.Update(yearPrice);
            }
            else
            {
                string message = "";
                if(hourPrice == null)
                {
                    message += $"[Concurrency WARNING] You are trying to edit a Catalogue where HourPrice: {cataloguePrice.HourId} either do not exist or has been deleted. [REFRESH]";
                }

                if (dayPrice == null)
                {
                    message += $"[Concurrency WARNING] You are trying to edit a Catalogue where DayPrice: {cataloguePrice.DayId} either do not exist or has been deleted. [REFRESH]";
                }

                if (monthPrice == null)
                {
                    message += $"[Concurrency WARNING] You are trying to edit a Catalogue where HourPrice: {cataloguePrice.MonthId} either do not exist or has been deleted. [REFRESH]";
                }

                if (yearPrice == null)
                {
                    message += $"[Concurrency WARNING] You are trying to edit a Catalogue where YearPrice: {cataloguePrice.YearId} either do not exist or has been deleted. [REFRESH]";
                }

                return Content(HttpStatusCode.NotFound, message);
            }

            try
            {
                Db.Complete();
            }
            catch(DbUpdateConcurrencyException ex)
            {
                return Content(HttpStatusCode.Conflict, ex);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }

            return Ok(new { hourPrice, dayPrice, monthPrice, yearPrice });
        }

        // POST: api/CataloguePrices
        [Authorize(Roles = "Admin")]
        [ResponseType(typeof(CataloguePrice))]
        [HttpPost]
        public IHttpActionResult PostCataloguePrice(CataloguePriceBindingModel cataloguePrice)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            if (cataloguePrice.Begin.CompareTo(cataloguePrice.End) > 0)
            {
                return BadRequest("[WARNING] Begin date is after end date.");
            }
            if (cataloguePrice.Begin.CompareTo(DateTime.Now) < 0)
            {
                return BadRequest("[WARNING] Begin date is before now.");

            }

            if (!IsItValid(cataloguePrice.Begin, cataloguePrice.End))
            {
                return Content(HttpStatusCode.Conflict, $"[Conflict WARNING] Catalogue with Begining: {cataloguePrice.Begin}, End: {cataloguePrice.End} is in conflict with another catalogue's date.");
            }


            Db.CatalogueRepository.Add(new Catalogue() { Begin = cataloguePrice.Begin, End = cataloguePrice.End, Version = 0, });

            try
            {
                Db.Complete();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Content(HttpStatusCode.Conflict, ex);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }

            Catalogue addedCatalogue = Db.CatalogueRepository.Find(cat => cat.Begin == cataloguePrice.Begin && cat.End == cataloguePrice.End).FirstOrDefault();


            CataloguePrice hourCataloguePrice = new CataloguePrice() { Price = cataloguePrice.HourPrice, TicketTypeId = "Hour", CatalogueId = addedCatalogue.CatalogueId, Version = 0, };
            CataloguePrice dayCataloguePrice = new CataloguePrice() { Price = cataloguePrice.DayPrice, TicketTypeId = "Day", CatalogueId = addedCatalogue.CatalogueId, Version = 0, };
            CataloguePrice monthCataloguePrice = new CataloguePrice() { Price = cataloguePrice.MonthPrice, TicketTypeId = "Month", CatalogueId = addedCatalogue.CatalogueId, Version = 0, };
            CataloguePrice yearCataloguePrice = new CataloguePrice() { Price = cataloguePrice.YearPrice, TicketTypeId = "Year", CatalogueId = addedCatalogue.CatalogueId, Version = 0, };


            Db.CataloguePriceRepository.Add(hourCataloguePrice);
            Db.CataloguePriceRepository.Add(dayCataloguePrice); 
            Db.CataloguePriceRepository.Add(monthCataloguePrice);
            Db.CataloguePriceRepository.Add(yearCataloguePrice);



            try
            {
                Db.Complete();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Content(HttpStatusCode.Conflict, ex);
            }
            catch (DbUpdateException e)
            {
                if (CataloguePriceExists(hourCataloguePrice.CataloguePriceId) || CataloguePriceExists(dayCataloguePrice.CataloguePriceId) || CataloguePriceExists(monthCataloguePrice.CataloguePriceId) || CataloguePriceExists(yearCataloguePrice.CataloguePriceId))
                {
                    return Content(HttpStatusCode.Conflict, $"[Conflict WARNING] Catalogue price for either hour, day, month or yeat tickets is in conflict with one already in DB [REFRESH]");
                }
                else
                {
                    return InternalServerError(e);
                }
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }

            cataloguePrice.HourId = hourCataloguePrice.CataloguePriceId;
            cataloguePrice.DayId = dayCataloguePrice.CataloguePriceId;
            cataloguePrice.MonthId = monthCataloguePrice.CataloguePriceId;
            cataloguePrice.YearId = yearCataloguePrice.CataloguePriceId;

            return Ok(new { hourCataloguePrice, dayCataloguePrice, monthCataloguePrice, yearCataloguePrice });
        }

        private bool IsItValid(DateTime begin, DateTime end, Catalogue excludeCatalogue = null)
        {
            List<Catalogue> allCatalogues = Db.CatalogueRepository.GetAll().ToList();


            foreach (Catalogue catalogue in allCatalogues)
            {
                if ((begin.CompareTo(catalogue.Begin) >= 0 && begin.CompareTo(catalogue.End) <= 0) || (end.CompareTo(catalogue.Begin) >= 0 && end.CompareTo(catalogue.End) <= 0))
                {
                    if (excludeCatalogue != null && excludeCatalogue.CatalogueId == catalogue.CatalogueId)
                    {
                        continue;
                    }
                    return false;
                }

                if (begin.CompareTo(catalogue.Begin) <= 0 && end.CompareTo(catalogue.End) >= 0)
                {
                    if (excludeCatalogue != null)
                    {
                        continue;
                    }
                    return false;
                }

            }

            return true;
        }

        // DELETE: api/CataloguePrices/5
        [Authorize(Roles = "Admin")]
        [ResponseType(typeof(CataloguePrice))]
        [HttpDelete]
        [Route("api/DeleteCataloguePrice/{id}")]
        public IHttpActionResult DeleteCataloguePrice(string id, int hourVersion, int dayVersion, int monthVersion, int yearVersion)
        {
            CataloguePrice hourCataloguePrice = Db.CataloguePriceRepository.Get(id + "|Hour");
            CataloguePrice dayCataloguePrice = Db.CataloguePriceRepository.Get(id + "|Day");
            CataloguePrice monthCataloguePrice = Db.CataloguePriceRepository.Get(id + "|Month");
            CataloguePrice yearCataloguePrice = Db.CataloguePriceRepository.Get(id + "|Year");

            if (hourCataloguePrice == null || dayCataloguePrice == null || monthCataloguePrice == null || yearCataloguePrice == null)
            {
                string message = "";

                if (hourCataloguePrice == null)
                {
                    message += $"[Concurrency WARNING] You are trying to delete a Catalogue where HourPrice: {id + "|Hour"} either do not exist or has been deleted (CORRUPTION). Try again. [REFRESH]";
                }

                if (dayCataloguePrice == null)
                {
                    message += $"[Concurrency WARNING] You are trying to delete a Catalogue where DayPrice: {id + "|Day"} either do not exist or has been deleted (CORRUPTION). Try again. [REFRESH]";
                }

                if (monthCataloguePrice == null)
                {
                    message += $"[Concurrency WARNING] You are trying to delete a Catalogue where MonthPrice: {id + "|Month"} either do not exist or has been deleted (CORRUPTION). Try again. [REFRESH]";
                }

                if (yearCataloguePrice == null)
                {
                    message += $"[Concurrency WARNING] You are trying to delete a Catalogue where YearPrice: {id + "|Year"} either do not exist or has been deleted (CORRUPTION). Try again. [REFRESH]";
                }


                return Content(HttpStatusCode.NotFound, message);
            }


            if(hourCataloguePrice.Version > hourVersion || dayCataloguePrice.Version > dayVersion || monthCataloguePrice.Version > monthVersion || yearCataloguePrice.Version > yearVersion)
            {
                string message = "";

                if (hourCataloguePrice.Version > hourVersion)
                {
                    message += $"[Concurrency WARNING] You are trying to edit a Catalogue where HourPrice: {id + "|Hour"} has been changed recently. Try again. [REFRESH]";
                }

                if (dayCataloguePrice.Version > dayVersion)
                {
                    message += $"[Concurrency WARNING] You are trying to edit a Catalogue where DayPrice: {id + "|Day"} has been changed recently. Try again. [REFRESH]";
                }

                if (monthCataloguePrice.Version > monthVersion)
                {
                    message += $"[Concurrency WARNING] You are trying to edit a Catalogue where MonthPrice: {id + "|Month"} has been changed recently. Try again. [REFRESH]";
                }

                if (yearCataloguePrice.Version > yearVersion)
                {
                    message += $"[Concurrency WARNING] You are trying to edit a Catalogue where YearPrice: {id + "|Year"} has been changed recently. Try again. [REFRESH]";
                }

                return Content(HttpStatusCode.Conflict, message);
            }

            DateTime now = DateTime.Now;
            if (DateTime.Compare(now, hourCataloguePrice.Catalogue.Begin) < 0)
            {
                Catalogue catalogue = Db.CatalogueRepository.Get(hourCataloguePrice.Catalogue.CatalogueId);
                if (catalogue == null)
                {
                    return NotFound();
                }
                Db.CataloguePriceRepository.Delete(hourCataloguePrice);
                Db.CataloguePriceRepository.Delete(dayCataloguePrice);
                Db.CataloguePriceRepository.Delete(monthCataloguePrice);
                Db.CataloguePriceRepository.Delete(yearCataloguePrice);



                //Db.Complete();
                try
                {
                    Db.CatalogueRepository.Delete(catalogue);
                }
                catch (DbUpdateConcurrencyException ex)
                {
                    return Content(HttpStatusCode.Conflict, ex);
                }
                catch (Exception e)
                {
                    return InternalServerError(e);
                }
            }
            //try
            //{
            //    Db.Complete();
            //}
            //catch (Exception e)
            //{
            //    return InternalServerError(e);
            //}

            return Ok();
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