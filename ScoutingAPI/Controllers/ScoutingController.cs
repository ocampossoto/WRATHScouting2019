using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Cors;
using System.Web.Mvc;

namespace ScoutingAPI.Controllers
{
    public class ScoutingController : Controller
    {
        // GET: Scouting
        [EnableCors(origins: "https://scoutingdataapi.azurewebsites.net", headers: "*", methods: "*")]
        public ActionResult Index()
        {
            return View();
        }
    }
}