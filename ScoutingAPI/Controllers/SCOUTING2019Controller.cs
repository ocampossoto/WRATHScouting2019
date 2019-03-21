using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using Newtonsoft.Json.Linq;
using ScoutingAPI.Models;

namespace ScoutingAPI.Controllers
{
    [EnableCors(origins: "https://scoutingdataapi.azurewebsites.net", headers: "*", methods: "*")]
    public class SCOUTING2019Controller : ApiController
    {
        private scoutingEntities db = new scoutingEntities();

        // GET: api/SCOUTING2019
        public IQueryable<SCOUTING2019> GetSCOUTING2019()
        {
            IQueryable<SCOUTING2019> teamList = db.SCOUTING2019;//  db.SCOUTING2019;
            foreach (SCOUTING2019 team in teamList)
            {
                dynamic result = WebRequest("frc" + team.NUM.ToString());
                if (result != null)
                {
                    try
                    {
                        int rank = result.qual.ranking.rank;
                        team.RANK = rank;
                    }
                    catch (Exception ex)
                    {
                        Console.Write(ex.Message);
                        break;
                    }
                }

                db.SaveChanges();
            }
            return db.SCOUTING2019;
        }

        // GET: api/SCOUTING2019/5
        [ResponseType(typeof(SCOUTING2019))]
        public async Task<IHttpActionResult> GetSCOUTING2019(int id)
        {
            SCOUTING2019 sCOUTING2019 = await db.SCOUTING2019.FindAsync(id);
            if (sCOUTING2019 == null)
            {
                return NotFound();
            }

            return Ok(sCOUTING2019);
        }

        // PUT: api/SCOUTING2019/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutSCOUTING2019(int id, SCOUTING2019 sCOUTING2019)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != sCOUTING2019.Id)
            {
                return BadRequest();
            }

            db.Entry(sCOUTING2019).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SCOUTING2019Exists(id))
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

        // POST: api/SCOUTING2019
        [ResponseType(typeof(SCOUTING2019))]
        public async Task<IHttpActionResult> PostSCOUTING2019(SCOUTING2019 sCOUTING2019)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            db.SCOUTING2019.Add(sCOUTING2019);
            await db.SaveChangesAsync();
            
            return CreatedAtRoute("DefaultApi", new { id = sCOUTING2019.Id }, sCOUTING2019);
        }

        // DELETE: api/SCOUTING2019/5
        [ResponseType(typeof(SCOUTING2019))]
        public async Task<IHttpActionResult> DeleteSCOUTING2019(int id)
        {
            SCOUTING2019 sCOUTING2019 = await db.SCOUTING2019.FindAsync(id);
            if (sCOUTING2019 == null)
            {
                return NotFound();
            }

            db.SCOUTING2019.Remove(sCOUTING2019);
            await db.SaveChangesAsync();

            return Ok(sCOUTING2019);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool SCOUTING2019Exists(int id)
        {
            return db.SCOUTING2019.Count(e => e.Id == id) > 0;
        }


        private static dynamic WebRequest(string teamkey)
        {
            string event_key= "2019mokc";
            //string event_key = "2019ksla";
            string WEBSERVICE_URL = "https://www.thebluealliance.com/api/v3/team/" + teamkey + "/event/"+ event_key +"/status";
            try
            {
                var webRequest = System.Net.WebRequest.Create(WEBSERVICE_URL);
                if (webRequest != null)
                {
                    webRequest.Method = "GET";
                    webRequest.Timeout = 12000;
                    webRequest.ContentType = "application/json";
                    webRequest.Headers.Add("X-TBA-Auth-Key", "OS42lUa6MsZEhUe4wnVmmlHJ1NA8ztHt6PvcDss3XB2Jt7J159khwBzQSmwEinvl");

                    using (System.IO.Stream s = webRequest.GetResponse().GetResponseStream())
                    {
                        using (System.IO.StreamReader sr = new System.IO.StreamReader(s))
                        {
                            var jsonResponse = sr.ReadToEnd();
                            dynamic json = JObject.Parse(jsonResponse);
                            return json;
                        }
                    }
                }
                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return null;
            }
        }
    }
}