using Microsoft.AspNet.Identity.Owin;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;
using WebApp.Models;
using WebApp.Persistence;
using WebApp.Persistence.UnitOfWork;

namespace WebApp.Controllers
{
    /*get all ni je potreban
     * single get sa svim kartama, vec radi preko repo...
     * nema delete passengera
     * prilagoditi put
     * 
         */
    [RoutePrefix("api/Passengers")]
    public class PassengersController : ApiController
    { 
        public IUnitOfWork Db { get; set; }


        private ApplicationUserManager _userManager;
        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        public PassengersController(IUnitOfWork db)
        {
            Db = db;
        }

        // GET: api/Passengers
        public IQueryable<Passenger> GetUsers()
        {
            return Db.PassengerRepository.GetAll().AsQueryable();
        }

        // GET: api/Passengers/5
        [ResponseType(typeof(Passenger))]
        public async Task<IHttpActionResult> GetPassenger(string id)
        {
            Passenger passenger = Db.PassengerRepository.Get(id);
            if (passenger == null)
            {
                ApplicationUser appUser = await UserManager.FindByIdAsync(id);
                if (appUser == null)
                {
                    return NotFound();
                }
                else
                {
                    return Ok(appUser);
                }
            }

            passenger.DateOfBirthString = passenger.DateOfBirth.ToString("yyyy-MM-dd");
            return Ok(passenger);
        }

        [HttpGet]
        [Route("DownloadPicture/{id}")]
        public IHttpActionResult DownloadPicture(string id)
        {

            Passenger passenger = Db.PassengerRepository.Get(id);

            if (passenger == null)
            {
                return BadRequest("User doesn't exists.");
            }

            if (passenger.ImageUrl == null)
            {
                return BadRequest("Picture doesn't exists.");
            }


            var filePath = HttpContext.Current.Server.MapPath("~/UploadFile/" + passenger.ImageUrl);

            FileInfo fileInfo = new FileInfo(filePath);
            string type = fileInfo.Extension.Split('.')[1];
            byte[] data = new byte[fileInfo.Length];

            HttpResponseMessage response = new HttpResponseMessage();
            using (FileStream fs = fileInfo.OpenRead())
            {
                fs.Read(data, 0, data.Length);
                response.StatusCode = HttpStatusCode.OK;
                response.Content = new ByteArrayContent(data);
                response.Content.Headers.ContentLength = data.Length;

            }




            response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/png");

            return Ok(data);


        }

        // PUT: api/Passengers/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutPassenger(string id, Passenger passenger)
        {

            
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != passenger.UserName)
            {
                return BadRequest();
            }

            Passenger passengerDb = Db.PassengerRepository.Get(id);
            if (passengerDb != null)
            {
                passengerDb.Name = passenger.Name;
                passengerDb.Surname = passenger.Surname;
                
                passengerDb.DateOfBirthString = passenger.DateOfBirth.ToString("yyyy-MM-dd");
                passengerDb.DateOfBirth = passenger.DateOfBirth;

                if (passengerDb.Type != passenger.Type)
                {
                    passengerDb.EmailConfirmed = false;
                    string filePath = HttpContext.Current.Server.MapPath("~/UploadFile/" + passenger.ImageUrl);
                    if (File.Exists(filePath))
                    { 
                        File.Delete(filePath);
                    }
                    passengerDb.ImageUrl = null;
                    passengerDb.Type = passenger.Type;
                }

                if (passenger.Email != passengerDb.Email)
                {
                    ApplicationUser passengerWithSameEmail = await UserManager.FindByEmailAsync(passenger.Email);
                    if (passengerWithSameEmail != null)
                    {
                        ModelState.AddModelError("", "User with same email already exists");
                        return BadRequest(ModelState);
                    }
                    else
                    {
                        passengerDb.Email = passenger.Email;
                    }
                }
                

                Db.PassengerRepository.Update(passengerDb);
            }
            else
            {
                ApplicationUser applicationUser = await UserManager.FindByIdAsync(id);
                if (applicationUser != null)
                {
                    applicationUser.Email = passenger.Email;
                    await UserManager.UpdateAsync(applicationUser);
                    return StatusCode(HttpStatusCode.NoContent);
                }
                else
                {
                    return NotFound();
                }
                
            }

            try
            {
                Db.Complete();
            }
            catch (DbUpdateConcurrencyException dbEx)
            {
                if (!PassengerExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw dbEx;
                }
            }
            catch(Exception e)
            {
                throw e;
            }
            

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Passengers
        [ResponseType(typeof(Passenger))]
        public IHttpActionResult PostPassenger(Passenger passenger)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (!PassengerExists(passenger.Id))
            {
                Db.PassengerRepository.Add(passenger);
            }

            try
            {
                Db.Complete();
            }
            catch (DbUpdateException dbEx)
            {
                if (PassengerExists(passenger.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw dbEx;
                }
            }
            catch(Exception e)
            {
                throw e;
            }

            return CreatedAtRoute("DefaultApi", new { id = passenger.Id }, passenger);
        }

        // DELETE: api/Passengers/5
        [ResponseType(typeof(Passenger))]
        public IHttpActionResult DeletePassenger(string id)
        {
            Passenger passenger = Db.PassengerRepository.Get(id);
            if (passenger == null)
            {
                return NotFound();
            }

            Db.PassengerRepository.Remove(passenger);

            try
            {
                Db.Complete();
            }
            catch (Exception e)
            {
                throw e;
            }

            return Ok(passenger);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                Db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool PassengerExists(string id)
        {
            return Db.PassengerRepository.Get(id) != null;
        }
    }
}