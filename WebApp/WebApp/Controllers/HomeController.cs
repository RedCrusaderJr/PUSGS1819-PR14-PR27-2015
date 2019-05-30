using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApp.Models;
using WebApp.Persistence;
using WebApp.Persistence.UnitOfWork;
using Unity;

namespace WebApp.Controllers
{
    public class HomeController : Controller
    {    
        
        public ActionResult Index()
        {
            
     
            ViewBag.Title = "Home Page";


            return View();
        }
    }
}
