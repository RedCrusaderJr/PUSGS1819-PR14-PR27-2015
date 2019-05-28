using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApp.Models;
using WebApp.Persistence;
using WebApp.Persistence.UnitOfWork;
using Unity;
using WebApp.Persistence.Repository.ModelRepositories;

namespace WebApp.Controllers
{
    public class HomeController : Controller
    {
       

        //public HomeController(ILocationRepository locationRepository)
        //{
        //    _locationRepository = locationRepository;
        //}
        
        
        public ActionResult Index()
        {
            
     
            ViewBag.Title = "Home Page";


            return View();
        }
    }
}
